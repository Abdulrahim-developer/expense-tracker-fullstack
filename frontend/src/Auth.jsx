import React, { useState } from 'react';

function Auth({ onLoginSuccess, setLoading }) {

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        // Trigger the coin spinning overlay immediately on button click
        setLoading(true);

        const endpoint = isLogin ? '/auth/login' : '/auth/signup';

        try {
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // Handle raw string or JSON responses from backend safely
            const contentType = response.headers.get("content-type");
            let data;
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            // 1. THE SINGLE, CLEAN CONSOLIDATED ERROR CHECK BLOCK
            if (!response.ok) {
                let errorMessage = 'Authentication failed';
                
                // If Spring Boot returned a structured JSON error object
                if (data && typeof data === 'object') {
                    // Check if it's a validation error list (Spring Boot default structure for @Valid)
                    if (data.errors && data.errors[0]) {
                        errorMessage = data.errors[0].defaultMessage; // Grabs your custom Java message!
                    } else if (data.message) {
                        errorMessage = data.message;
                    }
                } else if (typeof data === 'string') {
                    // If the backend returned a plain text string error
                    errorMessage = data;
                }
                
                throw new Error(errorMessage);
            }

            // 2. RUNS ONLY IF THE NETWORK CALL WAS COMPLETELY SUCCESSFUL
            if (isLogin) {
                // Logged in! Send identity data back up to App.jsx
                onLoginSuccess(data.id, data.email); 
            } else {
                setMessage('Registration successful! Please log in below.');
                setIsLogin(true); // Automatically toggle form view to login screen
                setPassword('');
                setLoading(false); // Turn off spinner to let them enter password
            }

        } catch (err) {
            setMessage(err.message);
            setLoading(false); // Shut off loader if database rejects or errors out
        }
    };

    return (
        <div className='auth-card-container'>
            <div className='auth-card'>
                <h2>{isLogin ? 'Sign In to Tracker' : 'Create an Account'}</h2>

                {message && (
                    <p className="auth-message" style={{ color: message.includes('successful') ? '#28a745' : '#dc3545' }}>
                        {message}
                    </p>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className='outer'>
                        <label>Email</label>
                        <span className='break'>:</span>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            placeholder='name@example.com'
                        />
                    </div>

                    <div className='outer'>
                        <label>Password</label>
                        <span className='break'>:</span>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            placeholder='••••••••'
                        />
                    </div>

                    <div>
                        <button type='submit' style={{ width: '100%', marginTop: '10px' }}>
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="auth-toggle-link" onClick={() => { setIsLogin(!isLogin); setMessage(''); }}>
                    {isLogin ? "New here? Create an account instead" : 'Already have an account? Sign in here'}
                </p>
            </div>
        </div>
    );
}

export default Auth;
