import React, { useRef, useEffect, useState } from 'react';
import { HelpCircle, PiggyBank } from 'lucide-react';

const Header = ({ onShowHowTo, userName = 'User', onLogout }) => {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setShowAccountMenu(false);
      }
    }
    if (showAccountMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAccountMenu]);

  return (
    <header className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
      <div className="flex items-center w-full">
        <div className="flex flex-center gap-4 min-w-0">
          <img src="/logo.svg" alt="BudgetBae Logo" style={{ height: 96 }} />
          <div>
            <h1 className="text-2xl font-bold">BudgetBae</h1>
            <p className="text-gray" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Take control of your finances
            </p>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-6">
          <button
            className="flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-lg font-semibold transition-all focus:outline-none"
            style={{
              background: 'linear-gradient(90deg, #10b981 0%, #2563eb 100%)',
              fontWeight: 700,
              marginLeft: '64px',
              boxShadow: '0 4px 16px rgba(16,185,129,0.10)',
              letterSpacing: '0.02em',
              outline: 'none',
              border: 'none',
            }}
            onClick={onShowHowTo}
            title="How to use this app"
          >
            <HelpCircle size={24} style={{ marginRight: 4 }} /> How To
          </button>
          {/* Account icon and username at the right end */}
          <div ref={accountRef} className="relative">
            <button
              onClick={() => setShowAccountMenu(v => !v)}
              className="flex items-center gap-2 px-4 py-1 rounded-full bg-white/90 hover:bg-green-100 border border-green-200 shadow-sm transition-all focus:outline-none"
              title="Account"
              style={{ color: '#166534', fontWeight: 600, minWidth: 80, boxShadow: '0 2px 8px rgba(16,185,129,0.08)' }}
            >
              <PiggyBank size={20} color="#10b981" />
              <span className="ml-2" style={{ fontWeight: 600, fontSize: 16 }}>{userName}</span>
            </button>
            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => { setShowAccountMenu(false); onLogout && onLogout(); }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 