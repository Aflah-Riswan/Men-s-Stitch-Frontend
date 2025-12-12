
import React, { useEffect } from 'react';



import { Search, Filter, ArrowUpDown } from 'lucide-react';
import StatusCard from '../../../Components/StatusCard';


// 3. Mock Data
const tableData = [
  { id: '#CUST001', name: 'John Doe', phone: '+1234567890', orders: 25, spend: '3,450.00', status: 'Active' },
  { id: '#CUST002', name: 'Jane Smith', phone: '+1234567890', orders: 25, spend: '3,450.00', status: 'Active' },
  { id: '#CUST003', name: 'Bob Johnson', phone: '+1234567890', orders: 25, spend: '3,450.00', status: 'Active' },
  { id: '#CUST004', name: 'Alice Brown', phone: '+1234567890', orders: 25, spend: '3,450.00', status: 'Active' },
  { id: '#CUST005', name: 'Charlie Davis', phone: '+1234567890', orders: 5, spend: '250.00', status: 'blocked' },
  { id: '#CUST006', name: 'Emily Davis', phone: '+1234567890', orders: 30, spend: '4,600.00', status: 'blocked' },
  { id: '#CUST007', name: 'Jane Smith', phone: '+1234567890', orders: 5, spend: '250.00', status: 'blocked' },
  { id: '#CUST008', name: 'John Doe', phone: '+1234567890', orders: 25, spend: '3,450.00', status: 'Active' },
];

export default function Customers() {

  useEffect(()=>{
    
  })
  return (
    // Main Content Area - Assuming this sits next to your sidebar
    <div className="flex-1 bg-[#f8f9fc] min-h-screen p-8 font-sans">

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Customers</h1>

      {/* Top Section: Stats & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Left Column: Vertical Stack of Stats Cards */}
        <div className="flex flex-col justify-between gap-6 lg:col-span-1">
          {/* Card 1 */}
          <StatusCard
            title="Total Customers"
            value="11,040"
            change="+14.4%"
            isPositive={true}
          />
          {/* Card 2 */}
          <StatusCard
            title="New Customers"
            value="2,370"
            change="+20%"
            isPositive={true}
          />
          {/* Card 3 */}
          <StatusCard
            title="Visitor"
            value="250k"
            change="+20%"
            isPositive={true}
          />
        </div>

        {/* Right Column: Customer Overview Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">


          

        </div>
      </div>

      {/* Bottom Section: Customer List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-800">Customer List</h3>

          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search user"
                className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-gray-300 w-64"
              />
            </div>

            {/* Action Buttons */}
            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#eafbf2] text-slate-600 text-sm font-semibold">
                <th className="py-4 px-4 rounded-l-xl">Customer Id</th>
                <th className="py-4 px-4">Name</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4 text-center">Order Count</th>
                <th className="py-4 px-4">Total Spend</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-600">
              {tableData.map((user, index) => (
                <tr key={index} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-800">{user.id}</td>
                  <td className="py-4 px-4">{user.name}</td>
                  <td className="py-4 px-4">{user.phone}</td>
                  <td className="py-4 px-4 text-center">{user.orders}</td>
                  <td className="py-4 px-4">{user.spend}</td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center gap-2 font-medium ${user.status === 'Active' ? 'text-green-600' :
                        user.status === 'blocked' ? 'text-red-500' : 'text-orange-400'
                      }`}>
                      <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' :
                          user.status === 'blocked' ? 'bg-red-500' : 'bg-orange-400'
                        }`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <ToggleSwitch isBlocked={user.status === 'blocked'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}




// 2. Custom Toggle Switch (Matches Image Design)
function ToggleSwitch({ isBlocked }) {
  return (
    <button className={`relative w-16 h-7 rounded-full transition-colors flex items-center px-1 ${isBlocked ? 'bg-red-500' : 'bg-gray-200'
      }`}>
      {/* Circle */}
      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isBlocked ? 'translate-x-9' : 'translate-x-0'
        }`}></div>

      {/* Text Label inside Toggle */}
      <span className={`absolute text-[9px] font-bold ${isBlocked ? 'left-2 text-white' : 'right-2 text-gray-500'
        }`}>
        {isBlocked ? '' : 'BLOCK'}
      </span>
    </button>
  );
}

