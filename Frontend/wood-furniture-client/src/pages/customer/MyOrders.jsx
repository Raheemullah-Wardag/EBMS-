import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import StatusBadge from '../../components/StatusBadge';
import { getMyOrders } from '../../api/orderApi';
import { useAuth } from '../../context/AuthContext';
import { ChevronRight, Package, Eye, X } from 'lucide-react';

const MyOrders = () => {
    const { user }                = useAuth();
    const [orders,   setOrders]   = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        getMyOrders()
            .then(res => setOrders(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <CustomerLayout>

            {/* Order Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative">
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
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Order Date</span>
                                <span className="font-medium">
                                    {new Date(selected.orderDate).toLocaleDateString('en-PK', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Customer</span>
                                <span className="font-medium">{selected.customerName || '—'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Shipping Address</span>
                                <span className="font-medium text-right max-w-xs">{selected.shippingAddr || '—'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-500">Total Amount</span>
                                <span className="font-medium">Rs. {selected.totalAmount?.toLocaleString()}</span>
                            </div>
                            {selected.discount > 0 && (
                                <div className="flex justify-between border-b pb-2 text-green-600">
                                    <span>Discount</span>
                                    <span className="font-medium">− Rs. {selected.discount?.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-2">
                                <span className="font-bold text-gray-900">Final Amount</span>
                                <span className="font-bold text-amber-900 text-lg">
                                    Rs. {selected.finalAmount?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link to="/" className="hover:text-amber-800">Home</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-medium">My Orders</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

            {loading ? (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 animate-pulse space-y-3">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-16 bg-gray-100 rounded-lg w-full"></div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        You haven't placed any orders yet.
                    </p>
                    <Link to="/shop"
                        className="bg-amber-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-800 transition inline-block">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 text-sm">
                                    <th className="py-4 px-6 font-semibold">Order ID</th>
                                    <th className="py-4 px-6 font-semibold">Date</th>
                                    <th className="py-4 px-6 font-semibold">Type</th>
                                    <th className="py-4 px-6 font-semibold">Status</th>
                                    <th className="py-4 px-6 font-semibold">Total</th>
                                    <th className="py-4 px-6 font-semibold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map(order => (
                                    <tr key={order.orderID} className="hover:bg-gray-50/50 transition">
                                        <td className="py-4 px-6 font-medium text-gray-900">
                                            WC-{order.orderID.toString().padStart(5, '0')}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600 text-sm">
                                            {new Date(order.orderDate).toLocaleDateString('en-PK', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium
                                                ${order.orderType === 'Custom'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-blue-100 text-blue-700'}`}>
                                                {order.orderType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <StatusBadge status={order.orderStatus} />
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-amber-900">
                                            Rs. {order.finalAmount?.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <button
                                                onClick={() => setSelected(order)}
                                                className="text-amber-700 hover:text-amber-900 font-medium text-sm flex items-center justify-center gap-1 mx-auto">
                                                <Eye size={16} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
};

export default MyOrders;
