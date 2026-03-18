export default function TaskItem({ task, toggleStatus, togglePin, snoozeTask }) {
  return (
    <div className="flex justify-between items-center p-3 border-b hover:bg-gray-50 transition">

      <div>
        <p className="font-medium">{task.title}</p>

        <p className="text-sm text-gray-500">
          {task.type} • 
          <span className={`ml-1 px-2 py-0.5 rounded text-white text-xs ${
            task.priority === "high" ? "bg-red-500" :
            task.priority === "medium" ? "bg-yellow-500" :
            "bg-green-500"
          }`}>
            {task.priority}
          </span>
        </p>
      </div>

      <div className="flex gap-2 items-center">

        <button onClick={() => toggleStatus(task.id)}>
          {task.status === "pending" ? "✅" : "↩️"}
        </button>

        <button onClick={() => togglePin(task.id)}>
          {task.pinned ? "⭐" : "☆"}
        </button>

        <button onClick={() => snoozeTask(task.id)}>
          ⏰
        </button>

      </div>
    </div>
  );
}