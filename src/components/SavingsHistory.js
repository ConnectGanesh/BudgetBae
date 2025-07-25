import React, { useState } from 'react';
import { formatCurrency } from '../utils/currencyUtils';
import { Settings, Plus } from 'lucide-react';

const DEFAULT_SAVINGS_TYPES = [
  'Stocks', 'Mutual Funds', 'Gold', 'Education', 'Vacation', 'Emergency Funds', 'Gadget/Lifestyle'
];

const SavingsManager = ({ plannedSavings = {}, savingsAllocations = [], currency, transactions = [], onUpdatePlanned }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPlanned, setNewPlanned] = useState({});
  const [customTypes, setCustomTypes] = useState([]);
  const [showAddType, setShowAddType] = useState(false);
  const [newType, setNewType] = useState('');

  // Calculate planned and done for each savings type
  const planned = {};
  const done = {};
  const allTypes = [...DEFAULT_SAVINGS_TYPES, ...customTypes];
  allTypes.forEach(type => {
    planned[type] = plannedSavings[type] ?? 0;
    done[type] = 0;
  });
  // Sum done (transactions of type 'savings' and matching category)
  transactions.forEach(t => {
    if (t.type === 'savings' && done[t.category] !== undefined) {
      done[t.category] += t.amount;
    }
  });

  // Calculate total planned and done
  const totalPlanned = allTypes.reduce((sum, type) => sum + (planned[type] || 0), 0);
  const totalDone = allTypes.reduce((sum, type) => sum + (done[type] || 0), 0);

  // Only initialize newPlanned when entering edit mode for the first time
  React.useEffect(() => {
    if (isEditing && Object.keys(newPlanned).length === 0) {
      const initial = {};
      allTypes.forEach(type => { initial[type] = planned[type]; });
      setNewPlanned(initial);
    }
    // Do NOT reset newPlanned when leaving edit mode
    // if (!isEditing) setNewPlanned({});
  }, [isEditing]);

  // Reset newPlanned when plannedSavings changes and not editing
  React.useEffect(() => {
    if (!isEditing) {
      setNewPlanned({});
    }
  }, [plannedSavings, isEditing]);

  const handleAddType = (e) => {
    e.preventDefault();
    const trimmed = newType.trim();
    if (!trimmed) return;
    if (allTypes.includes(trimmed)) {
      alert('Category already exists.');
      return;
    }
    setCustomTypes([...customTypes, trimmed]);
    setNewPlanned({ ...newPlanned, [trimmed]: 0 });
    setNewType('');
    setShowAddType(false);
  };

  const handleAutoAllocate = () => {
    // Use the cumulative total income from all income transactions
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (t.amount || 0), 0);
    const savingsAmount = totalIncome * 0.5;
    // Default allocation percentages (same as modal)
    const defaultAllocations = {
      'Stocks': 20,
      'Mutual Funds': 20,
      'Gold': 20,
      'Education': 10,
      'Vacation': 5,
      'Emergency Funds': 20,
      'Gadget/Lifestyle': 5
    };
    const newAuto = { ...newPlanned };
    Object.entries(defaultAllocations).forEach(([type, percent]) => {
      if (allTypes.includes(type)) {
        newAuto[type] = Math.round(savingsAmount * (percent / 100) * 100) / 100;
      }
    });
    setNewPlanned(newAuto);
  };

  // Save handler
  const handleSave = () => {
    if (onUpdatePlanned) {
      onUpdatePlanned(newPlanned);
    }
    setIsEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Set Savings Category Limits</h3>
        {!isEditing ? (
          <button 
            className="btn btn-secondary flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            <Settings size={16} />
            Edit Savings
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="btn" onClick={handleSave}>
              Save Changes
            </button>
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
      {isEditing && (
        <div className="mb-4 space-y-3">
          <div className="flex gap-2 items-center">
            <button
              className="btn btn-secondary flex items-center gap-1 px-3"
              onClick={() => setShowAddType(v => !v)}
              type="button"
            >
              <Plus size={16} /> Add Category
            </button>
            <button
              className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 px-3"
              onClick={handleAutoAllocate}
              type="button"
            >
              <Settings size={16} /> Auto Allocate
            </button>
          </div>
          {showAddType && (
            <form onSubmit={handleAddType} className="flex gap-2">
              <input
                type="text"
                className="input flex-1"
                placeholder="New savings category"
                value={newType}
                onChange={e => setNewType(e.target.value)}
                maxLength={32}
                autoFocus
              />
              <button type="submit" className="btn">Add</button>
            </form>
          )}
        </div>
      )}
      <div className="mb-4 flex gap-8 items-center justify-center text-base font-semibold" style={{gap: 32}}>
        <span style={{ color: '#059669' }}>Total Planned: {formatCurrency(totalPlanned, currency)}</span>
        <span style={{ color: '#2563eb' }}>Total Done: {formatCurrency(totalDone, currency)}</span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {allTypes.map(type => {
          const plannedAmt = isEditing ? (newPlanned[type] ?? planned[type]) : planned[type];
          const doneAmt = done[type];
          const percent = plannedAmt > 0 ? Math.min(100, (doneAmt / plannedAmt) * 100) : 0;
          const remaining = plannedAmt - doneAmt;
          return (
            <div key={type} className="border rounded-lg shadow-md" style={{ background: 'linear-gradient(135deg, #d1fae5 0%, #bbf7d0 100%)', padding: 14, minHeight: 0 }}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-base" style={{ margin: 0 }}>{type}
                  <span style={{ color: '#059669', fontWeight: 500, marginLeft: 8, fontSize: '0.95em' }}>{percent.toFixed(1)}%</span>
                </h4>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-1 text-xs">
                <span style={{ color: '#059669', fontWeight: 500 }}>Planned: {formatCurrency(plannedAmt, currency)}</span>
                <span style={{ color: '#059669', fontWeight: 500 }}>Done: {formatCurrency(doneAmt, currency)}</span>
                <span style={{ color: remaining !== 0 ? '#dc2626' : '#059669', fontWeight: 600 }}>
                  {remaining < 0 ? 'Over' : 'Remaining'}: {formatCurrency(Math.abs(remaining), currency)}
                </span>
              </div>
              {isEditing ? (
                <div className="form-group mb-1">
                  <label className="text-xs font-medium">Planned Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm select-none" style={{fontWeight: 600}}>
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={newPlanned[type] ?? 0}
                      onChange={e => setNewPlanned({ ...newPlanned, [type]: Math.max(0, Math.floor(Number(e.target.value) || 0)) })}
                      className="input pl-8 py-1 text-sm"
                      min="0"
                      step="1"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1 mb-1">
                  <div
                    className={`h-2 rounded-full ${remaining < 0 ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: plannedAmt > 0 ? `${Math.min(100, (doneAmt / plannedAmt) * 100)}%` : '0%' }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavingsManager; 