import React, { useEffect, useState } from 'react';
import { Search, Filter, ArrowUpDown, ArrowDownIcon, ChevronDown, RotateCcw, } from 'lucide-react';
import StatusCard from '../../../Components/StatusCard'; // Assuming you have this
import axiosInstance from '../../../utils/axiosInstance';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Modal from '../../../Components/Modal';
import CustomerAnalytics from '../../../Components/analytics/CustomerAnalytics';
import useDebounce from '../../../hooks/useDebounce';

export default function Customers() {


  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [active, setActive] = useState('');
  const [limit, setLimit] = useState(5);
  const [users, setUsers] = useState([])
  const [sort, setSort] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(0)
  const debouncedSearch = useDebounce(search, 500);
  const [analytics, setAnalytics] = useState({
    stats: { total: 0, new: 0, blocked: 0 },
    chart: []
  })
  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, active, currentPage, sort, showModal]);

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchUsers = async () => {
    const data = { page : currentPage, search : debouncedSearch, active, limit, sort };
    try {
      const response = await axiosInstance.get('/admin/users', { params: data });
      if (response.data.success) {
        const { users, currentPage, totalPages } = response.data
        setCurrentPage(currentPage)
        setTotalPages(totalPages)
        setUsers(users)
      } else {
        console.log(response.data)
        console.log(response.data.message)
      }
    } catch (error) {
      console.log("founde errror  : ", error)
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await axiosInstance.get('/admin/users/analytics')
      if (response.data.success) {
        setAnalytics(response.data)
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleBlockUser = async (id, name) => {
    console.log("clicked")
    const response = await axiosInstance.patch(`/admin/users/${id}/block`)
    console.log(response)
    if (response.data.success) {
      setShowModal(true)
      setModalTitle('Block User ', name)
      setModalMessage(response.data.message)
    }
  }
  function handleModalClose() {
    setShowModal(false)
  }
  function handleReset() {
    setSort('')
    setSearch('')
    setActive('')
    setCurrentPage(1)

  }

  return (
    <div className="flex-1 bg-[#f8f9fc] min-h-screen p-8 font-sans">

      <Modal
        isOpen={showModal}
        title={modalTitle}
        message={modalMessage}
        onConfirm={handleModalClose}
        type="success"
      />

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Customers</h1>

      {/* Top Section: Stats (Preserved) */}
      {/* Top Section: Chart & Stats Combined */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* 1. Chart Section (Takes 2 Columns) */}
        {/* I placed this FIRST so it appears on the LEFT. Move it below the stats div to swap sides. */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-lg">Customer Growth</h3>
          </div>
          {analytics.chart && analytics.chart.length > 0 ? (
            <CustomerAnalytics data={analytics.chart} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
              Loading chart data...
            </div>
          )}
        </div>

        {/* 2. Stats Section (Takes 1 Column) */}
        {/* We wrap all cards in a flex column so they stack vertically next to the chart */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <StatusCard
            title={'Total Customers'}
            value={analytics.stats.total}
            change={'+14.4%'}
            isPositive={true}
          />
          <StatusCard
            title={'New Customers'}
            value={analytics.stats.new}
            change={analytics.stats.total - analytics.stats.new}
            isPositive={true}
          />
          <StatusCard
            title={'Blocked Customers'}
            value={analytics.stats.blocked}
            change={12}
            isPositive={false}
          />
          {/* You had a 4th card, adding it here to keep the stack even */}
          <StatusCard
            title={'Active Visitors'}
            value={40}
            change={11.43}
            isPositive={false}
          />
        </div>

      </div>
      {/* Bottom Section: Customer List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        {/* Header: Title + Actions */}
        <div className="flex flex-col gap-4 mb-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-bold text-slate-800">Customer List</h3>

            <div className="flex items-center gap-3">

              {/* 1. Search Bar (Always Visible) */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search user"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm outline-none focus:ring-1 focus:ring-gray-300 w-64 transition-all"
                />
              </div>

              {/* 2. Accordion Toggle Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${showFilters ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters & Sort</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>


          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-24 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-wrap gap-4 items-center">

              {/* Filter Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status:</span>
                <div className="relative">
                  <select
                    value={active}
                    onChange={(e) => setActive(e.target.value)}
                    className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-1 focus:ring-gray-300 appearance-none cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    <option value="">default</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By:</span>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
                  <select
                    className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:ring-1 focus:ring-gray-300 appearance-none cursor-pointer hover:border-gray-300 transition-colors"
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <option value="">default</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="a-z">Name (A-Z)</option>
                    <option value="z-a">Name (Z-A)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3 pointer-events-none" />
                </div>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>

            </div>
          </div>
        </div>

        {/* Table Container */}
        {/* ADDED min-h-[600px] to fix the layout shift issue */}
        <div className="overflow-x-auto min-h-[600px]">
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
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-800">{user._id}</td>
                  <td className="py-4 px-4">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="py-4 px-4">{user.phone}</td>
                  <td className="py-4 px-4 text-center">{25}</td>
                  <td className="py-4 px-4">{1000}</td>
                  <td className="py-4 px-4">
                    {/* Preserved your logic, just cleaned up Tailwind classes */}
                    <span className={` flex items-center gap-2 font-medium ${user.isBlocked ? 'text-red-500' : 'text-green-600'
                      }`} >
                      <span className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-red-500' : 'bg-green-500'
                        }`}></span>
                      {user.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className={`relative w-16 h-7 rounded-full transition-colors flex items-center px-1 ${user.isBlocked ? 'bg-red-500' : 'bg-gray-200'}`} onClick={() => handleBlockUser(user._id, user.firstName)}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${user.isBlocked ? 'translate-x-9' : 'translate-x-0'}`}></div>
                      <span className={`absolute text-[9px] font-bold ${user.isBlocked ? 'left-2 text-white' : 'right-2 text-gray-500'}`}>
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <Stack spacing={2}>
              <Pagination page={currentPage} count={totalPages} className='custom-pagination' onChange={(e, value) => setCurrentPage(value)} />
            </Stack>
          </div>
          {/* Empty State Message (Optional but good for UX) */}
          {users.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <p>No customers found.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}




