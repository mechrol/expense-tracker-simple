export const generateMockData = () => {
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

  const paymentMethods = ['card', 'cash', 'bank', 'digital']

  const expenseDescriptions = {
    'Food & Dining': ['Starbucks Coffee', 'Lunch at Subway', 'Grocery Shopping', 'Pizza Delivery', 'Restaurant Dinner'],
    'Transportation': ['Gas Station', 'Uber Ride', 'Bus Ticket', 'Parking Fee', 'Car Maintenance'],
    'Shopping': ['Amazon Purchase', 'Clothing Store', 'Electronics', 'Home Supplies', 'Books'],
    'Entertainment': ['Movie Tickets', 'Concert', 'Streaming Service', 'Gaming', 'Sports Event'],
    'Bills & Utilities': ['Electric Bill', 'Internet Bill', 'Phone Bill', 'Water Bill', 'Insurance'],
    'Healthcare': ['Doctor Visit', 'Pharmacy', 'Dental Care', 'Health Insurance', 'Vitamins'],
    'Travel': ['Hotel Booking', 'Flight Ticket', 'Car Rental', 'Travel Insurance', 'Vacation'],
    'Education': ['Course Fee', 'Books', 'Online Learning', 'Workshop', 'Certification'],
    'Other': ['Gift', 'Donation', 'Miscellaneous', 'Emergency', 'Investment']
  }

  // Generate expenses for the last 30 days
  const expenses = []
  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const descriptions = expenseDescriptions[category]
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]
    
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))
    
    expenses.push({
      id: `expense-${i}`,
      description,
      amount: Math.round((Math.random() * 200 + 5) * 100) / 100,
      category,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      date: date.toISOString()
    })
  }

  // Generate budgets
  const budgets = [
    { id: 'budget-1', category: 'Food & Dining', amount: 500, period: 'monthly' },
    { id: 'budget-2', category: 'Transportation', amount: 200, period: 'monthly' },
    { id: 'budget-3', category: 'Shopping', amount: 300, period: 'monthly' },
    { id: 'budget-4', category: 'Entertainment', amount: 150, period: 'monthly' },
    { id: 'budget-5', category: 'Bills & Utilities', amount: 400, period: 'monthly' }
  ]

  return { expenses, budgets }
}
