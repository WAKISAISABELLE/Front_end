import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
// import {AuthProvider} from './auth/AuthContext.js';
import SalesAgentDashboard from './pages/sales-agent/Dashboard.js';
import Login from './auth/login.js';
import SalesForm from'./pages/sales-agent/Sales.js';
import ProcurementForm from './pages/sales-agent/Procurement.js';
import CreditSales from './pages/sales-agent/CreditSales';
import CEODashboard from './pages/ceo/Dashboard.js';
import ManagerDashboard from './pages/manager/Dashboard.js';

function App() {
  // const [user, setUser] =useState(null);
  return (
    // <AuthProvider value={{user,setUser}}>
    <BrowserRouter>
      <Routes>
        <Route path="/ceo/dashboard" element={<CEODashboard />} />
        <Route path="/sales-agent/:branch/dashboard" element={<SalesAgentDashboard/>} />
        <Route path="/sales-agent/:branch/new-sale" element={<SalesForm/>} />
        <Route path="/sales-agent/:branch/procurement" element={<ProcurementForm/>} />
        <Route path="/sales-agent/:branch/credit-sales" element={<CreditSales />} />
        <Route path="/" element={<Login />} /> 
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
    // </AuthProvider>
  );
}

export default App;
