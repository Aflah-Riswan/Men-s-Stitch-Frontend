import React, { useEffect, useState } from 'react';
import { 
  Users, ShoppingBag, DollarSign, Package, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Loader, Filter, LogOut,
  Calendar, Award, Layers, Zap
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import axiosInstance from '../../utils/axiosInstance'; 
import { useDispatch } from 'react-redux';
import { setLogout } from '../../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('monthly');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#4f46e5'];

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/admin/dashboard-stats?filter=${filter}`);
        if (response.data.success) setDashboardData(response.data);
      } catch (err) { console.error("Fetch error:", err); } 
      finally { setLoading(false); }
    };
    fetchDashboardData();
  }, [filter]);

  const stats = dashboardData?.stats || [];
  const salesData = dashboardData?.salesData || [];
  const topProducts = dashboardData?.topProducts || [];
  const recentOrders = dashboardData?.recentOrders || [];
  const topCategories = dashboardData?.topCategories || [];

  if (loading && !dashboardData) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <Loader className="animate-spin text-blue-600 mb-4 mx-auto" size={40} />
          <p className="text-slate-500 font-medium animate-pulse">Analyzing store metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Store Insights</h1>
          <p className="text-slate-500 flex items-center gap-2 mt-1 italic">
            <Calendar size={14} /> Global performance overview: <span className="text-blue-600 font-semibold uppercase">{filter}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="weekly">Weekly View</option>
              <option value="monthly">Monthly View</option>
              <option value="yearly">Yearly View</option>
            </select>
          </div>
          <button onClick={() => dispatch(setLogout())} className="p-2.5 bg-white border border-slate-200 text-red-500 hover:bg-red-50 rounded-xl shadow-sm transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.title}</p>
                <h2 className="text-3xl font-black mt-2 text-slate-800">{s.value.toLocaleString()}</h2>
              </div>
              <div className={`p-3 rounded-xl ${i === 0 ? 'bg-blue-50 text-blue-600' : i === 1 ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                {i === 0 ? <ShoppingBag size={24} /> : i === 1 ? <Package size={24} /> : <Users size={24} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* REVENUE AREA CHART */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={20} /> Revenue Trajectory
          </h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CATEGORY DONUT WITH LEGEND */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
            <Layers className="text-purple-600" size={20} /> Category Split
          </h3>
          <div className="h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topCategories} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" nameKey="_id" stroke="none">
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} Sold`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Total Items</span>
              <span className="text-xl font-black text-slate-800">{topCategories.reduce((acc, curr) => acc + curr.count, 0)}</span>
            </div>
          </div>
          {/* CATEGORY LEGEND */}
          <div className="mt-6 space-y-3 overflow-y-auto max-h-[160px] pr-2 custom-scrollbar">
            {topCategories.map((cat, i) => (
              <div key={i} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-semibold text-slate-600 capitalize group-hover:text-blue-600 transition-colors">
                    {cat._id || 'General'}
                  </span>
                </div>
                <span className="text-xs font-black text-slate-400">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOWER RANKINGS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Award className="text-orange-500" size={22} /> Top Sellers</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600 shadow-sm">{i + 1}</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.totalSold} Sold</p>
                  </div>
                </div>
                <Zap size={16} className="text-orange-400 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 pb-4"><h3 className="text-lg font-bold">Live Activity</h3></div>
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((o, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 text-xs font-mono text-slate-400">{o.orderId}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${o.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-black">₹{o.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;