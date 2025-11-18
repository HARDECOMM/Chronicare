import { useState, useEffect } from "react";
import { doctorsAPI } from "../../api/doctorsAPI";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useNavigate } from "react-router-dom";

export function CreateDoctorForm({ existingProfile, onSuccess, onCancel }) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    licenseNumber: "",
    location: "",
    bio: "",
    yearsOfExperience: "",
    languagesSpoken: "",
    phone: "",
    email: "",
    address: "",
    profileImage: null,
  });

  useEffect(() => {
    if (existingProfile) {
      setForm({
        name: existingProfile.name || "",
        specialty: existingProfile.specialty || "",
        licenseNumber: existingProfile.licenseNumber || "",
        location: existingProfile.location || "",
        bio: existingProfile.bio || "",
        yearsOfExperience: existingProfile.yearsOfExperience || "",
        languagesSpoken: existingProfile.languagesSpoken?.join(", ") || "",
        phone: existingProfile.contactInfo?.phone || "",
        email: existingProfile.contactInfo?.email || "",
        address: existingProfile.contactInfo?.address || "",
        profileImage: null,
      });
    }
  }, [existingProfile]);

  async function handleSubmit(e) {
    e.preventDefault();

    const requiredFields = [
      form.name,
      form.specialty,
      form.licenseNumber,
      form.location,
      form.email,
      form.phone,
    ];

    if (requiredFields.some(field => !field.trim())) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();

      // Preserve existing image if no new one is uploaded
      let imageUrl = existingProfile?.profileImage || null;

      if (form.profileImage) {
        const imageData = new FormData();
        imageData.append("file", form.profileImage);
        imageData.append("upload_preset", "doctor_profile_upload");

        const res = await fetch("https://api.cloudinary.com/v1_1/di4qeeuua/image/upload", {
          method: "POST",
          body: imageData,
        });

        const data = await res.json();
        imageUrl = data.secure_url;
      }

      const payload = {
        clerkId: user.id,
        name: form.name.trim(),
        specialty: form.specialty.trim(),
        licenseNumber: form.licenseNumber.trim(),
        location: form.location.trim(),
        bio: form.bio?.trim() || null,
        profileImage: imageUrl,
        contactInfo: {
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address?.trim() || null,
        },
        yearsOfExperience: Number(form.yearsOfExperience) || 0,
        languagesSpoken: form.languagesSpoken
          ? form.languagesSpoken.split(",").map(s => s.trim()).filter(Boolean)
          : [],
      };

      const isUpdating = !!existingProfile;

      if (isUpdating) {
        await doctorsAPI.updateMyProfile(payload, token);
        toast.success("Profile updated successfully!");
      } else {
        await doctorsAPI.createMyProfile(payload, token);
        toast.success("Profile created successfully!");
        navigate("/doctor/profile");
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("🔴 Submission error:", err.response?.data || err.message);
      toast.error(err.response?.data?.error || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  const isFormValid = [
    form.name,
    form.specialty,
    form.licenseNumber,
    form.location,
    form.email,
    form.phone,
  ].every(field => field.trim());

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        {existingProfile ? "Update Your Profile" : "Create Your Profile"}
      </h2>

      {/* Profile Image Upload with preview */}
      <div>
        <Label htmlFor="profileImage">Profile Image</Label>
        <label className="block w-full cursor-pointer border border-dashed border-purple-400 p-4 text-center rounded hover:bg-purple-50">
          <input
            type="file"
            id="profileImage"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setForm({ ...form, profileImage: file });
              }
            }}
            className="hidden"
          />
          {form.profileImage ? (
            <span>{form.profileImage.name}</span>
          ) : (
            <span className="text-purple-600">Click to upload image</span>
          )}
        </label>

        {form.profileImage && (
          <img
            src={URL.createObjectURL(form.profileImage)}
            alt="Preview"
            className="mt-4 w-24 h-24 rounded-full object-cover border border-gray-300"
          />
        )}
      </div>

      {/* Form fields */}
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="specialty">Specialty</Label>
        <Input id="specialty" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="licenseNumber">License Number</Label>
        <Input id="licenseNumber" value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
        <Input id="yearsOfExperience" type="number" value={form.yearsOfExperience} onChange={e => setForm({ ...form, yearsOfExperience: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="languagesSpoken">Languages Spoken (comma-separated)</Label>
        <Input id="languagesSpoken" value={form.languagesSpoken} onChange={e => setForm({ ...form, languagesSpoken: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
          placeholder="Tell us about yourself"
        />
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={!isFormValid || loading}
        className={`w-full ${
          loading
            ? "bg-purple-400 cursor-not-allowed"
            : "bg-purple-600 text-white hover:bg-purple-700"
        }`}
      >
        {loading
          ? "Saving..."
          : existingProfile
          ? "Update Profile"
          : "Save Profile"}
      </Button>

      {/* Cancel button */}
      {onCancel && (
        <Button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 hover:bg-gray-400 w-full mt-2"
        >
          Cancel
        </Button>
      )}
    </form>
  );
}