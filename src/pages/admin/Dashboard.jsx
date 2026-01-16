import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import axiosInstance from '../../utils/axiosInstance'; 
import { useDispatch } from 'react-redux';
import { setLogout } from '../../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/admin/dashboard-stats');
        if (response.data.success) {
          setDashboardData(response.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

const handleLogout = () =>{
  console.log("clicked")
  dispatch(setLogout())
  navigate('/admin/login')
}

  // --- Helper to map Stat Titles to Icons ---
  const getIconForTitle = (title) => {
    switch (title) {
      case 'Total Revenue': return DollarSign;
      case 'Total Orders': return ShoppingBag;
      case 'Total Products': return Package;
      case 'Total Users': return Users;
      default: return TrendingUp;
    }
  };

  // --- Helper to map Stat Titles to Colors ---
  const getColorForTitle = (title) => {
    switch (title) {
      case 'Total Revenue': return 'bg-green-100 text-green-600';
      case 'Total Orders': return 'bg-blue-100 text-blue-600';
      case 'Total Products': return 'bg-orange-100 text-orange-600';
      case 'Total Users': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader className="animate-spin text-blue-600" size={32} />
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-10 text-center text-red-500 bg-gray-50 min-h-screen">
        <p className="font-bold text-lg">{error || "Something went wrong"}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50"
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, salesData, topProducts, recentOrders } = dashboardData;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* 1. HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
        <button onClick={()=>handleLogout()}>Logout</button>
      </div>

      {/* 2. STATS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = getIconForTitle(stat.title);
          const colorClass = getColorForTitle(stat.title);

          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.type === 'money' ? `₹${stat.value.toLocaleString()}` : stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClass}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm">
                <span className={`flex items-center font-medium ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {stat.change}
                </span>
                <span className="text-gray-400">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Main Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Revenue Analytics</h3>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Last 7 Days</span>
          </div>
          
          <div className="h-[300px]">
            {salesData && salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6B7280', fontSize: 12}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6B7280', fontSize: 12}} 
                    tickFormatter={(value) => `₹${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', color: '#fff', borderRadius: '8px', border: 'none' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#000" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#000', strokeWidth: 2, stroke: '#fff'}} 
                    activeDot={{r: 6}} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                No sales data for this period
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 max-h-[300px] scrollbar-thin">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.totalSold} sold</p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm text-gray-900">₹{product.revenue.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-10">No top products yet.</p>
            )}
          </div>
        </div>

      </div>

      {/* 4. RECENT ORDERS TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{order.user?.firstName || 'Guest'}</span>
                        <span className="text-xs text-gray-500">{order.user?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ₹{order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                          'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">No recent orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;