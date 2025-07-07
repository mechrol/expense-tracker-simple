import React from 'react'
import { Wallet, TrendingUp } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ExpenseTracker</h1>
              <p className="text-sm text-gray-500">Smart financial management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-success-600">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Financial Health: Good</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
