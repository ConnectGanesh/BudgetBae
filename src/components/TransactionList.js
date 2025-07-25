import React, { useState } from 'react';
import { Trash2, Calendar, PiggyBank, ChevronDown, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';

const TransactionList = ({ transactions, onDeleteTransaction, currency, savingsAllocations = [], onPlanSavings }) => {
  const [openCategories, setOpenCategories] = useState({});

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Group transactions by category
  const groupedByCategory = sortedTransactions.reduce((acc, transaction) => {
    const cat = transaction.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(transaction);
    return acc;
  }, {});

  // Helper: check if an income transaction has a savings allocation
  const hasSavingsAllocation = (transactionId) => {
    return savingsAllocations.some(a => a.incomeTransactionId === transactionId);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray text-lg">No transactions yet</p>
        <p className="text-gray">Add your first transaction to get started!</p>
      </div>
    );
  }

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div>
      {Object.entries(groupedByCategory).map(([category, txns]) => (
        <div key={category} className="mb-4 border rounded-lg shadow-sm bg-gray-50">
          <button
            className="w-full flex justify-between items-center px-4 py-3 text-lg font-semibold focus:outline-none hover:bg-gray-100 rounded-t-lg"
            onClick={() => toggleCategory(category)}
            aria-expanded={!!openCategories[category]}
          >
            <span className="flex items-center gap-2">
              {openCategories[category] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              {category}
              <span className="ml-2 text-xs text-gray-500">({txns.length})</span>
            </span>
          </button>
          {openCategories[category] && (
            <div className="divide-y">
              {txns.map(transaction => (
                <div key={transaction.id} className="transaction-item bg-white">
                  <div className="transaction-info">
                    <div className="transaction-title">{transaction.title}</div>
                    <div className="flex gap-4 items-center">
                      <div className="flex items-center gap-1 text-gray">
                        <Calendar size={14} />
                        <span className="text-sm">{formatDate(transaction.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount, currency)}
                    </span>
                    {/* Plan Savings button for income transactions without allocation */}
                    {transaction.type === 'income' && !hasSavingsAllocation(transaction.id) && onPlanSavings && (
                      <button
                        onClick={() => onPlanSavings(transaction)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-200 transition-colors text-xs font-medium"
                        title="Plan Savings for this Income"
                      >
                        <PiggyBank size={14} /> Plan Savings
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="delete-btn"
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TransactionList; 