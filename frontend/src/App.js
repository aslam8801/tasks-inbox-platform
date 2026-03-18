import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import Filters from "./components/Filters";
import SearchBar from "./components/SearchBar";
import { connectWebSocket } from "./websocket";

const BASE_URL = "https://tasks-inbox-platform.onrender.com";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch tasks from backend
  useEffect(() => {
    if (!token) return;

    fetch(`${BASE_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Fetch error:", err));
  }, [token]);

  // ✅ WebSocket connection (real-time updates)
  useEffect(() => {
    connectWebSocket((updatedTask) => {
      setTasks(prev => {
        const exists = prev.find(t => t.id === updatedTask.id);

        if (exists) {
          return prev.map(t =>
            t.id === updatedTask.id ? updatedTask : t
          );
        } else {
          return [updatedTask, ...prev];
        }
      });
    });
  }, []);

  // ✅ Update status
  const toggleStatus = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    fetch(`${BASE_URL}/tasks/${id}`, {
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

  // ✅ Pin task
  const togglePin = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    fetch(`${BASE_URL}/tasks/${id}`, {
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

  // ✅ Snooze task
  const snoozeTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const future = new Date();
    future.setHours(future.getHours() + 2);

    fetch(`${BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...task,
        snoozedUntil: future,
      }),
    });
  };

  // ✅ Filtering + search
  const now = new Date();

  const processedTasks = tasks
    .filter(t => !t.snoozedUntil || new Date(t.snoozedUntil) < now)
    .filter(t => (filter === "all" ? true : t.status === filter))
    .filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => b.pinned - a.pinned);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">

        <h1 className="text-3xl font-bold mb-4">Tasks Inbox</h1>

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