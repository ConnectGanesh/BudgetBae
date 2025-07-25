import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';

const BudgetOverview = ({ totals, categorySpending, remainingBudgets, currency, savingsTotals }) => {
  const totalBudget = Object.values(categorySpending).reduce((sum, spent) => sum + spent, 0);
  const totalAllocated = Object.values(remainingBudgets).reduce((sum, remaining) => sum + remaining, 0) + totalBudget;

  return (
    <div className="budget-card">
      <h2>Budget Overview</h2>

      <div className="budget-stats">
        <div className="stat-item">
          <div className="stat-value text-green">
            {formatCurrency(totals.income, currency)}
          </div>
          <div className="stat-label">Total Income</div>
        </div>

        <div className="stat-item">
          <div className="stat-value text-red">
            {formatCurrency(totals.expenses, currency)}
          </div>
          <div className="stat-label">Total Expenses</div>
        </div>

        <div className="stat-item">
          <div className={`stat-value ${totals.balance >= 0 ? 'text-green' : 'text-red'}`}>
            {formatCurrency(totals.balance, currency)}
          </div>
          <div className="stat-label">Current Balance</div>
        </div>

        <div className="stat-item">
          <div className="stat-value">
            {formatCurrency(totalAllocated, currency)}
          </div>
          <div className="stat-label">Total Budget Allocated</div>
        </div>

        <div className="stat-item">
          <div className="stat-value text-blue-300">
            {formatCurrency(savingsTotals?.totalSavings || 0, currency)}
          </div>
          <div className="stat-label">Total Savings</div>
        </div>

        <div className="stat-item">
          <div className="stat-value text-purple-300">
            {formatCurrency(savingsTotals?.totalAllocated || 0, currency)}
          </div>
          <div className="stat-label">Savings Allocated</div>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview; 