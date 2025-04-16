import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';

function Stock() {
  const { user } = useAuth();
  const [stock, setStock] = useState([]);

  const fetchStock = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/stock`, {
        params: ['ceo','manager','sales_agent'].includes(user.role) ?  {} : { branch: user.branch },
      });
      setStock(response.data);
      console.log('Stock - fetched data:', response.data);
    } catch (err) {
      console.error('Stock fetch error:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  return (
    <div className="stock">
      <h3>Stock</h3>
      <table>
        <thead>
          <tr>
            <th>Produce</th>
            <th>Tonnage</th>
            <th>Branch</th>
          </tr>
        </thead>
        <tbody>
          {stock.map((item) => (
            <tr key={item.id}>
              <td>{item.produce_name}</td>
              <td>{item.tonnage}</td>
              <td>{item.branch}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Stock;