// API service for dashboard data
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

export const api = {
  // Manager and Branch Info
  getManagerInfo: async (managerId) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${managerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch manager info")
      return response.json()
    } catch (error) {
      console.error("API Error:", error)
      return null
    }
  },

  getBranchByManager: async (managerId) => {
    try {
      const response = await fetch(`${API_URL}/api/branches/manager/${managerId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch branch info")
      return response.json()
    } catch (error) {
      console.error("API Error:", error)
      return null
    }
  },

  // Sales and KPI Data
  getSalesData: async (branchId) => {
    try {
      const response = await fetch(`${API_URL}/api/sales?branchId=${branchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch sales data")

      const salesData = await response.json()

      // Transform the data for the charts
      const monthlyData = {}

      // Group sales by month
      salesData.forEach((sale) => {
        const date = new Date(sale.createdAt)
        const month = date.toLocaleString("default", { month: "short" })

        if (!monthlyData[month]) {
          monthlyData[month] = {
            month,
            sales: 0,
            procurementCost: 0,
            profit: 0,
            stockTurnover: 0,
            profitMargin: 0,
          }
        }

        monthlyData[month].sales += Number(sale.amount)
      })

      // Get procurement data to calculate costs
      try {
        const procResponse = await fetch(`${API_URL}/api/procurements?branchId=${branchId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (procResponse.ok) {
          const procData = await procResponse.json()

          procData.forEach((proc) => {
            const date = new Date(proc.createdAt)
            const month = date.toLocaleString("default", { month: "short" })

            if (!monthlyData[month]) {
              monthlyData[month] = {
                month,
                sales: 0,
                procurementCost: 0,
                profit: 0,
                stockTurnover: 0,
                profitMargin: 0,
              }
            }

            monthlyData[month].procurementCost += Number(proc.cost)
          })
        }
      } catch (error) {
        console.error("Procurement data fetch error:", error)
      }

      // Get stock turnover data
      try {
        const turnoverResponse = await fetch(`${API_URL}/api/stock/turnover?branchId=${branchId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (turnoverResponse.ok) {
          const turnoverData = await turnoverResponse.json()

          turnoverData.stockTurnoverData.forEach((item) => {
            if (monthlyData[item.month]) {
              monthlyData[item.month].stockTurnover = item.stockTurnover
            }
          })
        }
      } catch (error) {
        console.error("Stock turnover data fetch error:", error)
      }

      // Calculate profit and profit margin
      Object.keys(monthlyData).forEach((month) => {
        monthlyData[month].profit = monthlyData[month].sales - monthlyData[month].procurementCost
        monthlyData[month].profitMargin =
          monthlyData[month].sales > 0 ? (monthlyData[month].profit / monthlyData[month].sales) * 100 : 0
      })

      // Convert to array and sort by month
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      return Object.values(monthlyData).sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month))
    } catch (error) {
      console.error("API Error:", error)
      return []
    }
  },

  getKpiData: async (branchId) => {
    try {
      // Get sales analytics
      const salesResponse = await fetch(`${API_URL}/api/sales/analytics?branchId=${branchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Get procurement analytics
      const procResponse = await fetch(`${API_URL}/api/procurements/analytics?branchId=${branchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Get stock turnover
      const turnoverResponse = await fetch(`${API_URL}/api/stock/turnover?branchId=${branchId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const [salesData, procData, turnoverData] = await Promise.all([
        salesResponse.ok ? salesResponse.json() : { totalSales: 0, creditPercentage: 0 },
        procResponse.ok ? procResponse.json() : { totalCost: 0 },
        turnoverResponse.ok ? turnoverResponse.json() : { stockTurnover: 0 },
      ])

      // Calculate sales trend (percentage change)
      let salesTrend = 0
      if (salesData.salesTrend && salesData.salesTrend.length >= 2) {
        const currentSales = salesData.salesTrend[salesData.salesTrend.length - 1].sales
        const previousSales = salesData.salesTrend[salesData.salesTrend.length - 2].sales
        salesTrend = previousSales > 0 ? ((currentSales - previousSales) / previousSales) * 100 : 0
      }

      // Calculate profit margin
      const profitMargin =
        salesData.totalSales > 0 ? ((salesData.totalSales - procData.totalCost) / salesData.totalSales) * 100 : 0

      return {
        salesTrend: Number.parseFloat(salesTrend.toFixed(1)),
        profitMargin: Number.parseFloat(profitMargin.toFixed(1)),
        stockTurnover: Number.parseFloat(turnoverData.stockTurnover.toFixed(1)),
        procurementCost: procData.totalCost,
      }
    } catch (error) {
      console.error("API Error:", error)
      return {
        salesTrend: 0,
        profitMargin: 0,
        stockTurnover: 0,
        procurementCost: 0,
      }
    }
  },

  // CEO Dashboard specific endpoints
  getCEODashboardData: async () => {
    try {
      // Get all branches
      const branchesResponse = await fetch(`${API_URL}/api/branches`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Get branch comparison data
      const comparisonResponse = await fetch(`${API_URL}/api/branches/comparison/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Get company-wide sales analytics
      const salesResponse = await fetch(`${API_URL}/api/sales/analytics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Get company-wide procurement analytics
      const procResponse = await fetch(`${API_URL}/api/procurements/analytics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      const [branches, comparison, salesData, procData] = await Promise.all([
        branchesResponse.ok ? branchesResponse.json() : [],
        comparisonResponse.ok ? comparisonResponse.json() : [],
        salesResponse.ok ? salesResponse.json() : { totalSales: 0, creditPercentage: 0 },
        procResponse.ok ? procResponse.json() : { totalCost: 0 },
      ])

      // Calculate total sales and procurement
      const totalSales = comparison.reduce((sum, branch) => sum + (branch.sales || 0), 0)
      const totalProcurement = comparison.reduce((sum, branch) => sum + (branch.procurement || 0), 0)

      // Calculate profit margin
      const profitMargin = totalSales > 0 ? ((totalSales - totalProcurement) / totalSales) * 100 : 0

      // Calculate average stock turnover
      const avgStockTurnover =
        comparison.length > 0
          ? comparison.reduce((sum, branch) => sum + (branch.stockTurnover || 0), 0) / comparison.length
          : 0

      // Format sales trend data
      const salesTrend = salesData.salesTrend
        ? salesData.salesTrend.map((item) => ({
            month: item.month,
            sales: item.sales || 0,
          }))
        : []

      // Format stock turnover data
      const stockTurnoverData =
        comparison.length > 0
          ? comparison.map((branch) => ({
              month: branch.name,
              turnover: branch.stockTurnover || 0,
            }))
          : []

      // Format credit sales data
      const creditSales = [
        { name: "Cash Sales", value: 100 - (salesData.creditPercentage || 0), color: "#0088FE" },
        { name: "Credit Sales", value: salesData.creditPercentage || 0, color: "#00C49F" },
      ]

      // Format procurement data (mock data for now)
      const procurementData = [
        { name: "Raw Materials", value: 37, color: "#0088FE" },
        { name: "Equipment", value: 23, color: "#00C49F" },
        { name: "Services", value: 19, color: "#FFBB28" },
        { name: "Maintenance", value: 21, color: "#FF8042" },
      ]

      return {
        summary: {
          totalSales,
          totalProcurement,
          profitMargin: Number.parseFloat(profitMargin.toFixed(1)),
          stockTurnover: Number.parseFloat(avgStockTurnover.toFixed(1)),
        },
        salesTrend,
        creditSales,
        procurementData,
        branchComparisonData: comparison.map((branch) => ({
          name: branch.name || "Unknown Branch",
          sales: branch.sales || 0,
          profit: branch.profit || 0,
          customers: branch.customers || 0,
          stockTurnover: branch.stockTurnover || 0,
          creditSales: branch.creditSales || 0,
        })),
        stockTurnoverData,
        profitMarginData: salesTrend.map((item) => ({
          month: item.month,
          margin: 0, // We need to calculate this from the backend
        })),
      }
    } catch (error) {
      console.error("API Error:", error)
      // Return default structure with empty/zero values
      return {
        summary: {
          totalSales: 0,
          totalProcurement: 0,
          profitMargin: 0,
          stockTurnover: 0,
        },
        salesTrend: [],
        creditSales: [
          { name: "Cash Sales", value: 100, color: "#0088FE" },
          { name: "Credit Sales", value: 0, color: "#00C49F" },
        ],
        procurementData: [
          { name: "Raw Materials\", value: 25, color: \"#0088"  },
        ],
        procurementData: [
          { name: "Raw Materials", value: 25, color: "#0088FE" },
          { name: "Equipment", value: 25, color: "#00C49F" },
          { name: "Services", value: 25, color: "#FFBB28" },
          { name: "Maintenance", value: 25, color: "#FF8042" },
        ],
        branchComparisonData: [],
        stockTurnoverData: [],
        profitMarginData: [],
      }
    }
  },
}
