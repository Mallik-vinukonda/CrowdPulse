import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        const errData = await res.json();
        setError(errData.message || 'Invalid admin credentials');
      }
    } catch (err) {
      setError('Error logging in');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Admin Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Admin Email"
            className="border px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="border px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className={`bg-blue-600 text-white px-6 py-3 rounded font-semibold transition-all duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <div className="text-red-600 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}
