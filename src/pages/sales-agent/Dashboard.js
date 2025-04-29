"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../auth/AuthContext"
import axios from "axios"
import "./SalesAgentDashboard.css"

export default function SalesAgentDashboard() {
  const { branchId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stock, setStock] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [branch, setBranch] = useState(null)

  useEffect(() => {
    // Verify user is logged in
    if (!user) return

    // Verify agent has access to this branch
    if (user.role !== "sales_agent" && user.role !== "manager" && user.role !== "ceo") {
      setError("Unauthorized access")
      setLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch branch details
        const branchResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/branches/${branchId}`)
        setBranch(branchResponse.data)

        // Fetch stock
        const stockResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/stock?branchId=${branchId}`)
        setStock(stockResponse.data)

        // Fetch recent activity (combine sales and procurements)
        const salesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/sales?branchId=${branchId}`)
        const procurementsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/procurements?branchId=${branchId}`,
        )

        // Filter only this agent's activity if they're a sales agent
        let filteredSales = salesResponse.data
        let filteredProcurements = procurementsResponse.data

        if (user.role === "sales_agent") {
          filteredSales = salesResponse.data.filter((sale) => sale.agentId === user.id)
          filteredProcurements = procurementsResponse.data.filter((proc) => proc.recordedBy === user.id)
        }

        // Combine and sort by date
        const combinedActivity = [
          ...filteredSales.map((sale) => ({
            ...sale,
            type: "sale",
            date: new Date(sale.createdAt),
          })),
          ...filteredProcurements.map((proc) => ({
            ...proc,
            type: "procurement",
            date: new Date(proc.createdAt),
          })),
        ]
          .sort((a, b) => b.date - a.date)
          .slice(0, 5) // Get only the 5 most recent activities

        setRecentActivity(combinedActivity)
        setLoading(false)
      } catch (err) {
        console.error("Dashboard data fetch error:", err)
        setError(err.response?.data?.message || "Failed to fetch dashboard data")
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Set up polling to refresh data every 5 minutes
    const intervalId = setInterval(fetchDashboardData, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [branchId, user])

  if (!user) return <div className="unauthorized">Please log in</div>
  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="sales-agent-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>{branch?.name || branchId} Branch - Sales Agent Portal</h1>
          <p>Welcome, {user.name}</p>
        </div>

        <div className="action-buttons">
          <ActionButton
            title="Record New Sale"
            description="Cash or credit transaction"
            icon="💰"
            onClick={() => navigate(`/sales-agent/${branchId}/new-sale`)}
            color="green"
          />
          <ActionButton
            title="Record Procurement"
            description="New produce purchases"
            icon="🛒"
            onClick={() => navigate(`/sales-agent/${branchId}/procurement`)}
            color="blue"
          />
          <ActionButton
            title="Credit Sales"
            description="Manage pending payments"
            icon="📝"
            onClick={() => navigate(`/sales-agent/${branchId}/credit-sales`)}
            color="purple"
          />
        </div>

        <div className="stock-card">
          <h2>Current Stock</h2>
          <StockAlert stock={stock} threshold={10} />
          <div className="stock-table-container">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Produce</th>
                  <th>Type</th>
                  <th>Tonnage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stock.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      No stock available
                    </td>
                  </tr>
                ) : (
                  stock.map((item) => (
                    <tr key={item.id}>
                      <td>{item.produceName}</td>
                      <td>{item.produceType || "N/A"}</td>
                      <td>{item.tonnage.toFixed(2)} tons</td>
                      <td>
                        <span
                          className={`stock-status ${item.tonnage < 5 ? "low" : item.tonnage < 10 ? "medium" : "good"}`}
                        >
                          {item.tonnage < 5 ? "Low" : item.tonnage < 10 ? "Medium" : "Good"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="activity-card">
          <h2>Your Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="no-data">No recent activity</p>
          ) : (
            <div className="activity-list">
              {recentActivity.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>{activity.type === "sale" ? "💰" : "🛒"}</div>
                  <div className="activity-details">
                    <h4>
                      {activity.type === "sale"
                        ? `Sold ${activity.tonnage.toFixed(2)} tons of ${activity.produceName}`
                        : `Procured ${activity.tonnage.toFixed(2)} tons of ${activity.produceName}`}
                    </h4>
                    <p>
                      {activity.type === "sale"
                        ? `UGX ${Number(activity.amount).toLocaleString()} - ${
                            activity.isCredit ? "Credit" : "Cash"
                          } sale to ${activity.buyerName}`
                        : `UGX ${Number(activity.cost).toLocaleString()} - From ${activity.dealerName}`}
                    </p>
                    <span className="activity-date">{activity.date.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ActionButton({ title, description, icon, onClick, color }) {
  return (
    <button onClick={onClick} className={`action-button ${color}`}>
      <div className="button-content">
        <span className="button-icon">{icon}</span>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </button>
  )
}

function StockAlert({ stock, threshold }) {
  const lowStockItems = stock.filter((item) => item.tonnage < threshold)

  if (lowStockItems.length === 0) {
    return <p className="stock-status-message good">All stock levels are good</p>
  }

  return (
    <div className="stock-alert">
      <p className="stock-status-message warning">
        <span className="alert-icon">⚠️</span> Low stock alert: {lowStockItems.length} items below threshold
      </p>
      <ul className="low-stock-list">
        {lowStockItems.map((item) => (
          <li key={item.id}>
            {item.produceName}: <strong>{item.tonnage.toFixed(2)} tons</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
