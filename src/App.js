import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import DetailScreen from './screens/DetailScreen';

function App() {
  const [user, setUser] = useState(null);

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('netflixUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Function to handle user login/signup
  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('netflixUser', JSON.stringify(userData));
  };

  // Function to handle user logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('netflixUser');
  };

  return (
    <div className="app">
      <Router>
        {!user ? (
          <LoginScreen onAuth={handleAuth} />
        ) : (
          <Routes>
            <Route path="/profile" element={<ProfileScreen user={user} onLogout={handleLogout} />} />
            <Route path="/detail/:type/:id" element={<DetailScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;