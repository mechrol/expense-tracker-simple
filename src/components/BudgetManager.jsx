import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Target, Edit3, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'

const BudgetManager = ({ budgets, expenses, onAddBudget, onUpdateBudget, onDeleteBudget }) => {
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  })

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Travel',
    'Education',
    'Other'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.category || !formData.amount) return

    const budgetData = {
      ...formData,
      amount: parseFloat(formData.amount)
    }

    if (editingBudget) {
      onUpdateBudget(editingBudget.id, budgetData)
      setEditingBudget(null)
    } else {
      onAddBudget(budgetData)
    }

    setFormData({ category: '', amount: '', period: 'monthly' })
    setShowForm(false)
  }

  const handleEdit = (budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingBudget(null)
    setFormData({ category: '', amount: '', period: 'monthly' })
  }

  const getBudgetStatus = (budget) => {
    const categoryExpenses = expenses
      .filter(expense => expense.category === budget.category)
      .reduce((sum, expense) => sum + expense.amount, 0)

    const percentage = (categoryExpenses / budget.amount) * 100
    const remaining = budget.amount - categoryExpenses

    return {
      spent: categoryExpenses,
      remaining: Math.max(0, remaining),
      percentage: Math.min(percentage, 100),
      status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'over': return 'text-red-600 bg-red-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'good': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'over': return <AlertTriangle className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'good': return <CheckCircle className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Budget Management</h2>
          <p className="text-gray-600">Set and track your spending limits</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add Budget
        </motion.button>
      </div>

      {/* Add/Edit Budget Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingBudget ? 'Edit Budget' : 'Add New Budget'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="select"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Amount
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
                    className="select"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary"
                >
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {budgets.map((budget, index) => {
            const status = getBudgetStatus(budget)
            
            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                    <p className="text-sm text-gray-600 capitalize">{budget.period} budget</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(budget)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDeleteBudget(budget.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-gray-900">
                      ${budget.amount.toLocaleString()}
                    </span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status.status)}`}>
                      {getStatusIcon(status.status)}
                      {status.status === 'over' ? 'Over Budget' : 
                       status.status === 'warning' ? 'Near Limit' : 'On Track'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Spent: ${status.spent.toLocaleString()}</span>
                      <span className="text-gray-600">Remaining: ${status.remaining.toLocaleString()}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${status.percentage}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-2 rounded-full ${
                          status.status === 'over' ? 'bg-red-500' :
                          status.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      />
                    </div>
                    
                    <div className="text-center text-sm text-gray-600">
                      {status.percentage.toFixed(1)}% used
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {budgets.length === 0 && !showForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set</h3>
          <p className="text-gray-600 mb-6">Create your first budget to start tracking your spending limits</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Your First Budget
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default BudgetManager
