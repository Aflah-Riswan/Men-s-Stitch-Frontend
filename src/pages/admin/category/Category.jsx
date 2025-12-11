import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Image as ImageIcon, RotateCcw, Search, Filter } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, toggleListButton, deleteCategory } from '../../../../redux/slice/categorySlice';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../../../redux/slice/productSlice';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


const Category = () => {

  const [showFilters, setShowFilters] = useState(false)
  const [sort, setSort] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [discount, setDiscount] = useState('')
  const [category, setCategory] = useState('')
  const navigate = useNavigate()
  const categories = useSelector((state) => state.category.items)
  const pagination = useSelector((state) => state.category.pagination)
  const products = useSelector((state) => state.product.items)
  console.log(categories)
  const dispatch = useDispatch()

  useEffect(() => {
    const filters = {
      sort,
      search,
      currentPage,
      status,
      discount,
      category
    }
    dispatch(fetchCategories(filters))
  }, [dispatch, sort, search, currentPage, status, discount, category])

  useEffect(() => {
    dispatch(fetchProducts())
  }, [])

  function handleResetButton() {
    setCategory('')
    setCurrentPage(1)
    setDiscount('')
    setSort('')
    setStatus('')
    setSearch('')
  }

  return (

    <div className="flex min-h-screen bg-gray-50">


      <div className="flex-1 p-8 overflow-y-auto h-screen">

        {/* --- HEADER SECTION --- */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Categories</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

            <h3 className="text-lg font-semibold text-gray-700 self-start md:self-center">Discover</h3>

            <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">

              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-sm transition-all shadow-sm"
                />
              </div>

              {/* 2. Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 border rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm
                  ${showFilters
                    ? 'bg-gray-100 border-gray-300 text-gray-900'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>

              {/* 3. Add Category Button */}
              <button
                className="flex items-center justify-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
                onClick={() => navigate('/admin/categories/add')}
              >
                <Plus size={18} />
                <span>Add Category</span>
              </button>
            </div>
          </div>

          {/* --- FILTER PANEL*/}
          {showFilters && (
            <div className="mb-6 p-5 bg-white border border-gray-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col md:flex-row gap-4 items-end">

                {/* Category Filter */}
                <div className="flex flex-col gap-1.5 w-full md:w-1/4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
                  <select className="p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:border-black transition-colors" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.categoryName}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col gap-1.5 w-full md:w-1/4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
                  <select className="p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:border-black transition-colors" value={status} onChange={(e) => setStatus(e.target.value)} >
                    <option value="">All Status</option>
                    <option value="active">Listed</option>
                    <option value="inactive">Unlisted</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex flex-col gap-1.5 w-full md:w-1/4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sort By</label>
                  <select className="p-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 outline-none focus:border-black transition-colors" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">Default</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="a-z">A-Z</option>
                    <option value="z-a">Z-A</option>
                  </select>
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleResetButton}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 hover:text-red-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium h-[42px]"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* --- DISCOVER GRID CARDS --- */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {categories.map((card) => (
              <div key={card._id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-200">
                  <img
                    src={card.image}
                    alt={card.categoryName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{card.categoryName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#1a4d2e] text-white">
                <tr>
                  <th className="px-6 py-4 font-medium">SNO</th>
                  <th className="px-6 py-4 font-medium">Category Name</th>
                  <th className="px-6 py-4 font-medium">Offer</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Date Added</th>
                  <th className="px-6 py-4 font-medium">List / Unlist</th>
                  <th className="px-6 py-4 font-medium text-center">Action</th>
                  <th className="px-6 py-4 font-medium text-center">Discount-Type</th>
                  <th className="px-6 py-4 font-medium text-center">Max Redeemable ₹</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((item, index) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.categoryName}</td>
                    <td className="px-6 py-4 text-gray-600">{item.categoryOffer}</td>
                    <td className="px-6 py-4 text-gray-600">{products.reduce((acc, product) => {
                      if (product.mainCategory?.categoryName === item.categoryName) {
                        const productStock = product.variants.reduce((vAcc, variant) => {
                          const totalVariant = Object.values(variant.stock).reduce((sAcc, qty) => sAcc + Number(qty), 0)
                          return vAcc + totalVariant
                        }, 0)
                        return productStock + acc
                      }
                      return acc
                    }, 0)}</td>
                    <td className="px-6 py-4 text-gray-500">{item.createdAt}</td>
                    <td className="px-6 py-4">
                      <button
                        className={`
                          flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold text-white transition-all
                          ${item.isListed ? 'bg-[#7fad39] flex-row' : 'bg-red-500 flex-row-reverse'}
                        `}
                        onClick={() => dispatch(toggleListButton(item._id))}
                      >
                        <span>{item.isListed ? 'List'.toUpperCase() : 'unlist'.toUpperCase()}</span>
                        <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded border border-gray-200" onClick={() => navigate(`edit/${item.slug}`)}>
                          <Pencil size={14} />
                        </button>
                        <button className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded border border-gray-200" onClick={() => dispatch(deleteCategory(item._id))}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{item.discountType}</td>
                    <td className="px-6 py-4 text-center font-medium text-gray-700">{item.maxRedeemable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <Stack spacing={2}>
            <Pagination page={currentPage} count={pagination.totalPages} className='custom-pagination' onChange={(e, value) => setCurrentPage(value)} />
          </Stack>
        </div>
      </div>
    </div>
  );
};

export default Category;