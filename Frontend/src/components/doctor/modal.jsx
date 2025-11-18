// export function Modal({ children, onClose, title }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="w-full max-w-lg mx-4">
//         <div className="bg-white rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
//             aria-label="Close modal"
//           >
//             ✕
//           </button>

//           {/* Optional Title */}
//           {title && <h3 className="text-xl font-semibold text-purple-700 mb-4">{title}</h3>}

//           {/* Scrollable Content */}
//           <div className="space-y-4">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// }
