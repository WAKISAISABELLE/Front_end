import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import SalesAgent from '../../sales-agent/Dashboard.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<SalesAgent/>} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
