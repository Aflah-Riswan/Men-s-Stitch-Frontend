import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Or use your axiosInstance
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import * as salesService from '../../services/salesService'

const SalesReport = () => {
  const [reportData, setReportData] = useState({ summary: {}, orders: [] });
  const [filterType, setFilterType] = useState('daily');
  const [customDates, setCustomDates] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    fetchSalesData();
  }, [filterType]); 

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      let query = `?period=${filterType}`;
      if (filterType === 'custom' && customDates.from && customDates.to) {
        query = `?from=${customDates.from}&to=${customDates.to}`;
      }
      
      const response = await salesService.getSalesReport(query)
      console.log(" reponse : ", response.data)
      setReportData(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
    setLoading(false);
  };

  // --- PDF DOWNLOAD LOGIC ---
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Report', 14, 15);
    doc.text(`Period: ${filterType.toUpperCase()}`, 14, 25);
    
    // Summary Table
    doc.text(`Total Sales: Rs.${reportData.summary.totalSales}`, 14, 35);
    doc.text(`Total Discount: Rs.${reportData.summary.totalDiscount}`, 14, 45);

    // Orders Table
    const tableColumn = ["Date", "Order ID", "Customer", "Amount", "Discount"];
    const tableRows = reportData.orders.map(order => [
      new Date(order.createdAt).toLocaleDateString(),
      order.orderId,
      order.user?.firstName || 'Guest',
      order.totalAmount,
      order.discount || 0
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 55,
    });

    doc.save(`sales_report_${filterType}.pdf`);
  };

  // --- EXCEL DOWNLOAD LOGIC ---
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData.orders.map(order => ({
      Date: new Date(order.createdAt).toLocaleDateString(),
      OrderID: order.orderId,
      Customer: order.user?.email,
      TotalAmount: order.totalAmount,
      Discount: order.discount,
      PaymentMethod: order.payment.method
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    XLSX.writeFile(workbook, `sales_report_${filterType}.xlsx`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Sales Report</h1>

      {/* 1. FILTER SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 flex flex-wrap gap-4 items-end">
        <div>
           <label className="block text-sm font-bold mb-2">Filter By</label>
           <select 
             value={filterType} 
             onChange={(e) => setFilterType(e.target.value)}
             className="border rounded px-4 py-2"
           >
             <option value="daily">Daily (Today)</option>
             <option value="weekly">Last 7 Days</option>
             <option value="monthly">This Month</option>
             <option value="yearly">This Year</option>
             <option value="custom">Custom Date Range</option>
           </select>
        </div>

        {/* Custom Date Inputs (Only show if 'custom' is selected) */}
        {filterType === 'custom' && (
          <>
            <div>
              <label className="block text-sm font-bold mb-2">From</label>
              <input type="date" 
                onChange={(e) => setCustomDates({...customDates, from: e.target.value})} 
                className="border rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">To</label>
              <input type="date" 
                onChange={(e) => setCustomDates({...customDates, to: e.target.value})}
                className="border rounded px-4 py-2"
              />
            </div>
            <button 
              onClick={fetchSalesData}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              Apply Filter
            </button>
          </>
        )}
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold">₹{reportData.summary.totalSales || 0}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-gray-500">Total Orders</p>
          <h2 className="text-3xl font-bold">{reportData.summary.totalOrders || 0}</h2>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
          <p className="text-gray-500">Total Discounts Given</p>
          <h2 className="text-3xl font-bold">₹{reportData.summary.totalDiscount || 0}</h2>
        </div>
      </div>

      {/* 3. DOWNLOAD BUTTONS */}
      <div className="flex justify-end gap-4 mb-4">
        <button 
          onClick={downloadPDF}
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-red-700"
        >
          Download PDF
        </button>
        <button 
          onClick={downloadExcel}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          Download Excel
        </button>
      </div>

      {/* 4. DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {reportData.orders.length > 0 ? (
              reportData.orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-mono text-sm">{order.orderId}</td>
                  <td className="p-4">{order.user?.firstName || 'N/A'}</td>
                  <td className="p-4 font-bold">₹{order.totalAmount}</td>
                  <td className="p-4 text-red-500">-₹{order.discount || 0}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
               <tr><td colSpan="6" className="p-8 text-center text-gray-500">No sales found for this period</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;