import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 tracking-tight text-center">Login</h2>
        {error && <div className="bg-red-100 text-red-800 rounded p-2 mb-4 text-center font-semibold">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required className="px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg" />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required className="px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg" />
          <button type="submit" className="bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-blue-700 transition">Login</button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-semibold">Register</Link>
        </div>
      </div>
    </div>
  );
}
