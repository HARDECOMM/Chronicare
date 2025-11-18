// pages/Landing.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRedirectUrlForRole } from '../../components/roleBase/getRedirectUrl';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Landing({ isLoaded, user, role }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      // Not signed in → go to sign-in
      navigate('/sign-in');
      return;
    }

    if (!role) {
      // Signed in but no role → go to role selector
      navigate('/select-role');
      return;
    }

    // Role exists → redirect to correct dashboard
    navigate(getRedirectUrlForRole(role));
  }, [isLoaded, user, role, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-purple-700">Redirecting...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Please wait while we take you to your dashboard.</p>
        </CardContent>
      </Card>
    </div>
  );
}
