import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
// import {AuthProvider} from './auth/AuthContext.js';
import SalesAgentDashboard from './pages/sales-agent/Dashboard.js';
import Login from './auth/login.js';
import SalesForm from'./pages/sales-agent/Sales.js';
import ProcurementForm from './pages/sales-agent/Procurement.js';
import CreditSales from './pages/sales-agent/CreditSales';

function App() {
  // const [user, setUser] =useState(null);
  return (
    // <AuthProvider value={{user,setUser}}>
    <BrowserRouter>
      <Routes>
        <Route path="/sales-agent/:branch/dashboard" element={<SalesAgentDashboard/>} />
        <Route path="/sales-agent/:branch/new-sale" element={<SalesForm/>} />
        <Route path="/sales-agent/:branch/procurement" element={<ProcurementForm/>} />
        <Route path="/sales-agent/:branch/credit-sales" element={<CreditSales />} />
        <Route path="/" element={<Login />} />
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
    // </AuthProvider>
  );
}

export default App;
