import React from 'react';
import './SplashPage.css';

const SplashPage: React.FC = () => {
  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo">
          <h1>Treasure Coast Food Bank</h1>
          <p>Agency Finder</p>
        </div>
        
        <div className="splash-loading">
          <div className="loading-spinner"></div>
          <p>Loading agency data...</p>
        </div>
        
        <div className="splash-message">
          <p>Finding food assistance near you</p>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;