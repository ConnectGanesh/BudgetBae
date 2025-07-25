import React, { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { formatCurrency, getCurrencySymbol } from '../utils/currencyUtils';

const TransactionForm = ({ onAddTransaction, remainingBudgets = {}, currency, transactions = [], categoryBudgets = {}, onPlanSavingsLink }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0]
  });
  const [customExpenseCategories, setCustomExpenseCategories] = useState([]);
  const [customIncomeCategories, setCustomIncomeCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other', ...customIncomeCategories],
    expense: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Self Development', 'Provisions', 'Savings', 'Other', ...customExpenseCategories]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    // Expense validation
    if (formData.type === 'expense') {
      const hasIncome = transactions.some(t => t.type === 'income');
      if (!hasIncome) {
        alert('Please add your income first before entering an expense.');
        return;
      }
      const catBudget = categoryBudgets[formData.category];
      if (!catBudget || catBudget === 0) {
        alert('Please plan your budget for this category before entering an expense.');
        return;
      }
    }

    onAddTransaction({
      ...formData,
      amount: parseFloat(formData.amount)
    });

    // Reset form
    setFormData({
      title: '',
      amount: '',
      category: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' && { category: '' })
    }));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    
    const currentCategories = categories[formData.type];
    if (currentCategories.includes(trimmed)) {
      alert('Category already exists.');
      return;
    }
    
    if (formData.type === 'income') {
      setCustomIncomeCategories([...customIncomeCategories, trimmed]);
    } else {
      setCustomExpenseCategories([...customExpenseCategories, trimmed]);
    }
    
    setFormData(prev => ({ ...prev, category: trimmed }));
    setNewCategory('');
    setShowAddCategory(false);
  };

  return (
    <div className="bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 p-1 rounded-2xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white bg-opacity-90 rounded-2xl p-6">
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="expense"
              checked={formData.type === 'expense'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-red font-medium">Expense</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="savings"
              checked={formData.type === 'savings'}
              onChange={handleChange}
              className="mr-2"
            />
            <span style={{ color: '#059669', fontWeight: 600 }}>Savings</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="income"
              checked={formData.type === 'income'}
              onChange={handleChange}
              className="mr-2"
            />
            <span style={{ color: '#2563eb', fontWeight: 600 }}>Income</span>
          </label>
        </div>
        {/* Category field: show savings types if type is 'savings', else normal categories */}
        <div className="form-group">
          <label>Category</label>
          <div className="flex gap-2">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input flex-1"
            >
              <option value="">Select a category</option>
              {formData.type === 'savings'
                ? [
                    'Stocks',
                    'Mutual Funds',
                    'Gold',
                    'Education',
                    'Vacation',
                    'Emergency Funds',
                    'Gadget/Lifestyle',
                  ].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))
                : categories[formData.type].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
            </select>
            {/* ...existing add category button for expense/income... */}
            {formData.type !== 'savings' && (
              <button
                type="button"
                className="btn btn-secondary px-3"
                onClick={() => setShowAddCategory(v => !v)}
              >
                + Add Category
              </button>
            )}
          </div>
          {/* ...existing add category form... */}
        </div>

        {/* Amount */}
        <div className="form-group">
          <label>Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg select-none" style={{fontWeight: 600}}>
              {getCurrencySymbol(currency)}
            </span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input pl-10"
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Date */}
        <div className="form-group">
          <label>Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Move Description field last */}
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="Enter transaction description"
          />
        </div>

        {formData.type === 'expense' && formData.category && remainingBudgets[formData.category] !== undefined && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm text-blue-800">
              <strong>Budget Status:</strong> {formatCurrency(remainingBudgets[formData.category], currency)} remaining in {formData.category}
            </div>
            {formData.amount && (
              <div className="text-sm text-blue-600 mt-1">
                After this transaction: {formatCurrency(remainingBudgets[formData.category] - parseFloat(formData.amount), currency)}
              </div>
            )}
          </div>
        )}

        <button type="submit" className="btn w-full flex items-center justify-center gap-2">
          <Plus size={20} />
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm; 