import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { Download, TrendingUp, RefreshCcw, ShoppingBag, XCircle } from 'lucide-react';
import * as salesService from '../../services/salesService'; 

const SalesReport = () => {
  const [reportData, setReportData] = useState({ 
    summary: { 
        totalOrders: 0, 
        grossSales: 0, 
        totalSales: 0, 
        netSales: 0, 
        totalRefunds: 0, 
        totalDiscount: 0, 
        cancelledOrders: 0 
    }, 
    orders: [] 
  });
  
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
        query = `?period=custom&from=${customDates.from}&to=${customDates.to}`;
      }
      
      const response = await salesService.getSalesReport(query);
      if(response && response.data) {
          setReportData(response.data);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to fetch report");
    }
    setLoading(false);
  };

  // --- PDF DOWNLOAD (Updated to show Products) ---
  const downloadPDF = () => {
    if (!reportData.orders || reportData.orders.length === 0) return toast.error("No data available");

    const doc = new jsPDF();
    doc.text('Sales Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Period: ${filterType.toUpperCase()} | Generated: ${new Date().toLocaleDateString()}`, 14, 22);
    
    // 👇 Updated Column Header
    const tableColumn = ["Date", "Products", "Customer", "Status", "Amount", "Pay Status"];
    
    const tableRows = reportData.orders.map(order => {
      // 👇 Create a string of product names for the PDF
      const productNames = order.items.map(item => `${item.name} (x${item.quantity})`).join(", ");
      
      return [
        new Date(order.createdAt).toLocaleDateString(),
        productNames, // Show names instead of ID
        order.user?.firstName || 'Guest',
        order.status,
        order.totalAmount,
        order.payment?.status
      ];
    });

    autoTable(doc, { 
      head: [tableColumn], 
      body: tableRows, 
      startY: 30,
      styles: { fontSize: 8 }, // Smaller font to fit product names
      columnStyles: { 1: { cellWidth: 60 } } // Give more width to Product column
    });
    doc.save(`sales_report_${filterType}.pdf`);
  };

  // --- EXCEL DOWNLOAD (Updated to show Products) ---
  const downloadExcel = () => {
    if (!reportData.orders || reportData.orders.length === 0) return toast.error("No data available");

    const ordersSheet = XLSX.utils.json_to_sheet(reportData.orders.map(order => ({
      Date: new Date(order.createdAt).toLocaleDateString(),
      // 👇 Join product names with commas
      Products: order.items.map(i => `${i.name} (x${i.quantity})`).join(", "), 
      Customer: order.user?.email || 'Guest',
      Status: order.status,
      TotalAmount: order.totalAmount,
      PaymentStatus: order.payment?.status || 'Pending'
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ordersSheet, "Orders");
    XLSX.writeFile(workbook, `sales_report_${filterType}.xlsx`);
  };

  const getRevenue = () => reportData.summary.grossSales || reportData.summary.totalSales || 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Sales Dashboard</h1>
        
        <div className="flex gap-3">
            <button onClick={downloadPDF} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium">
                <Download size={16} /> PDF
            </button>
            <button onClick={downloadExcel} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm font-medium">
                <Download size={16} /> Excel
            </button>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-8 flex flex-wrap gap-4 items-end border border-gray-100">
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Period</label>
           <select 
             value={filterType} 
             onChange={(e) => setFilterType(e.target.value)}
             className="border border-gray-300 rounded-lg px-4 py-2 bg-white min-w-[150px] focus:ring-2 focus:ring-blue-500 outline-none"
           >
             <option value="daily">Today</option>
             <option value="weekly">Last 7 Days</option>
             <option value="monthly">This Month</option>
             <option value="yearly">This Year</option>
             <option value="custom">Custom Range</option>
           </select>
        </div>

        {filterType === 'custom' && (
          <div className="flex items-end gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">From</label>
              <input type="date" onChange={(e) => setCustomDates({...customDates, from: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">To</label>
              <input type="date" onChange={(e) => setCustomDates({...customDates, to: e.target.value})} className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <button onClick={fetchSalesData} className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 text-sm font-bold">Apply</button>
          </div>
        )}
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Gross Sales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 h-full w-1 bg-blue-500"></div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition"><TrendingUp size={20} /></div>
             <span className="text-sm font-semibold text-gray-500">Gross Sales</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">₹{getRevenue()}</h2>
        </div>

        {/* Net Sales */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition"><ShoppingBag size={20} /></div>
             <span className="text-sm font-semibold text-gray-500">Net Sales</span>
          </div>
          <h2 className="text-3xl font-bold text-green-600">₹{reportData.summary.netSales || 0}</h2>
        </div>

        {/* Refunds */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 h-full w-1 bg-orange-500"></div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:scale-110 transition"><RefreshCcw size={20} /></div>
             <span className="text-sm font-semibold text-gray-500">Refunds</span>
          </div>
          <h2 className="text-3xl font-bold text-orange-600">₹{reportData.summary.totalRefunds || 0}</h2>
        </div>

        {/* Cancelled */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 h-full w-1 bg-red-500"></div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-red-50 text-red-600 rounded-lg group-hover:scale-110 transition"><XCircle size={20} /></div>
             <span className="text-sm font-semibold text-gray-500">Cancelled Orders</span>
          </div>
          <h2 className="text-3xl font-bold text-red-600">{reportData.summary.cancelledOrders || 0}</h2>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <h3 className="font-bold text-gray-700">Detailed Transaction History</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              {/* 👇 Changed Header from Order ID to Products */}
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/3">Products</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reportData.orders.length > 0 ? (
              reportData.orders.map((order) => {
                const isCancelled = ['Cancelled', 'Returned'].includes(order.status);
                const rowClass = isCancelled ? 'bg-red-50/60' : 'hover:bg-gray-50';

                return (
                  <tr key={order._id} className={`transition ${rowClass}`}>
                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                    
                    {/* 👇 Changed to display Product Names */}
                    <td className="p-4">
                        <div className="flex flex-col gap-1">
                            {order.items.map((item, index) => (
                                <div key={index} className="text-xs font-medium text-gray-800 border-l-2 border-gray-300 pl-2">
                                    <span className="line-clamp-1" title={item.name}>
                                        {item.name} <span className="text-gray-500">x{item.quantity}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </td>

                    <td className="p-4 text-sm text-gray-700 font-medium">{order.user?.firstName || 'Guest'}</td>
                    
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border
                          ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : 
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                            order.status === 'Returned' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${isCancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            ₹{order.totalAmount}
                        </span>
                        {isCancelled && <span className="text-[10px] text-red-500 font-bold">Ref: ₹{order.totalAmount}</span>}
                        {!isCancelled && order.discount > 0 && <span className="text-[10px] text-green-600">Disc: -₹{order.discount}</span>}
                      </div>
                    </td>

                    <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                              order.payment?.status === 'paid' ? 'bg-green-500' :
                              order.payment?.status === 'refunded' ? 'bg-orange-500' : 'bg-gray-300'
                          }`}></span>
                          <span className="text-xs font-medium text-gray-600 uppercase">
                              {order.payment?.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 ml-4 capitalize">{order.payment?.method}</div>
                    </td>
                  </tr>
                );
              })
            ) : (
               <tr><td colSpan="6" className="p-12 text-center text-gray-400 italic">No sales records found for this period.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesReport;