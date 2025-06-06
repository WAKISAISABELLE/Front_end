"use client"

import { useEffect, useState } from "react"
import "./CEODashboard.css"
import { exportToPDF, exportToExcel } from "./ExportTool.js"
import { api } from "../../services/api-service.js"
import { useAuth } from "../../auth/AuthContext"

export default function CEODashboard() {
  const { user } = useAuth()
  const [kpiData, setKpiData] = useState({
    summary: {
      totalSales: 0,
      totalProcurement: 0,
      profitMargin: 0,
      stockTurnover: 0,
    },
    salesTrend: [],
    creditSales: [],
    procurementData: [],
    branchComparisonData: [],
    stockTurnoverData: [],
    profitMarginData: [],
  })
  const [loading, setLoading] = useState(true)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await api.getCEODashboardData()
        setKpiData(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Set up polling to refresh data every 5 minutes
    const intervalId = setInterval(fetchDashboardData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".export-button") && exportMenuOpen) {
        setExportMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [exportMenuOpen])

  if (loading) return <div className="loading">Loading CEO Dashboard...</div>
  if (error) return <div className="error">{error}</div>

  // Safely calculate max values with null checks
  const maxSales =
    kpiData.salesTrend && kpiData.salesTrend.length > 0
      ? Math.max(...kpiData.salesTrend.map((item) => item.sales || 0))
      : 0

  const maxTurnover =
    kpiData.stockTurnoverData && kpiData.stockTurnoverData.length > 0
      ? Math.max(...kpiData.stockTurnoverData.map((item) => item.turnover || 0))
      : 0

  // Safely determine top branch with null checks
  const topBranch =
    kpiData.branchComparisonData && kpiData.branchComparisonData.length >= 2
      ? kpiData.branchComparisonData[0].sales > kpiData.branchComparisonData[1].sales
        ? kpiData.branchComparisonData[0]
        : kpiData.branchComparisonData[1]
      : null

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">CEO Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name || "CEO"}</span>
        </div>
        <button
          className="export-button"
          onClick={() => setExportMenuOpen(!exportMenuOpen)}
          aria-label="Export options"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
        <div className={`export-menu ${exportMenuOpen ? "active" : ""}`}>
          <div
            className="export-menu-item"
            onClick={(e) => {
              e.stopPropagation()
              exportToPDF(kpiData)
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Export as PDF
          </div>
          <div
            className="export-menu-item"
            onClick={(e) => {
              e.stopPropagation()
              exportToExcel(kpiData)
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Export as Excel
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="card-grid metrics">
        <div className="card metric-card">
          <div className="card-header">
            <h3 className="card-title">Total Sales</h3>
          </div>
          <div className="card-content">
            <p className="metric-value">${((kpiData.summary?.totalSales || 0) / 1000).toFixed(0)}K</p>
            <p className="metric-change positive">+12.5% from previous period</p>
          </div>
        </div>
        <div className="card metric-card">
          <div className="card-header">
            <h3 className="card-title">Procurement</h3>
          </div>
          <div className="card-content">
            <p className="metric-value">${((kpiData.summary?.totalProcurement || 0) / 1000).toFixed(0)}K</p>
            <p className="metric-change positive">+5.2% from previous period</p>
          </div>
        </div>
        <div className="card metric-card">
          <div className="card-header">
            <h3 className="card-title">Profit Margin</h3>
          </div>
          <div className="card-content">
            <p className="metric-value">{kpiData.summary?.profitMargin || 0}%</p>
            <p className="metric-change positive">+2.3% from previous period</p>
          </div>
        </div>
        <div className="card metric-card">
          <div className="card-header">
            <h3 className="card-title">Stock Turnover</h3>
          </div>
          <div className="card-content">
            <p className="metric-value">{(kpiData.summary?.stockTurnover || 0).toFixed(1)}</p>
            <p className="metric-change positive">+0.4 from previous period</p>
          </div>
        </div>
      </div>

      {/* Top Charts: Area and Bar */}
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Sales Trend</h3>
            <p className="card-description">Monthly sales performance</p>
          </div>
          <div className="card-content">
            <div className="area-chart">
              <div className="area-chart-grid">
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
                <div className="grid-line"></div>
              </div>
              <div className="area-chart-points">
                {kpiData.salesTrend &&
                  kpiData.salesTrend.map((item, index) => (
                    <div
                      key={item.month}
                      className="area-point"
                      style={{
                        bottom: `${maxSales > 0 ? ((item.sales || 0) / maxSales) * 80 : 0}%`,
                        left: `${(index / Math.max(kpiData.salesTrend.length - 1, 1)) * 100}%`,
                      }}
                    >
                      <span className="point-label">{item.month}</span>
                      <span className="point-value">${((item.sales || 0) / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
              </div>
              <div className="area-chart-fill" style={{ height: "80%" }}></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Stock Turnover</h3>
            <p className="card-description">Monthly stock turnover rate</p>
          </div>
          <div className="card-content">
            <div className="bar-chart">
              {kpiData.stockTurnoverData &&
                kpiData.stockTurnoverData.map((item) => (
                  <div
                    key={item.month}
                    className="bar"
                    style={{ height: `${maxTurnover > 0 ? ((item.turnover || 0) / maxTurnover) * 80 : 0}%` }}
                  >
                    <span className="bar-label">{item.month}</span>
                    <span className="bar-value">{(item.turnover || 0).toFixed(1)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pie Charts */}
      <div className="card-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Procurement Breakdown</h3>
            <p className="card-description">Distribution of procurement expenses</p>
          </div>
          <div className="card-content">
            <div className="pie-chart procurement-pie"></div>
            <div className="pie-chart-legend">
              {kpiData.procurementData &&
                kpiData.procurementData.map((item) => (
                  <div key={item.name} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                    <span>
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Sales Distribution</h3>
            <p className="card-description">Distribution of sales channels</p>
          </div>
          <div className="card-content">
            <div className="pie-chart sales-distribution-pie"></div>
            <div className="pie-chart-legend">
              {kpiData.creditSales &&
                kpiData.creditSales.map((item) => (
                  <div key={item.name} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: item.color }}></span>
                    <span>
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Branch Comparison */}
      <div className="card-grid branch">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Branch Comparison</h3>
            <p className="card-description">Performance metrics across branches</p>
          </div>
          <div className="card-content">
            <div className="branch-grid">
              {kpiData.branchComparisonData && kpiData.branchComparisonData.length >= 2 ? (
                <>
                  <div className="branch-section">
                    <p className="branch-title">{kpiData.branchComparisonData[0].name}</p>
                    <div className="branch-metric">
                      <span>Sales:</span>
                      <span className="branch-metric-value">
                        ${((kpiData.branchComparisonData[0].sales || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="branch-metric">
                      <span>Profit:</span>
                      <span className="branch-metric-value">
                        ${((kpiData.branchComparisonData[0].profit || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="branch-metric">
                      <span>Stock Turnover:</span>
                      <span className="branch-metric-value">
                        {(kpiData.branchComparisonData[0].stockTurnover || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="branch-metric">
                      <span>Credit Sales:</span>
                      <span className="branch-metric-value">
                        ${((kpiData.branchComparisonData[0].creditSales || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                  <div className="branch-section">
                    <p className="branch-title">{kpiData.branchComparisonData[1].name}</p>
                    <div className="branch-metric">
                      <span>Sales:</span>
                      <span className="branch-metric-value">
                        ${((kpiData.branchComparisonData[1].sales || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="branch-metric">
                      <span>Profit:</span>
                      <span className="branch-metric-value">
                        ${((kpiData.branchComparisonData[1].profit || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="branch-metric">
                      <span>Stock Turnover:</span>
                      <span className="branch-metric-value">
                        {(kpiData.branchComparisonData[1].stockTurnover || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="branch-metric">
                      <span>Credit Sales:</span>
                      <span className="branch-metric-value">
                        ${((kpiData.branchComparisonData[1].creditSales || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                  </div>
                  {topBranch && (
                    <>
                      <div className="branch-divider"></div>
                      <div className="top-branch">
                        <p className="top-branch-title">Top Performing Branch: {topBranch.name}</p>
                        <div className="top-branch-metrics">
                          <p>
                            Higher sales by $
                            {(
                              (topBranch.sales -
                                (topBranch.name === kpiData.branchComparisonData[0].name
                                  ? kpiData.branchComparisonData[1].sales
                                  : kpiData.branchComparisonData[0].sales)) /
                              1000
                            ).toFixed(0)}
                            K
                          </p>
                          <p>
                            Higher profit by $
                            {(
                              (topBranch.profit -
                                (topBranch.name === kpiData.branchComparisonData[0].name
                                  ? kpiData.branchComparisonData[1].profit
                                  : kpiData.branchComparisonData[0].profit)) /
                              1000
                            ).toFixed(0)}
                            K
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="no-data">Not enough branch data available for comparison</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
