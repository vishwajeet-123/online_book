import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Truck, ShieldCheck, Star } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../services/api.ts";

const HomePage = () => {
  const [featuredBooks, setFeaturedBooks] = useState<any[]>([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.get("/books");
        setFeaturedBooks(data.slice(0, 4));
      } catch (err) {
        console.error("Error loading featured books", err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
            alt="Library" 
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Discover Your Next <span className="text-indigo-400">Great Adventure</span>
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Explore our curated selection of thousands of books, from timeless classics 
              to contemporary masterpieces. Managed with precision, delivered with care.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/books" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2">
                <span>Start Reading</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/about" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all text-center">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <BookOpen className="h-8 w-8" />, title: "Huge Collection", desc: "Access to over 50,000 titles across all genres reachable in seconds." },
            { icon: <Truck className="h-8 w-8" />, title: "Fast Delivery", desc: "Get your books delivered to your doorstep within 24-48 hours globally." },
            { icon: <ShieldCheck className="h-8 w-8" />, title: "Secure Payment", desc: "Industry-standard encryption for all your transactions and data." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4"
            >
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="text-slate-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Featured Releases</h2>
            <p className="text-slate-600">Hand-picked selections from our editors this month.</p>
          </div>
          <Link to="/books" className="text-indigo-600 font-bold flex items-center space-x-2 group">
            <span>View All Library</span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {featuredBooks.length > 0 ? (
            featuredBooks.map((book) => (
              <motion.div 
                key={book.id}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Link to={`/books/${book.id}`}>
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 mb-4 shadow-md">
                    <img 
                      src={book.imageUrl || "https://picsum.photos/seed/" + book.id + "/400/600"} 
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-slate-500">{book.author}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-indigo-600 font-bold">${book.price}</span>
                      <div className="flex items-center text-amber-500 text-xs">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="ml-1 font-bold">{book.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
             Array(4).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[3/4] bg-slate-200 rounded-2xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <BookOpen className="h-64 w-64 text-indigo-400 rotate-12" />
           </div>
           <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
             <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">Ready to start your literary journey?</h2>
             <p className="text-slate-400 text-lg">Join thousands of readers and get access to exclusive editions and events.</p>
             <div className="flex justify-center flex-wrap gap-4 pt-4">
               <Link to="/register" className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                  Join Elite Bookshelf
               </Link>
               <Link to="/login" className="bg-transparent border border-slate-700 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all">
                  Sign In
               </Link>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
