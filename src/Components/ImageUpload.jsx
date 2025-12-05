import React from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react'; 

const ImageUpload = ({    
  images = [],                
  onUpload,                   
  onRemove,                   
  inputId,                    
  maxImages = 3,
  inputName // Optional: purely for accessibility/debugging, not used for RHF logic
}) => {
  
  return (
    <div className="w-full space-y-4">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-900">
          Upload Images
        </label>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${images.length > maxImages ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
          {images.length} / {maxImages} Uploaded
        </span>
      </div>

      {/* Upload Zone */}
      <div className="group relative">
        <label 
          htmlFor={inputId}
          className={`
            flex flex-col items-center justify-center w-full h-40 
            border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
            ${images.length >= maxImages 
              ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50' 
              : 'border-gray-300 bg-white hover:bg-gray-50 hover:border-amber-500 hover:shadow-sm'
            }
          `}
        >
          <input 
            type='file' 
            multiple 
            accept='image/*' 
            className='hidden' 
            id={inputId}
            name={inputName}
            disabled={images.length >= maxImages}
            onChange={onUpload} 
          />

          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <div className="p-3 bg-gray-100 rounded-full mb-3 group-hover:bg-amber-50 transition-colors">
              <UploadCloud className={`w-6 h-6 ${images.length >= maxImages ? 'text-gray-400' : 'text-gray-500 group-hover:text-amber-600'}`} />
            </div>
            <p className="mb-1 text-sm text-gray-700 font-medium">
              <span className="font-semibold text-amber-900">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              SVG, PNG, JPG or GIF (Max {maxImages} images)
            </p>
          </div>
        </label>
      </div>

      {/* Preview Area */}
      {images.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {Array.from(images).map((file, index) => (
            <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
              <img
                src={URL.createObjectURL(file)}
                alt={`preview ${index}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // Stop the click from bubbling up to the label
                    onRemove && onRemove(index);
                  }} 
                  className="p-2 bg-white rounded-full hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors shadow-lg"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 text-gray-400 text-sm">
          <ImageIcon size={18} />
          <span>No images selected yet.</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;