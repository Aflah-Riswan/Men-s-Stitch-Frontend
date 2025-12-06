import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Keep for routing structure
import { useForm } from 'react-hook-form';
import {
  ArrowLeft, Save, Trash2, Plus,
  Image as ImageIcon, Loader2, Package
} from 'lucide-react';
import axiosInstance from '../../../utils/axiosInstance';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../../../../redux/slice/productSlice';
import { fetchCategories } from '../../../../redux/slice/categorySlice';

// --- DUMMY DATA (Simulating Backend) ---
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const DUMMY_ATTRIBUTES_LIST = [
  { label: 'Fabric', options: ['Cotton', 'Linen', 'Polyester', 'Denim'] },
  { label: 'Fit', options: ['Slim Fit', 'Regular Fit', 'Oversized'] },
  { label: 'Sleeve', options: ['Half Sleeve', 'Full Sleeve'] },
  { label: 'Pattern', options: ['Solid', 'Striped', 'Checked', 'Printed'] },
];

const DUMMY_CATEGORIES = [
  { _id: 'cat_1', categoryName: "Men's Shirts" },
  { _id: 'cat_2', categoryName: "Jeans" },
  { _id: 'cat_3', categoryName: "Jackets" },
];

const DUMMY_PRODUCT_DATA = {
  productName: "Men's Premium Oxford Shirt",
  productDescription: "A high-quality cotton shirt perfect for formal and casual wear. Breathable fabric with a modern fit.",
  originalPrice: 2499,
  salePrice: 1899,
  mainCategory: 'cat_1',
  isListed: true,
  tags: ["formal", "office", "summer"],
  attributes: {
    "Fabric": "Cotton",
    "Fit": "Regular Fit",
    "Sleeve": "Full Sleeve"
  },
  variants: [
    {
      productColor: "White",
      colorCode: "#FFFFFF",
      variantImages: [
        "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=100&q=80",
        "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=100&q=80",
        "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?w=100&q=80"
      ],
      stock: { XS: 0, S: 10, M: 25, L: 15, XL: 5, XXL: 0 }
    },
    {
      productColor: "Sky Blue",
      colorCode: "#87CEEB",
      variantImages: [
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80"
      ],
      stock: { XS: 5, S: 20, M: 20, L: 20, XL: 10, XXL: 5 }
    }
  ]
};

// --- COMPONENT STARTS HERE ---
const EditProduct = () => {
  const navigate = useNavigate();


  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [variantsCollection, setVariantsCollection] = useState([]);
  const [newVariantFiles, setNewVariantFiles] = useState([]);
  const [productToEdit, setProductToEdit] = useState([])
  const { isError } = useSelector((state) => state.product)
  const { categories } = useSelector((state)=>state.category)
  const dispatch = useDispatch()
  const {
    register, handleSubmit, setValue, getValues, trigger, watch, reset,
    formState: { errors }
  } = useForm();

  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}/edit`)
        if (response.data.success) {
          setProductToEdit(response.data.products)
          setVariantsCollection(response.data.variants)
        } else {
          setError(response.data.message)
        }
      } catch (error) {
        console.log("error found ", error)
        setError('error found')
      }
    }
    fetchData()
    dispatch(fetchCategories())
    
  }, []);

  

  if (isError) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      error found
      {isError}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate()} className="p-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <div className="text-sm text-gray-500">Dashboard / Products / Edit</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-5">General Information</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name</label>
                  <input
                    {...register('productName' , 
                      { required: 'product name is required ' ,
                      minLength : {value: 3,message:'product name should be with minimum amount of 3 letters'},
                      pattern : { value:/^[A-Za-z,' -]+$/ , message : 'special characters are not allowed '}})}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 transition-all bg-gray-50 focus:bg-white"
                  />
                  {errors.productName && <span className="text-xs text-red-500 mt-1">{errors.productName.message}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                  <textarea
                    {...register('productDescription',
                      {required : 'product description is required ' , minLength : {value : 20 ,message : 'minimum characters are 20 '} , maxLength : {value : 100 ,message : 'maximum length is 100' ,}}
                    )}
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 transition-all bg-gray-50 focus:bg-white h-32 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 2. Pricing */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Pricing</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                    <input
                      type="number"
                      {...register('originalPrice', { required: 'original price is required ',
                         min:{value:10 , message: 'original price should be greater than 10' }
                        })}
                      className="w-full pl-8 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sale Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                    <input
                      type="number"
                      {...register('salePrice', { required : 'sale price is required ', min:{value : 1 ,message : 'minimum value is 1 '} })}
                      className="w-full pl-8 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Variants Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-600">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Product Variants</h3>

              {/* Existing Variants List */}
              <div className="space-y-3 mb-8">
                {variantsCollection.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                    No variants added. Add one below.
                  </div>
                ) : (
                  variantsCollection.map((variant, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: variant.colorCode }}></div>
                        <div>
                          <p className="font-bold text-gray-800">{variant.productColor}</p>
                          <p className="text-xs text-gray-500 font-medium">
                            {Object.values(variant.stock).reduce((a, b) => a + b, 0)} units total
                          </p>
                        </div>
                        {/* Image Preview Row */}
                        <div className="flex -space-x-3 ml-4">
                          {variant.variantImages.map((img, i) => (
                            <img key={i} src={img} className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm bg-white" alt="" />
                          ))}
                        </div>
                      </div>
                      <button type="button" onClick={() => removeVariant(idx)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Variant Form */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Add New Variant</h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Color Name</label>
                    <input {...register('productColor')} placeholder="e.g. Midnight Blue" className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Color Code</label>
                    <div className="flex items-center gap-3 p-2 border rounded-lg bg-white">
                      <input type="color" {...register('colorCode')} className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent" />
                      <span className="text-sm font-mono text-gray-600 uppercase">{watch('colorCode')}</span>
                    </div>
                  </div>
                </div>

                {/* Custom Image Upload UI */}
                <div className="mb-5">
                  <label className="text-xs font-bold text-gray-500 mb-2 block">Upload 3 Images</label>
                  <div className="grid grid-cols-4 gap-3">
                    {/* Upload Button */}
                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-blue-400 transition-all">
                      <Plus size={20} className="text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Add</span>
                      <input type="file" multiple onChange={handleFileChange} className="hidden" accept="image/*" />
                    </label>

                    {/* Previews */}
                    {newVariantFiles.map((file, i) => (
                      <div key={i} className="relative h-24 group">
                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded-lg border" alt="preview" />
                        <button type="button" onClick={() => removeNewFile(i)} className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full shadow-md hover:bg-red-50">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stock Grid */}
                <div className="bg-gray-50 p-4 rounded-xl mb-5">
                  <label className="text-xs font-bold text-gray-500 mb-3 block">Stock Quantities</label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {SIZES.map((size) => (
                      <div key={size} className="text-center">
                        <span className="text-[10px] font-bold text-gray-400 block mb-1">{size}</span>
                        <input type="number" placeholder="0" {...register(`stock_${size}`)} className="w-full p-2 text-center border rounded-md text-sm outline-none focus:border-blue-500 focus:bg-white transition-all bg-white" />
                      </div>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={handleSaveNewVariant} className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-md flex items-center justify-center gap-2">
                  <Plus size={18} /> Save Variant
                </button>
              </div>
            </div>

            {/* 4. Specifications */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {DUMMY_ATTRIBUTES_LIST.map((attr, i) => (
                  <div key={i}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{attr.label}</label>
                    <select {...register(`attributes.${attr.label}`)} className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:bg-white focus:border-blue-500 transition-all">
                      <option value="">Select {attr.label}</option>
                      {attr.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold text-gray-800 mb-5">Organization</h3>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select {...register('mainCategory')} className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 outline-none cursor-pointer">
                    {DUMMY_CATEGORIES.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select {...register('isListed')} className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 outline-none cursor-pointer">
                    <option value={true}>Active</option>
                    <option value={false}>Draft (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
                  <input {...register('tags')} className="w-full p-2.5 border border-gray-200 rounded-lg outline-none bg-gray-50 focus:bg-white transition-all" />
                  <p className="text-xs text-gray-400 mt-1">Separate tags with commas</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100">
                <button type="submit" disabled={submitting} className="w-full bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed">
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Update Product
                </button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

export default EditProduct;