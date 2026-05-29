import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import { placeStockOrder } from '../../api/orderApi';
import { getImageUrl } from '../../api/imageUrl';
import { ChevronRight, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';

const DELIVERY_CHARGE = 2500;

const Checkout = () => {
    const navigate     = useNavigate();
    const location     = useLocation();

    // Discount passed from Cart page
    const cartDiscount = location.state?.discount || 0;

    const [cart,    setCart]    = useState([]);
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        shippingAddr:  '',
        paymentMethod: 'Cash',
    });

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    }, []);

    const subtotal = cart.reduce((sum, i) => sum + i.basePrice * i.quantity, 0);
    const total    = subtotal + DELIVERY_CHARGE - cartDiscount;

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;
        setLoading(true);
        setError('');
        try {
            for (const item of cart) {
                await placeStockOrder({
                    productID:    item.productID,
                    quantity:     item.quantity,
                    unitPrice:    item.basePrice,
                    discount:     cartDiscount,
                    shippingAddr: form.shippingAddr,
                });
            }
            localStorage.removeItem('cart');
            setSuccess(true);
            setTimeout(() => navigate('/my-orders'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Order failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Success Screen ─────────────────────────────────────
    if (success) return (
        <CustomerLayout>
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <CheckCircle2 size={72} className="text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
                    <p className="text-gray-500 mb-2">Thank you for your order.</p>
                    <p className="text-gray-400 text-sm">Redirecting to My Orders...</p>
                </div>
            </div>
        </CustomerLayout>
    );

    return (
        <CustomerLayout>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap">
                <Link to="/"     className="hover:text-amber-800">Home</Link>
                <ChevronRight size={14} />
                <Link to="/cart" className="hover:text-amber-800">Cart</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-medium">Checkout</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">

                {/* ── Left: Delivery + Payment ── */}
                <div className="flex-1 space-y-8">

                    {/* Delivery Address */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-amber-900 text-white flex items-center justify-center text-xs">1</span>
                                Delivery Address
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Shipping Address
                                </label>
                                <textarea
                                    name="shippingAddr"
                                    value={form.shippingAddr}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    placeholder="123 Main Street, Gulberg, Lahore..."
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-900 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs">2</span>
                            Payment Method
                        </h2>

                        <div className="space-y-4">
                            {[
                                { value: 'Card', label: 'Credit / Debit Card', desc: 'Pay securely using your card', icon: <CreditCard className="text-gray-400" size={24} /> },
                                { value: 'Cash', label: 'Cash on Delivery',    desc: 'Pay when you receive',         icon: <Banknote className="text-gray-400" size={24} /> },
                                { value: 'BankTransfer', label: 'Bank Transfer', desc: 'Direct bank transfer',       icon: <Banknote className="text-gray-400" size={24} /> },
                            ].map(opt => (
                                <label key={opt.value}
                                    className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition
                                        ${form.paymentMethod === opt.value
                                            ? 'border-amber-900 bg-amber-50/30'
                                            : 'border-gray-200 hover:border-amber-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                                            ${form.paymentMethod === opt.value ? 'border-amber-900' : 'border-gray-300'}`}>
                                            {form.paymentMethod === opt.value &&
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-900"></div>}
                                        </div>
                                        <input type="radio" name="paymentMethod" value={opt.value}
                                            checked={form.paymentMethod === opt.value}
                                            onChange={handleChange} className="hidden" />
                                        <div>
                                            <span className="font-semibold text-gray-800 block text-sm">{opt.label}</span>
                                            <span className="text-xs text-gray-500">{opt.desc}</span>
                                        </div>
                                    </div>
                                    {opt.icon}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right: Order Summary ── */}
                <div className="lg:w-96 flex-shrink-0">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 sticky top-24">
                        <h2 className="font-bold text-xl text-gray-900 mb-6 pb-4 border-b border-gray-100">
                            Order Summary
                        </h2>

                        {/* Cart Items */}
                        <div className="space-y-4 mb-6">
                            {cart.map(item => (
                                <div key={item.productID} className="flex gap-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                        {item.images?.[0]
                                            ? <img src={getImageUrl(item.images[0].imagePath)}
                                                className="w-full h-full object-cover" alt={item.productName} />
                                            : <div className="w-full h-full bg-amber-50 flex items-center justify-center text-2xl">🪑</div>
                                        }
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.productName}</h4>
                                        <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</p>
                                        <p className="text-sm font-semibold text-amber-900">
                                            Rs. {(item.basePrice * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="space-y-3 text-sm mb-6 pt-6 border-t border-gray-100">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Delivery Charges</span>
                                <span className="font-semibold">Rs. {DELIVERY_CHARGE.toLocaleString()}</span>
                            </div>
                            {cartDiscount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span className="font-semibold">− Rs. {cartDiscount.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-100 mb-8">
                            <span>Total</span>
                            <span className="text-amber-900">Rs. {total.toLocaleString()}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || cart.length === 0}
                            className="w-full bg-amber-900 hover:bg-amber-800 text-white font-medium py-4 rounded-xl transition shadow-lg shadow-amber-900/20 disabled:opacity-50 disabled:shadow-none">
                            {loading ? 'Placing Order...' : 'Place Order'}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4">
                            By placing the order, you agree to our Terms & Conditions
                        </p>
                    </div>
                </div>

            </form>
        </CustomerLayout>
    );
};

export default Checkout;
