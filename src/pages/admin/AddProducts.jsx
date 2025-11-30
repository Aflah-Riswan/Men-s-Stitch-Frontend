

import React from 'react';
import { Image as ImageIcon, } from 'lucide-react'; // Make sure to install lucide-react: npm i lucide-react

import AdminSidebar from '../../Components/AdminSidebar';

const AddProducts = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">

      {/* --- SIDEBAR (Ideally this goes in src/layouts/AdminLayout.jsx) --- */}
      <AdminSidebar />

      {/* --- MAIN CONTENT (src/pages/admin/products/AddProductPage.jsx) --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
          <div className="text-sm text-gray-500">Dashboard / Products / Add New Product</div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN - Product Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Details */}
            <Section title="Basic Details">
              <div className="space-y-4">
                <InputGroup label="Product Title" placeholder="Product title" />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Product Description</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                    placeholder="Product description"
                  ></textarea>
                </div>
              </div>
            </Section>

            {/* Pricing */}
            <Section title="Pricing">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Product Regular price" placeholder="$0.00" />
                <InputGroup label="Product Sale price" placeholder="$0.00" />
              </div>
            </Section>

            {/* Variants */}
            <Section title="Add Variants">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup label="Color Name" placeholder="Color Name" />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Pick your color</label>
                    <input type="color" className="h-11 w-full p-1 rounded-lg border border-gray-300 cursor-pointer" />
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <span className="text-sm text-gray-500 mb-2">Color Images</span>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200">Upload</button>
                </div>
              </div>
            </Section>

            {/* Stock */}
            <Section title="Stock">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <div key={size} className="flex items-center gap-2">
                    <span className="w-8 font-semibold text-gray-600">{size}</span>
                    <input type="number" placeholder="0" className="w-full p-2 border border-gray-300 rounded-lg" />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700">Cancel</button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
              </div>
            </Section>

            {/* Product Attributes */}
            <Section title="Product Attributes">
              <div className="space-y-4">
                <SelectGroup label="Select Fabric" />
                <SelectGroup label="Select Fit" />
                <SelectGroup label="Sleeve" />
                <SelectGroup label="Collar" />
              </div>
            </Section>
          </div>

          {/* RIGHT COLUMN - Images & Meta */}
          <div className="space-y-6">

            {/* Image Upload */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-lg mb-4">Upload Product Image</h3>

              <div className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-6 flex flex-col items-center justify-center text-center mb-4 min-h-[200px]">
                <ImageIcon className="text-blue-400 mb-2" size={32} />
                <p className="text-xs text-gray-500 mb-2">Drag and drop image here, or click add image</p>
                <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm font-medium">Add Image</button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square bg-gray-50 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center">
                    <ImageIcon size={16} className="text-gray-400 mb-1" />
                    <span className="text-[10px] text-blue-500">Add Image</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-semibold text-lg">Categories</h3>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Category</label>
                <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 outline-none">
                  <option>Select your categories</option>
                </select>

                <select className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 outline-none">
                  <option>Select your sub-categories</option>
                </select>
              </div>



              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Tags</label>
                <input type="text" placeholder="Product tags" className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none" />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </div>
                <button className="px-3 py-2  bg-black text-white rounded-lg font-light hover:bg-gray-800 transition">
                  Publish Product
                </button>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

/* --- Reusable Sub-components --- */

const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h3 className="font-semibold text-lg mb-4 text-gray-800">{title}</h3>
    {children}
  </div>
);

const InputGroup = ({ label, placeholder, type = "text" }) => (
  <div className="space-y-2 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
    />
  </div>
);

const SelectGroup = ({ label }) => (
  <div className="space-y-2 w-full">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none">
      <option>Select...</option>
    </select>
  </div>
)

const NavItem = ({ icon, label, active = false }) => (
  <a
    href="#"
    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active
        ? 'bg-black text-white'
        : 'text-gray-600 hover:bg-gray-100'
      }`}
  >
    {icon}
    <span>{label}</span>
  </a>
);

export default AddProducts;