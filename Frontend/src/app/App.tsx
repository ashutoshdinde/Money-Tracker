import React, { useState } from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { MonthSelector } from './components/MonthSelector';
import { Dashboard } from './components/Dashboard';
import { ExpenseTracker } from './components/ExpenseTracker';
import { InvestmentsView } from './components/InvestmentsView';
import { AdvancedFeatures } from './components/AdvancedFeatures';
import { GlobalTrackedDashboard } from './components/GlobalTrackedDashboard';
import { API_BASE_URL } from './apiConfig';
import { LayoutDashboard, Receipt, TrendingUp, Settings, Star } from 'lucide-react';

type Tab = 'dashboard' | 'tracked' | 'expenses' | 'investments' | 'advanced';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracked' as Tab, label: 'Tracked', icon: Star },
    { id: 'expenses' as Tab, label: 'Expenses', icon: Receipt },
    { id: 'investments' as Tab, label: 'Investments', icon: TrendingUp },
    { id: 'advanced' as Tab, label: 'Advanced', icon: Settings },
  ];

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-5 sm:p-6 text-white">
            <h1 className="text-2xl sm:text-3xl mb-2">Personal Finance Tracker</h1>
            <p className="text-blue-100">
              Manage your salary, track expenses, and grow your investments
            </p>
          </div>

          <MonthSelector />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex overflow-x-auto border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {activeTab === 'dashboard' && <Dashboard />}
              {activeTab === 'tracked' && <GlobalTrackedDashboard />}
              {activeTab === 'expenses' && <ExpenseTracker />}
              {activeTab === 'investments' && <InvestmentsView />}
              {activeTab === 'advanced' && <AdvancedFeatures />}
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            Built with React & Tailwind CSS · API {API_BASE_URL}
          </div>
        </div>
      </div>
    </FinanceProvider>
  );
}