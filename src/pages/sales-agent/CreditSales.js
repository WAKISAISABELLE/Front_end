import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../auth/AuthContext';
import { useEffect, useState } from 'react';
import './CreditSales.css';

export default function CreditSales() {
  const { branch } = useParams();
//   const { user } = useAuth();
  const navigate = useNavigate();
  const [creditSales, setCreditSales] = useState([]);
  const [loading, setLoading] = useState(false);//made false since we werent fetching data

//   useEffect(() => {
    // const fetchCreditSales = async () => {
    //   try {
    //     const response = await fetch(`/api/sales?branch=${branch}&credit=true&agentId=${user._id}`, {
    //       headers: {
    //         'Authorization': `Bearer ${localStorage.getItem('token')}`
    //       }
    //     });
        
//         if (!response.ok) throw new Error('Failed to fetch credit sales');
//         const data = await response.json();
//         setCreditSales(data);
//       } catch (error) {
//         console.error('Error:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCreditSales();
//   }, [branch, user._id]);

  const handlePayment = async (saleId) => {
    try {
      const response = await fetch(`/api/sales/${saleId}/payment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ paid: true })
      });

      if (!response.ok) throw new Error('Failed to record payment');
      
      setCreditSales(prev => prev.map(sale => 
        sale._id === saleId ? { ...sale, paid: true } : sale
      ));
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  if (loading) return <div className="loading">Loading credit sales...</div>;

  return (
    <div className="credit-sales-container">
      <div className="credit-sales-card">
        <div className="header">
          <h1>Credit Sales</h1>
          <button
            onClick={() => navigate(`/sales-agent/${branch}/dashboard`)}
            className="back-button"
          >
            Back to Dashboard
          </button>
        </div>

        {creditSales.length === 0 ? (
          <p className="no-sales">No pending credit sales</p>
        ) : (
          <div className="sales-list">
            {creditSales.map(sale => (
              <div key={sale._id} className="sale-item">
                <div className="sale-header">
                  <div>
                    <p className="buyer-name">{sale.buyerName}</p>
                    <p className="sale-details">{sale.produceName} - {sale.tonnage} tons</p>
                  </div>
                  <p className="amount">UGX {sale.amount.toLocaleString()}</p>
                </div>
                <div className="sale-footer">
                  <p className={`due-date ${
                    new Date(sale.dueDate) < new Date() ? 'overdue' : ''
                  }`}>
                    Due: {new Date(sale.dueDate).toLocaleDateString()}
                  </p>
                  {!sale.paid ? (
                    <button
                      onClick={() => handlePayment(sale._id)}
                      className="pay-button"
                    >
                      Mark as Paid
                    </button>
                  ) : (
                    <span className="paid-badge">
                      Paid
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
