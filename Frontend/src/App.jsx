import { Routes, Route } from 'react-router-dom'; 
import { DoctorList } from './pages/DoctorList'; // Ensure this is a default export

export default function App() {
  return (
    <Routes>
      <Route path="/doctors" element={<DoctorList />} />
      {/* Add other routes here as needed */}
    </Routes>
  );
}