export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') 
    image.src = url
  })

export async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx || !pixelCrop) {
    return null
  }

  // 1. Set canvas size to match the original image dimensions
  canvas.width = image.width
  canvas.height = image.height

  // 2. Draw the original image onto the canvas
  ctx.drawImage(image, 0, 0)

  // 3. Extract the pixel data from the selected crop area
  const data = ctx.getImageData(
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height
  )

  // 4. Resize canvas to the final crop size
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // 5. Paste the extracted pixel data into the resized canvas
  ctx.putImageData(data, 0, 0)

  // 6. Return as Blob
  return new Promise((resolve) => {
    canvas.toBlob((file) => {
      resolve(file)
    }, 'image/jpeg')
  })
}