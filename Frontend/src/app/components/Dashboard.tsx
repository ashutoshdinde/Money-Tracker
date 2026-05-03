import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Wallet, TrendingUp, PiggyBank, DollarSign, Plus, X, Star } from 'lucide-react';

export function Dashboard() {
  const {
    monthData,
    setSalary,
    addAllocation,
    addCategory,
    removeCategory,
    getTotalAllocated,
    getRemainingBalance,
    toggleCategoryStar,
  } = useFinance();

  const [salaryInput, setSalaryInput] = useState(monthData.salary.toString());
  const [allocationInputs, setAllocationInputs] = useState<Record<string, string>>({});
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSetSalary = () => {
    const amount = parseFloat(salaryInput);
    if (!isNaN(amount) && amount >= 0) {
      setSalary(amount);
    }
  };

  const handleAllocate = (categoryId: string) => {
    const amount = parseFloat(allocationInputs[categoryId] || '0');
    const remaining = getRemainingBalance();

    if (!isNaN(amount) && amount > 0 && amount <= remaining) {
      addAllocation(categoryId, amount);
      setAllocationInputs({ ...allocationInputs, [categoryId]: '' });
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const totalAllocated = getTotalAllocated();
  const remaining = getRemainingBalance();
  const allocationPercentage = monthData.salary > 0 ? (totalAllocated / monthData.salary) * 100 : 0;

  const getStatusColor = (balance: number) => {
    if (balance < 0) return 'text-red-500';
    if (balance < monthData.salary * 0.1) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Monthly Salary
        </h2>
        <div className="flex gap-3">
          <input
            type="number"
            value={salaryInput}
            onChange={(e) => setSalaryInput(e.target.value)}
            placeholder="Enter monthly salary"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSetSalary}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Set Salary
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Salary</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl text-blue-700">₹{monthData.salary.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Allocated</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl text-purple-700">₹{totalAllocated.toLocaleString()}</div>
          <div className="mt-2 text-sm text-purple-600">{allocationPercentage.toFixed(1)}% of salary</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Remaining Balance</span>
            <PiggyBank className="w-5 h-5 text-green-600" />
          </div>
          <div className={`text-3xl ${getStatusColor(remaining)}`}>
            ₹{remaining.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">Allocate Funds</h2>
          <button
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        {showAddCategory && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button
                onClick={handleAddCategory}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddCategory(false);
                  setNewCategoryName('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {monthData.categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => toggleCategoryStar(category.id)}
                    className={`p-1 rounded transition-colors ${
                      category.starred
                        ? 'text-amber-500 hover:text-amber-600'
                        : 'text-gray-300 hover:text-amber-400'
                    }`}
                    title={category.starred ? 'Tracked on global dashboard' : 'Track on global dashboard'}
                  >
                    <Star className={`w-4 h-4 ${category.starred ? 'fill-current' : ''}`} />
                  </button>
                  <span className="font-medium">{category.name}</span>
                  {category.isCustom && (
                    <button
                      onClick={() => removeCategory(category.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Added to this fund this month: ₹{category.amount.toLocaleString()}
                </div>
              </div>
              <input
                type="number"
                value={allocationInputs[category.id] || ''}
                onChange={(e) =>
                  setAllocationInputs({ ...allocationInputs, [category.id]: e.target.value })
                }
                placeholder="Amount"
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => handleAllocate(category.id)}
                disabled={remaining <= 0}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Allocate
              </button>
            </div>
          ))}
        </div>

        {remaining < 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">
              ⚠️ Warning: You have over-allocated by ₹{Math.abs(remaining).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
