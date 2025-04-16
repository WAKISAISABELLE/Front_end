import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';

function Procurement() {
  const { user, token } = useAuth();
  const [procurements, setProcurements] = useState([]);
  const [formData, setFormData] = useState({
    produce_name: '',
    type: 'Grain',
    tonnage: '',
    cost: '',
    dealer_name: '',
    contact: '',
    selling_price: '',
    branch: ['ceo', 'manager'].includes(user.role) ? {} :{branch:  user.branch},
  });

  const fetchProcurements = useCallback(async () => {
    try {
      console.log('Fetching procurements - token:', token);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/procurements`, {
        params:['ceo','manager'].includes(user.role) ? {} : { branch: user.branch },
        headers: { Authorization: `Bearer ${token}` }
      });
      setProcurements(response.data);
      console.log('Procurements - fetched data:', response.data);
    } catch (err) {
      console.error('Procurements fetch error:', err.response?.data, err.message);
      toast.error(err.response?.data?.error || 'Failed to fetch procurements');
    }
  }, [user, token]);

  useEffect(() => {
    if (token) {
      fetchProcurements();
    } else {
      console.warn('Procurement - no token available');
    }
  }, [fetchProcurements, token]);

  const formatMySQLDate = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 19).replace('T', ' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        date: formatMySQLDate(new Date()),
        tonnage: parseFloat(formData.tonnage),
        cost: parseFloat(formData.cost),
        selling_price: formData.selling_price ? parseFloat(formData.selling_price) : null,
      };
      console.log('Adding procurement - payload:', payload, 'token:', token);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/procurements`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Stock added successfully!');
      setFormData({
        produce_name: '',
        type: 'Grain',
        tonnage: '',
        cost: '',
        dealer_name: '',
        contact: '',
        selling_price: '',
        branch: user.role === 'ceo' ? {} :{branch:  user.branch},
      });
      fetchProcurements();
      console.log('Procurement added - response:', response.data);
    } catch (err) {
      console.error('Add procurement error:', err.response?.data, err.message);
      toast.error(err.response?.data?.error || 'Failed to add stock');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="procurement">
      <h3>Add Stock (Procurement)</h3>
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
          <label>Type:</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="Grain">Grain</option>
            <option value="Vegetable">Vegetable</option>
            <option value="Fruit">Fruit</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tonnage:</label>
          <input
            type="number"
            name="tonnage"
            value={formData.tonnage}
            onChange={handleChange}
            placeholder="e.g., 10"
            step="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Cost (Ugx):</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="e.g., 5000"
            step="100"
            required
          />
        </div>
        <div className="form-group">
          <label>Dealer Name:</label>
          <input
            type="text"
            name="dealer_name"
            value={formData.dealer_name}
            onChange={handleChange}
            placeholder="e.g., Ssenyonjo Andy"
          />
        </div>
        <div className="form-group">
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="e.g., 1234567890"
          />
        </div>
        <div className="form-group">
          <label>Selling Price (Ugx):</label>
          <input
            type="number"
            name="selling_price"
            value={formData.selling_price}
            onChange={handleChange}
            placeholder="e.g., 6000"
            step="1000"
          />
        </div>
        <div className="form-group">
          <label>Branch:</label>
          {user.role === 'ceo' ? (
            <select name="branch" value={formData.branch} onChange={handleChange}>
              <option value="Matugga">Matugga</option>
              <option value="Maganjo">Maganjo</option>
              <option value="HQ">HQ</option>
            </select>
          ) : (
            <input type="text" name="branch" value={formData.branch} readOnly />
          )}
        </div>
        <button type="submit">Add Stock</button>
      </form>
      <h4>Recent Procurements</h4>
      <table>
        <thead>
          <tr>
            <th>Produce</th>
            <th>Tonnage</th>
            <th>Cost</th>
            <th>Branch</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {procurements.map((p) => (
            <tr key={p.id}>
              <td>{p.produce_name}</td>
              <td>{p.tonnage}</td>
              <td>{p.cost}</td>
              <td>{p.branch}</td>
              <td>{new Date(p.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Procurement;