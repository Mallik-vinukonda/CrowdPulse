import React, { useState, useEffect } from 'react';

export default function ReviewIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // id of issue being reviewed

  useEffect(() => {
    async function fetchPendingIssues() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/issue?status=pending', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch pending issues');
        const data = await res.json();
        setIssues(data);
      } catch (err) {
        setError(err.message || 'Error loading issues');
      }
      setLoading(false);
    }
    fetchPendingIssues();
  }, []);

  const handleReview = async (id, status) => {
    setActionLoading(id);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/issue/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to review issue');
      }
      setIssues(issues => issues.filter(issue => issue._id !== id));
    } catch (err) {
      setError(err.message || 'Review action failed');
    }
    setActionLoading(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Review Submitted Issues</h2>
      <div className="bg-white p-6 rounded shadow border border-gray-200">
        {loading ? (
          <div>Loading pending issues...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : issues.length === 0 ? (
          <div>No pending issues to review. All clear!</div>
        ) : (
          <ul className="flex flex-col gap-4">
            {issues.map(issue => (
              <li key={issue._id} className="flex flex-col md:flex-row gap-4 border-b pb-4 last:border-b-0">
                <img src={issue.photoUrl || require('../assets/issue_colorful.jpg')} alt="Issue" className="w-20 h-20 rounded object-cover border" />
                <div className="flex-1">
                  <div className="font-bold mb-1">{issue.title}</div>
                  <div className="mb-1 text-gray-600 text-sm">{issue.description}</div>
                  <div className="mb-1 text-xs text-gray-500">Category: {issue.category} | Location: {issue.location}</div>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => handleReview(issue._id, 'accepted')} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 font-semibold" disabled={actionLoading === issue._id}>Accept</button>
                    <button onClick={() => handleReview(issue._id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-semibold" disabled={actionLoading === issue._id}>Reject</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-6 text-xs text-gray-500 text-center">Moderators: Please review with care. Accepted issues reward users with credits!</div>
    </div>
  );
}
