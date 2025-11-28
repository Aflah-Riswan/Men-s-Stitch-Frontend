
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../../redux/slice/authSlice';



const DashboardDesign = () => {
 const dispatch = useDispatch()

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Shopify</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Free</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main menu</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center px-4 py-3 bg-black text-white rounded-lg font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Order Management
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Customers
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                  Coupons
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Transaction
                </a>
              </li>
            </ul>
          </div>
          <div className="px-4 py-2 mt-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Product</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  Add Products
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                  Product List
                </a>
              </li>
            </ul>
          </div>
          <div className="px-4 py-2 mt-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Admin</h2>
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Admin role
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Inbox
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/150?img=3" alt="Mark" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Mark</p>
              <p className="text-xs text-gray-500">Mark@thedeveloper...</p>
            </div>
          </div>
          <a href="#" className="flex items-center mt-4 text-sm font-medium text-gray-700 hover:text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Visit store
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
        </header>
        <button onClick={()=>dispatch(setLogout())}>Logout</button>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Overview</h3>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Total Sales Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Total Sales</h4>
              <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">₹65,805</span>
                <span className="ml-2 text-sm text-gray-500">Sales</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                Previous 7days <span className="text-blue-500 ml-1 font-medium"> (₹59,224)</span>
              </p>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Total Orders</h4>
              <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">10.7K</span>
                <span className="ml-2 text-sm text-gray-500">order</span>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center">
                Previous 7days <span className="text-blue-500 ml-1 font-medium"> (7.6k)</span>
              </p>
            </div>

            {/* Pending & Canceled Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Pending & Canceled</h4>
              <p className="text-xs text-gray-400 mb-4">Last 7 days</p>
              <div className="flex space-x-8">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-green-600">509</span>
                    <span className="ml-2 text-sm text-green-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12 7a1 1 0 10-2 0v2a1 1 0 102 0V7zM8 7a1 1 0 10-2 0v2a1 1 0 102 0V7z" clipRule="evenodd" /><path fillRule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm9 12H6a1 1 0 01-1-1V6a1 1 0 011-1h8a1 1 0 011 1v8a1 1 0 01-1 1z" clipRule="evenodd" /></svg>
                      <span className="font-medium">+204</span>
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Canceled</p>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-red-600">94</span>
                    <span className="ml-2 text-sm text-red-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      <span className="font-medium">+14.4%</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#12545</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Ethan Carter</td>
                  <td className="px-6 py-4 text-sm text-gray-900">$150</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">2023-08-15</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#12546</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Sophia Turner</td>
                  <td className="px-6 py-4 text-sm text-gray-900">$200</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Shipped
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">2023-08-14</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#12547</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Liam Harper</td>
                  <td className="px-6 py-4 text-sm text-gray-900">$100</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Delivered
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">2023-08-13</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#12548</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Olivia Foster</td>
                  <td className="px-6 py-4 text-sm text-gray-900">$250</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">2023-08-12</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#12549</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Noah Brooks</td>
                  <td className="px-6 py-4 text-sm text-gray-900">$180</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Shipped
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">2023-08-11</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              View All Orders
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardDesign;