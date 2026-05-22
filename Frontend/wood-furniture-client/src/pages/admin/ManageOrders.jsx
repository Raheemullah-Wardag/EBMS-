import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import { getAllOrders, updateOrderStatus } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { Search, Eye, X, ChevronDown } from 'lucide-react';
 
const STATUSES = ['Pending','Confirmed','InProduction','Ready','Shipped','Delivered','Cancelled'];
const ITEMS_PER_PAGE = 10;
 
const ManageOrders = () => {
    const { user }                    = useAuth();
    const [orders,   setOrders]       = useState([]);
    const [filtered, setFiltered]     = useState([]);
    const [loading,  setLoading]      = useState(true);
    const [search,   setSearch]       = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter,   setTypeFilter]   = useState('');
    const [selected, setSelected]     = useState(null);  // detail modal
    const [page,     setPage]         = useState(1);
    const [updating, setUpdating]     = useState(false);
 
    const fetchOrders = () => {
        setLoading(true);
        getAllOrders()
            .then(res => {
                setOrders(res.data);
                setFiltered(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };
 
    useEffect(() => { fetchOrders(); }, []);
 
    // ── Filter ─────────────────────────────────────────────
    useEffect(() => {
        let result = orders;
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(o =>
                o.orderID.toString().includes(q) ||
                o.customerName?.toLowerCase().includes(q) ||
                o.customerID?.toString().includes(q)
            );
        }
        if (statusFilter) result = result.filter(o => o.orderStatus === statusFilter);
        if (typeFilter)   result = result.filter(o => o.orderType   === typeFilter);
        setFiltered(result);
        setPage(1);
    }, [search, statusFilter, typeFilter, orders]);
 
    // ── Pagination ─────────────────────────────────────────
    const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated   = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
 
    // ── Update Status ──────────────────────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            await updateOrderStatus(orderId, { newStatus });
            fetchOrders();
            if (selected?.orderID === orderId)
                setSelected(prev => ({ ...prev, orderStatus: newStatus }));
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };
 
    return (
        <AdminLayout title="Order Management">
 
            {/* Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setSelected(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            Order WC-{selected.orderID.toString().padStart(5, '0')}
                        </h2>
                        <div className="flex gap-2 mb-6">
                            <StatusBadge status={selected.orderStatus} />
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                {selected.orderType}
                            </span>
                        </div>
 
                        <div className="space-y-3 text-sm mb-6">
                            {[
                                { label: 'Customer',    value: selected.customerName || `#${selected.customerID}` },
                                { label: 'Order Date',  value: new Date(selected.orderDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) },
                                { label: 'Shipping',    value: selected.shippingAddr || '—' },
                                { label: 'Total',       value: `Rs. ${selected.totalAmount?.toLocaleString()}` },
                                { label: 'Discount',    value: selected.discount > 0 ? `Rs. ${selected.discount?.toLocaleString()}` : '—' },
                                { label: 'Final Amount',value: `Rs. ${selected.finalAmount?.toLocaleString()}` },
                            ].map(row => (
                                <div key={row.label} className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">{row.label}</span>
                                    <span className="font-medium text-right max-w-xs">{row.value}</span>
                                </div>
                            ))}
                        </div>
 
                        {/* Update Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                            <div className="flex gap-2">
                                <select
                                    defaultValue={selected.orderStatus}
                                    onChange={e => handleStatusChange(selected.orderID, e.target.value)}
                                    disabled={updating}
                                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600">
                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
 
            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                    />
                </div>
 
                <div className="flex gap-3 w-full sm:w-auto">
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="flex-1 sm:flex-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white">
                        <option value="">All Statuses</option>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        className="flex-1 sm:flex-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white">
                        <option value="">All Types</option>
                        <option value="Stock">Stock</option>
                        <option value="Custom">Custom</option>
                    </select>
                </div>
            </div>
 
            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Order ID</th>
                                <th className="py-4 px-6 font-semibold">Date</th>
                                <th className="py-4 px-6 font-semibold">Customer</th>
                                <th className="py-4 px-6 font-semibold">Type</th>
                                <th className="py-4 px-6 font-semibold">Amount</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                                            <p>Loading orders...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-gray-400">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(order => (
                                    <tr key={order.orderID} className="hover:bg-gray-50/50 transition">
                                        <td className="py-4 px-6 font-semibold text-gray-900">
                                            WC-{order.orderID.toString().padStart(5, '0')}
                                        </td>
                                        <td className="py-4 px-6 text-gray-500">
                                            {new Date(order.orderDate).toLocaleDateString('en-PK', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-6 text-gray-700">
                                            {order.customerName || `#${order.customerID}`}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`text-xs px-2 py-0.5 rounded font-medium
                                                ${order.orderType === 'Custom'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-blue-100 text-blue-700'}`}>
                                                {order.orderType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-gray-900">
                                            Rs. {order.finalAmount?.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <StatusBadge status={order.orderStatus} />
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setSelected(order)}
                                                    className="text-amber-600 hover:text-amber-800 text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-amber-50 transition">
                                                    <Eye size={14} /> View
                                                </button>
                                                <select
                                                    value={order.orderStatus}
                                                    onChange={e => handleStatusChange(order.orderID, e.target.value)}
                                                    disabled={updating}
                                                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white">
                                                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
 
                {/* Pagination */}
                {!loading && filtered.length > 0 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
                        <span>
                            Showing {((page-1)*ITEMS_PER_PAGE)+1} to {Math.min(page*ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p-1))}
                                disabled={page === 1}
                                className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 transition text-xs">
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i+1).map(p => (
                                <button key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-3 py-1 border rounded-lg text-xs transition
                                        ${page === p
                                            ? 'bg-amber-700 text-white border-amber-700'
                                            : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                                disabled={page === totalPages}
                                className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 transition text-xs">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};
 
export default ManageOrders;