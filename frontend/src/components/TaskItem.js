export default function TaskItem({ task, toggleStatus, togglePin, snoozeTask }) {
  return (
    <div className="flex justify-between p-3 border-b">

      <div>
        <p>{task.title}</p>
        <p className="text-sm text-gray-500">{task.type}</p>
      </div>

      <div className="flex gap-2">

        <button onClick={() => toggleStatus(task)}>
          {task.status === "pending" ? "✅" : "↩️"}
        </button>

        <button onClick={() => togglePin(task)}>
          {task.pinned ? "⭐" : "☆"}
        </button>

        <button onClick={() => snoozeTask(task)}>
          ⏰
        </button>

      </div>
    </div>
  );
}