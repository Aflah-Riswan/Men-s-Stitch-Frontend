import React, { useCallback, useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import { useLocation, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
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
  const location = useLocation()
  const [selectedFilters, setSelectedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sizes: [],
    attributes: {}
  });

  const debouncedFilters = useDebounce(selectedFilters, 500);

  const fetchProducts = useCallback(async (page, filtersToUse) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 10);

      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.get('search');

      const response = await productService.getProductsByCategory(slug, {
        page,
        limit: 10,
        search: searchQuery,
        filters: filtersToUse
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
    setCurrentPage(1);
    fetchProducts(1, debouncedFilters);
  }, [debouncedFilters, slug, fetchProducts]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setSelectedFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setSelectedFilters(prev => {
      const currentSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: currentSizes };
    });
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
  };



  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    fetchProducts(value, debouncedFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

              {/* APPLY BUTTON */}
              {/* <button
                onClick={handleApplyFilter}
                className="w-full bg-black text-white py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors mt-4"
              >
                Apply Filter
              </button> */}
            </div>
          </div>

          {/* --- RIGHT CONTENT --- */}
          <div className="flex-1">
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