// src/components/auth/SelectRole.jsx
import { useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { usersAPI } from "../../api/usersAPI";   // ✅ Correct API for role management
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function SelectRole({ setRole }) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selectedRole) return toast.error("Please select a role");
    setLoading(true);

    try {
      const token = await getToken();
      const role = selectedRole.toLowerCase();

      // ✅ Use usersAPI for sync + role assignment
      await usersAPI.sync(user, token);
      await usersAPI.setRole(user.id, role, token);

      setRole(role);
      toast.success(`Role set to ${selectedRole}`);
      navigate(getRedirectUrlForRole(role));
    } catch (err) {
      console.error("❌ Role update failed:", err);
      toast.error("Failed to set role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-purple-700">Choose Your Role</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
          {["patient", "doctor", "admin"].map((role) => (
            <div key={role} className="flex items-center space-x-2">
              <RadioGroupItem value={role} id={role} />
              <label
                htmlFor={role}
                className="capitalize cursor-pointer hover:text-purple-600"
              >
                {role}
              </label>
            </div>
          ))}
        </RadioGroup>
        <Button
          disabled={loading}
          className="mt-6 w-full"
          onClick={handleSubmit}
        >
          {loading ? "Setting role..." : "Confirm Role"}
        </Button>
      </CardContent>
    </Card>
  );
}

// Helper function for navigation
function getRedirectUrlForRole(role) {
  switch (role) {
    case "patient":
      return "/patient/dashboard";
    case "doctor":
      return "/doctor/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
}
