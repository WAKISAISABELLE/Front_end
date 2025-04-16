import React from 'react';
import Sales from './Sales';
import CreditSales from './CreditSales';
import Stock from './Stock';
import Analytics from './Analytics';
import { useAuth } from '../auth/AuthContext';

function SalesAgentDashboard() {
  const { user } = useAuth();
  return (
    <div className="dashboard">
      <header>
        <h1>Sales Agent Dashboard - {user?.branch}</h1>
      </header>
      <div className="dashboard-content">
        <div className="card">
          <Sales />
        </div>
        <div className="card">
          <CreditSales />
        </div>
        <div className="card">
          <Stock />
        </div>
        <div className="card">
          <Analytics />
        </div>
      </div>
    </div>
  );
}

export default SalesAgentDashboard;