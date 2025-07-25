import React from 'react';
import { formatCurrency, getCurrencySymbol } from '../utils/currencyUtils';

const ExpensePlanningHistory = ({ expensePlanningHistory = [], currency = 'USD' }) => {
  if (expensePlanningHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <div className="text-4xl mb-2">📋</div>
          <p>No expense planning history yet.</p>
          <p className="text-sm">Use the "Plan Expenses" button to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expensePlanningHistory.map((planning) => (
        <div key={planning.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-gray-800">Expense Planning</h4>
              <p className="text-sm text-gray-500">{planning.date}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                {formatCurrency(planning.totalPlanned, currency)}
              </div>
              <div className="text-xs text-gray-500">Total Planned</div>
            </div>
          </div>
          
          <div className="space-y-2">
            {Object.entries(planning.allocations).map(([category, amount]) => (
              <div key={category} className="flex justify-between items-center text-sm">
                <span className="text-gray-700">{category}</span>
                <span className="font-medium text-gray-800">
                  {formatCurrency(amount, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpensePlanningHistory; 