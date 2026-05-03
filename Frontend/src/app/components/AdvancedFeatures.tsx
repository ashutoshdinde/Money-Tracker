import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Repeat, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export function AdvancedFeatures() {
  const {
    monthData,
    addRecurringExpense,
    toggleRecurringExpense,
    deleteRecurringExpense,
  } = useFinance();

  const [showAddRecurring, setShowAddRecurring] = useState(false);
  const [recurringAmount, setRecurringAmount] = useState('');
  const [recurringCategory, setRecurringCategory] = useState('other-spending');
  const [recurringNote, setRecurringNote] = useState('');
  const [recurringDay, setRecurringDay] = useState('1');

  const handleAddRecurring = () => {
    const amount = parseFloat(recurringAmount);
    const day = parseInt(recurringDay);

    if (!isNaN(amount) && amount > 0 && recurringNote.trim() && day >= 1 && day <= 31) {
      addRecurringExpense(amount, recurringCategory, recurringNote.trim(), day);
      setRecurringAmount('');
      setRecurringNote('');
      setRecurringDay('1');
      setShowAddRecurring(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl flex items-center gap-2">
            <Repeat className="w-5 h-5" />
            Recurring Expenses
          </h2>
          <button
            onClick={() => setShowAddRecurring(!showAddRecurring)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {showAddRecurring ? 'Cancel' : 'Add Recurring'}
          </button>
        </div>

        {showAddRecurring && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={recurringAmount}
                  onChange={(e) => setRecurringAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Category</label>
                <select
                  value={recurringCategory}
                  onChange={(e) => setRecurringCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {monthData.categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Note</label>
                <input
                  type="text"
                  value={recurringNote}
                  onChange={(e) => setRecurringNote(e.target.value)}
                  placeholder="Rent, EMI, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Day of Month</label>
                <input
                  type="number"
                  value={recurringDay}
                  onChange={(e) => setRecurringDay(e.target.value)}
                  min="1"
                  max="31"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleAddRecurring}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Recurring Expense
            </button>
          </div>
        )}

        <div className="space-y-2">
          {monthData.recurringExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recurring expenses set. Add one to track monthly bills automatically!
            </div>
          ) : (
            monthData.recurringExpenses.map((recurring) => {
              const category = monthData.categories.find((c) => c.id === recurring.category);
              return (
                <div
                  key={recurring.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    recurring.isActive
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-medium">{recurring.note}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {category?.name}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                        Day {recurring.dayOfMonth}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      ₹{recurring.amount.toLocaleString()} / month
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRecurringExpense(recurring.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {recurring.isActive ? (
                        <ToggleRight className="w-6 h-6 text-blue-600" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteRecurringExpense(recurring.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
