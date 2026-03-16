import './styles/main.css';
import './styles/components.css';
import './styles/animations.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// --- LAYOUT COMPONENTS ---
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/shared/ProtectedRoute';

// --- COMMON PAGES ---
import Home from './pages/common/Home';
import CarDetail from './pages/common/CarDetail';
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import NotFound from './pages/common/NotFound';
import Profile from './pages/common/Profile';

// --- BUYER PAGES ---
import Inventory from './pages/buyer/Inventory';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import MyOrders from './pages/buyer/MyOrders';

// --- SELLER PAGES ---
import SellerDashboard from './pages/seller/Dashboard';
import PostCar from './pages/seller/PostCar';
import ManageCars from './pages/seller/ManageCars';
import OrderRequests from './pages/seller/OrderRequests';
import EditCar from './pages/seller/EditCar';

// --- ADMIN PAGES ---
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ApproveCars from './pages/admin/ApproveCars';
import AllOrders from './pages/admin/AllOrders';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-white">
        {/* Navbar xuất hiện ở mọi trang */}
        <Navbar />

        {/* Nội dung chính của các trang */}
        <main className="grow container mx-auto px-4 py-8">
          <Routes>
            {/* --- PUBLIC ROUTES (Ai cũng xem được) --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/car/:id" element={<CarDetail />} />

            {/* --- BUYER ROUTES (Cần đăng nhập) --- */}
            <Route element={<ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']} />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
            </Route>

            {/* --- SELLER ROUTES (Chỉ dành cho Người bán) --- */}
            <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/post-car" element={<PostCar />} />
              <Route path="/seller/manage-cars" element={<ManageCars />} />
              <Route path="/seller/edit-car/:id" element={<EditCar />} />
              <Route path="/seller/orders" element={<OrderRequests />} />
            </Route>

            {/* --- ADMIN ROUTES (Chỉ dành cho Quản trị viên) --- */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/approve-cars" element={<ApproveCars />} />
              <Route path="/admin/all-orders" element={<AllOrders />} />
            </Route>

            {/* --- PROFILE (Cần đăng nhập) --- */}
            <Route element={<ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
            </Route>

            {/* --- 404 NOT FOUND --- */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>

        {/* Footer xuất hiện ở mọi trang */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;