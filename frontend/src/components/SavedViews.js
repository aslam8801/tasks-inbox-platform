export default function SavedViews({ views, applyView }) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      {views.map((v, i) => (
        <button
          key={i}
          onClick={() => applyView(v)}
          className="bg-gray-300 px-2 py-1 rounded"
        >
          View {i + 1}
        </button>
      ))}
    </div>
  );
}