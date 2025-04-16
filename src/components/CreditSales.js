import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function CreditSales() {
  const { user } = useAuth();
  const [creditSales, setCreditSales] = useState([]);

  const fetchCreditSales = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/creditSales`, {
        params: ['ceo','manager','sales_agent'].includes(user.role) ? {} : { branch: user.branch },
      });
      setCreditSales(response.data);
      console.log('CreditSales - fetched data:', response.data);
    } catch (err) {
      console.error('CreditSales fetch error:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchCreditSales();
  }, [fetchCreditSales]);

  return (
    <div className="credit-sales">
      <h3>Credit Sales</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produce</th>
            <th>Amount</th>
            <th>Buyer</th>
            <th>Branch</th>
          </tr>
        </thead>
        <tbody>
          {creditSales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.produce_name}</td>
              <td>{sale.amount}</td>
              <td>{sale.buyer_name}</td>
              <td>{sale.branch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CreditSales;