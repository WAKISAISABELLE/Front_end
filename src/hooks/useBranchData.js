
import { useState, useEffect } from 'react';

export default function useBranchData(branch) {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/stock?branch=${branch}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch stock');
        const data = await response.json();
        setStock(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [branch]);

  return { stock, loading, error };
}