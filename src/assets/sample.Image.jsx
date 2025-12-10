
import React, { useState, useRef } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css' // Import CSS for the drag handles
import { getCroppedImg } from '../utils/cropUtils'
import { X, Check } from 'lucide-react'

// Helper to center the crop box initially
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90, // Start with 90% width selection
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

const ImageCropper = ({ imageSrc, onCropDone, onCropCancel }) => {
  const [crop, setCrop] = useState()
  const [completedCrop, setCompletedCrop] = useState(null)
  const imgRef = useRef(null) // Reference to the displayed image

  // Run when image loads to set the initial box size
  function onImageLoad(e) {
    const { width, height } = e.currentTarget
    // Start with a centered crop (free aspect ratio)
    setCrop(centerAspectCrop(width, height, 0)) 
  }

  const handleCrop = async () => {
    if (!completedCrop || !imgRef.current) return

    // 1. Calculate the SCALE. (Displayed size vs Actual image size)
    const image = imgRef.current
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // 2. Convert the visual crop to actual pixel coordinates for the original image
    const actualPixelCrop = {
      x: completedCrop.x * scaleX,
      y: completedCrop.y * scaleY,
      width: completedCrop.width * scaleX,
      height: completedCrop.height * scaleY,
    }

    try {
      // 3. Send these calculated coordinates to your utility
      const croppedBlob = await getCroppedImg(imageSrc, actualPixelCrop)
      const file = new File([croppedBlob], "cropped-img.jpg", { type: "image/jpeg" })
      onCropDone(file)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl overflow-hidden w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white z-10 shrink-0">
          <h3 className="font-bold text-gray-800">Crop Image</h3>
          <button type="button" onClick={onCropCancel} className="text-gray-500 hover:text-red-500 transition-colors">
             <X size={24} />
          </button>
        </div>

        {/* Cropper Area (Scrollable) */}
        <div className="flex-1 overflow-auto bg-gray-900 flex items-center justify-center p-4">
          <ReactCrop 
            crop={crop} 
            onChange={(c) => setCrop(c)} 
            onComplete={(c) => setCompletedCrop(c)}
            // You can lock aspect ratio here if needed, e.g., aspect={1}
          >
            <img 
              ref={imgRef}
              src={imageSrc} 
              alt="Crop me"
              onLoad={onImageLoad}
              style={{ maxHeight: '70vh', maxWidth: '100%' }} // Ensure image fits in modal
            />
          </ReactCrop>
        </div>

        {/* Controls */}
        <div className="p-4 bg-white border-t space-y-4 shrink-0">
          <p className="text-xs text-gray-500 text-center">Drag corners to resize • Drag box to move</p>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onCropCancel} 
              className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleCrop} 
              className="flex-1 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 flex justify-center items-center gap-2"
            >
              <Check size={18} /> Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper