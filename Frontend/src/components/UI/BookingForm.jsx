export default function BookingForm({ doctor, date, setDate, type, setType, notes, setNotes, onSubmit, error }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Book Appointment with {doctor.name}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div>
        <label className="block font-medium">Date & Time</label>
        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="virtual">Virtual</option>
          <option value="in-person">In-Person</option>
        </select>
      </div>
      <div>
        <label className="block font-medium">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
      </div>
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Confirm Appointment
      </button>
    </form>
  );
}
