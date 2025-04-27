import React, { useEffect, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [credits, setCredits] = useState(0);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data from backend
  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const creditRes = await fetch('/api/credit/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!creditRes.ok) throw new Error('Failed to fetch credits');
      const creditData = await creditRes.json();
      setCredits(creditData.credits || 0);
      const issueRes = await fetch('/api/issue/mine', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!issueRes.ok) throw new Error('Failed to fetch issues');
      const issueData = await issueRes.json();
      setIssues(issueData.reverse());
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h2 className="text-4xl font-bold text-blue-900 mb-2 tracking-tight">My Dashboard</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="flex justify-end mb-4">
          <button onClick={fetchDashboard} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 font-semibold">
            <ArrowPathIcon className="w-5 h-5 animate-spin-slow" /> Refresh
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 flex flex-col items-center">
            <h3 className="text-lg font-semibold text-gray-700">Credits</h3>
            <p className="text-5xl text-blue-700 font-extrabold mt-4 mb-2">{loading ? <span className="animate-pulse text-gray-400">...</span> : credits}</p>
            <span className="text-sm text-gray-400">Earn more by reporting issues!</span>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-700 flex items-center justify-between">
              Latest Submissions
              <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">{issues.length} total</span>
            </h3>
            {loading ? (
              <p className="text-gray-500 mt-2 animate-pulse">Loading...</p>
            ) : issues.length === 0 ? (
              <p className="text-gray-500 mt-2">No issues submitted yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100 mt-4">
                {issues.map(issue => (
                  <li key={issue._id} className="py-3 flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-800 mr-2">{issue.title}</span>
                      <span className="text-xs text-gray-500">{issue.category}</span>
                    </div>
                    <span className={
                      issue.status === 'pending' ? 'text-yellow-600' :
                      issue.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                    }>
                      {issue.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
