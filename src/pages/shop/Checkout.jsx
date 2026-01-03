import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trash2, Plus, ArrowRight, Circle, CheckCircle, X } from 'lucide-react';
import * as addressService from '../../services/addressService';
import * as cartService from '../../services/cartService';
import { toast } from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation()
  const [paymentSummary, setPaymentSummary] = useState({
    subTotal: 0,
    discount: 0,
    shippingFee: 0,
    grandTotal: 0
  });

  useEffect(() => {
    const init = async () => {
      try {
        const [addrRes, cartRes] = await Promise.all([
          addressService.getAddress(),
          cartService.getCartItems()
        ]);

        const addrList = addrRes.data.addresses || [];
        setAddresses(addrList);
        
        const defaultAddr = addrList.find(a => a.isDefault);
        if (defaultAddr) setSelectedAddress(defaultAddr._id);
        else if (addrList.length > 0) setSelectedAddress(addrList[0]._id);

        setCart(cartRes.data);
        setPaymentSummary ({
          subTotal : cartRes.data.subTotal,
          discount : cartRes.data.discount,
          shippingFee : cartRes.data.shippingFee === 0 ? 'Free' : cartRes.data.shippingFee,
          grandTotal : cartRes.data.grandTotal
        })
      } catch (error) {
        console.error(error);
        toast.error("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);


  const handleProceed = () => {
    if (!selectedAddress) return toast.error("Please select a shipping address");   
    navigate('/payment', { state: { addressId: selectedAddress , paymentSummary} });
  };


  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!cart || !cart.items.length) return <div className="p-10 text-center">Your cart is empty</div>;

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          {/* LEFT: Address Selection */}
          <div className="lg:col-span-7 mb-10 lg:mb-0">
            <h2 className="text-lg font-semibold mb-6">Select Shipping Address</h2>
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div 
                  key={addr._id}
                  onClick={() => setSelectedAddress(addr._id)}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddress === addr._id ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="mt-1 mr-4">
                    {selectedAddress === addr._id ? <CheckCircle size={20} className="text-black fill-current" /> : <Circle size={20} className="text-gray-400" />}
                  </div>
                  <div>
                    <span className="block text-sm font-bold">{addr.firstName} {addr.lastName} <span className="text-xs font-normal text-gray-500">({addr.label})</span></span>
                    <span className="block text-sm text-gray-600 mt-1">{addr.addressLine1}, {addr.addressLine2}</span>
                    <span className="block text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</span>
                    <span className="block text-sm text-gray-600 mt-1">Phone: {addr.phoneNumber}</span>
                  </div>
                </div>
              ))}

              <button 
                onClick={() => navigate('/addresses/add',{
                  state : { from : location.pathname}
                })}
                className="w-full flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-black hover:border-black transition"
              >
                <Plus size={20} className="mr-2" /> Add New Address
              </button>
            </div>
          </div>

          {/* RIGHT: Cart Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-gray-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="max-h-60 overflow-y-auto mb-6 pr-2">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-4 mb-4">
                     <img src={item.image || "https://placehold.co/150"} className="w-16 h-16 object-cover rounded bg-gray-100" alt={item.productId?.productName} />
                     <div className="flex-1">
                        <p className="text-sm font-bold line-clamp-1">{item.productId?.productName}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} | Size: {item.size}</p>
                        <p className="text-sm font-medium mt-1">₹{item.totalPrice}</p>
                     </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-gray-600 border-t pt-4">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{cart.subTotal}</span></div>
                <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{cart.discount}</span></div>
                <div className="flex justify-between text-green-600"><span>Delivery</span><span>{cart.shippingFee === 0 ? 'Free' : `₹${cart.shippingFee}`}</span></div>
                <div className="flex justify-between text-base font-bold text-black pt-2 border-t mt-2"><span>Total</span><span>₹{cart.grandTotal}</span></div>
              </div>

              <button 
                onClick={handleProceed}
                className="w-full bg-black text-white py-4 rounded-full mt-6 flex items-center justify-center hover:bg-gray-800 transition"
              >
                Proceed to Payment <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;