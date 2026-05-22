import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import { IndianRupee, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../../api/orderApi';
import { getAllProducts } from '../../api/productApi';
import { getAllEmployees } from '../../api/employeeApi';
 
const StatCard = ({ title, value, icon: Icon, trend, isPositive, colorClass, loading }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
                <Icon size={24} />
            </div>
            {trend !== undefined && (
                <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full
                    ${isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {trend}%
                </div>
            )}
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            {loading
                ? <div className="h-8 w-24 bg-gray-100 rounded-lg animate-pulse"></div>
                : <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            }
        </div>
    </div>
);
 
const Dashboard = () => {
    const [orders,    setOrders]    = useState([]);
    const [products,  setProducts]  = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading,   setLoading]   = useState(true);
 
    useEffect(() => {
        Promise.all([
            getAllOrders(),
            getAllProducts(),
            getAllEmployees(),
        ]).then(([ordersRes, productsRes, employeesRes]) => {
            setOrders(ordersRes.data);
            setProducts(productsRes.data);
            setEmployees(employeesRes.data);
        }).catch(err => console.error(err))
          .finally(() => setLoading(false));
    }, []);
 
    // ── Computed Stats ──────────────────────────────────
    const totalRevenue    = orders
        .filter(o => o.orderStatus === 'Delivered')
        .reduce((sum, o) => sum + (o.finalAmount || 0), 0);
 
    const totalOrders     = orders.length;
    const pendingOrders   = orders.filter(o => o.orderStatus === 'Pending').length;
    const activeEmployees = employees.filter(e => e.isActive).length;
    const totalEmployees  = employees.length;
    const lowStockItems   = products.filter(p => p.stockStatus === 'Low Stock' || p.stockStatus === 'Out of Stock').length;
 
    // Recent 5 orders
    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
        .slice(0, 5);
 
    return (
        <AdminLayout title="Dashboard Overview">
 
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`Rs. ${totalRevenue.toLocaleString()}`}
                    icon={IndianRupee}
                    trend={12.5}
                    isPositive={true}
                    colorClass="bg-amber-100 text-amber-700"
                    loading={loading}
                />
                <StatCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={ShoppingCart}
                    trend={5.2}
                    isPositive={true}
                    colorClass="bg-blue-100 text-blue-700"
                    loading={loading}
                />
                <StatCard
                    title="Active Employees"
                    value={`${activeEmployees}/${totalEmployees}`}
                    icon={Users}
                    colorClass="bg-emerald-100 text-emerald-700"
                    loading={loading}
                />
                <StatCard
                    title="Low Stock Items"
                    value={lowStockItems}
                    icon={Package}
                    colorClass="bg-rose-100 text-rose-700"
                    loading={loading}
                />
            </div>
 
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
                        <Link to="/admin/orders"
                            className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                            View All
                        </Link>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        {loading ? (
                            <div className="p-6 space-y-3 animate-pulse">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
                                ))}
                            </div>
                        ) : recentOrders.length === 0 ? (
                            <p className="text-center text-gray-400 py-10">No orders yet.</p>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="py-3 px-6 font-semibold">Order ID</th>
                                        <th className="py-3 px-6 font-semibold">Customer</th>
                                        <th className="py-3 px-6 font-semibold">Date</th>
                                        <th className="py-3 px-6 font-semibold">Amount</th>
                                        <th className="py-3 px-6 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {recentOrders.map(order => (
                                        <tr key={order.orderID} className="hover:bg-gray-50/50 transition">
                                            <td className="py-4 px-6 font-medium text-gray-900">
                                                WC-{order.orderID.toString().padStart(5, '0')}
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">{order.customerName || '—'}</td>
                                            <td className="py-4 px-6 text-gray-500">
                                                {new Date(order.orderDate).toLocaleDateString('en-PK', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-4 px-6 font-medium text-gray-900">
                                                Rs. {order.finalAmount?.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <StatusBadge status={order.orderStatus} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
 
                {/* Right Column */}
                <div className="space-y-8">
 
                    {/* Orders by Status */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Orders by Status</h2>
                        {loading ? (
                            <div className="space-y-3 animate-pulse">
                                {[1,2,3].map(i => <div key={i} className="h-8 bg-gray-100 rounded-lg"></div>)}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {['Pending','Confirmed','InProduction','Shipped','Delivered','Cancelled'].map(status => {
                                    const count = orders.filter(o => o.orderStatus === status).length;
                                    if (count === 0) return null;
                                    return (
                                        <div key={status} className="flex items-center justify-between">
                                            <StatusBadge status={status} />
                                            <span className="font-bold text-gray-900">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
 
                    {/* Quick Links */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
                        <div className="space-y-2">
                            {[
                                { label: 'Manage Orders',    path: '/admin/orders' },
                                { label: 'Manage Products',  path: '/admin/products' },
                                { label: 'Attendance',       path: '/admin/attendance' },
                                { label: 'Production',       path: '/admin/production' },
                                { label: 'Raw Materials',    path: '/admin/raw-materials' },
                            ].map(link => (
                                <Link key={link.path} to={link.path}
                                    className="flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-amber-50 text-gray-700 hover:text-amber-800 transition text-sm font-medium">
                                    {link.label}
                                    <ArrowUpRight size={14} />
                                </Link>
                            ))}
                        </div>
                    </div>
 
                </div>
            </div>
 
        </AdminLayout>
    );
};
 
export default Dashboard;