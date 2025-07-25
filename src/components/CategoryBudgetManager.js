import React, { useState } from 'react';
import { Settings, AlertTriangle, Plus } from 'lucide-react';
import { formatCurrency, getCurrencySymbol } from '../utils/currencyUtils';

const DEFAULT_CATEGORIES = [
  'Food', 'Transportation', 'Housing', 'Utilities', 
  'Entertainment', 'Healthcare', 'Shopping', 'Self Development', 'Provisions', 'Other'
];

const BudgetManager = ({ 
  categoryBudgets, 
  categorySpending, 
  remainingBudgets, 
  onUpdateBudgets,
  currency,
  totalIncome = 0,
  totalSavings = 0
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudgets, setNewBudgets] = useState(categoryBudgets);
  const [customCategories, setCustomCategories] = useState(
    Object.keys(categoryBudgets).filter(cat => !DEFAULT_CATEGORIES.includes(cat))
  );
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const categories = [...DEFAULT_CATEGORIES, ...customCategories];

  const handleSave = () => {
    // Merge newBudgets with existing categoryBudgets to preserve untouched categories
    onUpdateBudgets({ ...categoryBudgets, ...newBudgets });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewBudgets(categoryBudgets);
    setIsEditing(false);
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      alert('Category already exists.');
      return;
    }
    setCustomCategories([...customCategories, trimmed]);
    setNewBudgets({ ...newBudgets, [trimmed]: 0 });
    setNewCategory('');
    setShowAddCategory(false);
  };

  const handleDefaultAllocation = () => {
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

    const newAllocations = {};
    Object.entries(defaultAllocations).forEach(([category, percentage]) => {
      newAllocations[category] = Math.round(budgetAmount * percentage * 100) / 100;
    });

    setNewBudgets(newAllocations);
    
    // Add any new categories that don't exist yet
    const newCategories = Object.keys(defaultAllocations).filter(cat => !categories.includes(cat));
    if (newCategories.length > 0) {
      setCustomCategories([...customCategories, ...newCategories]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Set Budget Limits</h3>
        {!isEditing ? (
          <button 
            className="btn btn-secondary flex items-center gap-2"
            onClick={() => setIsEditing(true)}
          >
            <Settings size={16} />
            Edit Budgets
          </button>
        ) : (
          <div className="flex gap-2">
            <button className="btn" onClick={handleSave}>
              Save Changes
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Summary row for total planned and total spent */}
      {!isEditing && (
        <div className="mb-4 flex gap-8 items-center justify-center text-base font-semibold" style={{gap: 32}}>
          <span style={{ color: '#059669' }}>Total Planned: {formatCurrency(categories.reduce((sum, cat) => sum + (categoryBudgets[cat] || 0), 0), currency)}</span>
          <span style={{ color: '#2563eb' }}>Total Spent: {formatCurrency(categories.reduce((sum, cat) => sum + (categorySpending[cat] || 0), 0), currency)}</span>
        </div>
      )}

      {isEditing && (
        <div className="mb-4 space-y-3">
          <div className="flex gap-2 items-center">
            <button
              className="btn btn-secondary flex items-center gap-1 px-3"
              onClick={() => setShowAddCategory(v => !v)}
              type="button"
            >
              <Plus size={16} /> Add Category
            </button>
            {totalIncome > 0 && (
              <button
                className="btn bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 px-3"
                onClick={handleDefaultAllocation}
                type="button"
              >
                <Settings size={16} /> Auto Allocate
              </button>
            )}
          </div>
          {showAddCategory && (
            <form onSubmit={handleAddCategory} className="flex gap-2">
              <input
                type="text"
                className="input flex-1"
                placeholder="New category name"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                maxLength={32}
                autoFocus
              />
              <button type="submit" className="btn">Add</button>
            </form>
          )}
          {totalIncome > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm text-green-800">
                <strong>Auto Allocate:</strong> Based on your income of {formatCurrency(totalIncome, currency)} and savings of {formatCurrency(totalSavings, currency)}, 
                this will allocate 50% of remaining amount ({formatCurrency((totalIncome - totalSavings) * 0.5, currency)}) across categories using recommended percentages.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Change grid to 2 columns and compact layout */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {categories.map((category, idx) => {
          const allocated = newBudgets[category] ?? categoryBudgets[category] ?? 0;
          const spent = categorySpending[category] || 0;
          const remaining = remainingBudgets[category] || 0;
          const percentage = allocated > 0 ? (spent / allocated) * 100 : 0;
          const isOverBudget = spent > allocated;

          // Array of lighter gradients for variety
          const gradients = [
            'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
            'linear-gradient(135deg, #d1f7e7 0%, #e0f7fa 100%)',
            'linear-gradient(135deg, #ffe0c3 0%, #ffd6e0 100%)',
            'linear-gradient(135deg, #fffbe0 0%, #e0ffe0 100%)',
            'linear-gradient(135deg, #e0f7fa 0%, #e0e7ff 100%)',
            'linear-gradient(135deg, #ffe0f7 0%, #ffe0e0 100%)',
            'linear-gradient(135deg, #e0ffe0 0%, #e0f7fa 100%)',
            'linear-gradient(135deg, #fbe0ff 0%, #e0f7fa 100%)',
            'linear-gradient(135deg, #e0f7fa 0%, #e0e7ff 100%)',
            'linear-gradient(135deg, #e0f7fa 0%, #ffe0f7 100%)',
          ];
          const gradient = gradients[idx % gradients.length];

          return (
            <div key={category} className="border rounded-lg shadow-md" style={{ background: gradient, padding: 14, minHeight: 0 }}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-base" style={{ margin: 0 }}>{category}
                  <span style={{ color: '#2563eb', fontWeight: 500, marginLeft: 8, fontSize: '0.95em' }}>
                    {allocated > 0 ? `${Math.min(100, (spent / allocated) * 100).toFixed(1)}%` : '0%'}
                  </span>
                </h4>
                {isOverBudget && (
                  <div className="flex items-center gap-1 text-red-500">
                    <AlertTriangle size={14} />
                    <span className="text-xs font-medium">Over</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-1 text-xs">
                <span style={{ color: '#2563eb', fontWeight: 500 }}>Budget: {formatCurrency(allocated, currency)}</span>
                <span style={{ color: '#f87171', fontWeight: 500 }}>Spent: {formatCurrency(spent, currency)}</span>
                <span style={{ color: isOverBudget ? '#dc2626' : '#059669', fontWeight: 600 }}>
                  {isOverBudget ? 'Over' : 'Remaining'}: {formatCurrency(Math.abs(remaining), currency)}
                </span>
              </div>
              {isEditing ? (
                <div className="form-group mb-1">
                  <label className="text-xs font-medium">Monthly Limit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm select-none" style={{fontWeight: 600}}>
                      {getCurrencySymbol(currency)}
                    </span>
                    <input
                      type="number"
                      value={newBudgets[category] ?? 0}
                      onChange={e => setNewBudgets({ ...newBudgets, [category]: parseFloat(e.target.value) || 0 })}
                      className="input pl-8 py-1 text-sm"
                      min="0"
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1 mb-1">
                  <div
                    className={`h-2 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: allocated > 0 ? `${Math.min(100, (spent / allocated) * 100)}%` : '0%' }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Budget Management Tips - fix bullets */}
      {!isEditing && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">Budget Management Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
            <li>Set realistic budget limits for each category based on your income</li>
            <li>Monitor your spending regularly to stay within budget</li>
            <li>Categories in red are over budget - consider reducing spending</li>
            <li>Categories in yellow are approaching their limit</li>
            <li>Use the remaining budget information to make informed spending decisions</li>
          </ul>
        </div>
      )}

      {/* Add a class for savings history gradient for use in App.js */}
      {/* .savings-history-gradient { background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%); } */}
    </div>
  );
};

export default BudgetManager; 