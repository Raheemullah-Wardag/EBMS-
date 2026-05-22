import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Customer Pages
import Home from '../pages/customer/Home';
import Shop from '../pages/customer/Shop';
import ProductDetail from '../pages/customer/ProductDetail';
import CustomOrder from '../pages/customer/CustomOrder';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import MyOrders from '../pages/customer/MyOrders';

// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import ManageOrders from '../pages/admin/ManageOrders';
import ManageProducts from '../pages/admin/ManageProducts';
import ManageEmployees from '../pages/admin/ManageEmployees';
import Attendance from '../pages/admin/Attendance';
import Production from '../pages/admin/Production';
import RawMaterials from '../pages/admin/RawMaterials';
import Customers from '../pages/admin/Customers';
import Payments from '../pages/admin/Payments';
import Reports from '../pages/admin/Reports';
import UserManagement from '../pages/admin/UserManagement';
import Settings from '../pages/admin/Settings';
import PurchaseOrders from '../pages/admin/PurchaseOrders';
import Shifts from '../pages/admin/Shifts';
import PayRoll from '../pages/admin/PayRoll';
// import { RawMaterials, Customers, Payments, Reports, UserManagement, Settings } from '../pages/admin/GenericAdminPages';

import CustomerLayout from '../components/CustomerLayout';
import AdminLayout from '../components/AdminLayout';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:id" element={<ProductDetail />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Area with Navbar */}
      <Route element={<Outlet />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        {/* Customer Protected */}
        <Route path="/custom-order" element={<CustomOrder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
      </Route>

      {/* Admin Area with Sidebar */}
      <Route path="/admin" element={<AdminRoute><Outlet /></AdminRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="employees" element={<ManageEmployees />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="production" element={<Production />} />
        <Route path="raw-materials" element={<RawMaterials />} />
        <Route path="purchase-orders" element={<PurchaseOrders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="payments" element={<Payments />} />
        <Route path="reports" element={<Reports />} />
        <Route path="shifts" element={<Shifts />} />
        <Route path="payroll" element={<PayRoll />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<Settings />} />
        {/* Fallbacks for uncreated pages */}
        <Route path="*" element={<div className="p-8">Page under construction</div>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
