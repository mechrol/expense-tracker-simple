import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Dashboard from './components/Dashboard'
import ExpenseForm from './components/ExpenseForm'
import BudgetManager from './components/BudgetManager'
import TransactionList from './components/TransactionList'
import Header from './components/Header'
import { generateMockData } from './utils/mockData'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [expenses, setExpenses] = useState([])
  const [budgets, setBudgets] = useState([])

  useEffect(() => {
    // Load mock data on first render
    const mockData = generateMockData()
    setExpenses(mockData.expenses)
    setBudgets(mockData.budgets)
  }, [])

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    }
    setExpenses(prev => [newExpense, ...prev])
  }

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  const addBudget = (budget) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
    }
    setBudgets(prev => [newBudget, ...prev])
  }

  const updateBudget = (id, updatedBudget) => {
    setBudgets(prev => prev.map(budget => 
      budget.id === id ? { ...budget, ...updatedBudget } : budget
    ))
  }

  const deleteBudget = (id) => {
    setBudgets(prev => prev.filter(budget => budget.id !== id))
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'add-expense', label: 'Add Expense', icon: '➕' },
    { id: 'transactions', label: 'Transactions', icon: '📝' },
    { id: 'budgets', label: 'Budgets', icon: '🎯' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white rounded-xl shadow-sm border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard expenses={expenses} budgets={budgets} />
            )}
            {activeTab === 'add-expense' && (
              <ExpenseForm onAddExpense={addExpense} />
            )}
            {activeTab === 'transactions' && (
              <TransactionList 
                expenses={expenses} 
                onDeleteExpense={deleteExpense}
              />
            )}
            {activeTab === 'budgets' && (
              <BudgetManager
                budgets={budgets}
                expenses={expenses}
                onAddBudget={addBudget}
                onUpdateBudget={updateBudget}
                onDeleteBudget={deleteBudget}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
