import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import { getAllOrders } from '../../api/orderApi';
import { getPaymentsByOrder } from '../../api/paymentApi';
import { Search } from 'lucide-react';

const Payments = () => {
    const [orders,  setOrders]  = useState([]);
    const [filtered,setFiltered]= useState([]);
    const [loading, setLoading] = useState(true);
    const [search,  setSearch]  = useState('');

    useEffect(() => {
        getAllOrders()
            .then(res => { setOrders(res.data); setFiltered(res.data); })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(orders.filter(o =>
            o.orderID?.toString().includes(q) ||
            o.customerName?.toLowerCase().includes(q)
        ));
    }, [search, orders]);

    const totalRevenue = orders.filter(o => o.orderStatus === 'Delivered').reduce((sum, o) => sum + (o.finalAmount || 0), 0);
    const pending      = orders.filter(o => o.orderStatus === 'Pending').reduce((sum, o) => sum + (o.finalAmount || 0), 0);

    return (
        <AdminLayout title="Payments">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Total Collected</p>
                    <p className="text-2xl font-bold text-green-700">Rs. {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Pending Payments</p>
                    <p className="text-2xl font-bold text-amber-700">Rs. {pending.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-700">{orders.length}</p>
                </div>
            </div>

            <div className="flex mb-6">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white" />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Order ID</th>
                                <th className="py-4 px-6 font-semibold">Customer</th>
                                <th className="py-4 px-6 font-semibold">Order Type</th>
                                <th className="py-4 px-6 font-semibold">Amount</th>
                                <th className="py-4 px-6 font-semibold">Order Status</th>
                                <th className="py-4 px-6 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="py-12 text-center">
                                    <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="py-12 text-center text-gray-400">No payments found.</td></tr>
                            ) : (
                                filtered.map(o => (
                                    <tr key={o.orderID} className="hover:bg-gray-50/50 transition">
                                        <td className="py-4 px-6 font-semibold text-gray-900">WC-{o.orderID.toString().padStart(5,'0')}</td>
                                        <td className="py-4 px-6 text-gray-600">{o.customerName || '—'}</td>
                                        <td className="py-4 px-6">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.orderType === 'Custom' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {o.orderType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-gray-900">Rs. {o.finalAmount?.toLocaleString()}</td>
                                        <td className="py-4 px-6"><StatusBadge status={o.orderStatus} /></td>
                                        <td className="py-4 px-6 text-gray-500">
                                            {new Date(o.orderDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Payments;
