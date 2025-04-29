import React from 'react';
import { BrowserRouter as Router, Routes,Route, Navigate } from 'react-router-dom';
import {AuthProvider} from './auth/AuthContext.js';
import Login from './auth/login.js';
import SalesAgentDashboard from './pages/sales-agent/Dashboard.js';
import SalesForm from'./pages/sales-agent/Sales.js';
import ProcurementForm from './pages/sales-agent/Procurement.js';
import CreditSales from './pages/sales-agent/CreditSales';
import CEODashboard from './pages/ceo/Dashboard.js';
import ManagerDashboard from './pages/manager/Dashboard.js';
import ProtectedRoute from './ProtectedRoute.js';

function App() {
  
  return (
     <AuthProvider >
      <Router>
       <Routes>
        <Route path="/login" element={<Login />} />

        <Route
         path="/ceo-dashboard"
         element={
           <ProtectedRoute allowedRoles={['ceo']}>
              <CEODashboard />
           </ProtectedRoute> 
          }
        />
        <Route
         path="/manager-dashboard/:branchId"
         element={
           <ProtectedRoute allowedRoles={['manager', 'ceo']}>
              <ManagerDashboard />
           </ProtectedRoute> 
          }
        />
        <Route
         path="/sales-agent/:branchId/dashboard"
         element={
           <ProtectedRoute allowedRoles={['sales_agent', 'manager', 'ceo']}>
              <SalesAgentDashboard />
           </ProtectedRoute> 
          }
        />
        <Route
         path="/sales-agent/:branchId/new-sale"
         element={
           <ProtectedRoute allowedRoles={['sales_agent', 'manager', 'ceo']}>
              <CreditSales />
           </ProtectedRoute> 
          }
        />
        <Route
         path="/sales-agent/:branchId/procurement"
         element={
           <ProtectedRoute allowedRoles={['sales_agent', 'manager', 'ceo']}>
              <ProcurementForm />
           </ProtectedRoute> 
          }
        />
        <Route
         path="/sales-agent/:branchId/credit-sales"
         element={
           <ProtectedRoute allowedRoles={['sales_agent', 'manager', 'ceo']}>
              <SalesForm />
           </ProtectedRoute> 
          }
        />


        <Route path="/" element={<Navigate to ="/Login" replace />} /> 
      
       </Routes>
      </Router>
    
   </AuthProvider>
  );
}

export default App;
