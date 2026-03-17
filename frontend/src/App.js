import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import Filters from "./components/Filters";
import SearchBar from "./components/SearchBar";
import SavedViews from "./components/SavedViews";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [savedViews, setSavedViews] = useState([]);

  // 🔥 FETCH FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:8080/tasks")
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err));
  }, []);

  const toggleStatus = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === "pending" ? "completed" : "pending" }
          : t
      )
    );
  };

  const togglePin = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, pinned: !t.pinned } : t
      )
    );
  };

  const snoozeTask = (id) => {
    const future = new Date();
    future.setHours(future.getHours() + 2);

    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, snoozedUntil: future } : t
      )
    );
  };

  const saveView = () => {
    setSavedViews(prev => [...prev, { filter, search }]);
  };

  const now = new Date();

  const processedTasks = tasks
    .filter(t => !t.snoozedUntil || new Date(t.snoozedUntil) < now)
    .filter(t => (filter === "all" ? true : t.status === filter))
    .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.pinned - a.pinned);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">

        <h1 className="text-3xl font-bold mb-4">Tasks Inbox</h1>

        <SearchBar search={search} setSearch={setSearch} />
        <Filters setFilter={setFilter} />

        <button
          onClick={saveView}
          className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save View
        </button>

        <SavedViews
          views={savedViews}
          applyView={(v) => {
            setFilter(v.filter);
            setSearch(v.search);
          }}
        />

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