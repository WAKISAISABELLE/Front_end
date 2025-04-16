import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Analytics() {
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalSales: [],
    stockLevels: [],
    salesTrend: []
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      console.log('Fetching analytics - token:', token, 'user:', user);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/analytics`, {
        params: ['ceo', 'manager'].includes(user.role) ? {} : { branch: user.branch },
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
      console.log('Analytics - fetched data:', response.data);
    } catch (err) {
      console.error('Analytics fetch error:', err.response?.data, err.message);
      toast.error(err.response?.data?.error || 'Failed to fetch analytics');
    }
  }, [user, token]);

  useEffect(() => {
    if (token && user.branch) {
      fetchAnalytics();
    } else {
      console.warn('Analytics - missing token or branch:', { token, branch: user.branch });
    }
  }, [fetchAnalytics, token, user.branch]);

  // Convert data to CSV
  const convertToCSV = (data, type) => {
    if (!data || data.length === 0) return '';

    let headers, rows;
    switch (type) {
      case 'totalSales':
        headers = ['Produce Name', 'Branch', 'Total Tonnage', 'Total Revenue'];
        rows = data.map(item => [
          item.produce_name,
          item.branch,
          item.total_tonnage,
          item.total_revenue
        ]);
        break;
      case 'stockLevels':
        headers = ['Produce Name', 'Branch', 'Available Tonnage'];
        rows = data.map(item => [
          item.produce_name,
          item.branch,
          item.available_tonnage
        ]);
        break;
      case 'salesTrend':
        headers = ['Sale Date', 'Total Tonnage', 'Total Revenue'];
        rows = data.map(item => [
          new Date(item.sale_date).toLocaleDateString(),
          item.total_tonnage,
          item.total_revenue
        ]);
        break;
      default:
        return '';
    }

    const csvRows = [
      headers.join(','),
      ...rows.map(row => row.map(val => `"${val}"`).join(','))
    ];
    return csvRows.join('\n');
  };

  // Download CSV
  const downloadCSV = (data, filename) => {
    const csv = convertToCSV(data, filename);
    if (!csv) {
      toast.error('No data to export');
      return;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="analytics">
      <h3>Analytics Dashboard - {user.branch}</h3>

      <div className="section">
        <h4>Total Sales by Produce</h4>
        {analytics.totalSales.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.totalSales} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="produce_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_tonnage" fill="#8884d8" name="Tonnage" />
              <Bar dataKey="total_revenue" fill="#82ca9d" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No sales data available.</p>
        )}
        {['ceo', 'manager'].includes(user.role) && (
          <button
            className="export-btn"
            onClick={() => downloadCSV(analytics.totalSales, 'total_sales')}
          >
            Export Sales as CSV
          </button>
        )}
      </div>

      <div className="section">
        <h4>Stock Levels</h4>
        {analytics.stockLevels.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.stockLevels} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="produce_name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="available_tonnage" fill="#ff7300" name="Tonnage" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No stock data available.</p>
        )}
        {['ceo', 'manager'].includes(user.role) && (
          <button
            className="export-btn"
            onClick={() => downloadCSV(analytics.stockLevels, 'stock_levels')}
          >
            Export Stock as CSV
          </button>
        )}
      </div>

      <div className="section">
        <h4>Sales Trend (Last 30 Days)</h4>
        {analytics.salesTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.salesTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sale_date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_tonnage" fill="#8884d8" name="Tonnage" />
              <Bar dataKey="total_revenue" fill="#82ca9d" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No sales trend data available.</p>
        )}
        {['ceo', 'manager'].includes(user.role) && (
          <button
            className="export-btn"
            onClick={() => downloadCSV(analytics.salesTrend, 'sales_trend')}
          >
            Export Trend as CSV
          </button>
        )}
      </div>
    </div>
  );
}

export default Analytics;