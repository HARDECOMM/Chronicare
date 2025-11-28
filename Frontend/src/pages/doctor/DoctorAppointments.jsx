import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { appointmentsAPI } from "@/api/appointmentAPI";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function DoctorAppointments() {
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Track note drafts, active note card, and editing state
  const [noteDrafts, setNoteDrafts] = useState({});
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [editingNote, setEditingNote] = useState({}); // { [noteId]: true }

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await appointmentsAPI.listForDoctor(token);
        setAppointments(Array.isArray(res.appointments) ? res.appointments : []);
      } catch (err) {
        toast.error("Could not load appointments");
      } finally {
        setLoading(false);
      }
    })();
  }, [getToken]);

  const handleConfirm = async (id) => {
    try {
      const token = await getToken();
      const updated = await appointmentsAPI.confirm(id, token);
      toast.success("Appointment confirmed");
      setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)));
    } catch {
      toast.error("Failed to confirm appointment");
    }
  };

  const handleCancel = async (id) => {
    try {
      const token = await getToken();
      // ✅ Use the doctor-specific cancel endpoint
      const updated = await appointmentsAPI.cancelByDoctor(id, token);
      toast.success("Appointment canceled");
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? updated : a))
      );
    } catch (err) {
      console.error("Cancel error:", err.response?.data || err.message);
      toast.error("Failed to cancel appointment");
    }
  };


  // ✅ Add new note
  const handleAddNote = async (id) => {
    const message = noteDrafts[id];
    if (!message) return toast.error("Note cannot be empty");
    try {
      const token = await getToken();
      const updated = await appointmentsAPI.addNote(id, { message, authorType: "doctor" }, token);
      toast.success("Note added");
      setAppointments((prev) => prev.map((a) => (a._id === id ? updated : a)));
      setNoteDrafts((prev) => ({ ...prev, [id]: "" }));
      setActiveNoteId(null);
    } catch {
      toast.error("Failed to add note");
    }
  };

  // ✅ Update existing note
  const handleUpdateNote = async (appointmentId, noteId) => {
    const message = noteDrafts[noteId];
    if (!message) return toast.error("Note cannot be empty");
    try {
      const token = await getToken();
      const updated = await appointmentsAPI.updateNote(appointmentId, noteId, { message }, token);
      toast.success("Note updated");
      setAppointments((prev) => prev.map((a) => (a._id === appointmentId ? updated : a)));
      setEditingNote((prev) => ({ ...prev, [noteId]: false }));
    } catch {
      toast.error("Failed to update note");
    }
  };

  // ✅ Delete note
  const handleDeleteNote = async (appointmentId, noteId) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      const token = await getToken();
      const updated = await appointmentsAPI.deleteNote(appointmentId, noteId, token);
      toast.success("Note deleted");
      setAppointments((prev) => prev.map((a) => (a._id === appointmentId ? updated : a)));
    } catch {
      toast.error("Failed to delete note");
    }
  };

  if (loading) return <p className="text-purple-600">Loading appointments…</p>;

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments yet.</p>
      ) : (
        appointments.map((appt) => (
          <Card key={appt._id}>
            <CardHeader>
              <CardTitle className="text-purple-700">
                Appointment with {appt.patientId?.name || appt.patientName || "Unknown Patient"} —{" "}
                {new Date(appt.date).toLocaleDateString()}{" "}
                {new Date(appt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>
                <span className="font-semibold text-black">Reason:</span>{" "}
                {appt.reason || "Not specified"}
              </p>
              <p>
                <span className="font-semibold text-black">Status:</span>{" "}
                {appt.status}
              </p>

              {/* ✅ Notes section with edit/delete */}
              <div className="mt-2">
                <span className="font-semibold text-black">Notes:</span>
                {appt.notes?.length ? (
                  <ul className="list-disc ml-5 space-y-2">
                    {appt.notes.map((note, idx) => (
                      <li key={note._id || idx}>
                        {editingNote[note._id] ? (
                          <div className="space-y-2">
                            <Input
                              value={noteDrafts[note._id] || note.message}
                              onChange={(e) =>
                                setNoteDrafts((prev) => ({ ...prev, [note._id]: e.target.value }))
                              }
                              className="border-gray-400 focus:ring-purple-600"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleUpdateNote(appt._id, note._id)}
                                className="bg-purple-600 text-white"
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setEditingNote((prev) => ({ ...prev, [note._id]: false }))
                                }
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <span className="font-medium text-black">
                                {note.authorType === "doctor" ? "Doctor" : "Patient"}:
                              </span>{" "}
                              {note.message}{" "}
                              <span className="text-gray-500 text-xs">
                                ({new Date(note.createdAt).toLocaleString()})
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingNote((prev) => ({ ...prev, [note._id]: true }));
                                  setNoteDrafts((prev) => ({ ...prev, [note._id]: note.message }));
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteNote(appt._id, note._id)}
                                className="text-red-600"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No notes yet</p>
                )}

                {/* ✅ Add new note toggle */}
                {activeNoteId !== appt._id ? (
                  <Button
                    onClick={() => setActiveNoteId(appt._id)}
                    className="mt-2 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Add Note
                  </Button>
                ) : (
                  <div className="mt-2 border rounded p-3 bg-gray-50 space-y-2">
                    <Input
                      placeholder="Write your note..."
                      value={noteDrafts[appt._id] || ""}
                      onChange={(e) =>
                        setNoteDrafts((prev) => ({ ...prev, [appt._id]: e.target.value }))
                      }
                      className="border-gray-400 focus:ring-purple-600"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleAddNote(appt._id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Save Note
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setActiveNoteId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* ✅ Confirm/Cancel buttons */}
              <div className="flex gap-2 mt-3">
                {appt.status === "pending" && (
                  <>
                    <Button
                      onClick={() => handleConfirm(appt._id)}
                      className="bg-green-600 text-white"
                    >
                      Confirm
                    </Button>
                    <Button
                      onClick={() => handleCancel(appt._id)}
                      className="bg-red-600 text-white"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}