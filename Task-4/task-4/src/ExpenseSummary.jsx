import React from 'react';

function ExpenseSummary({ expenses = [] }) {
  // Calculate total money spent
  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  // Group total spending by category
  const categoryTotals = expenses.reduce((acc, item) => {
    const cat = item.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  return (
    <div className="expense-summary-container">
      <h2>Expense Summary</h2>
      
      <div className="summary-total-box">
        <span className="summary-total-label">Total Spent:</span>
        <span className="summary-total-value">${totalAmount.toFixed(2)}</span>
      </div>

      <h3 className="summary-subtitle">By Category:</h3>

      {Object.keys(categoryTotals).length === 0 ? (
        <p className="summary-empty">No summary data available.</p>
      ) : (
        <ul className="summary-category-list">
          {Object.entries(categoryTotals).map(([category, total]) => (
            <li key={category} className="summary-category-item">
              <span className="summary-category-name">{category}</span>
              <span className="summary-category-amount">${total.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ExpenseSummary;