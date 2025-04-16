import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

function Sales() {
  const { user, token } = useAuth();
  const [sales, setSales] = useState([]);
  const [formData, setFormData] = useState({
    produce_name: '',
    tonnage: '',
    amount_paid: '',
    buyer_name: '',
    buyer_contact: '',
    branch: user.branch || ''
  });

  const fetchSales = useCallback(async () => {
    try {
      if (!token || !user.branch) {
        throw new Error('Missing token or branch');
      }
      console.log('Fetching sales - token:', token, 'branch:', user.branch, 'user:', user);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/sales`, {
        params: { branch: user.branch },
        headers: { Authorization: `Bearer ${token}` }
      });
      setSales(response.data);
      console.log('Sales - fetched data:', response.data);
    } catch (err) {
      console.error('Sales fetch error:', err.response?.data, err.message);
      toast.error(err.response?.data?.error || 'Failed to fetch sales');
    }
  }, [user, token]);

  useEffect(() => {
    if (token && user.branch) {
      fetchSales();
    } else {
      console.warn('Sales - missing token or branch:', { token, branch: user.branch });
    }
  }, [fetchSales, token, user.branch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submit started - formData:', formData, 'user:', user);
      const payload = {
        produce_name: formData.produce_name.trim(),
        tonnage: parseFloat(formData.tonnage),
        amount_paid: parseFloat(formData.amount_paid),
        buyer_name: formData.buyer_name ? formData.buyer_name.trim() : null,
        buyer_contact: formData.buyer_contact ? formData.buyer_contact.trim() : null,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        sales_agent: user.username,
        branch: user.branch
      };
      console.log('Adding sale - payload:', payload, 'token:', token);

      // Client-side validation
      if (!payload.produce_name) {
        throw new Error('Produce name is required');
      }
      if (isNaN(payload.tonnage) || payload.tonnage <= 0) {
        throw new Error('Tonnage must be a positive number');
      }
      if (isNaN(payload.amount_paid) || payload.amount_paid < 0) {
        throw new Error('Amount paid must be non-negative');
      }
      if (!payload.branch) {
        throw new Error('Branch is required');
      }
      if (!token) {
        throw new Error('Authentication token missing');
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/sales`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Sale added successfully!');
      setFormData({
        produce_name: '',
        tonnage: '',
        amount_paid: '',
        buyer_name: '',
        buyer_contact: '',
        branch: user.branch || ''
      });
      fetchSales();
      console.log('Sale added - response:', response.data);
    } catch (err) {
      console.error('Add sale error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      toast.error(err.response?.data?.error || err.message || 'Failed to add sale');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="sales">
      <h3>Add Sale</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Produce Name:</label>
          <input
            type="text"
            name="produce_name"
            value={formData.produce_name}
            onChange={handleChange}
            placeholder="e.g., Maize"
            required
          />
        </div>
        <div className="form-group">
          <label>Tonnage:</label>
          <input
            type="number"
            name="tonnage"
            value={formData.tonnage}
            onChange={handleChange}
            placeholder="e.g., 5"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Amount Paid (Ugx):</label>
          <input
            type="number"
            name="amount_paid"
            value={formData.amount_paid}
            onChange={handleChange}
            placeholder="e.g., 2500"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Buyer Name:</label>
          <input
            type="text"
            name="buyer_name"
            value={formData.buyer_name}
            onChange={handleChange}
            placeholder="e.g., Ssenyonjo Andy"
          />
        </div>
        <div className="form-group">
          <label>Buyer Contact:</label>
          <input
            type="text"
            name="buyer_contact"
            value={formData.buyer_contact}
            onChange={handleChange}
            placeholder="e.g., 1234567890"
          />
        </div>
        <div className="form-group">
          <label>Branch:</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            readOnly
          />
        </div>
        <button type="submit">Add Sale</button>
      </form>
      <h4>Recent Sales</h4>
      <table>
        <thead>
          <tr>
            <th>Produce</th>
            <th>Tonnage</th>
            <th>Amount Paid</th>
            <th>Buyer</th>
            <th>Branch</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td>{s.produce_name}</td>
              <td>{s.tonnage}</td>
              <td>{s.amount_paid}</td>
              <td>{s.buyer_name}</td>
              <td>{s.branch}</td>
              <td>{new Date(s.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Sales;