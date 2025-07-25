import React, { useState, useEffect } from 'react';
import { X, PiggyBank, TrendingUp, Coins, GraduationCap, Plane, Shield, Smartphone } from 'lucide-react';
import { formatCurrency, getCurrencySymbol } from '../utils/currencyUtils';

const SavingsAllocationModal = ({ 
  isOpen, 
  onClose, 
  onSkip, 
  incomeAmount, 
  currency, 
  onSaveAllocation 
}) => {
  const [savingsPercentage, setSavingsPercentage] = useState(50);
  const [allocations, setAllocations] = useState({
    stocks: 20,
    mutualFunds: 20,
    gold: 20,
    education: 10,
    vacation: 5,
    emergencyFunds: 20,
    lifestyle: 5
  });

  const totalAllocation = Object.values(allocations).reduce((sum, val) => sum + val, 0);

  const categories = [
    { key: 'stocks', name: 'Stocks', icon: TrendingUp, color: 'text-green-600' },
    { key: 'mutualFunds', name: 'Mutual Funds', icon: TrendingUp, color: 'text-blue-600' },
    { key: 'gold', name: 'Gold', icon: Coins, color: 'text-yellow-600' },
    { key: 'education', name: 'Education', icon: GraduationCap, color: 'text-purple-600' },
    { key: 'vacation', name: 'Vacation', icon: Plane, color: 'text-pink-600' },
    { key: 'emergencyFunds', name: 'Emergency Funds', icon: Shield, color: 'text-red-600' },
    { key: 'lifestyle', name: 'Gadget/Lifestyle', icon: Smartphone, color: 'text-indigo-600' }
  ];

  const handleAllocationChange = (key, value) => {
    const newAllocations = { ...allocations, [key]: parseFloat(value) || 0 };
    setAllocations(newAllocations);
  };

  // Helper to update allocations and keep total at 100%
  const handleCategoryPercentChange = (key, value) => {
    let newVal = Math.max(0, Math.min(100, parseFloat(value) || 0));
    const others = Object.keys(allocations).filter(k => k !== key);
    const sumOthers = others.reduce((sum, k) => sum + allocations[k], 0);
    let newAlloc = { ...allocations, [key]: newVal };
    let total = newVal + sumOthers;
    if (total !== 100 && others.length > 0) {
      // Distribute the difference proportionally
      const diff = 100 - newVal;
      const sumOthersOrig = sumOthers;
      others.forEach((k, idx) => {
        if (sumOthersOrig === 0) {
          newAlloc[k] = diff / others.length;
        } else {
          newAlloc[k] = Math.max(0, Math.round((allocations[k] / sumOthersOrig) * diff * 100) / 100);
        }
      });
      // Fix rounding errors
      const newSum = Object.values(newAlloc).reduce((a, b) => a + b, 0);
      if (newSum !== 100) {
        // Adjust the first 'other' to make total exactly 100
        const firstOther = others[0];
        newAlloc[firstOther] += 100 - newSum;
      }
    }
    setAllocations(newAlloc);
  };

  const handleSave = () => {
    const savingsAmount = (incomeAmount * savingsPercentage) / 100;
    const allocationAmounts = {};
    
    Object.keys(allocations).forEach(key => {
      allocationAmounts[key] = (savingsAmount * allocations[key]) / 100;
    });

    onSaveAllocation({
      savingsPercentage,
      savingsAmount,
      allocations,
      allocationAmounts
    });
    onClose();
  };

  const handleSkip = () => {
    if (window.confirm("It’s better to plan your investments upfront and then plan your expenses for a better future. You can always plan your savings from the Savings Manager section.")) {
      if (onSkip) onSkip();
      else onClose();
    }
  };

  if (!isOpen) return null;

  const savingsAmount = (incomeAmount * savingsPercentage) / 100;

  return (
    <div className="savings-modal-overlay">
      <div className="savings-modal-content" style={{ position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 12, right: 12, fontSize: 24, color: '#666', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}
        >
          × <span style={{ fontSize: 16, verticalAlign: 'middle' }}>Close</span>
        </button>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <PiggyBank className="text-green-600" size={24} />
              <h2 className="text-2xl font-bold">Plan Your Savings</h2>
            </div>
          </div>

          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-green-800">Income Received</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(incomeAmount, currency)}
              </span>
            </div>
            <p className="text-sm text-green-700">
              Let's plan how much you'd like to save and invest from this income.
            </p>
          </div>

          {/* Savings Percentage */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What percentage of this income would you like to save?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={savingsPercentage}
                onChange={e => setSavingsPercentage(Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={savingsPercentage}
                onChange={e => {
                  let val = Number(e.target.value);
                  if (val < 0) val = 0;
                  if (val > 100) val = 100;
                  setSavingsPercentage(val);
                }}
                className="w-16 p-1 border border-gray-300 rounded text-center"
              />
              <span className="ml-1 font-semibold">%</span>
            </div>
            <div className="mt-2 text-green-700 font-medium">
              Savings Amount: {formatCurrency(savingsAmount, currency)}
            </div>
          </div>

          {/* Allocation Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Allocate Your Savings</h3>
            <div className="space-y-4">
              {categories.map(({ key, name, icon: Icon, color }) => (
                <div key={key} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Icon className={`${color}`} size={20} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{name}</span>
                      <span className="text-sm text-gray-600">
                        {formatCurrency((savingsAmount * allocations[key]) / 100, currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={allocations[key]}
                        onChange={(e) => handleCategoryPercentChange(key, e.target.value)}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={allocations[key]}
                        onChange={e => handleCategoryPercentChange(key, e.target.value)}
                        className="w-16 p-1 border border-gray-300 rounded text-center"
                      />
                      <span className="text-sm font-medium min-w-[40px]">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Allocation Warning */}
            {totalAllocation !== 100 && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                totalAllocation > 100 
                  ? 'bg-red-50 border border-red-200 text-red-700' 
                  : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
              }`}>
                <strong>Total Allocation: {totalAllocation}%</strong>
                {totalAllocation > 100 && (
                  <p>Total allocation exceeds 100%. Please adjust the percentages.</p>
                )}
                {totalAllocation < 100 && (
                  <p>Total allocation is less than 100%. You can add more allocations.</p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip for Now
            </button>
            <button
              onClick={handleSave}
              disabled={totalAllocation !== 100}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                totalAllocation === 100
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Allocation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsAllocationModal; 