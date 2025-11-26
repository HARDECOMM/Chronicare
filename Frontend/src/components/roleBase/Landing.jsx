import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getRedirectUrlForRole } from "./redirectRole";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/doctor/card";
import { Button } from "@/components/ui/doctor/button";

export function Landing({ isLoaded, user, role }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    if (user && role) {
      // Signed in with role → redirect to dashboard
      navigate(getRedirectUrlForRole(role));
    } else if (user && !role) {
      // Signed in but no role → go to role selector
      navigate("/select-role");
    }
    // If no user → stay here and show Sign In button
  }, [isLoaded, user, role, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-purple-700">
            {user ? "Redirecting..." : "Welcome to chronicare"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <p className="text-gray-600">Please wait while we take you to your dashboard.</p>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">Sign in to continue as a doctor or patient.</p>
              <Link to="/sign-in">
                <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
