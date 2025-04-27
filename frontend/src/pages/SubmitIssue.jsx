import React, { useState } from 'react';

export default function SubmitIssue() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    photo: null,
    category: '',
    location: '',
  });
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const formData = {
        title: form.title,
        description: form.description,
        category: form.category,
        location: {
          address: form.location
        }
      };
      // Optionally add photoUrl if you have backend support for image upload
      const res = await fetch('/api/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Submission failed');
      }
      setSuccess('Issue submitted! Pending review.');
      setForm({ title: '', description: '', photo: null, category: '', location: '' });
    } catch (err) {
      setSuccess('');
      alert(err.message || 'Error submitting issue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 tracking-tight text-center">Report an Issue / News</h2>
        {success && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center font-semibold shadow">{success}</div>
        )}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 space-y-6">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Issue Title"
            required
            className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue or news..."
            rows={4}
            required
            className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg"
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category (e.g. Road, Water, Power)"
            className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg"
          />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location (address or landmark)"
            className="w-full px-4 py-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none text-lg"
          />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-blue-200"
          />
          {form.photo && (
            <div className="mt-2">
              <img src={URL.createObjectURL(form.photo)} alt="Preview" className="w-24 h-24 object-cover rounded border mx-auto" />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-blue-700 transition"
          >
            Submit Issue
          </button>
          <button
            type="reset"
            onClick={() => setForm({ title: '', description: '', photo: null, category: '', location: '' })}
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold text-lg shadow hover:bg-gray-300 transition"
          >
            Clear
          </button>
        </form>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">How to Write a Good Report?</h3>
          <ul className="list-disc ml-6 text-gray-700 text-sm space-y-1">
            <li>Use a clear and descriptive title.</li>
            <li>Add factual details and avoid speculation.</li>
            <li>Include the exact location for accuracy.</li>
            <li>Attach a photo if possible to support the report.</li>
            <li>Choose an accurate category to help moderators.</li>
          </ul>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <b>Note:</b> All reports are reviewed by moderators. Earn credits for accepted submissions.
        </div>
      </div>
    </div>
  );
}
