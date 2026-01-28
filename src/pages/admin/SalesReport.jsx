import React, { useState, useEffect, useMemo } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { Download, TrendingUp, RefreshCcw, ShoppingBag, XCircle, Package, CreditCard, BarChart3 } from 'lucide-react';
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

  // Calculate Product & Order Statistics on the Client Side ---
  const stats = useMemo(() => {
    const orders = reportData.orders || [];
    const productMap = {};
    let totalItemsSold = 0;

    orders.forEach(order => {
        // Skip cancelled orders for product stats if desired
        if (order.status === 'Cancelled') return;

        order.items.forEach(item => {
            totalItemsSold += item.quantity;
            if (productMap[item.name]) {
                productMap[item.name].qty += item.quantity;
                productMap[item.name].revenue += (item.price || 0) * item.quantity; 
            } else {
                productMap[item.name] = {
                    qty: item.quantity,
                    revenue: (item.price || 0) * item.quantity
                };
            }
        });
    });

   
    const topProducts = Object.entries(productMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5); // Get top 5

    const averageOrderValue = reportData.summary.totalOrders > 0 
        ? (reportData.summary.netSales / reportData.summary.totalOrders) 
        : 0;

    return { totalItemsSold, topProducts, averageOrderValue };
  }, [reportData]);

  //  PDF DOWNLOAD 

  const downloadPDF = () => {
    if (!reportData.orders || reportData.orders.length === 0) return toast.error("No data available");

    const doc = new jsPDF();
    
   
    let dateText = filterType.toUpperCase();
    if (filterType === 'custom' && customDates.from && customDates.to) {
        const fromDate = new Date(customDates.from).toLocaleDateString();
        const toDate = new Date(customDates.to).toLocaleDateString();
        dateText = `${fromDate} to ${toDate}`;
    }

   
    doc.setFontSize(18);
    doc.text('Sales Report', 14, 15);
    
    doc.setFontSize(10);
    doc.setTextColor(100); 
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`Period: ${dateText}`, 14, 27);

   
    doc.setTextColor(0); 
    doc.setFontSize(11); 
    
    
    doc.text(`Total Orders: ${reportData.summary.totalOrders}`, 14, 40);
    doc.text(`Total Cancelled: ${reportData.summary.cancelledOrders}`, 14, 46);
    doc.text(`Total Refunds: ${reportData.summary.totalRefunds}`, 14, 52);


    doc.text(`Total Revenue (Gross): ${reportData.summary.grossSales}`, 100, 40);
    doc.text(`Total Collected (Net): ${reportData.summary.netSales}`, 100, 46);
    doc.text(`Avg Order Value: ${stats.averageOrderValue?.toFixed(2) || 0}`, 100, 52);

 
    doc.setDrawColor(200);
    doc.line(14, 58, 196, 58);

    const tableColumn = ["Date", "Products", "Customer", "Status", "Amount", "Pay Status"];
    const tableRows = reportData.orders.map(order => {
      const productNames = order.items.map(item => `${item.name} (x${item.quantity})`).join(", ");
      return [
        new Date(order.createdAt).toLocaleDateString(),
        productNames,
        order.user?.firstName || 'Guest',
        order.status,
        order.totalAmount,
        order.payment?.status
      ];
    });

    autoTable(doc, { 
      head: [tableColumn], 
      body: tableRows, 
      startY: 65,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }, 
      columnStyles: { 1: { cellWidth: 50 } }
    });

    doc.save(`sales_report_${filterType}.pdf`);
  };

  //  EXCEL DOWNLOAD 
  const downloadExcel = () => {
    if (!reportData.orders || reportData.orders.length === 0) return toast.error("No data available");

    // 1. Summary Sheet
    const summaryData = [
        { Metric: "Total Gross Revenue", Value: reportData.summary.grossSales },
        { Metric: "Total Net Collected", Value: reportData.summary.netSales },
        { Metric: "Total Refunds", Value: reportData.summary.totalRefunds },
        { Metric: "Total Items Sold", Value: stats.totalItemsSold },
        { Metric: "Average Order Value", Value: stats.averageOrderValue.toFixed(2) },
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);

    // 2. Orders Sheet
    const ordersSheet = XLSX.utils.json_to_sheet(reportData.orders.map(order => ({
      Date: new Date(order.createdAt).toLocaleDateString(),
      Products: order.items.map(i => `${i.name} (x${i.quantity})`).join(", "), 
      Customer: order.user?.email || 'Guest',
      Status: order.status,
      TotalAmount: order.totalAmount,
      PaymentStatus: order.payment?.status || 'Pending'
    })));

    // 3. Top Products Sheet
    const productsSheet = XLSX.utils.json_to_sheet(stats.topProducts);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
    XLSX.utils.book_append_sheet(workbook, ordersSheet, "Orders");
    XLSX.utils.book_append_sheet(workbook, productsSheet, "Top Products");
    XLSX.writeFile(workbook, `sales_report_${filterType}.xlsx`);
  };

  const getRevenue = () => reportData.summary.grossSales || reportData.summary.totalSales || 0;

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Sales Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of your store's performance</p>
        </div>
        
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

      {/*  FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Gross Revenue */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 h-full w-1 bg-blue-500"></div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={20} /></div>
             <span className="text-sm font-semibold text-gray-500">Total Revenue (Gross)</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">₹{getRevenue()}</h2>
          <p className="text-xs text-gray-400 mt-1">Before deductions</p>
        </div>

        {/* Net Collected */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 h-full w-1 bg-green-500"></div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ShoppingBag size={20} /></div>
             <span className="text-sm font-semibold text-gray-500">Total Collected (Net)</span>
          </div>
          <h2 className="text-3xl font-bold text-green-600">₹{reportData.summary.netSales || 0}</h2>
          <p className="text-xs text-gray-400 mt-1">Cash in hand</p>
        </div>

        {/* Avg Order Value (New) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 h-full w-1 bg-purple-500"></div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><CreditCard size={20} /></div>
             <span className="text-sm font-semibold text-gray-500">Avg. Order Value</span>
          </div>
          <h2 className="text-3xl font-bold text-purple-600">₹{stats.averageOrderValue.toFixed(0)}</h2>
          <p className="text-xs text-gray-400 mt-1">Per successful order</p>
        </div>

        {/* Total Refunds */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition">
          <div className="absolute right-0 top-0 h-full w-1 bg-orange-500"></div>
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><RefreshCcw size={20} /></div>
             <span className="text-sm font-semibold text-gray-500">Total Refunds</span>
          </div>
          <h2 className="text-3xl font-bold text-orange-600">₹{reportData.summary.totalRefunds || 0}</h2>
          <p className="text-xs text-gray-400 mt-1">Reversed transactions</p>
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