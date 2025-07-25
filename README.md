# Budget Planner App

A modern, responsive budget planning application built with React. Track your income, expenses, and savings goals with beautiful visualizations and an intuitive interface.

## Features

- 📊 **Budget Overview**: Set and track monthly income, expense, and savings goals
- 💰 **Transaction Management**: Add income and expense transactions with categories
- 📈 **Visual Analytics**: Interactive charts showing income vs expenses and goals vs actual
- 💾 **Local Storage**: Data persists between sessions
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
   ```bash
   cd budget-planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit `http://localhost:3000`

## Usage

### Setting Up Your Budget

1. **Configure Budget Goals**: Click "Edit Budget" in the Budget Overview section
2. **Set Monthly Targets**: Enter your desired income, expense limits, and savings goals
3. **Save Changes**: Click "Save" to store your budget configuration

### Adding Transactions

1. **Choose Transaction Type**: Select either "Income" or "Expense"
2. **Enter Details**: Fill in the description, amount, and category
3. **Submit**: Click "Add Transaction" to record the transaction

### Managing Transactions

- **View All Transactions**: Scroll through the Recent Transactions section
- **Delete Transactions**: Click the trash icon next to any transaction to remove it
- **Track Progress**: Monitor your spending against your budget goals

### Understanding the Charts

- **Income vs Expenses Pie Chart**: Visual representation of your income and expense distribution
- **Goals vs Actual Bar Chart**: Compare your actual spending with your budget goals

## Project Structure

```
budget-planner/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── BudgetOverview.js
│   │   ├── TransactionForm.js
│   │   ├── TransactionList.js
│   │   └── BudgetChart.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Technologies Used

- **React 18**: Modern React with hooks and functional components
- **Recharts**: Beautiful and responsive charts
- **Lucide React**: Modern icon library
- **CSS3**: Custom styling with gradients and animations
- **Local Storage**: Client-side data persistence

## Customization

### Adding New Categories

To add new transaction categories, modify the `categories` object in `TransactionForm.js`:

```javascript
const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other', 'Your New Category'],
  expense: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Healthcare', 'Shopping', 'Other', 'Your New Category']
};
```

### Styling

The app uses custom CSS classes. You can modify the styles in:
- `src/index.css` - Global styles and utility classes
- `src/App.css` - Component-specific styles

## Data Persistence

All data is stored in the browser's localStorage, which means:
- Data persists between browser sessions
- Data is specific to your browser/device
- No server or database required

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy Budgeting! 💰**

---

# BudgetBae
Simple app to track our day to day expense, plan budget and enable savings
