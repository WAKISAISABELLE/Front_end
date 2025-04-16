import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import {AuthProvider} from './auth/AuthContext.js';
import { ToastContainer } from 'react-toastify';
import SalesAgentDashboard from './components/SalesAgentDashboard.js';
import Login from './components/login.js';
import SalesForm from'./components/Sales.js';
import ProcurementForm from './components/Procurement.js';
import CreditSales from './components/CreditSales.js';
import CEODashboard from './components/ceo/Dashboard.js';
import ManagerDashboard from './components/manager/Dashboard.js';

function App() {
  // const [user, setUser] =useState(null);
  return (
    <AuthProvider >
      
    <BrowserRouter>
    <ToastContainer />
      <Routes>
        <Route path="/ceo/Dashboard" element={<CEODashboard />} />
        <Route path="/SalesAgentDashboard" element={<SalesAgentDashboard/>} />
        <Route path="/sales" element={<SalesForm/>} />
        <Route path="/procurement" element={<ProcurementForm/>} />
        <Route path="/credit-sales" element={<CreditSales />} />
        <Route path="/" element={<Login />} /> 
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
   </AuthProvider>
  );
}

export default App;
