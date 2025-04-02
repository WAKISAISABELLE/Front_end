import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import SalesAgentDashboard from './pages/sales-agent/Dashboard.js';
import Login from './auth/login.js';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sales-agent/:branch" element={<SalesAgentDashboard/>} />
        <Route path="/" element={<Login />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
