import { Routes, Route } from 'react-router-dom'; 
import { DoctorList } from './pages/DoctorList'; // Ensure this is a default export
import { BookAppointment } from './pages/BookAppointment';
import { Home } from './pages/Home'; // ✅ or wherever your Home component lives
import { Appointments } from './pages/Appointments';



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctors" element={<DoctorList />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/appointments/:doctorId" element={<BookAppointment />} />
      {/* Add other routes here as needed */}
    </Routes>
  );
}