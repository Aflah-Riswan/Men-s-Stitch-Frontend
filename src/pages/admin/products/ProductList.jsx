import { useEffect, useState } from 'react';
import {
  PlusCircle, Search, Filter, Edit, Trash2,
  Package, RotateCcw
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, toggleProductList } from '../../../../redux/slice/productSlice';
import { fetchCategories } from '../../../../redux/slice/categorySlice';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';

export default function ProductList() {

  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('')
  const [status, setStatus] = useState('')
  const products = useSelector((state) => state.product.items)
  const categories = useSelector((state) => state.category.items)
  const pagination = useSelector((state) => state.product.pagination)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const filters = {
      page:currentPage,
      category,
      search,
      sort,
      status
    }
    dispatch(fetchProducts(filters))
    console.log("products : ", products)
  }, [dispatch, currentPage, category, search, sort, status])

  useEffect(() => {
    dispatch(fetchCategories())
  }, [])

  function handleReset() {
    setCategory('')
    setStatus('')
    setSort('')
    setCurrentPage(1)
  }
  return (
    <div className="w-full p-6 md:p-8 font-sans text-gray-800 h-full flex flex-col bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Product List</h2>
        <div className="text-md breadcrumbs text-gray-500">
          <span>Dashboard</span> <span className="mx-2">/</span> <span className="text-blue-600 font-medium">Products</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-col flex-1 min-h-[600px] flex overflow-hidden ">

        {/* --- TOP ACTION BAR --- */}
        <div className="p-5 border-b border-gray-100 bg-white ">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            {/* Search & Filter Toggle */}
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-md transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border rounded-lg flex items-center gap-2 text-md font-medium transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                <Filter size={18} /> Filters
              </button>
            </div>

            {/* Add Button */}
            <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition text-md font-medium w-full md:w-auto justify-center">
              <PlusCircle size={18} /> Add Product
            </button>
          </div>

          {/* --- FILTER OPTIONS PANEL (Collapsible) --- */}
          {showFilters && (
            <div className="mt-4 p-5 bg-gray-50 border border-gray-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex flex-col md:flex-row gap-6 items-end">

                {/* Category Filter */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
                  <select className="p-2.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-blue-500" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option value={cat._id}>{cat.categoryName}</option>
                    ))

                    }

                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status</label>
                  <select className="p-2.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-blue-500" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All Status</option>
                    <option value="active">Listed (Active)</option>
                    <option value="inactive">Unlisted (Inactive)</option>
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sort By</label>
                  <select className="p-2.5 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-blue-500" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">Default</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                {/* Reset Button */}
                <button onClick={() => handleReset()} className="px-4 py-2.5 bg-white border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-medium h-fit">
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>
          )}

        </div>

        {/* --- TABLE --- */}
        <div className="overflow-x-auto ">
          <table className="w-full text-left border-collapse">
            <thead className=''>
              <tr className="bg-gray-800 text-white text-sm font-semibold uppercase tracking-wider">
                <th className="py-4 px-6 border-r border-gray-700 w-[250px]">Product Info</th>
                <th className="py-4 px-6 border-r border-gray-700 w-[120px]">Category</th>
                <th className="py-4 px-6 border-r border-gray-700 w-[120px]">Price</th>
                <th className="py-4 px-6 border-r border-gray-700">Variants & Stock</th>
                <th className="py-4 px-6 text-center border-r border-gray-700 w-[140px]">Status</th>
                <th className="py-4 px-6 text-center w-[120px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">

              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="group hover:bg-blue-50/20 transition-colors">

                    {/* Product Info */}
                    <td className="py-4 px-6 border-r border-gray-100 align-top">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center shrink-0">
                          <img src={product.coverImages[0]} />
                        </div>
                        <div>
                          <p className="font-semibold text-md text-gray-900 leading-tight">{product.productName}</p>
                          <span className="text-xs text-gray-400">ID: #{product._id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 border-r border-gray-100 align-top">
                      <span className="inline-block text-[13px] font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                        {product.mainCategory.categoryName}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 border-r border-gray-100 align-top font-bold text-gray-700 text-md">
                      ₹{product.salePrice}
                    </td>

                    {/* Variants & Stock */}
                    <td className="py-4 px-6 border-r border-gray-100 align-top">
                      <div className="flex flex-col gap-3">
                        {product.variants.map((variant, idx) => {
                          const stockItems = Object.entries(variant.stock).filter(([_, qty]) => Number(qty) > 0);
                          const isOutOfStock = stockItems.length === 0;

                          return (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-md">
                              {/* Color Info */}
                              <div className="flex items-center gap-2 w-24 shrink-0">
                                <div
                                  className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-sm"
                                  style={{ backgroundColor: variant.colorCode }}
                                ></div>
                                <span className="font-medium text-gray-700 text-sm">{variant.colorName}</span>
                              </div>

                              {/* Stock Pills */}
                              <div className="flex flex-wrap gap-1.5">
                                {isOutOfStock ? (
                                  <span className="text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 font-bold">Out of Stock</span>
                                ) : (
                                  stockItems.map(([size, qty]) => (
                                    <span key={size} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-gray-600 text-[11px] shadow-sm">
                                      <span className="font-bold text-gray-800">{size}:</span> {qty}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="py-4 px-6 border-r border-gray-100 align-middle text-center">
                      <button
                        className={`relative inline-flex items-center p-2 rounded-full w-16 h-6 px-1 transition-colors focus:outline-none text[9px] ${product.isListed ? 'bg-[#7fad39]' : 'bg-red-500'}`} onClick={()=>dispatch(toggleProductList(product._id))}
                      >
                        <span className={`${product.isListed ? 'translate-x-10' : 'translate-x-0'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-md`} />
                        <span className={`absolute text-[10px] font-bold text-white ${product.isListed ? 'left-1' : 'right-1'}`}>
                          {product.isListed ? 'ACTIVE' : 'HIDDEN'}
                        </span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 align-top text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition border border-transparent hover:border-blue-100" title="Edit" onClick={()=>navigate(`edit/${product._id}`)}>
                          <Edit size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition border border-transparent hover:border-red-100" title="Delete">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>No products match your filters.</p>
                      <button className="text-blue-500 text-sm hover:underline">Clear all filters</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <Stack spacing={2}>
            <Pagination page={currentPage} count={pagination.totalPages}  className='custom-pagination' onChange={(e,value)=>setCurrentPage(value)} />
          </Stack>
        </div>



      </div>
    </div>
  );
}