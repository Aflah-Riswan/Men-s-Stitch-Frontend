import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Wallet as WalletIcon, Plus, History, ArrowUpRight, ArrowDownLeft, Gift, Copy } from 'lucide-react';
import * as walletService from '../../../services/walletService'
import UserSidebar from '../../../Components/user-account-components/UserSidebar';
import NewsLetter from '../../../Components/NewsLetter';
import Footer from '../../../Components/Footer';
import * as paymentService from '../../../services/paymentService'

const Wallet = () => {

  const [balance, setBalance] = useState();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('add money for purchase')
  const [transactions, setTransactions] = useState([]);
  const [ referralCode , setReferralCode] = useState('')
  useEffect(() => {
    fetchWalletDetails()
  }, [])

  const fetchWalletDetails = async () => {
    try {
      const response = await walletService.getMyWallet()
      console.log(" response : ", response)
      setBalance(response.walletBalance)
      setTransactions(response.transactionDetails)
      setReferralCode(response.referralCode)
    } catch (error) {
      console.log(error)
    }
  }

  const loadRazorPay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.append(script)
    })
  }

  const handleRazorPayment = async () => {
    try {
      const isScripted = await loadRazorPay()
      if (!isScripted) return toast.error('something wnet wrong in script loading')
       
      const orderData = await paymentService.createPayment(amount)
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Men's Stitch",
        description: description,
        order_id: orderData.id,

        handler: async function (response) {
          try {
            const paymentData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              amount,
              description
            }
            const apiResponse = await walletService.addMoneyToWallet(paymentData)
            setAmount('')
            fetchWalletDetails()
            toast.success(" money added to your wallet")
          } catch (error) {
             console.log(" errro  : ",error)
          }
        },
         theme: { color: "#000000" }
      }
      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      console.log(error)
    }
  }
  const handleAddMoney = async () =>{

    try {
      setLoading(true)
      await handleRazorPayment ()
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCopyCode = () =>{

  }
  return (
    // 1. Root Container (Matches Wishlist)
<div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">

      <div className="flex-grow max-w-7xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          <UserSidebar activeTab="Wallet" />

          {/* Main Content Area */}
          <main className="flex-1 min-h-[400px]">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Wallet</h1>

            <div className="space-y-8">

              {/* BALANCE CARD */}
              <div className="bg-black text-white rounded-2xl p-8 flex justify-between items-center shadow-lg hover:shadow-xl transition-shadow">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">Available Balance</p>
                  <h2 className="text-4xl font-bold">₹{Number(balance).toFixed(2)}</h2>
                </div>
                <div className="p-4 bg-gray-800 rounded-full">
                  <WalletIcon size={32} className="text-white" />
                </div>
              </div>

              {/* --- 5. NEW SECTION: REFERRAL CARD --- */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden shadow-sm">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
                       <Gift className="text-blue-600" size={20}/> Refer & Earn ₹100
                    </h3>
                    <p className="text-blue-700 max-w-md text-sm leading-relaxed">
                      Share your unique code with friends. They get <span className="font-bold">₹50</span> instantly, 
                      and you earn <span className="font-bold">₹100</span> after their first order!
                    </p>
                  </div>

                  {/* Code Display & Copy Button */}
                  <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-blue-200 shadow-sm shrink-0">
                    <div className="pl-4 font-mono font-bold text-lg tracking-wider text-gray-800 border-r border-gray-100 pr-4">
                      {referralCode || 'LOADING...'}
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-md shadow-blue-200"
                    >
                      <Copy size={16} /> Copy
                    </button>
                  </div>
                </div>
                {/* Decorative Background Icon */}
                <Gift className="absolute -bottom-6 -right-6 text-blue-100 opacity-50 w-32 h-32 rotate-12 -z-0 pointer-events-none" />
              </div>
      

              {/* ADD MONEY SECTION */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <Plus size={20} /> Add Money
                </h3>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount (e.g. 500)"
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors font-medium"
                    />
                  </div>
                  <button
                    onClick={handleAddMoney}
                    disabled={loading}
                    className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap shadow-lg shadow-gray-200"
                  >
                    {loading ? "Processing..." : "Add Funds"}
                  </button>
                </div>

                <div className="flex gap-3 mt-4 flex-wrap">
                  {[500, 1000, 2000, 5000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt)}
                      className="px-4 py-2 text-sm border border-gray-200 rounded-full hover:border-black hover:bg-gray-50 transition-colors"
                    >
                      + ₹{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* TRANSACTION HISTORY */}
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center gap-2">
                  <History size={18} className="text-gray-600" />
                  <span className="font-bold text-gray-900">Transaction History</span>
                </div>
                <div className="divide-y divide-gray-100 bg-white">
                  {  transactions.map((tx) => (
                    <div key={tx._id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${tx.transactionType === 'Credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {tx.transactionType === 'Credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{tx.description}</p>
                          <p className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`font-bold ${tx.transactionType === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.transactionType === 'Credit' ? '+' : '-'} ₹{tx.amount}
                      </span>
                    </div>
                  )) }
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>

      {/* Footer Section */}
      <div className="relative mt-24">
        <div className="absolute top-0 left-0 right-0 transform -translate-y-1/2 px-4 z-10">
          <div className="max-w-7xl mx-auto">
            <NewsLetter />
          </div>
        </div>
        <div className="bg-gray-100 pt-32 pb-8 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <Footer />
          </div>
        </div>
      </div>

    </div>

  );
};

export default Wallet;