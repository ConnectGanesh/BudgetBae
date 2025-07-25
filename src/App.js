import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BudgetOverview from './components/BudgetOverview';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BudgetChart from './components/BudgetChart';
import BudgetManager from './components/CategoryBudgetManager';
import CurrencySelector from './components/CurrencySelector';
import SavingsAllocationModal from './components/SavingsAllocationModal';
import SavingsManager from './components/SavingsHistory';
import BudgetPlanningModal from './components/BudgetPlanningModal';
import Login from './components/Login';
import './App.css';
import { createDiagram } from 'mermaid';
import { PiggyBank } from 'lucide-react';

function App() {
  // All hooks at the top!
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [transactions, setTransactions] = useState([]);
  const [categoryBudgets, setCategoryBudgets] = useState({
    Food: 0,
    Transportation: 0,
    Housing: 0,
    Utilities: 0,
    Entertainment: 0,
    Healthcare: 0,
    Shopping: 0,
    Other: 0
  });
  const [currency, setCurrency] = useState('USD');
  const [savingsAllocations, setSavingsAllocations] = useState([]);
  const [showSavingsModal, setShowSavingsModal] = useState(false);
  const [pendingIncome, setPendingIncome] = useState(null);
  const [toast, setToast] = useState(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [howToSvg, setHowToSvg] = useState('');
  const [showBudgetPlanningModal, setShowBudgetPlanningModal] = useState(false);
  const [plannedSavings, setPlannedSavings] = useState({});
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    const savedCategoryBudgets = localStorage.getItem('categoryBudgets');
    const savedCurrency = localStorage.getItem('currency');
    const savedSavingsAllocations = localStorage.getItem('savingsAllocations');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    if (savedCategoryBudgets) {
      setCategoryBudgets(JSON.parse(savedCategoryBudgets));
    }
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    if (savedSavingsAllocations) {
      setSavingsAllocations(JSON.parse(savedSavingsAllocations));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('categoryBudgets', JSON.stringify(categoryBudgets));
  }, [categoryBudgets]);

  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('savingsAllocations', JSON.stringify(savingsAllocations));
  }, [savingsAllocations]);

  useEffect(() => {
    localStorage.setItem('plannedSavings', JSON.stringify(plannedSavings));
  }, [plannedSavings]);

  // How-to diagram (Mermaid)
  const howToMermaid = `
flowchart TD
  A[Add Income] --> B[Plan Savings Allocation]
  B --> C[Set Category Budgets]
  C --> D[Add Expenses]
  D --> E[Track Spending]
  E --> F[Visualize with Charts]
  F --> G[Review Savings History]
  B -.->|Skip| C
  C -.->|Add Category| C
  D -.->|Add Category| D
  %% Styling for bolder, clearer nodes and arrows
  classDef boldNode fill:#10b981,stroke:#14b8a6,stroke-width:3px,color:#fff,font-weight:bold,font-size:18px;
  classDef boldEdge stroke:#14b8a6,stroke-width:3px;
  class A,B,C,D,E,F,G boldNode;
  linkStyle default stroke:#14b8a6,stroke-width:3px;
`;

  useEffect(() => {
    if (showHowTo) {
      import('mermaid').then(mermaid => {
        mermaid.default.initialize({ startOnLoad: false });
        mermaid.default.render('howToDiagram', howToMermaid).then(({ svg }) => setHowToSvg(svg));
      });
    }
  }, [showHowTo]);

  // Now do the login check
  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUserName(username);
  };
  const handleLogout = () => setIsLoggedIn(false);
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now(),
      date: transaction.date || new Date().toISOString().split('T')[0]
    };
    
    setTransactions([...transactions, newTransaction]);

    // If it's an income transaction, show savings allocation modal
    if (transaction.type === 'income') {
      setPendingIncome(newTransaction);
      setShowSavingsModal(true);
    }
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const updateCategoryBudgets = (newBudgets) => {
    const merged = { ...categoryBudgets, ...newBudgets };
    console.log('App.js: updateCategoryBudgets merged', merged);
    setCategoryBudgets(merged);
  };

  const updateCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  const handleSavingsAllocation = (allocationData) => {
    const newAllocation = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      incomeTransactionId: pendingIncome.id,
      incomeAmount: pendingIncome.amount,
      ...allocationData
    };
    setSavingsAllocations([...savingsAllocations, newAllocation]);

    // Key mapping from modal keys to display names
    const keyMap = {
      stocks: 'Stocks',
      mutualFunds: 'Mutual Funds',
      gold: 'Gold',
      education: 'Education',
      vacation: 'Vacation',
      emergencyFunds: 'Emergency Funds',
      lifestyle: 'Gadget/Lifestyle'
    };

    // Cumulative update for plannedSavings with mapped keys
    setPlannedSavings(prev => {
      const updated = { ...prev };
      if (allocationData && allocationData.allocationAmounts) {
        Object.entries(allocationData.allocationAmounts).forEach(([category, amount]) => {
          const mapped = keyMap[category] || category;
          updated[mapped] = (updated[mapped] || 0) + (amount || 0);
        });
      }
      return updated;
    });

    setPendingIncome(null);
    setShowSavingsModal(false);
  };

  const closeSavingsModal = (skipped = false) => {
    setPendingIncome(null);
    setShowSavingsModal(false);
    if (skipped) {
      setToast('You skipped savings allocation for this income. You can allocate savings later from the Savings Manager.');
      setTimeout(() => setToast(null), 6000);
    }
  };

  // Open modal for a specific income transaction
  const planSavingsForIncome = (incomeTransaction) => {
    setPendingIncome(incomeTransaction);
    setShowSavingsModal(true);
  };

  const handleBudgetPlanningApply = (budgetAllocations) => {
    updateCategoryBudgets(budgetAllocations);
    setShowBudgetPlanningModal(false);
    setToast('Budget allocated successfully! You can now start adding expenses.');
    setTimeout(() => setToast(null), 4000);
  };



  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return { income, expenses, balance: income - expenses };
  };

  const calculateCategorySpending = () => {
    const spending = {};
    Object.keys(categoryBudgets).forEach(category => {
      spending[category] = transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    });
    return spending;
  };

  const calculateRemainingBudgets = () => {
    const spending = calculateCategorySpending();
    const remaining = {};
    Object.keys(categoryBudgets).forEach(category => {
      remaining[category] = categoryBudgets[category] - spending[category];
    });
    return remaining;
  };

  const calculateSavingsTotals = () => {
    const totalSavings = savingsAllocations.reduce((sum, allocation) => sum + allocation.savingsAmount, 0);
    const totalAllocated = savingsAllocations.reduce((sum, allocation) => {
      return sum + Object.values(allocation.allocationAmounts).reduce((catSum, amount) => catSum + amount, 0);
    }, 0);
    
    return { totalSavings, totalAllocated };
  };

  const totals = calculateTotals();
  const categorySpending = calculateCategorySpending();
  const remainingBudgets = calculateRemainingBudgets();
  const savingsTotals = calculateSavingsTotals();

  return (
    <div className="App">
      <Header onShowHowTo={() => setShowHowTo(true)} userName={userName} onLogout={handleLogout} />
      <div className="w-full px-8">
        <div className="flex justify-end mb-4">
          <CurrencySelector currency={currency} onCurrencyChange={updateCurrency} />
        </div>
        
        {toast && (
          <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-300 text-yellow-800 px-6 py-3 rounded-lg shadow-lg z-[10001] text-center text-base font-medium animate-fade-in">
            {toast}
          </div>
        )}
        
        {/* How To Modal */}
        {showHowTo && (
          <div className="how-to-modal-overlay">
            <div className="how-to-modal-content" style={{ position: 'relative', background: 'white', borderRadius: '16px', maxWidth: 600, margin: 'auto', boxShadow: '0 8px 32px rgba(16,185,129,0.12)', padding: 0 }}>
              <button
                onClick={() => setShowHowTo(false)}
                style={{ position: 'absolute', top: 12, right: 12, fontSize: 24, color: '#666', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', zIndex: 10 }}
                title="Close"
              >
                × <span style={{ fontSize: 16, verticalAlign: 'middle' }}>Close</span>
              </button>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-700">How to Use This App</h2>
                <ul className="mb-6 pl-0 text-gray-700 text-base">
                  <li className="flex items-start gap-2 mb-2"><span style={{marginTop: 6, minWidth: 12, minHeight: 12, display: 'inline-block'}}><svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="6" fill="#10b981"/></svg></span>Add your <b>income</b> and plan your <b>savings allocation</b></li>
                  <li className="flex items-start gap-2 mb-2"><span style={{marginTop: 6, minWidth: 12, minHeight: 12, display: 'inline-block'}}><svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="6" fill="#14b8a6"/></svg></span>Set <b>category budgets</b> (add new categories as needed)</li>
                  <li className="flex items-start gap-2 mb-2"><span style={{marginTop: 6, minWidth: 12, minHeight: 12, display: 'inline-block'}}><svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="6" fill="#10b981"/></svg></span>Add <b>expenses</b> (add new categories as needed)</li>
                  <li className="flex items-start gap-2 mb-2"><span style={{marginTop: 6, minWidth: 12, minHeight: 12, display: 'inline-block'}}><svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="6" fill="#14b8a6"/></svg></span>Track your <b>spending</b> and <b>remaining budgets</b></li>
                  <li className="flex items-start gap-2 mb-2"><span style={{marginTop: 6, minWidth: 12, minHeight: 12, display: 'inline-block'}}><svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="6" fill="#10b981"/></svg></span>Visualize your finances with <b>charts</b></li>
                  <li className="flex items-start gap-2 mb-2"><span style={{marginTop: 6, minWidth: 12, minHeight: 12, display: 'inline-block'}}><svg width="12" height="12" viewBox="0 0 12 12"><circle cx="6" cy="6" r="6" fill="#14b8a6"/></svg></span>Review your <b>savings history</b> and allocations</li>
                </ul>
                <div className="flex justify-center items-center">
                  <div style={{ width: '100%', maxWidth: 500, minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f0fff4', borderRadius: 12, padding: 16 }}>
                    <div style={{ width: '100%', height: 'auto' }} dangerouslySetInnerHTML={{ __html: howToSvg }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <BudgetOverview 
          totals={totals} 
          categorySpending={categorySpending}
          remainingBudgets={remainingBudgets}
          currency={currency}
          savingsTotals={savingsTotals}
        />

        {/* Plan Your Budget Button */}
        {totals.income > 0 && Object.values(categoryBudgets).every(budget => budget === 0) && (
          <div className="card mb-8 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Plan Your Budget</h3>
                <p className="text-gray-600 text-sm">
                  Set up your category budgets using recommended allocations based on your income and savings
                </p>
              </div>
              <button
                onClick={() => setShowBudgetPlanningModal(true)}
                className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Plan Budget
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-2 gap-8 mb-8">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Add Transaction</h2>
            <TransactionForm 
              onAddTransaction={addTransaction} 
              remainingBudgets={remainingBudgets}
              currency={currency}
              transactions={transactions}
              categoryBudgets={categoryBudgets}
              onPlanSavingsLink={() => setShowSavingsModal(true)}
            />
          </div>
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Income vs Expenses</h2>
            <BudgetChart 
              totals={totals} 
              categorySpending={{}} // disables category charts in this tile
              categoryBudgets={categoryBudgets}
              currency={currency}
              showIncomeVsExpensesOnly={true}
              plannedSavings={plannedSavings}
              transactions={transactions}
            />
          </div>
        </div>

        {/* Category Spending vs Budget - only show if at least one budget is allocated */}
        {/* {totals.income > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-4">Category Spending vs Budget</h2>
            <BudgetChart 
              totals={totals} 
              categorySpending={categorySpending}
              categoryBudgets={categoryBudgets}
              currency={currency}
              showCategoryPiesOnly={true}
            />
          </div>
        )}*/}

        <div className="space-y-8">
          {totals.income > 0 && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Budget Manager</h2>
              <BudgetManager 
                categoryBudgets={categoryBudgets}
                categorySpending={categorySpending}
                remainingBudgets={remainingBudgets}
                onUpdateBudgets={updateCategoryBudgets}
                currency={currency}
                totalIncome={totals.income}
                totalSavings={savingsTotals.totalSavings}
              />
            </div>
          )}

          {/* Category Spending vs Budget - only show if at least one budget is allocated */}
          {/* {Object.values(categoryBudgets).some(budget => budget > 0) && (
            <div className="card mb-8">
              <h2 className="text-xl font-bold mb-4">Category Spending vs Budget</h2>
              <BudgetChart 
                totals={totals} 
                categorySpending={categorySpending}
                categoryBudgets={categoryBudgets}
                currency={currency}
                showCategoryPiesOnly={true}
              />
            </div>
          )}*/}

          {/* Savings Manager only shown if at least one income transaction exists */}
          {transactions.some(t => t.type === 'income') && (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Savings Manager</h2>
              <SavingsManager
                plannedSavings={plannedSavings}
                onUpdatePlanned={setPlannedSavings}
                savingsAllocations={savingsAllocations}
                currency={currency}
                transactions={transactions}
              />
            </div>
          )}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={deleteTransaction}
              currency={currency}
              savingsAllocations={savingsAllocations}
              onPlanSavings={planSavingsForIncome}
            />
          </div>
        </div>
        


        {/* Savings Allocation Modal */}
        <SavingsAllocationModal
          isOpen={showSavingsModal}
          onClose={() => closeSavingsModal(false)}
          onSkip={() => closeSavingsModal(true)}
          incomeAmount={pendingIncome?.amount || 0}
          currency={currency}
          onSaveAllocation={handleSavingsAllocation}
        />

        {/* Budget Planning Modal */}
        <BudgetPlanningModal
          isOpen={showBudgetPlanningModal}
          onClose={() => setShowBudgetPlanningModal(false)}
          onApply={handleBudgetPlanningApply}
          totalIncome={totals.income}
          totalSavings={savingsTotals.totalSavings}
          currency={currency}
        />


      </div>
    </div>
  );
}

export default App; 