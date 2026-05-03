import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';

export function MonthSelector() {
  const { currentMonth, setCurrentMonth, getRemainingBalance, carryForwardBalance } = useFinance();

  const currentDate = new Date(currentMonth + '-01');
  const displayMonth = format(currentDate, 'MMMM yyyy');
  const remaining = getRemainingBalance();

  const handlePreviousMonth = () => {
    const prevMonth = subMonths(currentDate, 1);
    setCurrentMonth(format(prevMonth, 'yyyy-MM'));
  };

  const handleNextMonth = () => {
    const nextMonth = addMonths(currentDate, 1);
    setCurrentMonth(format(nextMonth, 'yyyy-MM'));
  };

  const handleCarryForward = () => {
    if (remaining > 0) {
      if (confirm(`Carry forward ₹${remaining.toLocaleString()} to next month?`)) {
        carryForwardBalance();
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <h1 className="text-2xl">{displayMonth}</h1>
          {remaining > 0 && (
            <button
              onClick={handleCarryForward}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Carry Forward ₹{remaining.toLocaleString()}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
