import React, { useState, useEffect } from 'react';

export default function ResourceHub() {
  const [resources, setResources] = useState({
    newspapers: [],
    ebooks: [],
    articles: [],
    journals: []
  });
  const [message, setMessage] = useState('');

  // Use VITE_API_URL or fallback to localhost
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    async function fetchResources() {
      try {
        const res = await fetch('/api/resources');
        const data = await res.json();
        // Categorize resources by type
        const categorized = { newspapers: [], ebooks: [], articles: [], journals: [] };
        data.forEach(r => {
          if (r.type === 'ebook') categorized.ebooks.push(r);
          else if (r.type === 'newspaper') categorized.newspapers.push(r);
          else if (r.type === 'article') categorized.articles.push(r);
          else if (r.type === 'journal') categorized.journals.push(r);
        });
        setResources(categorized);
      } catch (err) {
        setMessage('Failed to fetch resources.');
      }
    }
    fetchResources();
  }, []);

  const handleUnlock = (type, id, fileUrl) => {
    setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} unlocked!`);
    if (fileUrl) {
      // Always open from backend, not frontend
      window.open(`${backendUrl}${fileUrl}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 tracking-tight">Resource Hub</h2>
        {message && <div className="bg-green-100 text-green-800 rounded p-2 mb-4 text-center font-semibold">{message}</div>}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
          <p className="mb-8 text-blue-700 text-lg text-center">Unlock important newspapers, ebooks, articles, and journals using your earned credits. These resources are especially valuable for UPSC aspirants and the general public!</p>
          {/* Resource Sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Newspapers */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Old Newspapers</h3>
              {resources.newspapers.length === 0 ? (
                <div className="text-gray-500">No newspapers available yet.</div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {resources.newspapers.map(np => (
                    <li key={np._id} className="flex items-center gap-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <img src={np.imageUrl || '/favicon.svg'} alt="Newspaper" className="w-16 h-16 rounded object-cover border" />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-900">{np.title}</div>
                        <div className="text-xs text-blue-500">{np.author}</div>
                      </div>
                      {np.fileUrl && <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => handleUnlock('newspaper', np._id, np.fileUrl)}>Unlock</button>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Ebooks */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Ebooks</h3>
              {resources.ebooks.length === 0 ? (
                <div className="text-gray-500">No ebooks available yet.</div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {resources.ebooks.map(eb => (
                    <li key={eb._id} className="flex items-center gap-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <img src={eb.imageUrl || '/favicon.svg'} alt="Ebook" className="w-16 h-16 rounded object-cover border" />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-900">{eb.title}</div>
                        <div className="text-xs text-blue-500">{eb.author}</div>
                      </div>
                      {eb.fileUrl && <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" onClick={() => handleUnlock('ebook', eb._id, eb.fileUrl)}>Unlock</button>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Articles */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Articles</h3>
              {resources.articles.length === 0 ? (
                <div className="text-gray-500">No articles available yet.</div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {resources.articles.map(ar => (
                    <li key={ar._id} className="flex items-center gap-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <img src={ar.imageUrl || '/favicon.svg'} alt="Article" className="w-16 h-16 rounded object-cover border" />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-900">{ar.title}</div>
                        <div className="text-xs text-blue-500">{ar.author}</div>
                      </div>
                      {ar.link && <a className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" href={ar.link} target="_blank" rel="noopener noreferrer">Read</a>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Journals */}
            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-800">Journals</h3>
              {resources.journals.length === 0 ? (
                <div className="text-gray-500">No journals available yet.</div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {resources.journals.map(jn => (
                    <li key={jn._id} className="flex items-center gap-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <img src={jn.imageUrl || '/favicon.svg'} alt="Journal" className="w-16 h-16 rounded object-cover border" />
                      <div className="flex-1">
                        <div className="font-semibold text-blue-900">{jn.title}</div>
                        <div className="text-xs text-blue-500">{jn.author}</div>
                      </div>
                      {jn.link && <a className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" href={jn.link} target="_blank" rel="noopener noreferrer">Read</a>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
