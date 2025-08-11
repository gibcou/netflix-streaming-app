import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress MetaMask errors that are not related to our Netflix clone
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && 
      (event.error.message.includes('MetaMask') || 
       event.error.message.includes('ethereum') ||
       (event.filename && event.filename.includes('chrome-extension')))) {
    event.preventDefault();
    console.warn('MetaMask extension error suppressed (not related to Netflix clone):', event.error.message);
    return false;
  }
});

// Suppress unhandled promise rejections from MetaMask
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && 
      (event.reason.message.includes('MetaMask') || 
       event.reason.message.includes('ethereum'))) {
    event.preventDefault();
    console.warn('MetaMask promise rejection suppressed (not related to Netflix clone):', event.reason.message);
    return false;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);