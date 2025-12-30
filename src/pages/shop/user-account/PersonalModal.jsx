import React, { useRef, useState, useEffect } from 'react';
import { X, User, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import * as userService from '../../../services/userService'; 

const PersonalDetailsModal = ({ isOpen, onClose, currentUser, onUpdateSuccess }) => {
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || ''
      });
      setImagePreview(currentUser.profilePic || null);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('firstName', formData.firstName || '');
      data.append('lastName', formData.lastName || '');
      if (selectedFile) {
        data.append('profilePic', selectedFile); 
      }
      const response = await userService.updateUserDetails(data);

      if (response.success) {
        toast.success("Profile updated successfully");
        if (onUpdateSuccess) onUpdateSuccess(response.user); 
        onClose();
      }

    } catch (error) {
      console.error("Update Error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-8">Personal Details</h2>

        {/* Profile Picture Section */}
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 border border-gray-200 relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={48} className="text-gray-400" />
            )}
          </div>

          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            <button
              type="button"
              onClick={triggerFileInput}
              className="px-5 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
            >
              Upload New
            </button>
            <button
              type="button"
              onClick={() => { setImagePreview(null); setSelectedFile(null); }}
              className="px-5 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <form className="space-y-6" onSubmit={handleSubmit}>

          <div>
            <label htmlFor="firstName" className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-medium"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white text-lg font-bold rounded-full hover:bg-gray-800 transition-colors mt-8 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetailsModal;