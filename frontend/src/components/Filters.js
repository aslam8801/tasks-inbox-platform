export default function Filters({ setFilter }) {
  return (
    <div className="flex gap-2 mb-4">
      <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setFilter("all")}>
        All
      </button>
      <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setFilter("pending")}>
        Pending
      </button>
      <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setFilter("completed")}>
        Completed
      </button>
    </div>
  );
}