import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <div className="bg-red-100 text-red-800 rounded p-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow flex flex-col gap-4 border border-gray-200">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="p-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required className="p-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required className="p-2 rounded border border-gray-300 focus:border-blue-500 outline-none" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">Register</button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </div>
    </div>
  );
}
