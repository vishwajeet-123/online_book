import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft, Truck, Package, ShieldCheck, Heart } from "lucide-react";
import { api } from "../services/api.ts";
import { useCart } from "../context/CartContext.tsx";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await api.get(`/books/${id}`);
        setBook(data);
      } catch (err) {
        toast.error("Book not found");
        navigate("/books");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading book details...</div>;
  if (!book) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/books" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 font-medium">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Library
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group "
        >
          <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl relative">
            <img 
              src={book.imageUrl || "https://picsum.photos/seed/" + book.id + "/800/1200"} 
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
          <button className="absolute top-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg text-slate-400 hover:text-red-500 transition-colors">
            <Heart className="h-6 w-6" />
          </button>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-10 py-4"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-widest">{book.category}</span>
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1.5 text-sm font-bold text-slate-900">{book.rating} / 5.0</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">{book.title}</h1>
            <p className="text-2xl text-slate-400 font-medium">by <span className="text-slate-900">{book.author}</span></p>
          </div>

          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            {book.description || "No description available for this masterpiece."}
          </p>

          <div className="flex items-center space-x-12">
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Price</p>
              <p className="text-4xl font-bold text-indigo-600">${book.price}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Availability</p>
              <p className={`text-lg font-bold ${book.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {book.stock > 0 ? `${book.stock} in stock` : 'Out of Stock'}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-center">
            <div className="flex items-center bg-slate-100 p-2 rounded-2xl w-full sm:w-auto">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q-1))}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-slate-50 font-bold"
              >-</button>
              <span className="w-16 text-center font-bold text-xl">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(book.stock, q+1))}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-slate-50 font-bold"
              >+</button>
            </div>
            <button 
              onClick={() => {
                addToCart({ ...book, quantity });
                toast.success("Added to bag");
              }}
              className="flex-1 w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
              <ShoppingCart className="h-6 w-6" />
              <span>Add to Shopping Bag</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-10 border-t border-slate-100">
             <div className="flex items-start space-x-4">
                <Truck className="h-6 w-6 text-slate-400" />
                <div>
                   <p className="font-bold text-slate-900 text-sm">Free Express Delivery</p>
                   <p className="text-xs text-slate-500">Orders over $50 qualify for free shipping.</p>
                </div>
             </div>
             <div className="flex items-start space-x-4">
                <ShieldCheck className="h-6 w-6 text-slate-400" />
                <div>
                   <p className="font-bold text-slate-900 text-sm">Official Edition</p>
                   <p className="text-xs text-slate-500">Guaranteed authentic published copy.</p>
                </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
