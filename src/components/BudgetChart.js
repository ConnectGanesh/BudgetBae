import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCurrency } from '../utils/currencyUtils';

const BudgetChart = ({ totals, categorySpending, categoryBudgets, currency, showIncomeVsExpensesOnly, showCategoryPiesOnly, plannedSavings, transactions }) => {
  const pieData = [
    { name: 'Income', value: totals.income, color: '#10b981' },
    { name: 'Expenses', value: totals.expenses, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // Prepare data for category spending pie charts
  const categoryData = Object.entries(categorySpending)
    .filter(([category, spent]) => spent > 0 || categoryBudgets[category] > 0)
    .map(([category, spent]) => ({
      category,
      spent,
      budget: categoryBudgets[category] || 0,
      remaining: (categoryBudgets[category] || 0) - spent
    }))
    .sort((a, b) => b.spent - a.spent);

  // Only show Income vs Expenses pie
  if (showIncomeVsExpensesOnly) {
    // Calculate total investments planned (sum of all plannedSavings if provided)
    let totalInvestmentsPlanned = 0;
    if (plannedSavings) {
      totalInvestmentsPlanned = Object.values(plannedSavings).reduce((sum, v) => sum + (v || 0), 0);
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const allocations = JSON.parse(window.localStorage.getItem('savingsAllocations') || '[]');
        totalInvestmentsPlanned = allocations.reduce((sum, a) => sum + (a.savingsAmount || 0), 0);
      } catch {}
    }
    // Calculate total budget planned (sum of all category budgets)
    let totalBudgetPlanned = 0;
    if (categoryBudgets && typeof categoryBudgets === 'object') {
      totalBudgetPlanned = Object.values(categoryBudgets).reduce((sum, v) => sum + (v || 0), 0);
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const budgets = JSON.parse(window.localStorage.getItem('categoryBudgets') || '{}');
        totalBudgetPlanned = Object.values(budgets).reduce((sum, v) => sum + (v || 0), 0);
      } catch {}
    }
    // Calculate investments done (sum of all expense transactions in Savings category and all savings transactions)
    let totalInvestmentsDone = 0;
    if (typeof transactions !== 'undefined' && Array.isArray(transactions)) {
      totalInvestmentsDone = transactions
        .filter(t => (t.type === 'expense' && t.category === 'Savings') || t.type === 'savings')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    } else if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const transactions = JSON.parse(window.localStorage.getItem('transactions') || '[]');
        totalInvestmentsDone = transactions
          .filter(t => (t.type === 'expense' && t.category === 'Savings') || t.type === 'savings')
          .reduce((sum, t) => sum + (t.amount || 0), 0);
      } catch {}
    }
    // Calculate balance including savings
    const balance = totals.income - totals.expenses - totalInvestmentsDone;
    const percentSpent = totals.income > 0 ? ((totals.expenses + totalInvestmentsDone) / totals.income) * 100 : 0;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        <div style={{ width: 400, maxWidth: '100%', margin: '0 auto' }}>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={[{ name: 'Income vs Expenses', Income: totals.income, Expenses: totals.expenses, Savings: totalInvestmentsDone }]} layout="vertical" margin={{ left: 40, right: 40, top: 10, bottom: 10 }}>
              <XAxis type="number" hide domain={[0, Math.max(totals.income, totals.expenses, totalInvestmentsDone)]} />
              <YAxis type="category" dataKey="name" width={0} hide />
              <Bar dataKey="Income" fill="#2563eb" barSize={18} radius={[10, 10, 10, 10]} />
              <Bar dataKey="Expenses" fill="#ef4444" barSize={18} radius={[10, 10, 10, 10]} />
              <Bar dataKey="Savings" fill="#059669" barSize={18} radius={[10, 10, 10, 10]} />
              <Tooltip formatter={value => formatCurrency(value, currency)} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontWeight: 600 }}>
            <span style={{ color: '#2563eb' }}>Income</span>
            <span style={{ color: '#ef4444' }}>Expenses</span>
            <span style={{ color: '#059669' }}>Savings</span>
            <span style={{ color: balance >= 0 ? '#059669' : '#dc2626' }}>Balance: {formatCurrency(balance, currency)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, marginTop: 32, width: '100%' }}>
          <div style={{ background: '#fef2f2', borderRadius: 12, padding: '18px 28px', minWidth: 160, textAlign: 'center', boxShadow: '0 2px 8px rgba(239,68,68,0.08)' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#ef4444', marginBottom: 4 }}>💸 Expenses</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#dc2626' }}>{formatCurrency(totals.expenses, currency)}</div>
          </div>
          <div style={{ background: '#f0fdf4', borderRadius: 12, padding: '18px 28px', minWidth: 160, textAlign: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.08)' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#059669', marginBottom: 4 }}>🏦 Savings</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#059669' }}>{formatCurrency(totalInvestmentsDone, currency)}</div>
          </div>
          <div style={{ background: '#eff6ff', borderRadius: 12, padding: '18px 28px', minWidth: 160, textAlign: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#2563eb', marginBottom: 4 }}>💰 Income</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#2563eb' }}>{formatCurrency(totals.income, currency)}</div>
          </div>
          <div style={{ background: '#f0f9ff', borderRadius: 12, padding: '18px 28px', minWidth: 160, textAlign: 'center', boxShadow: '0 2px 8px rgba(14,165,233,0.08)' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#0ea5e9', marginBottom: 4 }}>📈 Investments Planned</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#0ea5e9' }}>{formatCurrency(totalInvestmentsPlanned, currency)}</div>
          </div>
          <div style={{ background: '#f0f9ff', borderRadius: 12, padding: '18px 28px', minWidth: 160, textAlign: 'center', boxShadow: '0 2px 8px rgba(14,165,233,0.08)' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#0ea5e9', marginBottom: 4 }}>🗂️ Budget Planned</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: '#0ea5e9' }}>{formatCurrency(totalBudgetPlanned, currency)}</div>
          </div>
          <div style={{ background: '#eff6ff', borderRadius: 12, padding: '18px 28px', minWidth: 160, textAlign: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#2563eb', marginBottom: 4 }}>% Spent</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: percentSpent > 100 ? '#dc2626' : '#2563eb' }}>{percentSpent.toFixed(1)}%</div>
          </div>
        </div>
      </div>
    );
  }

  // Only show category progress bars
  if (showCategoryPiesOnly) {
    return (
      <div>
        <div className="space-y-4">
          {categoryData.map(({ category, spent, budget, remaining }) => {
            const percent = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
            const isOver = spent > budget;
            return (
              <div key={category} className="bg-gray-50 p-4 rounded-lg shadow flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <span style={{ color: '#14b8a6', fontWeight: 600, fontSize: '1.1rem' }}>{category}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: isOver ? '#dc2626' : '#059669' }}>{percent.toFixed(1)}%</span>
                </div>
                <div className="w-full rounded-full h-4 overflow-hidden mb-2" style={{ background: '#e5e7eb' }}>
                  <div
                    style={{
                      height: '100%',
                      borderRadius: '9999px',
                      width: `${Math.min(percent, 100)}%`,
                      background: isOver
                        ? 'linear-gradient(90deg, #fecaca 0%, #f87171 60%, #dc2626 100%)'
                        : 'linear-gradient(90deg, #bbf7d0 0%, #34d399 60%, #059669 100%)'
                    }}
                  ></div>
                </div>
                <div className="flex flex-wrap text-xs mt-2">
                  <span style={{ color: '#2563eb', fontWeight: 500 }}>Budget: {formatCurrency(budget, currency)}</span>
                  <span style={{ color: '#f87171', fontWeight: 500, marginLeft: 24 }}>Spent: {formatCurrency(spent, currency)}</span>
                  <span style={{ color: isOver ? '#dc2626' : '#059669', fontWeight: 600, marginLeft: 24 }}>
                    {isOver ? 'Over Budget' : 'Remaining'}: {formatCurrency(Math.abs(remaining), currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: show both (legacy/fallback)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium">{`${label}: ${formatCurrency(payload[0].value, currency)}`}</p>
        </div>
      );
    }
    return null;
  };

  const CategoryTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-medium">{data.category}</p>
          <p>Spent: {formatCurrency(data.spent, currency)}</p>
          <p>Budget: {formatCurrency(data.budget, currency)}</p>
          <p>Remaining: {formatCurrency(data.remaining, currency)}</p>
        </div>
      );
    }
    return null;
  };

  if (totals.income === 0 && totals.expenses === 0) {
    return (
      <div className="chart-container">
        <div className="no-data">
          <p>No data to display</p>
          <p className="text-sm">Add some transactions to see charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 p-1 rounded-2xl shadow-lg">
      <div className="space-y-6 bg-white bg-opacity-90 rounded-2xl p-6">
        {/* Pie Chart for Income vs Expenses */}
        {pieData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Income vs Expenses</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Category Spending Pie Charts */}
        {categoryData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Category Spending vs Budget</h3>
            <div className="grid grid-3 gap-6">
              {categoryData.map(({ category, spent, budget, remaining }) => {
                const pieChartData = [
                  { name: 'Spent', value: spent, color: '#ef4444' },
                  { name: 'Budget Left', value: Math.max(budget - spent, 0), color: '#10b981' }
                ];
                return (
                  <div key={category} className="flex flex-col items-center bg-gray-50 p-4 rounded-lg shadow">
                    <span className="font-medium mb-2">{category}</span>
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {pieChartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border rounded shadow">
                                <div className="font-medium text-base mb-1">{category}</div>
                                <div className="text-xs text-gray-600">Spent: {formatCurrency(spent, currency)}</div>
                                <div className="text-xs text-gray-600">Budget: {formatCurrency(budget, currency)}</div>
                                <div className={`text-xs font-medium mt-1 ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>{remaining >= 0 ? 'Remaining' : 'Over Budget'}: {formatCurrency(Math.abs(remaining), currency)}</div>
                              </div>
                            );
                          }
                          return null;
                        }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
            {/* Single legend for all pies */}
            <div className="flex gap-6 justify-center mt-6">
              <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full" style={{ background: '#ef4444' }}></span>Spent</div>
              <div className="flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full" style={{ background: '#10b981' }}></span>Budget Left</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetChart; 