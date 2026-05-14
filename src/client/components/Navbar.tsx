import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Book, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";
import { useCart } from "../context/CartContext.tsx";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">Elite Bookshelf</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/books" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Browse</Link>
            <Link to="/about" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">About</Link>
            <Link to="/contact" className="text-slate-600 hover:text-indigo-600 transition-colors font-medium">Contact</Link>
            
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={user.role === "ADMIN" ? "/admin" : "/dashboard"} 
                  className="flex items-center space-x-2 text-slate-700 font-medium"
                >
                  <User className="h-5 w-5" />
                  <span>{user.displayName}</span>
                </Link>
                <button 
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <Link to="/books" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700">Browse Books</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700">About</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700">Contact</Link>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700">Cart ({cartCount})</Link>
              <div className="border-t border-slate-100 pt-4">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700">Dashboard</Link>
                    <button onClick={() => { logout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-red-600">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-indigo-600">Login</Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
