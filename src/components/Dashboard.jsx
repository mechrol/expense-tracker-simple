import React from 'react'
import { motion } from 'framer-motion'
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart 
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle } from 'lucide-react'
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'

const Dashboard = ({ expenses, budgets }) => {
  // Calculate current month expenses
  const currentMonth = new Date()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  
  const currentMonthExpenses = expenses.filter(expense => 
    isWithinInterval(new Date(expense.date), { start: monthStart, end: monthEnd })
  )

  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const budgetRemaining = totalBudget - totalExpenses

  // Category breakdown
  const categoryData = currentMonthExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  const pieData = Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount,
    percentage: ((amount / totalExpenses) * 100).toFixed(1)
  }))

  // Weekly spending trend
  const weeklyData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dayExpenses = expenses.filter(expense => 
      format(new Date(expense.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).reduce((sum, expense) => sum + expense.amount, 0)
    
    weeklyData.push({
      day: format(date, 'EEE'),
      amount: dayExpenses
    })
  }

  // Budget vs Actual
  const budgetComparison = budgets.map(budget => {
    const categoryExpenses = currentMonthExpenses
      .filter(expense => expense.category === budget.category)
      .reduce((sum, expense) => sum + expense.amount, 0)
    
    return {
      category: budget.category,
      budget: budget.amount,
      actual: categoryExpenses,
      percentage: (categoryExpenses / budget.amount) * 100
    }
  })

  const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316']

  const StatCard = ({ title, value, change, icon: Icon, color = 'primary' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${value.toLocaleString()}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 ${
              change > 0 ? 'text-danger-600' : 'text-success-600'
            }`}>
              {change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{Math.abs(change)}% vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          value={totalExpenses}
          change={12}
          icon={DollarSign}
          color="danger"
        />
        <StatCard
          title="Budget Remaining"
          value={budgetRemaining}
          change={-8}
          icon={Target}
          color="success"
        />
        <StatCard
          title="Monthly Budget"
          value={totalBudget}
          icon={Target}
          color="primary"
        />
        <StatCard
          title="Avg Daily Spend"
          value={totalExpenses / new Date().getDate()}
          icon={TrendingUp}
          color="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600">{entry.name}</span>
                <span className="text-sm font-medium text-gray-900">{entry.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Spending Trend */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Spending Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#0ea5e9" 
                  fill="#0ea5e9" 
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Budget vs Actual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Budget vs Actual Spending</h3>
        <div className="space-y-4">
          {budgetComparison.map((item, index) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{item.category}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    ${item.actual.toLocaleString()} / ${item.budget.toLocaleString()}
                  </span>
                  {item.percentage > 90 && (
                    <AlertTriangle className="w-4 h-4 text-warning-500" />
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    item.percentage > 100 ? 'bg-danger-500' :
                    item.percentage > 80 ? 'bg-warning-500' : 'bg-success-500'
                  }`}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{item.percentage.toFixed(1)}% used</span>
                <span>${(item.budget - item.actual).toLocaleString()} remaining</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
