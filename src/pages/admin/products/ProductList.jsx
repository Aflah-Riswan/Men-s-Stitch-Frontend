import React from 'react';
import { 
  PlusCircle, 
  Search,
  Filter,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ProductListData = [
  { id: 1, name: "Men's Full Sleeve Shirt", category: "Casuals", price: "₹559", status: "UNLIST", statusColor: "green" },
  { id: 2, name: "Men's Full Sleeve Shirt", category: "Casuals", price: "₹559", status: "UNLIST", statusColor: "green" },
  { id: 3, name: "Men's Full Sleeve Shirt", category: "Casuals", price: "₹559", status: "LIST", statusColor: "red" },
  { id: 4, name: "Men's Full Sleeve Shirt", category: "Casuals", price: "₹559", status: "UNLIST", statusColor: "green" },
  { id: 5, name: "Men's Full Sleeve Shirt", category: "Casuals", price: "₹559", status: "UNLIST", statusColor: "green" },
  { id: 6, name: "Men's Full Sleeve Shirt", category: "Casuals", price: "₹559", status: "UNLIST", statusColor: "green" },
  { id: 7, name: "Men's Full Sleeve Shirt", category: "Casuals", price: "₹559", status: "UNLIST", statusColor: "green" },
];

const sizes = [
  { label: 'XS', count: 26, color: 'bg-yellow-500' },
  { label: 'S', count: 26, color: 'bg-blue-500' },
  { label: 'M', count: 0, color: 'bg-pink-500' },
  { label: 'L', count: 26, color: 'bg-green-500' },
  { label: 'XL', count: 78, color: 'bg-purple-500' },
  { label: 'XXL', count: 26, color: 'bg-black' },
];

export default function ProductList() {
  return (
    <div className="w-full p-6 md:p-8 font-sans text-gray-800 h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-1 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Product List</h2>
          <div className="text-sm breadcrumbs text-gray-500">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span className="text-blue-600 font-medium">Categories</span>
          </div>
        </div>

        {/* Content Card - Added flex-grow to fill height if needed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h3 className="text-xl font-bold text-gray-800">All Products</h3>
            <button className="bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
              <PlusCircle size={18} />
              Add New Product
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Search product name, category..." 
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 focus:bg-white"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50">
                <Filter size={16} className="mr-2 text-gray-500"/>
                <span className="text-sm font-bold mr-3 text-gray-700 uppercase tracking-wider">Filter</span>
                <select className="bg-transparent text-sm text-gray-600 focus:outline-none cursor-pointer hover:text-black">
                  <option>Category</option>
                </select>
                <div className="w-px h-4 bg-gray-300 mx-3"></div>
                <select className="bg-transparent text-sm text-gray-600 focus:outline-none cursor-pointer hover:text-black">
                  <option>Price Range</option>
                </select>
              </div>

              <div className="flex items-center border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50">
                <span className="text-sm font-bold mr-3 text-gray-700 uppercase tracking-wider">Sort</span>
                <button className="text-sm font-medium text-gray-600 hover:text-black transition-colors">High-Low</button>
                <div className="w-px h-4 bg-gray-300 mx-3"></div>
                <button className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Low-High</button>
                <div className="w-px h-4 bg-gray-300 mx-3"></div>
                <button className="text-sm font-medium text-gray-600 hover:text-black transition-colors">Newest</button>
              </div>
            </div>
          </div>

          {/* Table Container - Added flex-1 to push pagination to bottom */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-5 px-6 rounded-l-lg">Image</th>
                  <th className="py-5 px-6">Product Name</th>
                  <th className="py-5 px-6">Category</th>
                  <th className="py-5 px-6">Price</th>
                  <th className="py-5 px-6 text-center">Stock Breakdown</th>
                  <th className="py-5 px-6 text-center">Status</th>
                  <th className="py-5 px-6 text-center rounded-r-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {ProductListData.map((product) => (
                  <tr key={product.id} className="group hover:bg-blue-50/30 transition-colors duration-200">
                    <td className="py-5 px-6">
                      <div className="w-14 h-14 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center shadow-sm">
                        <img src="https://via.placeholder.com/48" alt="Product" className="w-10 h-10 object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <p className="text-md font-semibold text-black-900">{product.name}</p>
                      <p className="text-sm text-blue-600 mt-0.5">ID: #8923{product.id}</p>
                    </td>
                    <td className="py-5 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-md font-bold text-gray-900">{product.price}</td>
                    
                    {/* Complex Stock Cell */}
                    <td className="py-5 px-6">
                      <div className="flex justify-center gap-2">
                        {sizes.map((size, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1 group/size">
                            <span className="text-[15px] font-bold text-gray-400 group-hover/size:text-gray-700">{size.count}</span>
                            <div className={`w-8 h-8 rounded-full ${size.color} flex items-center justify-center text-[9px] font-bold text-white shadow-sm ring-2 ring-transparent group-hover/size:ring-gray-200 transition-all cursor-default`}>
                              {size.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-5 px-6 text-center">
                       <button className={`
                          relative inline-flex items-center h-7 rounded-full w-20 px-1 transition-colors focus:outline-none cursor-pointer
                          ${product.statusColor === 'green' ? 'bg-emerald-500 shadow-emerald-200' : 'bg-red-500 shadow-red-200'} shadow-md
                        `}>
                          <span className={`text-[10px] font-bold text-white absolute uppercase tracking-wide ${product.statusColor === 'green' ? 'left-2.5' : 'right-2.5'}`}>
                            {product.status}
                          </span>
                          <span className={`
                             inline-block w-5 h-5 transform bg-white rounded-full transition-transform shadow-sm
                             ${product.statusColor === 'green' ? 'translate-x-[3.2rem]' : 'translate-x-0'}
                          `}/>
                        </button>
                    </td>

                    {/* Actions */}
                    <td className="py-5 px-6 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all">
                          <Edit size={20} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-100 gap-4">
            <span className="text-sm text-gray-500 font-medium">Showing 1-7 of 25 products</span>
            <div className="flex gap-1.5">
              <PaginationButton><ChevronLeft size={16} /> Prev</PaginationButton>
              <PaginationButton active>1</PaginationButton>
              <PaginationButton>2</PaginationButton>
              <PaginationButton>3</PaginationButton>
              <span className="px-2 py-1 text-gray-400">...</span>
              <PaginationButton>24</PaginationButton>
              <PaginationButton>Next <ChevronRight size={16} /></PaginationButton>
            </div>
          </div>
        </div>
    </div>
  );
}

// Helper component
function PaginationButton({ children, active = false }) {
  return (
    <button 
      className={`
        px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1
        ${active 
          ? 'bg-black text-white border-black shadow-md' 
          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
        }
      `}
    >
      {children}
    </button>
  );
}