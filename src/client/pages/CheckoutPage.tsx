import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.tsx";
import { api } from "../services/api.ts";
import { toast } from "react-hot-toast";
import { CreditCard, Truck, MapPin, CheckCircle, Package, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CheckoutPage = () => {
  const { cart, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const orderData = {
        items: cart.map(item => ({ bookId: item.id, title: item.title, price: item.price, quantity: item.quantity })),
        totalAmount: total,
        shippingAddress: address || "123 Main St, Bookcity"
      };

      const result = await api.post("/orders", orderData);
      setOrderComplete(result);
      setStep(3);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err: any) {
      toast.error(err.error || "Failed to place order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && !orderComplete) {
    return <div className="text-center py-20">Your cart is empty. Nothing to checkout.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Steps Indicator */}
      <div className="flex justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shadow-md ${
              step >= s ? "bg-indigo-600 text-white" : "bg-white text-slate-400 border border-slate-100"
            }`}
          >
            {step > s ? <CheckCircle className="h-5 w-5" /> : s}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-50"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold flex items-center">
                <Truck className="mr-3 text-indigo-600" />
                Shipping Details
              </h2>
              <p className="text-slate-500">Where should we send your literary treasures?</p>
            </div>
            
            <div className="space-y-4">
               <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <textarea 
                    placeholder="Enter your full shipping address..." 
                    rows={4}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  ></textarea>
               </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!address}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              <span>Next: Payment Info</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-50"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold flex items-center">
                <CreditCard className="mr-3 text-indigo-600" />
                Payment Integration
              </h2>
              <p className="text-slate-500">Dummy payment gateway for Elite Bookshelf.</p>
            </div>

            <div className="p-8 bg-slate-900 rounded-3xl text-white space-y-6">
               <div className="flex justify-between items-start">
                  <div className="w-12 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-inner"></div>
                  <Package className="h-8 w-8 text-indigo-400" />
               </div>
               <div className="space-y-1">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">Card Holder</p>
                  <p className="text-lg font-bold font-mono tracking-wider italic">ELITE CUSTOMER</p>
               </div>
               <div className="flex justify-between items-end">
                  <p className="text-xl font-bold font-mono">**** **** **** 8888</p>
                  <p className="text-sm font-mono opacity-60">12 / 28</p>
               </div>
            </div>

            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex justify-between items-center">
               <span className="font-bold text-slate-700">Total Charged</span>
               <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Complete Purchase"}
            </button>
            <button onClick={() => setStep(1)} className="w-full text-slate-400 font-bold hover:text-slate-600">Back to Shipping</button>
          </motion.div>
        )}

        {step === 3 && orderComplete && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-2xl border border-emerald-50"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full mb-4">
              <CheckCircle className="h-12 w-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-slate-900">Order Confirmed!</h2>
              <p className="text-slate-500 italic">Bill Reference: <span className="font-bold text-indigo-600">{orderComplete.paymentId}</span></p>
            </div>

            <div className="bg-slate-50 p-8 rounded-3xl text-left space-y-4">
               <h3 className="font-bold border-b border-slate-200 pb-2">Order Details</h3>
               {orderComplete.items.map((item: any, i: number) => (
                 <div key={i} className="flex justify-between text-sm">
                   <span>{item.title} (x{item.quantity})</span>
                   <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                 </div>
               ))}
               <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-lg font-bold">
                 <span>Grand Total</span>
                 <span className="text-indigo-600">${orderComplete.totalAmount.toFixed(2)}</span>
               </div>
            </div>

            <div className="pt-8 space-y-4">
              <button 
                onClick={() => navigate("/dashboard")}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold transition-all"
              >
                View Order History
              </button>
              <button 
                onClick={() => navigate("/books")}
                className="w-full bg-transparent text-indigo-600 font-bold"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutPage;
