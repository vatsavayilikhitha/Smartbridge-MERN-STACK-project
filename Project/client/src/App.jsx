import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

function App() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin & Seller Routes */}
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/seller" element={<AdminDashboard />} />
            <Route path="/seller/products" element={<AdminProducts />} />
            <Route path="/seller/orders" element={<AdminOrders />} />
          </Route>

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="empty-state" style={{ minHeight: '60vh' }}>
                <div className="empty-state-icon">🔍</div>
                <h3>Page Not Found</h3>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Back to Home
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
