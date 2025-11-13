export default function AppointmentSummary({ appointments, loading }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Your Existing Appointments</h3>
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">You have no appointments yet.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt._id} className="border rounded p-4 shadow-sm">
              <h4 className="font-semibold">{appt.doctorId?.name}</h4>
              <p>{new Date(appt.date).toLocaleString()}</p>
              <p className="capitalize text-sm text-gray-600">Status: {appt.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
