import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { api } from "../services/api.ts";
import { Package, Clock, MapPin, History, User as UserIcon, Book } from "lucide-react";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get("/orders/history");
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
         <div className="w-32 h-32 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center">
            <UserIcon className="h-16 w-16" />
         </div>
         <div className="space-y-4 text-center md:text-left flex-1">
            <div className="space-y-1">
               <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">{user?.role}</span>
               <h1 className="text-4xl font-bold text-slate-900">{user?.displayName}</h1>
               <p className="text-slate-500">{user?.email}</p>
            </div>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2">
                  <Package className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-bold">{orders.length} Orders</span>
               </div>
               <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-bold">Member for 2 months</span>
               </div>
            </div>
         </div>
         <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
            Edit Profile
         </button>
      </div>

      <div className="space-y-8">
        <div className="flex items-center space-x-3">
           <History className="h-6 w-6 text-indigo-600" />
           <h2 className="text-2xl font-bold text-slate-900">Order History</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
             {Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-3xl animate-pulse"></div>)}
          </div>
        ) : orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
             {orders.map((order) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order.id} 
                  className="bg-white border border-slate-100 p-8 rounded-3xl space-y-6 hover:shadow-lg transition-shadow"
                >
                   <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-slate-400 uppercase">Order ID</p>
                         <p className="font-mono text-indigo-600 font-bold">{order.id}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-slate-400 uppercase">Status</p>
                         <span className="px-3 py-1 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-full uppercase italic">
                            {order.status}
                         </span>
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-slate-400 uppercase">Total Amount</p>
                         <p className="font-bold text-lg text-slate-900">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-xs font-bold text-slate-400 uppercase">Date</p>
                         <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-slate-50 flex items-center space-x-4">
                      <div className="flex -space-x-3 overflow-hidden">
                        {order.items.slice(0, 3).map((item: any, i: number) => (
                          <div key={i} className="inline-block h-10 w-10 rounded-lg ring-4 ring-white bg-slate-200 overflow-hidden shadow-sm">
                             <Book className="h-full w-full p-2 text-slate-400" />
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-slate-500 font-medium">
                         {order.items.length} items purchased
                      </p>
                      <div className="flex-1"></div>
                      <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm cursor-pointer hover:underline">
                         <span>Download Bill</span>
                         <Clock className="h-4 w-4" />
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
             <p className="text-slate-500">No orders yet. Start your collection today!</p>
             <Link to="/books" className="mt-6 inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">Shop Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
