import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useBranchData(branchId) {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stock?branchId=${branchId}`);
        setStock(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch stock');
      } finally {
        setLoading(false);
      }
    };

    if (branchId) {
      fetchStock();
    }
  }, [branchId]);

  return { stock, loading, error };
}