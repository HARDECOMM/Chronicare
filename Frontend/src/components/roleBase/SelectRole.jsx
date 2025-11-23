import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { usersAPI } from "../../api/userAPI";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/doctor/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/doctor/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const roles = [
  {
    key: "patient",
    icon: "👤",
    description: "Book appointments and manage your health profile.",
  },
  {
    key: "doctor",
    icon: "🩺",
    description: "Manage patients and appointments.",
  },
];

export function SelectRole({ setRole }) {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // 🔍 Check if role already exists
  useEffect(() => {
    if (!isLoaded || !user) return;
    let mounted = true;

    (async () => {
      try {
        const token = await getToken();
        await usersAPI.sync(user, token);
        const res = await usersAPI.getRole(user.id, token);
        const existingRole = res?.role ?? null;

        if (!mounted) return;
        if (existingRole) {
          setRole(existingRole);
          toast.success(`Role already set: ${existingRole}`);
          // ✅ Redirect based on existing role
          if (existingRole === "doctor") {
            navigate("/doctor", { replace: true });
          } else if (existingRole === "patient") {
            navigate("/patient", { replace: true });
          }
        }
      } catch (err) {
        console.warn("SelectRole init check failed:", err);
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isLoaded, user, getToken, navigate, setRole]);

  const handleSubmit = async () => {
    if (!selectedRole) return toast.error("Please select a role");
    setLoading(true);
    try {
      const token = await getToken();
      const role = selectedRole.toLowerCase();

      await usersAPI.sync(user, token);
      await usersAPI.setRole(role, token);

      setRole(role);
      toast.success(`Role set to ${selectedRole}`);

      // ✅ Redirect to profile creation
      if (role === "doctor") {
        navigate("/doctor/create", { replace: true });
      } else if (role === "patient") {
        navigate("/patient/create", { replace: true });
      }
    } catch (err) {
      console.error("❌ Role update failed:", err);
      toast.error("Failed to set role");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-purple-600 text-lg font-semibold">Checking account…</p>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-purple-700">Choose Your Role</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
          {roles.map(({ key, icon, description }) => (
            <div key={key} className="flex items-start space-x-3 p-3 border rounded hover:bg-purple-50">
              <RadioGroupItem value={key} id={key} />
              <label htmlFor={key} className="flex flex-col cursor-pointer">
                <span className="flex items-center gap-2 font-semibold capitalize">
                  {icon} {key}
                </span>
                <span className="text-sm text-gray-600">{description}</span>
              </label>
            </div>
          ))}
        </RadioGroup>
        <Button disabled={loading} className="mt-6 w-full" onClick={handleSubmit}>
          {loading ? "Setting role..." : "Confirm Role"}
        </Button>
      </CardContent>
    </Card>
  );
}
