// components/UI/PaginationControls.jsx
export default function PaginationControls({ page, setPage, totalItems, pageSize }) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm font-medium">Page {page}</span>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page * pageSize >= totalItems}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}
