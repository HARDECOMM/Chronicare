import React from 'react';

export function AppointmentItem({ appt, onView, onConfirm, onCancel }) {
  return (
    <div className="border border-purple-200 rounded-lg p-4 bg-white flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold text-purple-700">{appt.patient?.name || appt.patientName || 'Patient'}</h3>
        <p className="text-gray-700">{appt.notes || appt.reason || 'Consultation'}</p>
        <p className="text-gray-600 mt-2 text-sm">
          {appt.date ? new Date(appt.date).toLocaleString() : 'TBD'} • {appt.type || 'in-person'}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={() => onView(appt)} className="bg-purple-600 text-white px-3 py-1 rounded">View</button>
        <button onClick={() => onConfirm(appt)} className="bg-green-600 text-white px-3 py-1 rounded">Confirm</button>
        <button onClick={() => onCancel(appt)} className="border border-gray-300 px-3 py-1 rounded">Cancel</button>
      </div>
    </div>
  );
}
