import React from 'react';
import './ProfileScreen.css';
import Nav from '../components/Nav';

function ProfileScreen({ user, onLogout }) {
  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      onLogout();
    }
  };

  return (
    <div className="profileScreen">
      <Nav />
      <div className="profileScreen__body">
        <h1>Edit Profile</h1>
        <div className="profileScreen__info">
          <img
            src="/netflix-avatar.svg"
            alt="Avatar"
          />
          <div className="profileScreen__details">
            <h2>{user?.email || 'user@example.com'}</h2>
            <div className="profileScreen__plans">
              <h3>Plans (Current: Netflix Standard)</h3>
              
              <div className="profileScreen__plan">
                <div className="profileScreen__planInfo">
                  <h5>Netflix Standard</h5>
                  <h6>1080p</h6>
                </div>
                <button>Current Plan</button>
              </div>

              <div className="profileScreen__plan">
                <div className="profileScreen__planInfo">
                  <h5>Netflix Basic</h5>
                  <h6>480p</h6>
                </div>
                <button>Downgrade</button>
              </div>

              <div className="profileScreen__plan">
                <div className="profileScreen__planInfo">
                  <h5>Netflix Premium</h5>
                  <h6>4K+HDR</h6>
                </div>
                <button>Upgrade</button>
              </div>
            </div>
            
            <button 
              className="profileScreen__signOut"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileScreen;