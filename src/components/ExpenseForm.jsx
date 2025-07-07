import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, DollarSign } from 'lucide-react'

const ExpenseForm = ({ onAddExpense }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    paymentMethod: 'card'
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

  const paymentMethods = [
    { value: 'card', label: '💳 Credit Card' },
    { value: 'cash', label: '💵 Cash' },
    { value: 'bank', label: '🏦 Bank Transfer' },
    { value: 'digital', label: '📱 Digital Wallet' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.category) return

    onAddExpense({
      ...formData,
      amount: parseFloat(formData.amount)
    })

    setFormData({
      description: '',
      amount: '',
      category: '',
      paymentMethod: 'card'
    })
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Plus className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Expense</h2>
            <p className="text-gray-600">Track your spending to stay on budget</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What did you spend on?"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="input pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="select"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="select"
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full btn-primary justify-center py-3 text-lg"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </motion.button>
        </form>

        {/* Quick Add Buttons */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Add</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Coffee', amount: 5, category: 'Food & Dining' },
              { label: 'Lunch', amount: 15, category: 'Food & Dining' },
              { label: 'Gas', amount: 40, category: 'Transportation' },
              { label: 'Groceries', amount: 80, category: 'Shopping' }
            ].map((quick) => (
              <motion.button
                key={quick.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onAddExpense({
                    description: quick.label,
                    amount: quick.amount,
                    category: quick.category,
                    paymentMethod: 'card'
                  })
                }}
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center transition-colors duration-200"
              >
                <div className="font-medium text-gray-900">{quick.label}</div>
                <div className="text-sm text-gray-600">${quick.amount}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ExpenseForm
