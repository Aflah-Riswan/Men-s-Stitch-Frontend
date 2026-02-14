
export default function ProductDetailsTab({ product }) {


  return (
    <div className="container mx-auto px-4 md:px-6 py-2 mb-16 animate-fadeIn">

      {/* Product Description Block */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-black mb-4">
          Product Description
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm md:text-base">
          {product.productDescription || "No description available."}
        </p>
      </div>

      {/* Product Details List Block */}
      <div>
        <h3 className="text-xl font-bold text-black mb-4">
          Product Details
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600 text-sm md:text-base">
          {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
            <li key={key}>
              <span className="font-medium text-gray-800">{key}:</span> {value}
            </li>
          ))}

          {product.tags && product.tags.length > 0 && (
            <li><span className="font-medium text-gray-800">Tags:</span> {product.tags.join(", ")}</li>
          )}
        </ul>
      </div>

      {/* Bottom Border Line */}
      <div className="mt-12 border-t border-gray-200 w-full"></div>
    </div>
  );
}