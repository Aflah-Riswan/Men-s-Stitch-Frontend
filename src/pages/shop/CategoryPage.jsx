import React, { useCallback, useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import categoryAttributes, { sizes } from '../../data';
import ProductCard from '../../Components/products/ProductCard';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import useDebounce from '../../hooks/useDebounce';
import productService from '../../services/productService';

export default function CategoryPage() {
  const { slug } = useParams();
  const [attributes, setAttributes] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 1. New State for Sorting
  const [sortBy, setSortBy] = useState('newest'); 

  const location = useLocation();
  const [selectedFilters, setSelectedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sizes: [],
    attributes: {}
  });

  const debouncedFilters = useDebounce(selectedFilters, 500);

  const fetchProducts = useCallback(async (page, filtersToUse, sortOption) => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.get('search');

      const response = await productService.getProductsByCategory(slug, {
        page,
        limit: 10,
        search: searchQuery,
        filters: filtersToUse,
        sort: sortOption 
      });
      console.log(response)

      if (response.data && response.data.products) {
        setProducts(response.data.products);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPages);
        }
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  }, [slug, location.search]);


  useEffect(() => {
    if (slug && categoryAttributes[slug]) {
      setAttributes(categoryAttributes[slug]);
    }
    fetchProducts(currentPage, debouncedFilters, sortBy); 
  }, [debouncedFilters, slug, sortBy, currentPage, fetchProducts]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); 
  };

  const handleSizeToggle = (size) => {
    setSelectedFilters(prev => {
      const currentSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: currentSizes };
    });
    setCurrentPage(1);
  };

  const handleAttributeToggle = (categoryLabel, option) => {
    setSelectedFilters(prev => {
      const currentCategoryOptions = prev.attributes[categoryLabel] || [];
      const newCategoryOptions = currentCategoryOptions.includes(option)
        ? currentCategoryOptions.filter(item => item !== option)
        : [...currentCategoryOptions, option];
      return {
        ...prev,
        attributes: {
          ...prev.attributes,
          [categoryLabel]: newCategoryOptions
        }
      };
    });
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Sort Handler
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); 
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <div className="container mx-auto px-4 py-6">

        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-8 flex items-center gap-2">
          <span>Home</span> <ChevronRight className="w-3 h-3" />
          <span className="font-semibold text-black capitalize">{slug || 'Category'}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* --- LEFT SIDEBAR --- */}
          <div className="w-full lg:w-64 flex-shrink-0">

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-lg font-bold">Filters</h3>
              <SlidersHorizontal className="w-5 h-5 text-gray-400 rotate-90" />
            </div>

            <div className="space-y-6">

              <div className="pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="font-bold text-sm">Price</span>
                  <ChevronUp className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={selectedFilters.minPrice}
                    onChange={handlePriceChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={selectedFilters.maxPrice}
                    onChange={handlePriceChange}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>

              {/* SIZES */}
              <div className="pb-6 border-b border-gray-100">
                <div className="flex items-center justify-between w-full mb-4">
                  <span className="font-bold text-sm">Size</span>
                  <ChevronUp className="w-4 h-4" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const isSelected = selectedFilters.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`px-4 py-2 text-xs rounded-full border transition-colors 
                                    ${isSelected
                            ? 'bg-black text-white border-black'
                            : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
                          }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ATTRIBUTES */}
              {attributes && attributes.map((section) => (
                <div key={section.label} className="pb-6 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between w-full mb-4">
                    <span className="font-bold text-sm">{section.label}</span>
                    <ChevronUp className="w-4 h-4" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {section.options.map((opt) => {
                      const isSelected = selectedFilters.attributes[section.label]?.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => handleAttributeToggle(section.label, opt)}
                          className={`px-4 py-2 text-xs rounded-full border transition-colors 
                                              ${isSelected
                              ? 'bg-black text-white border-black'
                              : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'
                            }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

            </div>
          </div>

          {/* --- RIGHT CONTENT --- */}
          <div className="flex-1">
            
            {/* 5. SORT HEADER UI */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
               <p className="text-sm text-gray-500">
                 Showing {products.length} Products
               </p>
               
               <div className="flex items-center gap-3">
                 <span className="text-sm font-medium text-gray-700">Sort by:</span>
                 <div className="relative">
                   <select 
                     value={sortBy}
                     onChange={handleSortChange}
                     className="appearance-none border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-black cursor-pointer bg-white shadow-sm"
                   >
                     <option value="newest">Newest First</option>
                     <option value="oldest">Oldest First</option>
                     <option value="price_low_high">Price: Low to High</option>
                     <option value="price_high_low">Price: High to Low</option>
                     <option value="a_z">Name: A to Z</option>
                     <option value="z_a">Name: Z to A</option>
                   </select>
                   <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No products found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- PAGINATION SECTION --- */}
        {products.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-center items-center mt-8">
            <Stack spacing={2}>
              <Pagination
                page={currentPage}
                count={totalPages}
                onChange={handlePageChange}
                className='custom-pagination'
                shape="rounded"
              />
            </Stack>
          </div>
        )}
      </div>
    </div>
  );
}