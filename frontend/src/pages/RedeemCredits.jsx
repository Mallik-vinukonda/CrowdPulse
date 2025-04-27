import React, { useState } from 'react';

export default function RedeemCredits() {
  const [credits, setCredits] = useState(0); // TODO: fetch from API
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');

  const handleRedeem = e => {
    e.preventDefault();
    // TODO: API call for redemption
    setMessage('Redemption request submitted!');
    setAmount('');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Redeem Credits</h2>
      <div className="bg-white p-6 rounded shadow mb-4 border border-gray-200">Current Credits: <b>{credits}</b></div>
      {message && <div className="bg-green-100 text-green-800 rounded p-2 mb-4">{message}</div>}
      <form onSubmit={handleRedeem} className="flex flex-col gap-4 bg-white p-6 rounded shadow border border-gray-200">
        <input type="number" placeholder="Credits to redeem (min 100)" value={amount} onChange={e => setAmount(e.target.value)} className="p-2 rounded border border-gray-300 focus:border-blue-500 outline-none" min="100" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">Redeem</button>
      </form>
    </div>
  );
}
