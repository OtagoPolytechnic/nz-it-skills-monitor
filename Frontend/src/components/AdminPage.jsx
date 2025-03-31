import React from 'react';

const AdminPage = () => {
  const handleScrapeStart = () => {
    alert('Scraping Seek.com has started!');
    // Add backend request here to start scraping
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <button onClick={handleScrapeStart} className="btn">
        Start Scraping
      </button>
    </div>
  );
};

export default AdminPage;
