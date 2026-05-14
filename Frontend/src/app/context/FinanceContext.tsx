import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { format } from 'date-fns';
import { API_BASE_URL } from '@/app/apiConfig';

export interface Category {
  id: string;
  name: string;
  amount: number;
  isCustom: boolean;
  starred: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  monthKey: string;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  category: string;
  monthKey: string;
}

export interface RecurringExpense {
  id: string;
  amount: number;
  category: string;
  note: string;
  dayOfMonth: number;
  isActive: boolean;
}

export interface MonthData {
  salary: number;
  categories: Category[];
  expenses: Expense[];
  recurringExpenses: RecurringExpense[];
  investments: Investment[];
}

interface FinanceContextType {
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  monthData: MonthData;
  setSalary: (amount: number) => void;
  addAllocation: (categoryId: string, amount: number) => void;
  addCategory: (name: string) => void;
  removeCategory: (categoryId: string) => void;
  toggleCategoryStar: (categoryId: string) => void;
  addExpense: (amount: number, category: string, note: string) => void;
  deleteExpense: (id: string) => void;
  addRecurringExpense: (amount: number, category: string, note: string, dayOfMonth: number) => void;
  toggleRecurringExpense: (id: string) => void;
  deleteRecurringExpense: (id: string) => void;
  getTotalAllocated: () => number;
  getRemainingBalance: () => number;
  getCategoryBalance: (categoryId: string) => number;
  getAllExpenses: () => Expense[];
  carryForwardBalance: () => void;
  addInvestment: (name: string, amount: number, category: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'stocks', name: 'Stocks', amount: 0, isCustom: false, starred: false },
  { id: 'lic', name: 'LIC', amount: 0, isCustom: false, starred: false },
  { id: 'liquid-cash', name: 'Liquid Cash', amount: 0, isCustom: false, starred: false },
  { id: 'other-spending', name: 'Other Spending', amount: 0, isCustom: false, starred: false },
];

const cloneDefaultCategories = () => DEFAULT_CATEGORIES.map(cat => ({ ...cat }));

const getDefaultMonthData = (): MonthData => ({
  salary: 0,
  categories: cloneDefaultCategories(),
  expenses: [],
  recurringExpenses: [],
  investments: [],
});

const normalizeExpense = (expense: any, monthKey: string): Expense => ({
  id: String(expense.id ?? ''),
  amount: Number(expense.amount ?? 0),
  category: expense.category ?? 'other-spending',
  note: expense.note ?? expense.description ?? '',
  date: expense.date ?? new Date().toISOString(),
  monthKey: expense.monthKey ?? monthKey,
});

const normalizeInvestment = (investment: any, monthKey: string): Investment => ({
  id: String(investment.id ?? ''),
  name: investment.name ?? '',
  amount: Number(investment.amount ?? 0),
  category: investment.category ?? '',
  monthKey: investment.monthKey ?? monthKey,
});

const normalizeCategory = (cat: any): Category => ({
  id: String(cat.id ?? ''),
  name: cat.name ?? '',
  amount: Number(cat.amount ?? 0),
  isCustom: Boolean(cat.isCustom ?? cat.custom),
  starred: Boolean(cat.starred),
});

const fetchJson = async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }
  return response.json();
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [currentMonth, setCurrentMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [allData, setAllData] = useState<Record<string, MonthData>>({});

  const saveMonthData = async (monthKey: string, data: MonthData) => {
    try {
      const response = await fetchJson(`${API_BASE_URL}/months/${monthKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salary: data.salary,
          categories: data.categories,
          recurringExpenses: data.recurringExpenses,
        }),
      });

      const synced: MonthData = {
        salary: Number(response.salary ?? 0),
        categories: response.categories?.length
          ? response.categories.map(normalizeCategory)
          : cloneDefaultCategories(),
        recurringExpenses: response.recurringExpenses ?? [],
        expenses: (response.expenses ?? []).map((exp: any) => normalizeExpense(exp, monthKey)),
        investments: (response.investments ?? []).map((inv: any) => normalizeInvestment(inv, monthKey)),
      };

      setAllData(prev => ({
        ...prev,
        [monthKey]: synced,
      }));
    } catch (error) {
      console.error('Failed to save month data:', error);
    }
  };

  const loadMonthData = async (monthKey: string) => {
    try {
      const response = await fetchJson(`${API_BASE_URL}/months/${monthKey}`);
      const next: MonthData = {
        salary: Number(response.salary ?? 0),
        categories: response.categories?.length
          ? response.categories.map(normalizeCategory)
          : cloneDefaultCategories(),
        recurringExpenses: response.recurringExpenses ?? [],
        expenses: (response.expenses ?? []).map((exp: any) => normalizeExpense(exp, monthKey)),
        investments: (response.investments ?? []).map((inv: any) => normalizeInvestment(inv, monthKey)),
      };

      setAllData(prev => ({
        ...prev,
        [monthKey]: next,
      }));
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setAllData(prev => ({
        ...prev,
        [monthKey]: prev[monthKey] ?? getDefaultMonthData(),
      }));
    }
  };

  useEffect(() => {
    void loadMonthData(currentMonth);
  }, [currentMonth]);

  const monthData: MonthData = allData[currentMonth] || getDefaultMonthData();

  const updateMonthData = (updater: (data: MonthData) => MonthData, persist = true) => {
    setAllData(prev => {
      const current = prev[currentMonth] ?? getDefaultMonthData();
      const next = updater(current);
      if (persist) {
        void saveMonthData(currentMonth, next);
      }
      return {
        ...prev,
        [currentMonth]: next,
      };
    });
  };

  const setSalary = (amount: number) => {
    updateMonthData(data => ({ ...data, salary: amount }));
  };

  const addAllocation = (categoryId: string, amount: number) => {
    updateMonthData(data => ({
      ...data,
      categories: data.categories.map(cat =>
        cat.id === categoryId ? { ...cat, amount: cat.amount + amount } : cat
      ),
    }));
  };

  const addCategory = (name: string) => {
    const id = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    updateMonthData(data => ({
      ...data,
      categories: [...data.categories, { id, name, amount: 0, isCustom: true, starred: false }],
    }));
  };

  const toggleCategoryStar = (categoryId: string) => {
    updateMonthData(data => ({
      ...data,
      categories: data.categories.map(cat =>
        cat.id === categoryId ? { ...cat, starred: !cat.starred } : cat
      ),
    }));
  };

  const removeCategory = async (categoryId: string) => {
    const expensesToRemove = monthData.expenses.filter(exp => exp.category === categoryId);

    updateMonthData(data => ({
      ...data,
      categories: data.categories.filter(cat => cat.id !== categoryId),
      expenses: data.expenses.filter(exp => exp.category !== categoryId),
    }));

    if (expensesToRemove.length > 0) {
      await Promise.all(
        expensesToRemove.map(exp =>
          fetch(`${API_BASE_URL}/expenses/${exp.id}`, { method: 'DELETE' })
        )
      );
    }
  };

  const addExpense = async (amount: number, category: string, note: string) => {
    const newExpense = {
      amount,
      category,
      note,
      date: new Date().toISOString(),
      monthKey: currentMonth,
    };

    try {
      const savedExpense = await fetchJson(`${API_BASE_URL}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense),
      });

      updateMonthData(data => ({
        ...data,
        expenses: [...data.expenses, normalizeExpense(savedExpense, currentMonth)],
      }));
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const deleteExpense = async (id: string) => {
    const expense = monthData.expenses.find(exp => exp.id === id);
    if (!expense) return;

    try {
      await fetch(`${API_BASE_URL}/expenses/${id}`, { method: 'DELETE' });

      updateMonthData(data => ({
        ...data,
        expenses: data.expenses.filter(exp => exp.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const addInvestment = async (name: string, amount: number, category: string) => {
    const newInvestment = {
      name,
      amount,
      category,
      monthKey: currentMonth,
    };

    try {
      const savedInvestment = await fetchJson(`${API_BASE_URL}/investments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInvestment),
      });

      updateMonthData(data => ({
        ...data,
        investments: [...data.investments, normalizeInvestment(savedInvestment, currentMonth)],
      }), false);
    } catch (error) {
      console.error('Failed to add investment:', error);
    }
  };

  const addRecurringExpense = (amount: number, category: string, note: string, dayOfMonth: number) => {
    const recurring: RecurringExpense = {
      id: Date.now().toString(),
      amount,
      category,
      note,
      dayOfMonth,
      isActive: true,
    };

    updateMonthData(data => ({
      ...data,
      recurringExpenses: [...data.recurringExpenses, recurring],
    }));
  };

  const toggleRecurringExpense = (id: string) => {
    updateMonthData(data => ({
      ...data,
      recurringExpenses: data.recurringExpenses.map(re =>
        re.id === id ? { ...re, isActive: !re.isActive } : re
      ),
    }));
  };

  const deleteRecurringExpense = (id: string) => {
    updateMonthData(data => ({
      ...data,
      recurringExpenses: data.recurringExpenses.filter(re => re.id !== id),
    }));
  };

  const getTotalAllocated = () => {
    return monthData.categories.reduce((sum, cat) => sum + cat.amount, 0);
  };

  const getRemainingBalance = () => {
    return monthData.salary - getTotalAllocated();
  };

  const getCategoryBalance = (categoryId: string) => {
    const category = monthData.categories.find(cat => cat.id === categoryId);
    const allocated = category?.amount ?? 0;
    const spent = monthData.expenses
      .filter(exp => exp.category === categoryId)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return allocated - spent;
  };

  const getAllExpenses = () => {
    return monthData.expenses;
  };

  const carryForwardBalance = () => {
    const remaining = getRemainingBalance();
    if (remaining <= 0) return;

    const nextMonthDate = new Date(currentMonth + '-01');
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonthKey = format(nextMonthDate, 'yyyy-MM');

    setAllData(prev => {
      const nextData = prev[nextMonthKey] ?? getDefaultMonthData();
      const updatedNext = { ...nextData, salary: nextData.salary + remaining };

      void saveMonthData(nextMonthKey, updatedNext);

      return {
        ...prev,
        [nextMonthKey]: updatedNext,
      };
    });

    setCurrentMonth(nextMonthKey);
  };

  const value: FinanceContextType = {
    currentMonth,
    setCurrentMonth,
    monthData,
    setSalary,
    addAllocation,
    addCategory,
    removeCategory,
    toggleCategoryStar,
    addExpense,
    deleteExpense,
    addRecurringExpense,
    toggleRecurringExpense,
    deleteRecurringExpense,
    getTotalAllocated,
    getRemainingBalance,
    getCategoryBalance,
    getAllExpenses,
    carryForwardBalance,
    addInvestment,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}
