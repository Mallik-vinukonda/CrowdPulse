import React, { useState, useEffect } from 'react';
import { getProfile, getCredits } from '../utils/api';
import { useAuth } from '../utils/AuthContext';

const DefaultAvatar = () => (
  <svg className="w-24 h-24 md:w-28 md:h-28 text-blue-200" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="48" stroke="#3b82f6" strokeWidth="4" fill="#e0e7ff" />
    <circle cx="50" cy="42" r="18" fill="#bfdbfe" />
    <ellipse cx="50" cy="75" rx="22" ry="13" fill="#bfdbfe" />
  </svg>
);

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    avatar: null,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const profileData = user || await getProfile();
        setProfile(profileData);
        // Fetch credits from backend
        const creditRes = await getCredits();
        // If no credits (new user), default to 100
        setCredits(typeof creditRes.credits === 'number' ? creditRes.credits : 100);
      } catch (e) {
        setProfile(null);
        setCredits(100); // fallback for new users
        setMessage(e?.response?.data?.error || e.message || 'Failed to load profile or credits.');
      }
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-700 text-lg">Loading profile...</div>;
  }
  if (!profile) {
    return <div className="min-h-screen flex flex-col items-center justify-center text-red-600 text-lg">
      Unable to load profile.
      {message && <div className="mt-4 bg-red-100 text-red-800 px-4 py-2 rounded text-center w-full font-medium">{message}</div>}
    </div>;
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar' && files.length > 0) {
      setForm({ ...form, avatar: URL.createObjectURL(files[0]) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setForm({
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
    });
    setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with API call to update profile
    setMessage('Profile updated successfully!');
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white/90 p-8 rounded-2xl shadow-xl border border-blue-100 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-900 tracking-tight text-center">My Profile</h2>
        <div className="mb-4 rounded-full border-4 border-blue-200 shadow-md bg-white flex items-center justify-center" style={{width:'7rem',height:'7rem'}}>
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="User Avatar"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover"
            />
          ) : (
            <DefaultAvatar />
          )}
        </div>
        {editing ? (
          <form className="w-full flex flex-col items-center gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg"
              placeholder="Name"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg"
              placeholder="Email"
              required
            />
            <input
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-blue-200"
            />
            <div className="flex gap-3 mt-2 w-full">
              <button type="submit" className="bg-blue-600 text-white flex-1 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Save</button>
              <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-800 flex-1 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="w-full flex flex-col items-center gap-1">
            <div className="text-xl font-semibold text-blue-800 mt-2">{profile.name}</div>
            <div className="text-gray-600 mb-1">{profile.email}</div>
            <span className="mt-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 tracking-wide mb-1">{profile.role ? profile.role.toUpperCase() : 'USER'}</span>
            <div className="mt-1 text-lg text-blue-900 font-bold">Credits: <span className="text-blue-700">{credits}</span></div>
            <button onClick={handleEdit} className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Edit Profile</button>
          </div>
        )}
        {message && <div className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded text-center w-full font-medium">{message}</div>}
      </div>
    </div>
  );
}
