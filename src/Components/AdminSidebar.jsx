

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Ticket, 
  Layers, 
  CreditCard, 
  PlusSquare, 
  List, 
  ShieldCheck, 
  Inbox, 
  ExternalLink, 
  BookOpenCheck
} from 'lucide-react';

const AdminSidebar = () => {
 
  const getLinkClasses = ({ isActive }) => {
    const baseClasses = "flex items-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 mb-1";
    const activeClasses = "bg-black text-white shadow-md";
    const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    

    <aside className="w-75 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      
      {/* --- HEADER --- */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">Shopify</h1>
          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wide">
            Free
          </span>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        
        {/* Section: Main Menu */}
        <div>
          <SectionTitle title="Main menu" />
          <ul>
            <li>
              <NavLink to="/admin/dashboard" className={getLinkClasses}>
                <LayoutDashboard size={20} className="mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/orders" className={getLinkClasses}>
                <ClipboardList size={20} className="mr-3" />
                Order Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/sales-report" className={getLinkClasses}>
                <BookOpenCheck size={20} className="mr-3" />
                Sales Report
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/customers" className={getLinkClasses}>
                <Users size={20} className="mr-3" />
                Customers
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/coupons" className={getLinkClasses}>
                <Ticket size={20} className="mr-3" />
                Coupons
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/categories" className={getLinkClasses}>
                <Layers size={20} className="mr-3" />
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/transactions" className={getLinkClasses}>
                <CreditCard size={20} className="mr-3" />
                Transaction
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Section: Product */}
        <div>
          <SectionTitle title="Product" />
          <ul>
            <li>
              <NavLink to="/admin/products/add" className={getLinkClasses}>
                <PlusSquare size={20} className="mr-3" />
                Add Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/products" className={getLinkClasses}>
                <List size={20} className="mr-3" />
                Product List
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Section: Admin */}
        <div>
          <SectionTitle title="Admin" />
          <ul>
            <li>
              <NavLink to="/admin/roles" className={getLinkClasses}>
                <ShieldCheck size={20} className="mr-3" />
                Admin role
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/inbox" className={getLinkClasses}>
                <Inbox size={20} className="mr-3" />
                Inbox
              </NavLink>
            </li>
          </ul>
        </div>

      </nav>

      {/* --- FOOTER / PROFILE --- */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <img 
            className="h-10 w-10 rounded-full object-cover border border-gray-200" 
            src="https://i.pravatar.cc/150?img=3" 
            alt="Admin Profile" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Mark</p>
            <p className="text-xs text-gray-500 truncate">mark@dev.com</p>
          </div>
        </div>
        
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center mt-4 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ExternalLink size={18} className="mr-2" />
          Visit Store
        </a>
      </div>

    </aside>

    
  );
};

// Simple helper for section headers
const SectionTitle = ({ title }) => (
  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">
    {title}
  </h2>
);

export default AdminSidebar;