// import { NavLink } from "react-router-dom";

// export function DoctorNavigation() {
//   return (
//     <nav className="flex flex-col space-y-2 p-4 bg-gray-100 rounded-md">
//       <NavLink
//         to="/doctor"
//         end
//         className={({ isActive }) =>
//           isActive ? "text-purple-700 font-semibold" : "text-gray-700"
//         }
//       >
//         Dashboard
//       </NavLink>

//       <NavLink
//         to="/doctor/appointments"
//         className={({ isActive }) =>
//           isActive ? "text-purple-700 font-semibold" : "text-gray-700"
//         }
//       >
//         Appointments
//       </NavLink>

//       <NavLink
//         to="/doctor/edit"
//         className={({ isActive }) =>
//           isActive ? "text-purple-700 font-semibold" : "text-gray-700"
//         }
//       >
//         Edit Profile
//       </NavLink>

//       <NavLink
//         to="/doctor/view"
//         className={({ isActive }) =>
//           isActive ? "text-purple-700 font-semibold" : "text-gray-700"
//         }
//       >
//         View Profile
//       </NavLink>
//     </nav>
//   );
// }