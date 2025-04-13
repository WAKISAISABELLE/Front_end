import { useState, useEffect } from 'react';
import { BarChart, LineChart, XAxis, YAxis, CartesianGrid, Bar, Line, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { utils, writeFile } from 'xlsx';
import './Dashboard.css';

// PDF Styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { fontSize: 20, marginBottom: 20, fontWeight: 'bold' },
  table: { display: 'table', width: '100%', marginBottom: 10 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '25%', border: '1px solid #000', padding: 5, backgroundColor: '#f0f0f0' },
  tableCol: { width: '25%', border: '1px solid #000', padding: 5 },
});

const ReportDocument = ({ data, reportType, branchName }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>{branchName.toUpperCase()} - {reportType.toUpperCase()} REPORT</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}><Text>Month</Text></View>
          <View style={styles.tableColHeader}><Text>Sales</Text></View>
          <View style={styles.tableColHeader}><Text>Profit</Text></View>
          <View style={styles.tableColHeader}><Text>Procurement Cost</Text></View>
        </View>
        {data.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}><Text>{item.month}</Text></View>
            <View style={styles.tableCol}><Text>${item.sales}</Text></View>
            <View style={styles.tableCol}><Text>${item.profit}</Text></View>
            <View style={styles.tableCol}><Text>${item.procurementCost}</Text></View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const NavBar = ({ branchName, managerName, onLogout }) => (
  <nav className="navbar">
    <div className="navbar-container">
      <h1 className="navbar-title">GCDL Manager - {branchName} Branch</h1>
      <div className="navbar-profile">
        <span className="profile-text">Welcome, {managerName}</span>
        <div className="profile-icon">{managerName ? managerName[0] : 'M'}</div>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </div>
  </nav>
);

const SideNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking on a link (for mobile)
  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  return (
    <aside className="side-nav">
      <button className="menu-toggle" onClick={toggleMenu}>
        <span className="menu-icon">{isOpen ? '✕' : '☰'}</span>
        <span className="menu-text">Dashboard Menu</span>
      </button>
      
      <nav className={`nav-content ${isOpen ? 'open' : ''}`}>
        <h3 className="section-title">Dashboard Sections</h3>
        <ul className="nav-list">
          <li><a href="#kpi-grid" className="nav-link" onClick={handleLinkClick}>KPI Overview</a></li>
          <li><a href="#sales-trends" className="nav-link" onClick={handleLinkClick}>Sales Trends</a></li>
          <li><a href="#procurement-costs" className="nav-link" onClick={handleLinkClick}>Procurement Costs</a></li>
          <li><a href="#profit-margin" className="nav-link" onClick={handleLinkClick}>Profit Margin</a></li>
          <li><a href="#stock-turnover" className="nav-link" onClick={handleLinkClick}>Stock Turnover</a></li>
          <li><a href="#export-section" className="nav-link" onClick={handleLinkClick}>Export Reports</a></li>
        </ul>
      </nav>
    </aside>
  );
};

// API service remains unchanged
const api = {/* ... */};

export default function ManagerDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [managerId, setManagerId] = useState(null);
  const [managerName, setManagerName] = useState('');
  const [branch, setBranch] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [kpiData, setKpiData] = useState({
    salesTrend: 0,
    profitMargin: 0,
    stockTurnover: 0,
    procurementCost: 0
  });
  const [reportType, setReportType] = useState('credit-sales');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scrolling Effect with All Improvements
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const contentArea = document.querySelector('.content-area');
      if (!contentArea) return;

      contentArea.style.scrollBehavior = 'smooth';
      const navLinks = document.querySelectorAll('.nav-link');

      const handleScrollProgress = () => {
        const scrollTop = contentArea.scrollTop;
        const scrollHeight = contentArea.scrollHeight - contentArea.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        setScrollProgress(progress);
      };

      const handleScroll = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        navLinks.forEach(link => link.classList.remove('active'));
        e.currentTarget.classList.add('active');

        if (targetElement) {
          const offset = targetElement.offsetTop;
          const headerOffset = 20;
          contentArea.scrollTo({
            top: offset - headerOffset,
            behavior: 'smooth'
          });
        }
      };

      navLinks.forEach(link => {
        link.addEventListener('click', handleScroll);
      });
      contentArea.addEventListener('scroll', handleScrollProgress);

      return () => {
        navLinks.forEach(link => {
          link.removeEventListener('click', handleScroll);
        });
        contentArea.removeEventListener('scroll', handleScrollProgress);
      };
    } catch (error) {
      console.error('Scrolling effect error:', error);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem('managerId');
    setIsAuthenticated(false);
    setManagerId(null);
    setBranch(null);
    setManagerName('');
    setSalesData([]);
    setKpiData({
      salesTrend: 0,
      profitMargin: 0,
      stockTurnover: 0,
      procurementCost: 0
    });
    window.location.href = '/';
  };

  const loadManagerData = async (managerId) => {
    try {
      setIsLoading(true);
      const [managerInfo, branchInfo] = await Promise.all([
        api.getManagerInfo(managerId),
        api.getBranchByManager(managerId)
      ]);
      setManagerName(managerInfo.name);
      setBranch(branchInfo);
      if (branchInfo) {
        await loadBranchData(branchInfo.id);
      } else {
        setError('No branch assigned to this manager.');
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load manager data. Please try again later.');
      setIsLoading(false);
    }
  };

  const loadBranchData = async (branchId) => {
    try {
      const [salesDataResponse, kpiDataResponse] = await Promise.all([
        api.getSalesData(branchId),
        api.getKpiData(branchId)
      ]);
      setSalesData(salesDataResponse);
      setKpiData(kpiDataResponse);
    } catch (err) {
      setError('Failed to load branch data. Please try again later.');
    }
  };

  const exportDataHandler = (type) => {
    switch(type) {
      case 'credit-sales':
        return salesData.map(({ month, sales }) => ({ month, sales }));
      case 'dealers-performance':
        return salesData.map(({ month, stockTurnover }) => ({ month, stockTurnover }));
      case 'agent-performance':
        return salesData.map(({ month, profit }) => ({ month, profit }));
      case 'buyer-analysis':
        return salesData.map(({ month, procurementCost }) => ({ month, procurementCost }));
      default:
        return salesData;
    }
  };

  const exportExcel = () => {
    const dataToExport = exportDataHandler(reportType);
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(dataToExport);
    utils.book_append_sheet(wb, ws, "ReportData");
    writeFile(wb, `${branch.id}_${reportType}_report.xlsx`);
  };

  const exportCSV = () => {
    const dataToExport = exportDataHandler(reportType);
    const wb = utils.book_new();
    const ws = utils.json_to_sheet(dataToExport);
    utils.book_append_sheet(wb, ws, "ReportData");
    writeFile(wb, `${branch.id}_${reportType}_report.csv`);
  };

  if (isLoading && !branch) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error && !branch) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="main-content">
      
      <NavBar 
        branchName={branch?.name || ''} 
        managerName={managerName}
        onLogout={handleLogout}
      />
      
      <div className="dashboard-container">
      <SideNav/>
        <div className="content-area">
        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>
          {isLoading ? (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading branch data...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => loadManagerData(managerId)}>Retry</button>
            </div>
          ) : (
            <>
              <div className="top-section">
                <div className="branch-banner">
                  <h2>{branch?.name || ''} Branch Dashboard</h2>
                  <p>Manager: {managerName}</p>
                </div>
              </div>

              <div className="kpi-grid" id="kpi-grid">
                <div className="kpi-card">
                  <h3>Sales Trend</h3>
                  <p className="kpi-value">{kpiData.salesTrend}%</p>
                </div>
                <div className="kpi-card">
                  <h3>Profit Margin</h3>
                  <p className="kpi-value">{kpiData.profitMargin}%</p>
                </div>
                <div className="kpi-card">
                  <h3>Stock Turnover</h3>
                  <p className="kpi-value">{kpiData.stockTurnover}x</p>
                </div>
                <div className="kpi-card">
                  <h3>Procurement Cost</h3>
                  <p className="kpi-value">${kpiData.procurementCost}</p>
                </div>
              </div>

              <div className="chart-grid">
                <div className="chart-group">
                  <div className="chart-card" id="sales-trends">
                    <h2 className="section-title">{branch?.name || ''} Branch Sales Trends</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={salesData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-card" id="procurement-costs">
                    <h2 className="section-title">{branch?.name || ''} Branch Procurement Costs</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={salesData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="procurementCost" stroke="#ff7300" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="chart-group">
                  <div className="chart-card" id="profit-margin">
                    <h2 className="section-title">{branch?.name || ''} Branch Profit Margin</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={salesData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="profitMargin" stroke="#82ca9d" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-card" id="stock-turnover">
                    <h2 className="section-title">{branch?.name || ''} Branch Stock Turnover</h2>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={salesData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="stockTurnover" fill="#ffc658" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="export-section" id="export-section">
                <h2 className="section-title">Export {branch?.name || ''} Branch Reports</h2>
                <div className="export-controls">
                  <select 
                    className="report-select"
                    onChange={(e) => setReportType(e.target.value)}
                    value={reportType}
                  >
                    <option value="credit-sales">Credit Sales</option>
                    <option value="dealers-performance">Dealers Performance</option>
                    <option value="agent-performance">Sales Agent Performance</option>
                    <option value="buyer-analysis">Buyer Analysis</option>
                  </select>
                  <div className="export-buttons">
                    <PDFDownloadLink 
                      document={<ReportDocument data={salesData} reportType={reportType} branchName={branch?.name || ''} />} 
                      fileName={`${branch?.id || 'branch'}_${reportType}_report.pdf`}
                      className="export-button pdf"
                    >
                      {({ loading }) => loading ? 'Generating PDF...' : 'Export PDF'}
                    </PDFDownloadLink>
                    <button onClick={exportExcel} className="export-button excel">Export Excel</button>
                    <button onClick={exportCSV} className="export-button csv">Export CSV</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}