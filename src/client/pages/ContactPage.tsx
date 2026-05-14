import React from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const ContactPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
      <div className="text-center space-y-4 flex flex-col items-center">
         <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">How Can We <span className="text-indigo-600 underline">Help</span>?</h1>
         <p className="text-xl text-slate-600 max-w-2xl">Our global support team is available 24/7 to ensure your reading journey is never interrupted.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
         {/* Contact Info */}
         <div className="space-y-12">
            <div className="space-y-8">
               {[
                  { icon: <Mail className="h-6 w-6" />, label: "Email Support", value: "hello@elitebookshelf.com", desc: "Response within 2 hours" },
                  { icon: <Phone className="h-6 w-6" />, label: "Call Us", value: "+1 (888) ELITE-BK", desc: "Toll-free worldwide" },
                  { icon: <MapPin className="h-6 w-6" />, label: "Visit Headquarters", value: "450 Market St, San Francisco", desc: "9 AM - 6 PM PST" }
               ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-6 p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                     <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                        {item.icon}
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{item.label}</p>
                        <p className="text-lg font-bold text-slate-900">{item.value}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>

            <div className="bg-slate-900 p-10 rounded-[3rem] text-white flex items-center justify-between">
               <div className="space-y-2">
                  <h3 className="text-xl font-bold italic">Live Concierge</h3>
                  <p className="text-slate-400 text-sm">Need a personal recommendation?</p>
               </div>
               <button className="bg-white text-slate-900 p-4 rounded-full hover:bg-slate-200 transition-all">
                  <MessageCircle className="h-6 w-6" />
               </button>
            </div>
         </div>

         {/* Contact Form */}
         <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl space-y-10">
            <h2 className="text-3xl font-bold text-slate-900">Send an Inquiry</h2>
            <form className="space-y-6">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-500">Full Name</label>
                     <input type="text" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-slate-500">Email Address</label>
                     <input type="email" className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">Subject</label>
                  <select className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none">
                     <option>Inquiry about Order</option>
                     <option>Technical Support</option>
                     <option>Bulk Purchase</option>
                     <option>Other</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500">Message</label>
                  <textarea rows={5} className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 focus:ring-2 focus:ring-indigo-600 outline-none resize-none"></textarea>
               </div>
               <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                  <Send className="h-5 w-5" />
                  <span>Transmit Message</span>
               </button>
            </form>
         </div>
      </div>
    </div>
  );
};

export default ContactPage;
