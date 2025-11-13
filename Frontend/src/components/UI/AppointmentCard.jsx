import { Link } from 'react-router-dom';

export function AppointmentCard({ appt, updatingId, onConfirm, onCancel, onDelete }) {
  const handleDelete = () => {
    if (typeof onDelete === 'function') {
      onDelete(appt._id);
    } else {
      console.warn('⚠️ onDelete not provided for appointment:', appt._id);
    }
  };

  return (
    <li className="border rounded p-4 shadow-sm hover:bg-gray-50 transition">
      {/* 🖱️ Clickable header linking to appointment detail */}
      <Link to={`/appointments/${appt._id}`} className="block mb-2">
        <h3 className="font-semibold text-lg text-blue-700 hover:underline">
          {appt.doctorId?.name || 'Doctor'}
        </h3>
        <p className="text-sm text-gray-600">{appt.doctorId?.specialty}</p>
        <p className="mt-2"><strong>Date:</strong> {new Date(appt.date).toLocaleString()}</p>
        <p><strong>Type:</strong> {appt.type}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`capitalize font-semibold ${
            appt.status === 'confirmed'
              ? 'text-green-600'
              : appt.status === 'cancelled'
              ? 'text-red-600'
              : 'text-yellow-600'
          }`}>
            {appt.status}
          </span>
        </p>
        {appt.notes && <p className="mt-1 text-sm text-gray-700">📝 {appt.notes}</p>}
      </Link>

      {/* 🛠️ Action buttons */}
      <div className="mt-3 flex gap-2 flex-wrap">
        {appt.status === 'pending' && (
          <>
            <button
              onClick={() => onConfirm(appt._id)}
              disabled={updatingId === appt._id}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Confirm
            </button>
            <button
              onClick={() => onCancel(appt._id)}
              disabled={updatingId === appt._id}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              Cancel
            </button>
          </>
        )}
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
