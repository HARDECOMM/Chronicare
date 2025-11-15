import { useUser } from '@clerk/clerk-react';

export function RequireRole({ role, children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-purple-600 text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  const userRole = user?.publicMetadata?.role?.toLowerCase();
  const required = role?.toLowerCase();

  if (!user || userRole !== required) {
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
