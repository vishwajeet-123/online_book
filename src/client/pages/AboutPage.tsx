import React from "react";
import { BookOpen, ShieldCheck, Heart, Award } from "lucide-react";
import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center text-center">
         <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=2000" 
               alt="Library" 
               className="w-full h-full object-cover brightness-[0.3]"
               referrerPolicy="no-referrer"
            />
         </div>
         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-3xl space-y-4 px-4"
         >
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">Our <span className="text-indigo-400 italic">Literary</span> Legacy</h1>
            <p className="text-xl text-slate-300">Founded in 1998, Elite Bookshelf has been at the forefront of curating knowledge and fostering a love for reading globally.</p>
         </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Founded", value: "1998" },
            { label: "Active Readers", value: "2M+" },
            { label: "Total Titles", value: "50k+" },
            { label: "Awards Won", value: "14" }
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-3xl font-bold text-indigo-600">{stat.value}</p>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
         <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">The Vision Behind Elite Bookshelf</h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
               <p>
                  At Elite Bookshelf, we believe that books are not just pages bound together, but gateways to new dimensions. 
                  Our journey started with a small brick-and-mortar library in downtown SF, and today, we serve millions of 
                  passionate readers across 40 countries through our advanced Management System.
               </p>
               <p>
                  Our mission is simple: to make quality literature accessible, organized, and inspiring. 
                  We leverage modern technology while preserving the traditional soul of reading.
               </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
               <div className="flex items-start space-x-3">
                  <Award className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <span className="font-bold text-slate-900">Quality Certified</span>
               </div>
               <div className="flex items-start space-x-3">
                  <Heart className="h-6 w-6 text-indigo-600 flex-shrink-0" />
                  <span className="font-bold text-slate-900">Reader Focused</span>
               </div>
            </div>
         </div>
         <div className="relative">
            <div className="aspect-square rounded-[4rem] bg-indigo-600 overflow-hidden shadow-2xl skew-y-3">
               <img 
                  src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=1000" 
                  alt="Reading" 
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
               />
            </div>
         </div>
      </section>
    </div>
  );
};

export default AboutPage;
