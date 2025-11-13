// components/UI/AppointmentFilters.jsx
export default function AppointmentFilters({
  filterStatus,
  setFilterStatus,
  dateFilter,
  setDateFilter,
  searchTerm,
  setSearchTerm,
  onPrint,
}) {
  return (
    <>
      <div className="mb-4">
        <label className="mr-2 font-medium">Search by doctor:</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFilterStatus('');
            setDateFilter('all');
          }}
          placeholder="Enter doctor name"
          className="border px-3 py-1 rounded w-full max-w-sm"
        />
      </div>

      <div className="mb-6 flex gap-6 items-center">
        <div>
          <label className="mr-2 font-medium">Filter by status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Filter by date:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>

        <button
          onClick={onPrint}
          className="ml-auto px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Print
        </button>
      </div>
    </>
  );
}
