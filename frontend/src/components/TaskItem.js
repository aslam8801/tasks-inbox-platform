import { motion } from "framer-motion";

const getPriorityColor = (priority) => {
  if (priority === "high") return "bg-red-100 text-red-600";
  if (priority === "medium") return "bg-yellow-100 text-yellow-600";
  return "bg-green-100 text-green-600";
};

export default function TaskItem({ task, toggleStatus, togglePin, snoozeTask }) {
  return (
    <motion.div
      className="flex justify-between items-center p-4 border-b hover:bg-gray-50 transition"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <p className="font-semibold text-gray-800">{task.title}</p>

        <div className="flex gap-2 mt-1 items-center">
          <span className="text-xs text-gray-500">{task.type}</span>

          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => toggleStatus(task.id)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          {task.status === "pending" ? "✔" : "↩"}
        </button>

        <button
          onClick={() => togglePin(task.id)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          {task.pinned ? "⭐" : "☆"}
        </button>

        <button
          onClick={() => snoozeTask(task.id)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          ⏰
        </button>
      </div>
    </motion.div>
  );
}