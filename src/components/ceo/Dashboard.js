// import { useEffect, useState } from 'react';
// import './CEODashboard.css';
// import { exportToPDF, exportToExcel } from './ExportTool.js';

// export default function CEODashboard() {
//   const [kpiData, setKpiData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [exportMenuOpen, setExportMenuOpen] = useState(false);

//   useEffect(() => {
//     const mockData = {
//       summary: {
//         totalSales: 396000, // $396K
//         totalProcurement: 950000, // $950K
//         profitMargin: 29.5,
//         stockTurnover: 4.8
//       },
//       salesTrend: [
//         { month: 'Jan', sales: 65000 }, // $65K
//         { month: 'Feb', sales: 59000 }, // $59K
//         { month: 'Mar', sales: 80000 }  // $80K
//       ],
//       creditSales: [
//         { name: 'Cash Sales', value: 70, color: '#0088FE' },
//         { name: 'Credit Sales', value: 30, color: '#00C49F' }
//       ],
//       procurementData: [
//         { name: 'Raw Materials', value: 37, color: '#0088FE' },
//         { name: 'Equipment', value: 23, color: '#00C49F' },
//         { name: 'Services', value: 19, color: '#FFBB28' },
//         { name: 'Maintenance', value: 21, color: '#FF8042' },
//       ],
//       branchComparisonData: [
//         {
//           name: 'Branch A',
//           sales: 145000, // $145K
//           profit: 52000,  // $52K
//           customers: 1200,
//           stockTurnover: 5.2,
//           creditSales: 38000, // $38K
//         },
//         {
//           name: 'Branch B',
//           sales: 100000, // $100K
//           profit: 36000,  // $36K
//           customers: 950,
//           stockTurnover: 4.8,
//           creditSales: 25000, // $25K
//         },
//       ],
//       stockTurnoverData: [
//         { month: 'Jan', turnover: 4.0 },
//         { month: 'Feb', turnover: 4.2 },
//         { month: 'Mar', turnover: 4.5 },
//       ],
//       profitMarginData: [
//         { month: 'Jan', margin: 25 },
//         { month: 'Feb', margin: 26 },
//         { month: 'Mar', margin: 28 },
//       ]
//     };
//     setKpiData(mockData);
//     setLoading(false);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest('.export-button') && exportMenuOpen) {
//         setExportMenuOpen(false);
//       }
//     };
//     document.addEventListener('click', handleClickOutside);
//     return () => document.removeEventListener('click', handleClickOutside);
//   }, [exportMenuOpen]);

//   if (loading || !kpiData) return <div className="loading">Loading CEO Dashboard...</div>;

//   const maxSales = Math.max(...kpiData.salesTrend.map(item => item.sales));
//   const maxTurnover = Math.max(...kpiData.stockTurnoverData.map(item => item.turnover));

//   const topBranch = kpiData.branchComparisonData[0].sales > kpiData.branchComparisonData[1].sales
//     ? kpiData.branchComparisonData[0]
//     : kpiData.branchComparisonData[1];

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <h1 className="dashboard-title">CEO Dashboard</h1>
//         <button className="export-button" onClick={() => setExportMenuOpen(!exportMenuOpen)} aria-label='Export options'>
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden='true'>
//             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
//             <polyline points="7 10 12 15 17 10"></polyline>
//             <line x1="12" y1="15" x2="12" y2="3"></line>
//           </svg>
//         </button>
//         <div className={`export-menu ${exportMenuOpen ? 'active' : ''}`}>
//           <div className="export-menu-item" onClick={(e) =>{e.stopPropagation(); exportToPDF(kpiData);}}>
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//               <polyline points="14 2 14 8 20 8"></polyline>
//               <line x1="16" y1="13" x2="8" y2="13"></line>
//               <line x1="16" y1="17" x2="8" y2="17"></line>
//               <polyline points="10 9 9 9 8 9"></polyline>
//             </svg>
//             Export as PDF
//           </div>
//           <div className="export-menu-item" onClick={(e) =>{e.stopPropagation(); exportToExcel(kpiData);}}>
//             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//               <polyline points="14 2 14 8 20 8"></polyline>
//               <line x1="16" y1="13" x2="8" y2="13"></line>
//               <line x1="16" y1="17" x2="8" y2="17"></line>
//               <polyline points="10 9 9 9 8 9"></polyline>
//             </svg>
//             Export as Excel
//           </div>
//         </div>
//       </div>

//       {/* Metric Cards */}
//       <div className="card-grid metrics">
//         <div className="card metric-card">
//           <div className="card-header">
//             <h3 className="card-title">Total Sales</h3>
//           </div>
//           <div className="card-content">
//             <p className="metric-value">${(kpiData.summary.totalSales / 1000).toFixed(0)}K</p>
//             <p className="metric-change positive">+12.5% from previous period</p>
//           </div>
//         </div>
//         <div className="card metric-card">
//           <div className="card-header">
//             <h3 className="card-title">Procurement</h3>
//           </div>
//           <div className="card-content">
//             <p className="metric-value">${(kpiData.summary.totalProcurement / 1000).toFixed(0)}K</p>
//             <p className="metric-change positive">+5.2% from previous period</p>
//           </div>
//         </div>
//         <div className="card metric-card">
//           <div className="card-header">
//             <h3 className="card-title">Profit Margin</h3>
//           </div>
//           <div className="card-content">
//             <p className="metric-value">{kpiData.summary.profitMargin}%</p>
//             <p className="metric-change positive">+2.3% from previous period</p>
//           </div>
//         </div>
//         <div className="card metric-card">
//           <div className="card-header">
//             <h3 className="card-title">Stock Turnover</h3>
//           </div>
//           <div className="card-content">
//             <p className="metric-value">{kpiData.summary.stockTurnover.toFixed(1)}</p>
//             <p className="metric-change positive">+0.4 from previous period</p>
//           </div>
//         </div>
//       </div>

//       {/* Top Charts: Area and Bar */}
//       <div className="card-grid">
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Sales Trend</h3>
//             <p className="card-description">Monthly sales performance</p>
//           </div>
//           <div className="card-content">
//             <div className="area-chart">
//               <div className="area-chart-grid">
//                 <div className="grid-line"></div>
//                 <div className="grid-line"></div>
//                 <div className="grid-line"></div>
//                 <div className="grid-line"></div>
//               </div>
//               <div className="area-chart-points">
//                 {kpiData.salesTrend.map((item, index) => (
//                   <div
//                     key={item.month}
//                     className="area-point"
//                     style={{ bottom: `${(item.sales / maxSales) * 80}%`, left: `${(index / (kpiData.salesTrend.length - 1)) * 100}%` }}
//                   >
//                     <span className="point-label">{item.month}</span>
//                     <span className="point-value">${(item.sales / 1000).toFixed(0)}K</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="area-chart-fill" style={{ height: '80%' }}></div>
//             </div>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Stock Turnover</h3>
//             <p className="card-description">Monthly stock turnover rate</p>
//           </div>
//           <div className="card-content">
//             <div className="bar-chart">
//               {kpiData.stockTurnoverData.map(item => (
//                 <div key={item.month} className="bar" style={{ height: `${(item.turnover / maxTurnover) * 80}%` }}>
//                   <span className="bar-label">{item.month}</span>
//                   <span className="bar-value">{item.turnover.toFixed(1)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Pie Charts */}
//       <div className="card-grid">
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Procurement Breakdown</h3>
//             <p className="card-description">Distribution of procurement expenses</p>
//           </div>
//           <div className="card-content">
//             <div className="pie-chart procurement-pie"></div>
//             <div className="pie-chart-legend">
//               {kpiData.procurementData.map(item => (
//                 <div key={item.name} className="legend-item">
//                   <span className="legend-color" style={{ backgroundColor: item.color }}></span>
//                   <span>{item.name}: {item.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Sales Distribution</h3>
//             <p className="card-description">Distribution of sales channels</p>
//           </div>
//           <div className="card-content">
//             <div className="pie-chart sales-distribution-pie"></div>
//             <div className="pie-chart-legend">
//               {kpiData.creditSales.map(item => (
//                 <div key={item.name} className="legend-item">
//                   <span className="legend-color" style={{ backgroundColor: item.color }}></span>
//                   <span>{item.name}: {item.value}%</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Branch Comparison */}
//       <div className="card-grid branch">
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title">Branch Comparison</h3>
//             <p className="card-description">Performance metrics across branches</p>
//           </div>
//           <div className="card-content">
//             <div className="branch-grid">
//               <div className="branch-section">
//                 <p className="branch-title">Branch A</p>
//                 <div className="branch-metric">
//                   <span>Sales:</span>
//                   <span className="branch-metric-value">${(kpiData.branchComparisonData[0].sales / 1000).toFixed(0)}K</span>
//                 </div>
//                 <div className="branch-metric">
//                   <span>Profit:</span>
//                   <span className="branch-metric-value">${(kpiData.branchComparisonData[0].profit / 1000).toFixed(0)}K</span>
//                 </div>
//                 <div className="branch-metric">
//                   <span>Stock Turnover:</span>
//                   <span className="branch-metric-value">{kpiData.branchComparisonData[0].stockTurnover.toFixed(1)}</span>
//                 </div>
//                 <div className="branch-metric">
//                   <span>Credit Sales:</span>
//                   <span className="branch-metric-value">${(kpiData.branchComparisonData[0].creditSales / 1000).toFixed(0)}K</span>
//                 </div>
//               </div>
//               <div className="branch-section">
//                 <p className="branch-title">Branch B</p>
//                 <div className="branch-metric">
//                   <span>Sales:</span>
//                   <span className="branch-metric-value">${(kpiData.branchComparisonData[1].sales / 1000).toFixed(0)}K</span>
//                 </div>
//                 <div className="branch-metric">
//                   <span>Profit:</span>
//                   <span className="branch-metric-value">${(kpiData.branchComparisonData[1].profit / 1000).toFixed(0)}K</span>
//                 </div>
//                 <div className="branch-metric">
//                   <span>Stock Turnover:</span>
//                   <span className="branch-metric-value">{kpiData.branchComparisonData[1].stockTurnover.toFixed(1)}</span>
//                 </div>
//                 <div className="branch-metric">
//                   <span>Credit Sales:</span>
//                   <span className="branch-metric-value">${(kpiData.branchComparisonData[1].creditSales / 1000).toFixed(0)}K</span>
//                 </div>
//               </div>
//               <div className="branch-divider"></div>
//               <div className="top-branch">
//                 <p className="top-branch-title">Top Performing Branch: {topBranch.name}</p>
//                 <div className="top-branch-metrics">
//                   <p>Higher sales by ${((topBranch.sales - (topBranch.name === "Branch A" ? kpiData.branchComparisonData[1].sales : kpiData.branchComparisonData[0].sales)) / 1000).toFixed(0)}K</p>
//                   <p>Higher profit by ${((topBranch.profit - (topBranch.name === "Branch A" ? kpiData.branchComparisonData[1].profit : kpiData.branchComparisonData[0].profit)) / 1000).toFixed(0)}K</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from 'react';
import Procurement from '../Procurement';
import Sales from '../Sales';
import CreditSales from '../CreditSales';
import Stock from '../Stock';
import Analytics from '../Analytics';
import UserManagement from '../UserManagement';
import { useAuth } from '../../auth/AuthContext';

function CeoDashboard() {
  const { user, loading } = useAuth();
  console.log('CeoDashboard rendering - user:', user);
  if (loading) {
    return (
      <div className="dashboard">
        <header>
          <h1>CEO Dashboard</h1>
        </header>
        <div>Loading...</div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="dashboard">
        <header>
          <h1>CEO Dashboard</h1>
        </header>
        <div>Not authenticated</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header>
        <h1>CEO Dashboard</h1>
      </header>
      <div className="dashboard-content">
        <div className="card">
          { <Procurement /> }
        </div>
         <div className="card">
          <Sales />
        </div> 
        <div className="card">
          { <CreditSales /> }
        </div>
        <div className="card">
          { <Stock /> }
        </div>
        <div className="card">
          { <UserManagement /> }
        </div>
        <div className="card">
          { <Analytics /> }
        </div>
      </div>
    </div>
  );
}

export default CeoDashboard;
     


            


