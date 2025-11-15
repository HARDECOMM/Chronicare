import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { DoctorSidebar } from '../../components/UI/DoctorSidebar';
import { toast } from 'react-hot-toast';
import { doctorsAPI } from '../../api/doctorsAPI';

export function DoctorProfileEditor() {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      try {
        const token = await getToken();
        const data = await doctorsAPI.getMyProfile(token);
        if (!mounted) return;
        setProfile(data || null);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          if (mounted) setProfile(null);
        } else {
          console.error('Failed to load profile', err);
          toast.error(err?.response?.data?.error || err.message || 'Failed to load profile');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchProfile();
    return () => { mounted = false; };
  }, [getToken]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getToken();
      const updated = await doctorsAPI.updateMyProfile(profile, token);
      setProfile(updated);
      toast.success('Profile updated');
    } catch (err) {
      console.error('Update failed', err);
      toast.error(err?.response?.data?.error || err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="flex">
      <DoctorSidebar />
      <main className="ml-64 p-6 w-full">
        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

        {!profile ? (
          <div className="p-4 bg-purple-50 border border-purple-100 rounded">
            <p className="mb-3">No profile found. Please create your profile first.</p>
            <a href="/doctor/create" className="inline-block bg-purple-600 text-white px-4 py-2 rounded">Create Profile</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={profile.name || ''} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Name" className="w-full border px-3 py-2 rounded" />
            <input type="text" value={profile.specialty || ''} onChange={(e) => setProfile({ ...profile, specialty: e.target.value })} placeholder="Specialty" className="w-full border px-3 py-2 rounded" />
            <input type="text" value={profile.location || ''} onChange={(e) => setProfile({ ...profile, location: e.target.value })} placeholder="Location" className="w-full border px-3 py-2 rounded" />
            <textarea value={profile.bio || ''} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Bio" className="w-full border px-3 py-2 rounded" />
            <label className="flex items-center space-x-2">
              <input type="checkbox" checked={!!profile.available} onChange={(e) => setProfile({ ...profile, available: e.target.checked })} className="h-4 w-4" />
              <span>Available for appointments</span>
            </label>
            <button type="submit" disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
