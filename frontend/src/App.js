
import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import Filters from "./components/Filters";
import SearchBar from "./components/SearchBar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const BASE_URL = "https://tasks-inbox-platform.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [token, setToken] = useState("");
  const [newTask, setNewTask] = useState("");

  // 🔐 LOGIN + FETCH TASKS
  useEffect(() => {
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: "admin", password: "admin" }),
    })
      .then((res) => res.text())
      .then((tok) => {
        setToken(tok);

        return fetch(`${BASE_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        });
      })
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  // 🔄 WEBSOCKET REAL-TIME
  useEffect(() => {
    const socket = new SockJS(`${BASE_URL}/ws`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.subscribe("/topic/tasks", (message) => {
          const updatedTasks = JSON.parse(message.body);
          setTasks(updatedTasks);
        });
      },
    });

    stompClient.activate();
    return () => stompClient.deactivate();
  }, []);

  // ➕ ADD TASK
  const addTask = () => {
    console.log("Clicked Add", newTask, token);

    if (!newTask.trim()) {
      alert("Empty task");
      return;
    }

    if (!token) return;

    fetch(`${BASE_URL}/tasks`, {
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
    })
      .then((res) => {
        console.log("Response:", res);
        if (!res.ok) throw new Error("Failed request");
        return res.json();
      })
      .then((data) => {
        console.log("Created:", data);
        setNewTask("");
      })
      .catch((err) => {
        console.error("ERROR:", err);
        alert("Failed to add task");
      });
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
        status: task.status === "pending" ? "completed" : "pending",
      }),
    });
  };

  // 📌 PIN TASK
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

  // ⏰ SNOOZE TASK
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
        snoozedUntil: future.toISOString(), // ✅ FIXED
      }),
    });
  };

  // 🔍 FILTER + SEARCH
  const now = new Date();

  const processedTasks = tasks
    .filter((t) => !t.snoozedUntil || new Date(t.snoozedUntil) < now)
    .filter((t) => (filter === "all" ? true : t.status === filter))
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-4">Tasks Inbox</h1>

        {/* ➕ ADD TASK */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Add new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={addTask}
            disabled={!token || loading}
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

