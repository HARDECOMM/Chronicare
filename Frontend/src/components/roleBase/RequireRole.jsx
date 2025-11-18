// src/components/auth/RequireRole.jsx
export function RequireRole({ requiredRole, currentRole, children }) {
  if (!currentRole) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-purple-600 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (currentRole.toLowerCase() !== requiredRole.toLowerCase()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="max-w-md w-full bg-white p-6 rounded border border-purple-300">
          <h2 className="text-purple-700 text-xl font-semibold mb-2">Access denied</h2>
          <p className="text-gray-700">You don’t have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
}
