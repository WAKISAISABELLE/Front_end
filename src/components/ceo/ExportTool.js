// import { utils, writeFile } from "xlsx"
// import { jsPDF } from "jspdf"
// import "jspdf-autotable"

// export const exportToPDF = (kpiData) => {
//   const doc = new jsPDF()

//   doc.setFontSize(20)
//   doc.text("GCDL Executive Dashboard", 20, 20)

//   // Summary Section
//   doc.setFontSize(16)
//   doc.text("Key Performance Indicators", 20, 35)

//   doc.autoTable({
//     startY: 40,
//     head: [["Metric", "Value"]],
//     body: [
//       ["Total Sales", `UGX ${kpiData.summary.totalSales.toLocaleString()}`],
//       ["Procurement", `UGX ${kpiData.summary.totalProcurement.toLocaleString()}`],
//       ["Profit Margin", `${kpiData.summary.profitMargin}%`],
//       ["Stock Turnover", kpiData.summary.stockTurnover.toFixed(1)],
//     ],
//     theme: "grid",
//     styles: { fontSize: 12 },
//   })

//   // Branch Comparison
//   doc.setFontSize(16)
//   doc.text("Branch Comparison", 20, doc.autoTable.previous.finalY + 15)

//   const branchData = [
//     ["Metric", "Branch A", "Branch B"],
//     [
//       "Sales",
//       `UGX ${kpiData.branchComparisonData[0].sales.toLocaleString()}`,
//       `UGX ${kpiData.branchComparisonData[1].sales.toLocaleString()}`,
//     ],
//     [
//       "Profit",
//       `UGX ${kpiData.branchComparisonData[0].profit.toLocaleString()}`,
//       `UGX ${kpiData.branchComparisonData[1].profit.toLocaleString()}`,
//     ],
//     [
//       "Stock Turnover",
//       kpiData.branchComparisonData[0].stockTurnover.toFixed(1),
//       kpiData.branchComparisonData[1].stockTurnover.toFixed(1),
//     ],
//     [
//       "Credit Sales",
//       `UGX ${kpiData.branchComparisonData[0].creditSales.toLocaleString()}`,
//       `UGX ${kpiData.branchComparisonData[1].creditSales.toLocaleString()}`,
//     ],
//   ]

//   doc.autoTable({
//     startY: doc.autoTable.previous.finalY + 20,
//     head: [branchData[0]],
//     body: branchData.slice(1),
//     theme: "grid",
//     styles: { fontSize: 12 },
//   })

//   // Sales Trend
//   doc.addPage()
//   doc.setFontSize(16)
//   doc.text("Sales Trend", 20, 20)

//   const salesTrendData = kpiData.salesTrend.map((item) => [item.month, `UGX ${item.sales.toLocaleString()}`])

//   doc.autoTable({
//     startY: 25,
//     head: [["Month", "Sales"]],
//     body: salesTrendData,
//     theme: "grid",
//     styles: { fontSize: 12 },
//   })

//   doc.save("gcdl-executive-report.pdf")
// }

// export const exportToExcel = (kpiData) => {
//   // Create Summary Sheet
//   const summarySheet = utils.json_to_sheet([
//     { Metric: "Total Sales", Value: kpiData.summary.totalSales },
//     { Metric: "Procurement", Value: kpiData.summary.totalProcurement },
//     { Metric: "Profit Margin", Value: `${kpiData.summary.profitMargin}%` },
//     { Metric: "Stock Turnover", Value: kpiData.summary.stockTurnover },
//   ])

//   // Create Sales Trend Sheet
//   const salesSheet = utils.json_to_sheet(
//     kpiData.salesTrend.map((item) => ({
//       Month: item.month,
//       "Sales (UGX)": item.sales,
//     })),
//   )

//   // Create Branch Comparison Sheet
//   const branchComparisonData = [
//     {
//       Metric: "Sales",
//       "Branch A": kpiData.branchComparisonData[0].sales,
//       "Branch B": kpiData.branchComparisonData[1].sales,
//     },
//     {
//       Metric: "Profit",
//       "Branch A": kpiData.branchComparisonData[0].profit,
//       "Branch B": kpiData.branchComparisonData[1].profit,
//     },
//     {
//       Metric: "Stock Turnover",
//       "Branch A": kpiData.branchComparisonData[0].stockTurnover,
//       "Branch B": kpiData.branchComparisonData[1].stockTurnover,
//     },
//     {
//       Metric: "Credit Sales",
//       "Branch A": kpiData.branchComparisonData[0].creditSales,
//       "Branch B": kpiData.branchComparisonData[1].creditSales,
//     },
//   ]

//   const branchSheet = utils.json_to_sheet(branchComparisonData)

//   // Create workbook and add sheets
//   const wb = utils.book_new()
//   utils.book_append_sheet(wb, summarySheet, "Summary")
//   utils.book_append_sheet(wb, salesSheet, "Sales Trend")
//   utils.book_append_sheet(wb, branchSheet, "Branch Comparison")

//   writeFile(wb, "gcdl-executive-report.xlsx")
// }


 
