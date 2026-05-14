import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.tsx";
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 space-y-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Your bag is empty</h2>
          <p className="text-slate-500">Looks like you haven't added any literary treasures yet.</p>
        </div>
        <Link to="/books" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
          Explore Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-slate-900 mb-12">Shopping Bag</h1>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Cart Items */}
        <div className="flex-1 space-y-8">
          {cart.map((item) => (
            <motion.div 
              layout
              key={item.id}
              className="flex items-center space-x-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm"
            >
              <div className="w-24 h-32 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden">
                <img 
                  src={item.imageUrl || "https://picsum.photos/seed/" + item.id + "/200/300"} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-500">Edition: Hardcover</p>
                <p className="text-indigo-600 font-bold mt-2">${item.price}</p>
              </div>
              <div className="flex items-center bg-slate-50 p-1.5 rounded-xl">
                 <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer"
                 >
                    <Minus className="h-4 w-4" />
                 </button>
                 <span className="w-8 text-center font-bold">{item.quantity}</span>
                 <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer"
                 >
                    <Plus className="h-4 w-4" />
                 </button>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="w-full lg:w-96">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white space-y-8 sticky top-24">
            <h2 className="text-2xl font-bold">Order Summary</h2>
            
            <div className="space-y-4 text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="flex justify-between">
                 <span>Taxes (Estimated)</span>
                 <span className="text-white">$0.00</span>
              </div>
              <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-bold text-indigo-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate("/checkout")}
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/50"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <div className="space-y-2 text-center">
               <p className="text-[10px] text-slate-500 uppercase tracking-widest">Safe & Secure Payment</p>
               <div className="flex justify-center space-x-2 opacity-50 grayscale brightness-200">
                  <div className="w-8 h-5 bg-slate-400 rounded-sm"></div>
                  <div className="w-8 h-5 bg-slate-400 rounded-sm"></div>
                  <div className="w-8 h-5 bg-slate-400 rounded-sm"></div>
               </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
