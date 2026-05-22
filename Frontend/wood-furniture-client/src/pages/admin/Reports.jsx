
// ============================================================
//  FILE 3: src/pages/admin/Reports.jsx
// ============================================================
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllOrders } from '../../api/orderApi';
import { getAllProducts } from '../../api/productApi';
import { getAllEmployees } from '../../api/employeeApi';
import { BarChart2, TrendingUp, Package, Users } from 'lucide-react';

const Reports = () => {
    const [orders,    setOrders]    = useState([]);
    const [products,  setProducts]  = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading,   setLoading]   = useState(true);

    useEffect(() => {
        Promise.all([getAllOrders(), getAllProducts(), getAllEmployees()])
            .then(([o, p, e]) => {
                setOrders(o.data);
                setProducts(p.data);
                setEmployees(e.data);
            })
            .finally(() => setLoading(false));
    }, []);

    const totalRevenue   = orders.filter(o => o.orderStatus === 'Delivered').reduce((sum, o) => sum + (o.finalAmount || 0), 0);
    const totalOrders    = orders.length;
    const pendingOrders  = orders.filter(o => o.orderStatus === 'Pending').length;
    const customOrders   = orders.filter(o => o.orderType === 'Custom').length;
    const stockOrders    = orders.filter(o => o.orderType === 'Stock').length;
    const lowStock       = products.filter(p => p.stockStatus !== 'In Stock').length;
    const activeEmps     = employees.filter(e => e.isActive).length;

    const stats = [
        { label: 'Total Revenue',    value: `Rs. ${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600',  bg: 'bg-green-50'  },
        { label: 'Total Orders',     value: totalOrders,   icon: BarChart2, color: 'text-blue-600',   bg: 'bg-blue-50'   },
        { label: 'Pending Orders',   value: pendingOrders, icon: BarChart2, color: 'text-amber-600',  bg: 'bg-amber-50'  },
        { label: 'Custom Orders',    value: customOrders,  icon: Package,   color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Stock Orders',     value: stockOrders,   icon: Package,   color: 'text-cyan-600',   bg: 'bg-cyan-50'   },
        { label: 'Low Stock Items',  value: lowStock,      icon: Package,   color: 'text-red-600',    bg: 'bg-red-50'    },
        { label: 'Active Employees', value: activeEmps,    icon: Users,     color: 'text-emerald-600',bg: 'bg-emerald-50'},
        { label: 'Total Products',   value: products.length, icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <AdminLayout title="Reports">
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
                    {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="bg-white h-28 rounded-2xl border border-gray-100"></div>)}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {stats.map(s => (
                            <div key={s.label} className={`${s.bg} rounded-2xl p-5 border border-gray-100 shadow-sm`}>
                                <s.icon size={24} className={`${s.color} mb-3`} />
                                <p className="text-gray-500 text-xs mb-1">{s.label}</p>
                                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Orders by Status Breakdown */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6">Orders by Status</h2>
                        <div className="space-y-4">
                            {['Pending','Confirmed','InProduction','Ready','Shipped','Delivered','Cancelled'].map(status => {
                                const count = orders.filter(o => o.orderStatus === status).length;
                                const pct   = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
                                return (
                                    <div key={status}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600 font-medium">{status}</span>
                                            <span className="text-gray-900 font-bold">{count} ({pct}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className="bg-amber-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default Reports;