import React, { useState } from 'react';
import {
  PlusCircle, Search, Filter, Edit, Trash2,
  Package, X, ChevronDown
} from 'lucide-react';

// Mock Data
const ProductListData = [
  {
    id: 1,
    name: "Men's Classic T-Shirt",
    category: "Casuals",
    price: "₹559",
    status: "Active",
    statusColor: "green",
    variants: [
      {
        colorName: "Navy Blue",
        colorCode: "#000080",
        stock: { XS: 5, S: 20, M: 50, L: 30, XL: 10, XXL: 0 }
      },
      {
        colorName: "Maroon",
        colorCode: "#800000",
        stock: { XS: 0, S: 10, M: 15, L: 5, XL: 0, XXL: 0 }
      }
    ]
  },
  {
    id: 2,
    name: "Slim Fit Chinos",
    category: "Trousers",
    price: "₹1,299",
    status: "Draft",
    statusColor: "red",
    variants: [
      {
        colorName: "Beige",
        colorCode: "#F5F5DC",
        stock: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 }
      }
    ],
    isListed: true
  },
  {
    id: 3,
    name: "Denim Jacket",
    category: "Jackets",
    price: "₹2,499",
    status: "Active",
    statusColor: "green",
    variants: [
      {
        colorName: "Black",
        colorCode: "#000000",
        stock: { S: 5, M: 8, L: 2 }
      }
    ],
    isListed: false
  },
];

export default function ProductList() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full p-6 md:p-8 font-sans text-gray-800 h-full flex flex-col bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Product List</h2>
        <div className="text-md breadcrumbs text-gray-500">
          <span>Dashboard</span> <span className="mx-2">/</span> <span className="text-blue-600 font-medium">Products</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">

        {/* --- TOP ACTION BAR --- */}
        <div className="p-5 border-b border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            {/* Search & Filter Toggle */}
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-md" />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border rounded-lg flex items-center gap-2 text-md font-medium transition-colors ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                <Filter size={16} /> Filters
              </button>
            </div>

            {/* Add Button */}
            <button className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition text-md font-medium w-full md:w-auto justify-center">
              <PlusCircle size={18} /> Add Product
            </button>
          </div>

          {/* --- FILTER OPTIONS PANEL (Collapsible) --- */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top-2 duration-200">

              {/* Category Filter */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">Category</label>
                <div className="relative">
                  <select className="w-full p-2 pl-3 pr-8 text-md border border-gray-300 rounded-md bg-white appearance-none focus:ring-1 focus:ring-blue-500 outline-none">
                    <option>All Categories</option>
                    <option>Casuals</option>
                    <option>Trousers</option>
                    <option>Jackets</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 uppercase">Status</label>
                <div className="relative">
                  <select className="w-full p-2 pl-3 pr-8 text-md border border-gray-300 rounded-md bg-white appearance-none focus:ring-1 focus:ring-blue-500 outline-none">
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Out of Stock</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
              </div>

              {/* Stock Level Filter */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-600 uppercase">Stock Level</label>
                <div className="relative">
                  <select className="w-full p-2 pl-3 pr-8 text-md border border-gray-300 rounded-md bg-white appearance-none focus:ring-1 focus:ring-blue-500 outline-none">
                    <option>Any</option>
                    <option>Low Stock (&lt;10)</option>
                    <option>Out of Stock</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
              </div>

              {/* Reset Actions */}
              <div className="flex items-end gap-2">
                <button className="flex-1 py-2 bg-blue-600 text-white text-md rounded-md hover:bg-blue-700 font-medium">Apply</button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-3 py-2 bg-white border border-gray-300 text-gray-600 text-md rounded-md hover:bg-gray-50"
                >
                  <X size={16} />
                </button>
              </div>

            </div>
          )}
        </div>

        {/* --- TABLE --- */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              {/* Made header much darker for clear identification */}
              <tr className="bg-gray-800 text-white text-sm font-semibold uppercase tracking-wider">
                <th className="py-4 px-6 border-r border-gray-700 w-[250px]">Product Info</th>
                <th className="py-4 px-6 border-r border-gray-700 w-[120px]">category</th>
                <th className="py-4 px-6 border-r border-gray-700 w-[120px]">Price</th>
                <th className="py-4 px-6 border-r border-gray-700">Variants & Stock</th>
                <th className="py-4 px-6 text-center border-r border-gray-700 w-[120px]">Status</th>
                <th className="py-4 px-6 text-center w-[120px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {ProductListData.map((product) => (
                <tr key={product.id} className="group hover:bg-blue-50/30 transition-colors">

                  {/* Product Info */}
                  <td className="py-4 px-6 border-r border-gray-800 align-top">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-md text-gray-900 leading-tight">{product.name}</p>
                        <span className="inline-block mt-1 text-[13px] font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 border-r border-gray-800 align-top font-medium text-gray-700 text-md">
                    {product.category}
                  </td>

                  <td className="py-4 px-6 border-r border-gray-800 align-top font-medium text-gray-700 text-md">
                    {product.price}
                  </td>


                  {/* Variants & Stock (Visible directly in table) */}
                  <td className="py-4 px-6 border-r border-gray-800 align-top">
                    <div className="flex flex-col gap-3">
                      {product.variants.map((variant, idx) => {
                        // Filter out sizes with 0 stock to keep UI clean
                        const stockItems = Object.entries(variant.stock).filter(([_, qty]) => Number(qty) > 0);
                        const isOutOfStock = stockItems.length === 0;

                        return (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-md">
                            {/* Color Info */}
                            <div className="flex items-center gap-2 w-28 shrink-0">
                              <div
                                className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                                style={{ backgroundColor: variant.colorCode }}
                              ></div>
                              <span className="font-medium text-gray-700 text-sm">{variant.colorName}</span>
                            </div>

                            {/* Stock Pills */}
                            <div className="flex flex-wrap gap-1.5">
                              {isOutOfStock ? (
                                <span className="text-[10px] text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100 font-medium">Out of Stock</span>
                              ) : (
                                stockItems.map(([size, qty]) => (
                                  <span key={size} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-red-400 text-[15px]">
                                    <span className="font-bold text-blue-300">{size}:</span> {qty}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6 border-r border-gray-800 align-top text-center">
                    <button
                      className={`flex items-center justify-between px-1.5 w-20 py-1 rounded-full text-[10px] font-bold text-white transition-all shadow-sm ${product.isListed ? 'bg-[#7fad39] flex-row' : 'bg-red-500 flex-row-reverse'}`}
                    >
                      <span className="flex-1 text-center">
                        {product.isListed ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                      <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform"/>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 align-top text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 hover:bg-blue-50 text-blue-400 hover:text-blue-800 rounded transition border border-transparent hover:border-blue-100">
                        <Edit size={17} />
                      </button>
                      <button className="p-1.5 hover:bg-red-50 text-red-400 hover:text-red-800 rounded transition border border-transparent hover:border-red-100">
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <span className="text-sm text-gray-500 font-medium">Showing 1-3 of 3 products</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-600 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm font-medium text-gray-600">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
}