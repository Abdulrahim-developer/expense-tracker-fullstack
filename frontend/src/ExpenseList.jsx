import React, { useState } from 'react';

function ExpenseList({ expenses, onExpenseDeleteSuccess }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // 1. Local States to manage the Secure Verification Pop-up Modal
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const filteredExpenses = selectedCategory === 'All'
    ? expenses
    : expenses.filter(expense => expense.category === selectedCategory);

  const handleDeleteTrigger = (expense) => {
    setExpenseToDelete(expense);
    setConfirmPassword('');
    setDeleteError('');
  };

  const executeDeleteRequest = async (e) => {
    e.preventDefault();
    setDeleteError('');

    const userId = localStorage.getItem('userId');

    try {
      const response = await fetch(`http://localhost:8080/expenses/${expenseToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': userId,
          // 2. Passes password securely in the custom header to match Spring Boot
          'X-Delete-Password': confirmPassword 
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete record');
      }

      // If successful, close modal and tell App.jsx to refresh the dashboard list
      setExpenseToDelete(null);
      if (onExpenseDeleteSuccess) {
        onExpenseDeleteSuccess();
      }
    } catch (err) {
      setDeleteError(err.message);
    }
  };

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2>Expense List</h2>
        
        <div className="filter-wrapper">
          <label htmlFor="categoryFilter" className="filter-label">Filter:</label>
          <select 
            id="categoryFilter" 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-dropdown"
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <p className="expense-list-empty">
          {selectedCategory === 'All' ? 'No expenses recorded yet.' : `No expenses found under "${selectedCategory}".`}
        </p>
      ) : (
        <ul className="expense-list-items">
          {filteredExpenses.map((expense) => (
            <li key={expense.id} className="expense-list-item">
              <div className="expense-list-details">
                <strong className="expense-list-title">{expense.title}</strong>
                <span className="expense-list-category">{expense.category}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span className="expense-list-amount">
                  ${Number(expense.amount).toFixed(2)}
                </span>
                {/* 3. Inline Delete action button */}
                <button 
                  onClick={() => handleDeleteTrigger(expense)}
                  className="btn-list-delete"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 4. SECURITY CONFIRMATION MODAL POP-UP */}
      {expenseToDelete && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Security Verification</h3>
            <p>To delete <strong>"{expenseToDelete.title}"</strong>, please enter your password to confirm:</p>
            
            {deleteError && (
              <p style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '10px', fontWeight: '500' }}>
                {deleteError}
              </p>
            )}
            
            <form onSubmit={executeDeleteRequest}>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                placeholder="Enter your login password"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  marginBottom: '15px', 
                  borderRadius: '4px', 
                  border: '1px solid #ccc',
                  outline: 'none'
                }}
              />
              <div className="modal-actions">
                <button type="submit" className="btn-confirm">Verify & Delete</button>
                <button type="button" className="btn-cancel" onClick={() => setExpenseToDelete(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
