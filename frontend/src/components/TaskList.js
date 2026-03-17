import TaskItem from "./TaskItem";

export default function TaskList({ tasks, toggleStatus, togglePin, snoozeTask }) {
  return (
    <div className="border rounded-lg overflow-hidden">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          toggleStatus={toggleStatus}
          togglePin={togglePin}
          snoozeTask={snoozeTask}
        />
      ))}
    </div>
  );
}