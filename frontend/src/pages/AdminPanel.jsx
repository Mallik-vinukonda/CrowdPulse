import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [form, setForm] = useState({
    title: '',
    author: '',
    type: 'ebook',
    credits: 0,
    file: null,
    imageUrl: '',
    link: ''
  });
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [resources, setResources] = useState([]);
  const [issues, setIssues] = useState([]);
  const [tab, setTab] = useState('upload');

  // Get admin JWT from localStorage
  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    async function fetchAdminData() {
      // Fetch all resources
      const res = await fetch('/api/resources', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setResources(await res.json());
      // Fetch all issues
      const issueRes = await fetch('/api/issue', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      setIssues(await issueRes.json());
    }
    fetchAdminData();
  }, [adminToken]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setForm({ ...form, file: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('author', form.author);
    formData.append('type', form.type);
    formData.append('credits', form.credits);
    formData.append('file', form.file);
    formData.append('imageUrl', form.imageUrl);
    formData.append('link', form.link);
    try {
      const res = await fetch('/api/resources/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`
        },
        body: formData
      });
      if (res.ok) {
        setMessage('Resource uploaded successfully!');
        setForm({ title: '', author: '', type: 'ebook', credits: 0, file: null, imageUrl: '', link: '' });
      } else {
        setMessage('Failed to upload resource.');
      }
    } catch (err) {
      setMessage('Error uploading resource.');
    }
    setUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-8">
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('upload')} className={`px-4 py-2 rounded ${tab==='upload' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Upload Resource</button>
        <button onClick={() => setTab('resources')} className={`px-4 py-2 rounded ${tab==='resources' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>All Resources</button>
        <button onClick={() => setTab('issues')} className={`px-4 py-2 rounded ${tab==='issues' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Reported Issues</button>
      </div>
      {tab === 'upload' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Admin: Upload Resource</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" className="border px-3 py-2 rounded" required />
            <input type="text" name="author" value={form.author} onChange={handleChange} placeholder="Author" className="border px-3 py-2 rounded" required />
            <select name="type" value={form.type} onChange={handleChange} className="border px-3 py-2 rounded">
              <option value="ebook">Ebook</option>
              <option value="video">Video</option>
              <option value="pdf">PDF</option>
            </select>
            <input type="number" name="credits" value={form.credits} onChange={handleChange} placeholder="Credits" className="border px-3 py-2 rounded" min="0" />
            <input type="file" name="file" accept=".pdf,image/*" onChange={handleChange} className="border px-3 py-2 rounded" required />
            <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL (optional)" className="border px-3 py-2 rounded" />
            <input type="text" name="link" value={form.link} onChange={handleChange} placeholder="External Link (optional)" className="border px-3 py-2 rounded" />
            <button type="submit" className={`bg-blue-600 text-white px-4 py-2 rounded font-semibold ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Resource'}</button>
            {message && <div className={`text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
          </form>
        </div>
      )}
      {tab === 'resources' && (
        <div>
          <h2 className="text-xl font-bold mb-4">All Resources</h2>
          <ul className="divide-y divide-gray-200">
            {resources.map(r => (
              <li key={r._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="font-semibold text-gray-800">{r.title}</span> <span className="text-xs text-gray-500">({r.type})</span>
                  <div className="text-xs text-gray-500">By {r.author}</div>
                </div>
                <a href={r.fileUrl || r.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mt-2 md:mt-0">View</a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {tab === 'issues' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Reported Issues</h2>
          <ul className="divide-y divide-gray-200">
            {issues.map(issue => (
              <li key={issue._id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <span className="font-semibold text-gray-800">{issue.title}</span>
                  <div className="text-xs text-gray-500">{issue.description}</div>
                </div>
                <span className={`text-xs font-semibold ${issue.status==='pending' ? 'text-yellow-600' : issue.status==='accepted' ? 'text-green-600' : 'text-red-600'}`}>{issue.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
