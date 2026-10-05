import React, { useEffect, useState } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseSummary from './ExpenseSummary';
import ExpenseList from './ExpenseList';
import Auth from './Auth';
import './index.css';

// 1. IMPORT YOUR GIF FROM THE ASSETS FOLDER HERE
import coinLoader from './assets/coin-loading.gif'; 

function App() {
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedUserId) {
      setUserId(savedUserId);
      setUserEmail(savedEmail || 'User');
    }
  }, []);

  // Fetches individual user data from Spring Boot using X-User-Id header
  const fetchExpenses = async () => {
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/expenses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': currentUserId 
        }
      });
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error('Failed to fetch expenses: ', error);
    } finally {
      // Small timeout so the coin animation looks satisfying during page changes
      setTimeout(() => setLoading(false), 800); 
    }
  };

  useEffect(() => {
    if (userId) {
      fetchExpenses();
    }
  }, [userId]);

  const handleLoginSuccess = (id, email) => {
    setLoading(true);
    localStorage.setItem('userId', id);
    localStorage.setItem('userEmail', email);
    setUserId(id);
    setUserEmail(email);
  };

  const executeLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.clear();
      setUserId(null);
      setUserEmail('');
      setExpenses([]);
      setShowLogoutModal(false);
      setShowMenu(false);
      setLoading(false);
    }, 600); // Quick fade-out loader when logging out
  };

  return (
    <>
      {/* 2. DYNAMIC LOADING SCREEN DISPLAYING THE IMPORTED GIF */}
      {loading && (
        <div className="video-loader-overlay">
          <img 
            src={coinLoader} 
            alt="Loading..." 
            style={{ width: '150px', height: '150px', objectFit: 'contain' }} 
          />
        </div>
      )}

      {/* Unauthenticated State */}
      {!userId ? (
        <Auth onLoginSuccess={handleLoginSuccess} setLoading={setLoading} />
      ) : (
        /* Authenticated Dashboard State */
        <>
          <header className="app-header">
            <div className="header-container">
              <div className="welcome-tag">
                Welcome, <span className="username-highlight">{userEmail.split('@')[0]}</span> 👋
              </div>
              <h1 className="app-logo">Expense Tracker</h1>
              
              <div className="hamburger-menu" onClick={() => setShowMenu(!showMenu)}>
                <div className={`bar ${showMenu ? 'open' : ''}`}></div>
                <div className={`bar ${showMenu ? 'open' : ''}`}></div>
                <div className={`bar ${showMenu ? 'open' : ''}`}></div>
              </div>

              <nav className={`nav-dropdown ${showMenu ? 'active' : ''}`}>
                <button className="logout-trigger-btn" onClick={() => setShowLogoutModal(true)}>
                  Logout
                </button>
              </nav>
            </div>
          </header>

          <div className="Layout-1">
            <div className="form-card-wrapper">
              <ExpenseForm onExpenseAdd={fetchExpenses} />
            </div>
            <ExpenseSummary expenses={expenses} />
           {/* Look inside your App.jsx return block and ensure it reads exactly like this: */}
<ExpenseList expenses={expenses} onExpenseDeleteSuccess={fetchExpenses} />

          </div>

          {showLogoutModal && (
            <div className="modal-overlay">
              <div className="modal-box">
                <h3>Confirm Action</h3>
                <p>Are you sure you want to log out of your account?</p>
                <div className="modal-actions">
                  <button className="btn-confirm" onClick={executeLogout}>Yes, Logout</button>
                  <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;


//npx json-server --watch db/db.json --port 3000 [start json db]