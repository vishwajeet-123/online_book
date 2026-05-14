import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Star, ShoppingCart, ChevronRight } from "lucide-react";
import { api } from "../services/api.ts";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext.tsx";
import { toast } from "react-hot-toast";

const BookListingPage = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const { addToCart } = useCart();

  const categories = ["All", "Fiction", "Non-Fiction", "Science", "Self-Help", "History"];
  const currentCategory = searchParams.get("category") || "All";

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (currentCategory !== "All") query.append("category", currentCategory);
        if (searchTerm) query.append("search", searchTerm);
        
        const data = await api.get(`/books?${query.toString()}`);
        setBooks(data);
      } catch (err) {
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [currentCategory, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(prev => {
      if (searchTerm) prev.set("search", searchTerm);
      else prev.delete("search");
      return prev;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Our Library</h1>
          <p className="text-slate-600">Curated collection of world-class literature.</p>
        </div>
        
        <form onSubmit={handleSearch} className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title or author..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Categories
            </h3>
            <div className="flex flex-wrap md:flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSearchParams({ category: cat })}
                  className={`px-4 py-2 rounded-xl text-left transition-all ${
                    currentCategory === cat 
                    ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100" 
                    : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="flex-1 space-y-8">
           <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm">Showing <span className="font-bold text-slate-900">{books.length}</span> results</p>
           </div>

           {loading ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
               {Array(6).fill(0).map((_, i) => (
                 <div key={i} className="animate-pulse space-y-4">
                   <div className="aspect-[3/4] bg-slate-200 rounded-2xl"></div>
                   <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                   <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                 </div>
               ))}
             </div>
           ) : books.length > 0 ? (
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                {books.map((book) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={book.id}
                    className="group bg-white rounded-3xl p-4 border border-transparent hover:border-slate-100 hover:shadow-xl transition-all duration-300"
                  >
                    <Link to={`/books/${book.id}`} className="block relative overflow-hidden rounded-2xl mb-4 group">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img 
                          src={book.imageUrl || "https://picsum.photos/seed/" + book.id + "/400/600"} 
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                        <div className="bg-white p-2 rounded-full shadow-lg">
                           <ChevronRight className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                    </Link>

                    <div className="space-y-2">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">{book.category}</span>
                          <div className="flex items-center text-amber-500 text-xs">
                             <Star className="h-3 w-3 fill-current" />
                             <span className="ml-1 font-bold">{book.rating}</span>
                          </div>
                       </div>
                       <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{book.title}</h3>
                       <p className="text-xs text-slate-500">{book.author}</p>
                       <div className="flex items-center justify-between pt-2">
                          <span className="text-lg font-bold text-slate-900">${book.price}</span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              addToCart({ ...book, quantity: 1 });
                              toast.success("Added to cart");
                            }}
                            className="bg-slate-900 text-white p-2 rounded-xl hover:bg-indigo-600 transition-all"
                          >
                             <ShoppingCart className="h-4 w-4" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
             </div>
           ) : (
             <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No books found</h3>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
                <button 
                  onClick={() => setSearchParams({})}
                  className="mt-6 text-indigo-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default BookListingPage;
