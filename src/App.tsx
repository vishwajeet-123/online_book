import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./client/context/AuthContext.tsx";
import { CartProvider } from "./client/context/CartContext.tsx";

// Pages
import HomePage from "./client/pages/HomePage.tsx";
import LoginPage from "./client/pages/LoginPage.tsx";
import RegisterPage from "./client/pages/RegisterPage.tsx";
import BookListingPage from "./client/pages/BookListingPage.tsx";
import BookDetailsPage from "./client/pages/BookDetailsPage.tsx";
import CartPage from "./client/pages/CartPage.tsx";
import CheckoutPage from "./client/pages/CheckoutPage.tsx";
import UserDashboard from "./client/pages/UserDashboard.tsx";
import AdminDashboard from "./client/pages/AdminDashboard.tsx";
import AboutPage from "./client/pages/AboutPage.tsx";
import ContactPage from "./client/pages/ContactPage.tsx";

// Components
import Navbar from "./client/components/Navbar.tsx";
import Footer from "./client/components/Footer.tsx";

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/books" element={<BookListingPage />} />
                <Route path="/books/:id" element={<BookDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                
                {/* Protected User Routes */}
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
            <Toaster position="bottom-right" />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
