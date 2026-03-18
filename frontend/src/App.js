import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import Filters from "./components/Filters";
import SearchBar from "./components/SearchBar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://tasks-inbox-platform.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [newTask, setNewTask] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔐 AUTH + FETCH (with retry)
  useEffect(() => {
    const init = async (retry = 0) => {
      try {
        let tok = localStorage.getItem("token");

        // 🔑 LOGIN IF NEEDED
        if (!tok) {
          const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: "admin",
              password: "admin",
            }),
          });

          if (!res.ok) throw new Error("Login failed");

          tok = await res.text();
          localStorage.setItem("token", tok);
        }

        setToken(tok);

        // 📥 FETCH TASKS
        const res = await fetch(`${BASE_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        });

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        console.log("Retrying...", retry);

        if (retry < 3) {
          setTimeout(() => init(retry + 1), 3000); // 🔁 retry (Render fix)
        } else {
          setError("Backend is waking up... please refresh");
          setLoading(false);
        }
      }
    };

    init();
  }, []);

  // 🔄 WEBSOCKET (REAL-TIME)
  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}/ws`);

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe("/topic/tasks", (msg) => {
          const updated = JSON.parse(msg.body);

          setTasks((prev) => {
            const exists = prev.find((t) => t.id === updated.id);

            if (exists) {
              return prev.map((t) =>
                t.id === updated.id ? updated : t
              );
            }

            return [updated, ...prev];
          });
        });
      },
    });

    client.activate();

    return () => client.deactivate();
  }, []);

  // ➕ ADD TASK
  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTask,
          status: "pending",
          priority: "medium",
          type: "General",
          pinned: false,
        }),
      });

      setNewTask("");
    } catch (err) {
      alert("Failed to add task");
    }
  };

  // 🔁 TOGGLE STATUS
  const toggleStatus = (task) => {
    fetch(`${BASE_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...task,
        status:
          task.status === "pending" ? "completed" : "pending",
      }),
    });
  };

  // 📌 PIN
  const togglePin = (task) => {
    fetch(`${BASE_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...task,
        pinned: !task.pinned,
      }),
    });
  };

  // ⏰ SNOOZE
  const snoozeTask = (task) => {
    const future = new Date();
    future.setHours(future.getHours() + 2);

    fetch(`${BASE_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...task,
        snoozedUntil: future.toISOString(),
      }),
    });
  };

  // 🔍 FILTER + SEARCH
  const now = new Date();

  const processedTasks = tasks
    .filter((t) => !t.snoozedUntil || new Date(t.snoozedUntil) < now)
    .filter((t) =>
      filter === "all" ? true : t.status === filter
    )
    .filter((t) =>
      t.title?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.pinned - a.pinned);

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  // ❌ ERROR UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-4">Tasks Inbox</h1>

        {/* ADD */}
        <div className="flex gap-2 mb-4">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add task..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={addTask}
            disabled={!token}
            className="bg-green-500 hover:bg-green-600 text-white px-4 rounded disabled:opacity-50"
          >
            Add
          </button>
        </div>

        <SearchBar search={search} setSearch={setSearch} />
        <Filters setFilter={setFilter} />

        <TaskList
          tasks={processedTasks}
          toggleStatus={toggleStatus}
          togglePin={togglePin}
          snoozeTask={snoozeTask}
        />
      </div>
    </div>
  );
}

export default App;