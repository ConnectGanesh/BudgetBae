import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo, accept any non-empty username/password
    if (username.trim() && password.trim()) {
      setError('');
      onLogin(username.trim());
    } else {
      setError('Please enter both username and password.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #bbf7d0 0%, #dbeafe 100%)' }}>
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img src="/logo.svg" alt="BudgetBae Logo" style={{ height: 80, marginBottom: 24 }} />
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full" style={{ maxWidth: 360 }}>
          <h2 className="text-2xl font-bold mb-8 text-green-700 text-center">Login</h2>
          <div className="mb-6">
            <label className="block text-gray-700 mb-3 text-base font-semibold">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
              autoFocus
              style={{ minHeight: 44 }}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-3 text-base font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-lg"
              style={{ minHeight: 44 }}
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-colors mt-2">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login; 