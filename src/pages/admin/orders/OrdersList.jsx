import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, CheckCircle, Clock, XCircle, Eye, Loader2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import the service we just created
import * as orderService from '../../../services/orderService'; 

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, newOrders: 0, delivered: 0, cancelled: 0 });

  // Filters
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const ITEMS_PER_PAGE = 10;

  // --- 1. Fetch Stats (On Mount) ---
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await orderService.getOrderStats();
        if(data.success) setStats(data.stats);
      } catch (error) {
        console.error("Stats Error", error);
        // Optional: toast.error("Failed to load stats");
      }
    };
    fetchStats();
  }, []);

  // --- 2. Fetch Orders (When filters change) ---
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderService.getAllOrders(currentPage, ITEMS_PER_PAGE, activeTab, search);
        console.log(data)
        if (data.success) {
          setOrders(data.orders);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Fetch Orders Error", error);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    // Debounce: Wait 500ms after user stops typing to call API
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [activeTab, search, currentPage]);

  // --- Helpers ---
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to page 1
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-50 border border-green-100';
      case 'Pending': return 'text-orange-500 bg-orange-50 border border-orange-100';
      case 'Processing': return 'text-blue-500 bg-blue-50 border border-blue-100';
      case 'Cancelled': return 'text-red-500 bg-red-50 border border-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircle size={14} className="mr-1.5" />;
      case 'Pending': return <Clock size={14} className="mr-1.5" />;
      case 'Cancelled': return <XCircle size={14} className="mr-1.5" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 bg-[#f8f9fc] h-full p-6 sm:p-8 font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Order Management</h1>
        <p className="text-sm text-gray-500 mt-1">Dashboard &gt; Order List</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Orders', value: stats.totalOrders, change: 'All Time', isPositive: true },
          { label: 'New Orders (7d)', value: stats.newOrders, change: '+Recent', isPositive: true },
          { label: 'Delivered', value: stats.delivered, change: 'Completed', isNeutral: true },
          { label: 'Cancelled', value: stats.cancelled, change: 'Failed', isPositive: false },
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-500 mb-2">{stat.label}</p>
            <div className="flex items-end gap-3">
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-full mb-1 ${
                stat.isNeutral ? 'text-green-600 bg-green-50' :
                stat.isPositive ? 'text-blue-600 bg-blue-50' : 'text-red-500 bg-red-50'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          
          {/* Tabs */}
          <div className="flex bg-gray-100/50 p-1 rounded-lg overflow-x-auto">
            {['All', 'Delivered', 'Pending', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search ID or Product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-slate-300"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"><Filter size={18} /></button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eafbf2] text-slate-600 text-sm font-semibold">
                <th className="py-4 px-4 rounded-l-xl w-12">SI-No</th>
                <th className="py-4 px-4">Order Id</th>
                <th className="py-4 px-4">Product Info</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 rounded-r-xl">Action</th>
              </tr>
            </thead>
            
            <tbody className="text-sm text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <div className="flex justify-center items-center gap-2 text-gray-500">
                        <Loader2 className="animate-spin" /> Loading orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-10 text-center text-gray-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order , index) => (
                  <tr key={order._id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      {index+1}
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-800">{order.orderId}</td>
                    
                    {/* Product Column - Shows first item image + name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0 border">
                          <img 
                            src={order.items[0]?.image || "https://placehold.co/40"} 
                            alt="Product" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex flex-col">
                            <span className="truncate max-w-[150px] font-medium text-slate-700">
                                {order.items[0]?.name}
                            </span>
                            {order.items.length > 1 && (
                                <span className="text-xs text-gray-400">+{order.items.length - 1} more items</span>
                            )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-800">₹{order.totalAmount}</td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${order.payment.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="font-medium text-slate-700 capitalize">{order.payment.status}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition text-gray-500 hover:text-blue-600">
                              <Eye size={16} />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Page <span className="font-bold">{currentPage}</span> of <span className="font-bold">{totalPages}</span>
          </div>

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}