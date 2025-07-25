import React, { useState, useEffect } from 'react';
import { formatCurrency, getCurrencySymbol } from '../utils/currencyUtils';

const ExpensePlanningModal = ({ 
  isOpen, 
  onClose, 
  onSkip, 
  remainingBudgets = {}, 
  currency = 'USD',
  onPlanExpenses 
}) => {
  const [suggestedAllocations, setSuggestedAllocations] = useState({});
  const [totalSuggested, setTotalSuggested] = useState(0);

  useEffect(() => {
    if (isOpen && remainingBudgets) {
      // Calculate suggested allocations based on typical spending patterns
      const suggestions = {};
      let total = 0;
      
      // Define typical expense ratios for different categories
      const expenseRatios = {
        'Food': 0.15,           // 15% of total budget
        'Transportation': 0.12,  // 12% of total budget
        'Housing': 0.25,         // 25% of total budget
        'Utilities': 0.08,       // 8% of total budget
        'Entertainment': 0.10,   // 10% of total budget
        'Healthcare': 0.08,      // 8% of total budget
        'Shopping': 0.12,        // 12% of total budget
        'Self Development': 0.05, // 5% of total budget
        'Provisions': 0.03,      // 3% of total budget
        'Other': 0.02            // 2% of total budget
      };
      
      const totalRemaining = Object.values(remainingBudgets).reduce((sum, amount) => sum + amount, 0);
      
      Object.entries(remainingBudgets).forEach(([category, remaining]) => {
        if (remaining > 0) {
          // Use the expense ratio for this category, but cap it at the remaining budget
          const ratio = expenseRatios[category] || 0.05; // Default 5% for unknown categories
          const suggested = Math.min(
            Math.round(totalRemaining * ratio * 100) / 100,
            remaining
          );
          suggestions[category] = suggested;
          total += suggested;
        }
      });
      
      setSuggestedAllocations(suggestions);
      setTotalSuggested(total);
    }
  }, [isOpen, remainingBudgets]);

  const handleAllocationChange = (category, value) => {
    const numValue = parseFloat(value) || 0;
    setSuggestedAllocations(prev => ({
      ...prev,
      [category]: numValue
    }));
    
    // Recalculate total
    const newTotal = Object.entries(suggestedAllocations).reduce((sum, [cat, amount]) => {
      return sum + (cat === category ? numValue : amount);
    }, 0);
    setTotalSuggested(newTotal);
  };

  const handleSavePlanning = () => {
    onPlanExpenses(suggestedAllocations);
  };

  const handleSkip = () => {
    if (window.confirm('Planning your expenses upfront helps you stay within budget. Are you sure you want to skip expense planning?')) {
      onSkip();
    }
  };

  if (!isOpen) return null;

  const categoriesWithBudget = Object.entries(remainingBudgets).filter(([_, remaining]) => remaining > 0);

  return (
    <div className="savings-modal-overlay">
      <div className="savings-modal-content relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl font-bold z-10"
        >
          × <span className="ml-1 text-base align-middle">Close</span>
        </button>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Plan Your Expenses</h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Based on typical spending patterns and your remaining budgets, here are suggested expense amounts for each category:
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="text-sm text-blue-800">
                <strong>Total Suggested:</strong> {formatCurrency(totalSuggested, currency)}
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {categoriesWithBudget.map(([category, remaining]) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium text-gray-700">{category}</label>
                  <span className="text-sm text-gray-500">
                    {formatCurrency(remaining, currency)} remaining
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 text-lg font-semibold">
                    {getCurrencySymbol(currency)}
                  </span>
                  <input
                    type="number"
                    value={suggestedAllocations[category] || 0}
                    onChange={(e) => handleAllocationChange(category, e.target.value)}
                    className="flex-1 input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max={remaining}
                  />
                  <div className="text-sm text-gray-500">
                    {suggestedAllocations[category] && remaining > 0 && (
                      <span className={suggestedAllocations[category] > remaining ? 'text-red-500' : 'text-green-500'}>
                        {Math.round((suggestedAllocations[category] / remaining) * 100)}% of remaining
                      </span>
                    )}
                  </div>
                </div>
                {suggestedAllocations[category] > remaining && (
                  <div className="text-red-500 text-sm mt-1">
                    ⚠️ Exceeds remaining budget
                  </div>
                )}
              </div>
            ))}
          </div>

          {categoriesWithBudget.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-lg font-medium mb-2">No Category Budgets Set</p>
                <p className="mb-4">To get expense planning suggestions, you need to set up your category budgets first.</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-blue-800 mb-2">Next Steps:</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Go to the "Category Budget Manager" section</li>
                    <li>Click "Edit Budgets" to set budget limits for each category</li>
                    <li>Use "Auto Allocate" to get suggested budget allocations</li>
                    <li>Come back here to plan your expenses</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleSkip}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Skip for Now
            </button>
            <button
              onClick={handleSavePlanning}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={categoriesWithBudget.length === 0}
            >
              Save Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensePlanningModal; 