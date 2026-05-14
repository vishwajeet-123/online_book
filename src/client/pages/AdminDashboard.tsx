import React, { useEffect, useState } from "react";
import { api } from "../services/api.ts";
import { 
  Plus, Users, ShoppingCart, DollarSign, Book as BookIcon, Trash2, Edit2, 
  BarChart3, LayoutDashboard, Settings, LogOut 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [view, setView] = useState('overview'); // 'overview', 'books', 'users'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    price: "",
    stock: "",
    description: "",
    imageUrl: "",
    rating: "4.5"
  });

  const fetchAdminData = async () => {
    try {
      const statsData = await api.get("/admin/stats");
      setStats(statsData);
      
      const booksData = await api.get("/books");
      setBooks(booksData);

      const usersData = await api.get("/admin/users");
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching admin data", err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleOpenModal = (book: any = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        category: book.category,
        price: book.price.toString(),
        stock: book.stock.toString(),
        description: book.description,
        imageUrl: book.imageUrl,
        rating: book.rating.toString()
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: "",
        author: "",
        category: "Fiction",
        price: "",
        stock: "",
        description: "",
        imageUrl: "",
        rating: "4.5"
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      rating: parseFloat(formData.rating)
    };

    try {
      if (editingBook) {
        await api.put(`/books/${editingBook.id}`, payload);
        toast.success("Book updated");
      } else {
        await api.post("/books", payload);
        toast.success("Book added");
      }
      setIsModalOpen(false);
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to save book");
    }
  };

  const deleteBook = async (id: string) => {
     if(!confirm("Are you sure you want to delete this book?")) return;
     try {
        await api.delete(`/books/${id}`);
        setBooks(books.filter(b => b.id !== id));
        toast.success("Book deleted");
     } catch (err) {
        toast.error("Failed to delete book");
     }
  };

  const chartData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 600 },
    { name: 'Thu', sales: 800 },
    { name: 'Fri', sales: 500 },
    { name: 'Sat', sales: 900 },
    { name: 'Sun', sales: 700 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col pt-8">
        <div className="px-8 mb-12">
           <h2 className="text-xl font-bold text-indigo-400">Admin Control</h2>
           <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Management Suite v1.0</p>
        </div>
        
        <nav className="flex-1 space-y-2 px-4 text-sm font-medium">
           <button 
            onClick={() => setView('overview')}
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all ${view === 'overview' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
           >
              <LayoutDashboard className="h-5 w-5" />
              <span>Overview</span>
           </button>
           <button 
            onClick={() => setView('books')}
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all ${view === 'books' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
           >
              <BookIcon className="h-5 w-5" />
              <span>Library Management</span>
           </button>
           <button 
            onClick={() => setView('users')}
            className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all ${view === 'users' ? 'bg-indigo-600 text-white' : 'hover:bg-white/5 text-slate-400'}`}
           >
              <Users className="h-5 w-5" />
              <span>User Base</span>
           </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button className="w-full flex items-center space-x-3 p-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
              <LogOut className="h-5 w-5" />
              <span>Logout Admin</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-auto">
        {view === 'overview' && (
          <div className="space-y-12">
            <div className="flex justify-between items-end">
               <div className="space-y-1">
                  <h1 className="text-4xl font-bold text-slate-900">Ecosystem Overview</h1>
                  <p className="text-slate-500">Live analytics for Elite Bookshelf.</p>
               </div>
               <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
                  <div className="flex items-center text-xs text-slate-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                    Systems Nominal
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { icon: <BookIcon className="text-blue-600" />, label: "Total Books", value: stats?.totalBooks || 0, color: "bg-blue-50" },
                { icon: <ShoppingCart className="text-indigo-600" />, label: "Total Orders", value: stats?.totalOrders || 0, color: "bg-indigo-50" },
                { icon: <Users className="text-emerald-600" />, label: "Total Users", value: stats?.totalUsers || 0, color: "bg-emerald-50" },
                { icon: <DollarSign className="text-amber-600" />, label: "Gross Revenue", value: `$${stats?.totalSales?.toFixed(2) || 0}`, color: "bg-amber-50" }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                   <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                      {stat.icon}
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                   </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-bold flex items-center">
                    <BarChart3 className="mr-3 text-indigo-600" />
                    Sales Velocity
                 </h2>
               </div>
               <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </div>
        )}

        {view === 'books' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
               <h2 className="text-3xl font-bold">Library Inventory</h2>
               <button 
                onClick={() => handleOpenModal()}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
               >
                  <Plus className="h-5 w-5" />
                  <span>Add New Edition</span>
               </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 italic text-slate-400 text-sm">
                     <tr>
                        <th className="px-8 py-4 font-normal">Preview</th>
                        <th className="px-8 py-4 font-normal">Book Title</th>
                        <th className="px-8 py-4 font-normal">Author</th>
                        <th className="px-8 py-4 font-normal">Price</th>
                        <th className="px-8 py-4 font-normal">Stock</th>
                        <th className="px-8 py-4 font-normal text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {books.map((book) => (
                        <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-8 py-6">
                              <img 
                                src={book.imageUrl || `https://picsum.photos/seed/${book.id}/200/300`} 
                                alt="" 
                                className="w-12 h-16 object-cover rounded shadow-sm bg-slate-100"
                                referrerPolicy="no-referrer"
                              />
                           </td>
                           <td className="px-8 py-6 font-bold text-slate-900">{book.title}</td>
                           <td className="px-8 py-6 text-slate-500">{book.author}</td>
                           <td className="px-8 py-6 font-bold text-indigo-600">${book.price}</td>
                           <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${book.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                 {book.stock} units
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex justify-end space-x-2">
                                 <button 
                                  onClick={() => handleOpenModal(book)}
                                  className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                                 >
                                  <Edit2 className="h-5 w-5" />
                                 </button>
                                 <button 
                                  onClick={() => deleteBook(book.id)} 
                                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                 >
                                  <Trash2 className="h-5 w-5" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-10">
                  <h3 className="text-2xl font-bold mb-8 text-slate-900">
                    {editingBook ? 'Edit Book Details' : 'Add New Edition to Library'}
                  </h3>
                  
                  <form onSubmit={handleSaveBook} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
                        <input 
                          required
                          type="text" 
                          value={formData.title}
                          onChange={e => setFormData({...formData, title: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Author</label>
                        <input 
                          required
                          type="text" 
                          value={formData.author}
                          onChange={e => setFormData({...formData, author: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price ($)</label>
                        <input 
                          required
                          type="number" 
                          step="0.01"
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stock</label>
                        <input 
                          required
                          type="number" 
                          value={formData.stock}
                          onChange={e => setFormData({...formData, stock: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                          <option>Fiction</option>
                          <option>Non-Fiction</option>
                          <option>Science</option>
                          <option>Self-Help</option>
                          <option>History</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                      <input 
                        type="url" 
                        value={formData.imageUrl}
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                      <textarea 
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none" 
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="flex-1 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        {editingBook ? 'Update Edition' : 'Create Edition'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {view === 'users' && (
           <div className="space-y-8">
              <h2 className="text-3xl font-bold">Patron Base</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {users.map((user) => (
                    <div key={user.uid} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center space-x-6">
                       <div className="w-16 h-16 bg-slate-900 text-indigo-400 rounded-2xl flex items-center justify-center font-bold text-xl uppercase">
                          {user.displayName.charAt(0)}
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-slate-900">{user.displayName}</h4>
                          <p className="text-sm text-slate-500">{user.email}</p>
                       </div>
                       <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                             {user.role}
                          </span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
