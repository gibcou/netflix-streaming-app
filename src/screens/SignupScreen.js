import React, { useRef, useState } from 'react';
import './SignupScreen.css';

function SignupScreen({ onAuth, initialMode = "signin" }) {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const register = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    // Create new user account
    const userData = {
      email: email,
      password: password, // Store password for authentication
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage as registered users
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Check if user already exists
    const userExists = existingUsers.find(user => user.email === email);
    if (userExists) {
      alert('User already exists! Please sign in instead.');
      setIsSignUp(false);
      return;
    }
    
    existingUsers.push(userData);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
    
    // Log the user in (don't include password in session data)
    const sessionData = {
      email: userData.email,
      id: userData.id,
      createdAt: userData.createdAt
    };
    
    onAuth(sessionData);
    alert('Account created successfully! Welcome to Netflix!');
  };

  const resetPassword = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const newPassword = newPasswordRef.current.value;
    
    if (!email || !newPassword) {
      alert('Please enter both email and new password');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }
    
    // Check if user exists in registered users
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = existingUsers.findIndex(user => user.email === email);
    
    if (userIndex !== -1) {
      // Update the user's password
      existingUsers[userIndex].password = newPassword;
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      
      alert('Password reset successfully! You can now sign in with your new password.');
      setIsForgotPassword(false);
      setIsSignUp(false);
    } else {
      alert('Account not found. Please check your email or create a new account.');
    }
  };

  const signIn = (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    // Check if user exists in registered users
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = existingUsers.find(user => user.email === email);
    
    if (user) {
      // Verify password
      if (user.password === password) {
        // Create session data (without password)
        const sessionData = {
          email: user.email,
          id: user.id,
          createdAt: user.createdAt
        };
        
        onAuth(sessionData);
        alert('Welcome back to Netflix!');
      } else {
        alert('Incorrect password. Please try again.');
      }
    } else {
      alert('Account not found. Please check your email or create a new account.');
    }
  };

  return (
    <div className="signupScreen">
      <form>
        <h1>
          {isForgotPassword ? 'Reset Password' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </h1>
        
        <input ref={emailRef} placeholder="Email" type="email" required />
        
        {isForgotPassword ? (
          <input ref={newPasswordRef} placeholder="New Password" type="password" required />
        ) : (
          <input ref={passwordRef} placeholder="Password" type="password" required />
        )}
        
        {isForgotPassword ? (
          <button type="submit" onClick={resetPassword}>
            Reset Password
          </button>
        ) : isSignUp ? (
          <button type="submit" onClick={register}>
            Create Account
          </button>
        ) : (
          <button type="submit" onClick={signIn}>
            Sign In
          </button>
        )}

        {!isForgotPassword && !isSignUp && (
          <div className="signupScreen__forgotPassword">
            <span 
              className="signupScreen__link" 
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot your password?
            </span>
          </div>
        )}

        <h4>
          {isForgotPassword ? (
            <>
              <span className="signupScreen__gray">Remember your password? </span>
              <span className="signupScreen__link" onClick={() => {
                setIsForgotPassword(false);
                setIsSignUp(false);
              }}>
                Sign In here.
              </span>
            </>
          ) : isSignUp ? (
            <>
              <span className="signupScreen__gray">Already have an account? </span>
              <span className="signupScreen__link" onClick={() => setIsSignUp(false)}>
                Sign In here.
              </span>
            </>
          ) : (
            <>
              <span className="signupScreen__gray">New to Netflix? </span>
              <span className="signupScreen__link" onClick={() => setIsSignUp(true)}>
                Sign Up now.
              </span>
            </>
          )}
        </h4>
      </form>
    </div>
  );
}

export default SignupScreen;