export function DoctorProfileCard({ profile }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <img
          src="/doctor-placeholder.png"
          alt="Doctor"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-2xl font-bold text-purple-700">Dr. {profile.name}</h2>
          <p className="text-gray-600">{profile.specialty}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div>
          <strong>Experience:</strong> {profile.yearsOfExperience}+ Years
        </div>
        <div>
          <strong>Languages:</strong> {profile.languagesSpoken?.join(", ")}
        </div>
        <div>
          <strong>Phone:</strong> {profile.contactInfo?.phone}
        </div>
        <div>
          <strong>Email:</strong> {profile.contactInfo?.email}
        </div>
        <div className="col-span-2">
          <strong>Location:</strong> {profile.location}
        </div>
        <div className="col-span-2">
          <strong>Bio:</strong> {profile.bio}
        </div>
      </div>
    </div>
  );
}
