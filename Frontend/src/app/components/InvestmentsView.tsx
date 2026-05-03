import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

export function InvestmentsView() {
  const { monthData, getTotalAllocated, getCategoryBalance } = useFinance();

  const totalAllocated = getTotalAllocated();
  const totalExpenses = monthData.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalSaved = totalAllocated - totalExpenses;

  const investmentCategories = monthData.categories.filter(
    cat => cat.id !== 'other-spending' && cat.amount > 0
  );

  const savingsCategories = monthData.categories.filter(
    cat => ['liquid-cash', 'stocks', 'lic'].includes(cat.id)
  );

  const allocationData = monthData.categories
    .filter(cat => cat.amount > 0)
    .map(cat => ({
      name: cat.name,
      value: cat.amount,
    }));

  const expensesByCategory = monthData.categories.map(cat => {
    const categoryExpenses = monthData.expenses
      .filter(exp => exp.category === cat.id)
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      name: cat.name,
      expenses: categoryExpenses,
    };
  }).filter(item => item.expenses > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Allocated</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl text-blue-700">₹{totalAllocated.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Spent</span>
            <DollarSign className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-3xl text-red-700">₹{totalExpenses.toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Net Savings</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl text-green-700">₹{totalSaved.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Investments & Savings
          </h2>

          <div className="space-y-3">
            {savingsCategories.map((category) => (
              <div
                key={category.id}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{category.name}</span>
                  <span className="text-xl font-medium text-blue-700">
                    ₹{category.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{
                      width: `${totalAllocated > 0 ? (category.amount / totalAllocated) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {investmentCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No investments or savings yet. Start allocating funds from the dashboard!
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Category Balances
          </h2>

          <div className="space-y-3">
            {monthData.categories.map((category) => {
              const remaining = getCategoryBalance(category.id);
              const isPositive = remaining >= 0;
              return (
                <div
                  key={category.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{category.name}</span>
                    <span
                      className={`text-lg font-medium ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      ₹{remaining.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Allocated ₹{category.amount.toLocaleString()} this month
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Allocation Distribution
          </h2>

          {allocationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No allocation data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <BarChartIcon className="w-5 h-5" />
            Expenses by Category
          </h2>

          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={expensesByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Bar dataKey="expenses" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No expense data available
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm p-6 border border-blue-200">
        <h2 className="text-xl mb-4">Monthly Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Income</div>
            <div className="text-2xl text-blue-700">₹{monthData.salary.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Total Invested</div>
            <div className="text-2xl text-purple-700">
              ₹{investmentCategories.reduce((sum, cat) => sum + cat.amount, 0).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Savings Rate</div>
            <div className="text-2xl text-green-700">
              {monthData.salary > 0 ? ((totalSaved / monthData.salary) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
