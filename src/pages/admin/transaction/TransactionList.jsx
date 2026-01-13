
import React, { useState } from 'react';
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Filter, 
  Download,
  Wallet,
  CreditCard,
  User,
  MoreVertical
} from 'lucide-react';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

const TransactionList = () => {
  const transactions = [
    {
      _id: '1',
      paymentId: 'pay_Hj89s7d89s',
      description: 'Wallet recharge via Razorpay',
      user: { firstName: 'Alex Johnson', email: 'alex@example.com', profilePic: '' },
      createdAt: '2026-01-12T10:30:00Z',
      method: 'Razorpay',
      transactionType: 'Credit',
      amount: 5000,
      status: 'Success'
    },
    {
      _id: '2',
      paymentId: 'WAL-17898233',
      description: 'Purchase for Order #ORD-8823',
      user: { firstName: 'Sarah Connor', email: 'sarah.c@gmail.com', profilePic: 'https://i.pravatar.cc/150?img=5' },
      createdAt: '2026-01-11T14:20:00Z',
      method: 'Wallet',
      transactionType: 'Debit',
      amount: 1299,
      status: 'Success'
    },
    {
      _id: '3',
      paymentId: 'REF-FULL-9923',
      description: 'Refund for Cancelled Order #ORD-1102',
      user: { firstName: 'Mike Ross', email: 'mike.law@pearson.com', profilePic: '' },
      createdAt: '2026-01-10T09:15:00Z',
      method: 'Wallet',
      transactionType: 'Credit',
      amount: 850,
      status: 'Success'
    },
    {
      _id: '4',
      paymentId: 'pay_Jk900d8s99',
      description: 'Wallet recharge failed attempt',
      user: { firstName: 'Jenny Doe', email: 'jenny@test.com', profilePic: '' },
      createdAt: '2026-01-09T18:00:00Z',
      method: 'Razorpay',
      transactionType: 'Credit',
      amount: 2000,
      status: 'Failed'
    },
    {
      _id: '5',
      paymentId: 'REF-RWD-1122',
      description: 'Referral Reward: John completed first order',
      user: { firstName: 'Admin System', email: 'system@menstitch.com', profilePic: '' },
      createdAt: '2026-01-08T11:00:00Z',
      method: 'Wallet',
      transactionType: 'Credit',
      amount: 100,
      status: 'Success'
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and monitor all financial movements.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium text-sm">
           <Download size={16} /> Export CSV
        </button>
      </div>

      {/* FILTERS TOOLBAR */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
        
        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by Payment ID, Name or Email..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <div className="relative min-w-[140px]">
            <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer hover:border-gray-400 transition">
              <option value="All">All Types</option>
              <option value="Credit">Credits (Income)</option>
              <option value="Debit">Debits (Expense)</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative min-w-[140px]">
            <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer hover:border-gray-400 transition">
              <option value="All">All Methods</option>
              <option value="Wallet">Wallet</option>
              <option value="Razorpay">Razorpay</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-5">Transaction Details</th>
                <th className="p-5">User</th>
                <th className="p-5">Date</th>
                <th className="p-5">Method</th>
                <th className="p-5 text-right">Amount</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx) => {
                const isCredit = tx.transactionType === 'Credit';
                
                return (
                  <tr key={tx._id} className="hover:bg-gray-50 transition-colors group">
                    
                    {/* 1. Transaction Info */}
                    <td className="p-5 max-w-[280px]">
                      <div className="flex flex-col">
                        <span className="font-mono text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          {tx.paymentId}
                        </span>
                        <span className="text-sm font-medium text-gray-900 leading-snug">
                          {tx.description}
                        </span>
                      </div>
                    </td>

                    {/* 2. User Info */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shrink-0">
                          {tx.user.profilePic ? (
                            <img src={tx.user.profilePic} alt="" className="w-full h-full rounded-full object-cover"/>
                          ) : <User size={16} strokeWidth={2.5}/>}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{tx.user.firstName}</span>
                          <span className="text-xs text-gray-500">{tx.user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* 3. Date */}
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-700 font-medium">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </td>

                    {/* 4. Method */}
                    <td className="p-5">
                       <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium border
                         ${tx.method === 'Razorpay' 
                           ? 'bg-blue-50 text-blue-700 border-blue-100' 
                           : 'bg-purple-50 text-purple-700 border-purple-100'}`}>
                          {tx.method === 'Razorpay' ? <CreditCard size={14}/> : <Wallet size={14}/>}
                          {tx.method}
                       </div>
                    </td>

                    {/* 5. Amount */}
                    <td className="p-5 text-right">
                       <div className={`inline-flex items-center gap-1 font-bold text-sm 
                         ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCredit ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                          {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                       </div>
                    </td>

                    {/* 6. Status */}
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border
                        ${tx.status === 'Success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          tx.status === 'Failed' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                          'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {tx.status}
                      </span>
                    </td>

                    {/* 7. Action Dots */}
                    <td className="p-5 text-right">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
                            <MoreVertical size={16} />
                        </button>
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-center">
            <Stack spacing={2}>
              <Pagination 
                count={10} 
                shape="rounded"
                color="primary" 
                // showFirstButton 
                // showLastButton
              />
            </Stack>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;