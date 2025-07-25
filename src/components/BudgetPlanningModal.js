import React, { useState, useEffect } from 'react';
import { formatCurrency, getCurrencySymbol } from '../utils/currencyUtils';

const BudgetPlanningModal = ({ 
  isOpen, 
  onClose, 
  onApply, 
  totalIncome = 0, 
  totalSavings = 0,
  currency = 'USD'
}) => {
  const [suggestedAllocations, setSuggestedAllocations] = useState({});

  useEffect(() => {
    if (isOpen && totalIncome > 0) {
      const remainingAfterSavings = totalIncome - totalSavings;
      const budgetAmount = remainingAfterSavings * 0.5; // 50% of remaining after savings
      
      // Default allocation percentages
      const defaultAllocations = {
        'Housing': 0.17,      // 17% for house rent/EMI
        'Transportation': 0.10, // 10% for transport
        'Food': 0.10,         // 10% for food
        'Utilities': 0.08,    // 8% for utilities
        'Entertainment': 0.07, // 7% for entertainment
        'Shopping': 0.10,     // 10% for shopping
        'Healthcare': 0.08,   // 8% for healthcare
        'Self Development': 0.05, // 5% for self development
        'Provisions': 0.16,   // 16% for provisions
        'Other': 0.09         // 9% for miscellaneous (remaining)
      };

      const suggestions = {};
      Object.entries(defaultAllocations).forEach(([category, percentage]) => {
        suggestions[category] = Math.round(budgetAmount * percentage * 100) / 100;
      });

      setSuggestedAllocations(suggestions);
    }
  }, [isOpen, totalIncome, totalSavings]);

  const handleAllocationChange = (category, value) => {
    const numValue = parseFloat(value) || 0;
    setSuggestedAllocations(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const handleApply = () => {
    onApply(suggestedAllocations);
  };

  if (!isOpen) return null;

  const remainingAfterSavings = totalIncome - totalSavings;
  const budgetAmount = remainingAfterSavings * 0.5;
  const totalSuggested = Object.values(suggestedAllocations).reduce((sum, amount) => sum + amount, 0);

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
            <h2 className="text-2xl font-bold text-gray-800">Plan Your Budget</h2>
          </div>

          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Budget Summary</h3>
              <div className="grid grid-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Total Income:</span>
                  <div className="font-semibold">{formatCurrency(totalIncome, currency)}</div>
                </div>
                <div>
                  <span className="text-blue-600">Total Savings:</span>
                  <div className="font-semibold">{formatCurrency(totalSavings, currency)}</div>
                </div>
                <div>
                  <span className="text-blue-600">Remaining After Savings:</span>
                  <div className="font-semibold">{formatCurrency(remainingAfterSavings, currency)}</div>
                </div>
                <div>
                  <span className="text-blue-600">Budget Amount (50%):</span>
                  <div className="font-semibold">{formatCurrency(budgetAmount, currency)}</div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">
              Based on your income and savings, here are suggested budget allocations for each category. You can adjust these amounts before applying:
            </p>
          </div>

          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {Object.entries(suggestedAllocations).map(([category, amount]) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium text-gray-700">{category}</label>
                  <span className="text-sm text-gray-500">
                    {Math.round((amount / budgetAmount) * 100)}% of budget
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-lg font-semibold">
                    {getCurrencySymbol(currency)}
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAllocationChange(category, e.target.value)}
                    className="flex-1 input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-green-800 font-medium">Total Budget Allocated:</span>
              <span className="text-green-800 font-bold text-lg">
                {formatCurrency(totalSuggested, currency)}
              </span>
            </div>
            {Math.abs(totalSuggested - budgetAmount) > 0.01 && (
              <div className="text-sm text-green-600 mt-1">
                {totalSuggested > budgetAmount 
                  ? `Over budget by ${formatCurrency(totalSuggested - budgetAmount, currency)}`
                  : `Under budget by ${formatCurrency(budgetAmount - totalSuggested, currency)}`
                }
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Apply Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetPlanningModal; 