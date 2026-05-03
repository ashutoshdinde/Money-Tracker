import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Receipt, Trash2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export function ExpenseTracker() {
  const { monthData, addExpense, deleteExpense, getCategoryBalance } = useFinance();

  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('other-spending');
  const [note, setNote] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleAddExpense = () => {
    const expenseAmount = parseFloat(amount);
    if (!isNaN(expenseAmount) && expenseAmount > 0 && note.trim()) {
      const categoryBalance = getCategoryBalance(selectedCategory);

      if (categoryBalance < expenseAmount) {
        if (!confirm(`This expense exceeds the ${monthData.categories.find(c => c.id === selectedCategory)?.name} balance. Continue?`)) {
          return;
        }
      }

      addExpense(expenseAmount, selectedCategory, note.trim());
      setAmount('');
      setNote('');
    }
  };

  const filteredExpenses = monthData.expenses
    .filter(exp => {
      const matchesSearch = exp.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || exp.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalExpenses = monthData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const spendingCategory = monthData.categories.find(c => c.id === selectedCategory);
  const spendingAllocated = spendingCategory?.amount ?? 0;
  const spendingBalance = getCategoryBalance(selectedCategory);
  const spentFromBudget =
    spendingAllocated > 0 ? Math.min(spendingAllocated - spendingBalance, spendingAllocated) : 0;
  const spendingPercentage =
    spendingAllocated > 0 ? Math.min((spentFromBudget / spendingAllocated) * 100, 100) : 0;

  const getBalanceColor = (balance: number) => {
    if (balance < 0) return 'bg-red-500';
    const percentage = (balance / (monthData.salary || 1)) * 100;
    if (percentage < 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Add Expense
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Amount (₹)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {monthData.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} — ₹{getCategoryBalance(cat.id).toLocaleString()} left of ₹
                  {cat.amount.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-2">Note</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tea, Food, Travel, etc."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddExpense()}
          />
        </div>

        {spendingCategory && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">{spendingCategory.name} Balance</span>
              <span className={`font-medium ${spendingBalance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                ₹{spendingBalance.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${getProgressColor(spendingPercentage)}`}
                style={{ width: `${spendingPercentage}%` }}
              />
            </div>
          </div>
        )}

        <button
          onClick={handleAddExpense}
          disabled={!amount || !note.trim()}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Add Expense
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Expense History</h2>
          <div className="text-gray-600">
            Total: <span className="font-medium text-gray-900">₹{totalExpenses.toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search expenses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {monthData.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No expenses found. Add your first expense above!
            </div>
          ) : (
            filteredExpenses.map((expense) => {
              const category = monthData.categories.find((c) => c.id === expense.category);
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">{expense.note}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {category?.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(expense.date), 'MMM dd, yyyy · hh:mm a')}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-medium text-red-600">
                      -₹{expense.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
