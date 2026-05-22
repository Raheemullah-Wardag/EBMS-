import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import { Minus, Plus, ArrowRight, ShoppingBag, X, Tag } from 'lucide-react';

const DELIVERY_CHARGE = 2500;

const Cart = () => {
    const [cart,        setCart]        = useState([]);
    const [coupon,      setCoupon]      = useState('');
    const [discount,    setDiscount]    = useState(0);
    const [couponMsg,   setCouponMsg]   = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
    }, []);

    const updateQty = (productID, qty) => {
        const updated = cart
            .map(i => i.productID === productID ? { ...i, quantity: qty } : i)
            .filter(i => i.quantity > 0);
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const removeItem = (productID) => {
        const updated = cart.filter(i => i.productID !== productID);
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const applyCoupon = () => {
        const code = coupon.trim().toUpperCase();
        if (code === 'WOOD10') {
            setDiscount(Math.round(subtotal * 0.10));
            setCouponMsg('✅ 10% discount applied!');
        } else if (code === 'WELCOME') {
            setDiscount(500);
            setCouponMsg('✅ Rs. 500 discount applied!');
        } else {
            setDiscount(0);
            setCouponMsg('❌ Invalid coupon code.');
        }
    };

    const subtotal = cart.reduce((sum, i) => sum + i.basePrice * i.quantity, 0);
    const total    = subtotal + DELIVERY_CHARGE - discount;

    return (
        <CustomerLayout>
            <div className="max-w-6xl mx-auto py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Your Cart</h1>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                            Looks like you haven't added anything to your cart yet.
                        </p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="bg-[#8B4513] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#6b340e] transition inline-flex items-center gap-2">
                            Continue Shopping <ArrowRight size={18} />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-12">

                        {/* ── Left: Items + Coupon ── */}
                        <div className="flex-1">
                            <div className="bg-[#FAF8F5]/50 rounded-2xl p-4 md:p-6 border border-gray-100 mb-8 overflow-x-auto">

                                {/* Header — hidden on mobile */}
                                <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-bold text-gray-900">
                                    <div className="col-span-5">Product</div>
                                    <div className="col-span-2 text-center">Price</div>
                                    <div className="col-span-2 text-center">Quantity</div>
                                    <div className="col-span-2 text-center">Total</div>
                                    <div className="col-span-1"></div>
                                </div>

                                <div className="divide-y divide-gray-100/50">
                                    {cart.map(item => (
                                        <div key={item.productID}
                                            className="flex flex-col sm:grid sm:grid-cols-12 gap-4 py-6 items-center">

                                            {/* Product Info */}
                                            <div className="sm:col-span-5 flex items-center gap-4 w-full">
                                                <div className="bg-white rounded-xl w-20 h-20 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                                    {item.images?.[0]
                                                        ? <img src={`http://localhost:5059/${item.images[0].imagePath}`}
                                                            className="w-full h-full object-cover" alt={item.productName} />
                                                        : <img src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=300&q=80"
                                                            className="w-full h-full object-cover opacity-60" alt="Placeholder" />
                                                    }
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-[15px]">{item.productName}</h3>
                                                    <p className="text-gray-500 text-sm mt-1">{item.material || 'Wood'}</p>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="sm:col-span-2 text-center font-semibold text-gray-700 text-sm w-full sm:w-auto flex sm:block justify-between">
                                                <span className="sm:hidden text-gray-400">Price:</span>
                                                Rs. {item.basePrice?.toLocaleString()}
                                            </div>

                                            {/* Quantity */}
                                            <div className="sm:col-span-2 flex justify-center w-full sm:w-auto">
                                                <div className="flex items-center border border-gray-200 rounded-lg h-10 bg-white">
                                                    <button onClick={() => updateQty(item.productID, item.quantity - 1)}
                                                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition">
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-gray-900 text-sm">
                                                        {item.quantity}
                                                    </span>
                                                    <button onClick={() => updateQty(item.productID, item.quantity + 1)}
                                                        className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition">
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Line Total */}
                                            <div className="sm:col-span-2 text-center font-bold text-gray-900 text-sm w-full sm:w-auto flex sm:block justify-between">
                                                <span className="sm:hidden text-gray-400">Total:</span>
                                                Rs. {(item.basePrice * item.quantity)?.toLocaleString()}
                                            </div>

                                            {/* Remove */}
                                            <div className="sm:col-span-1 flex justify-end w-full sm:w-auto">
                                                <button onClick={() => removeItem(item.productID)}
                                                    className="text-gray-400 hover:text-red-600 transition p-2">
                                                    <X size={16} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Coupon */}
                            <div className="max-w-md">
                                <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Tag size={14} /> Have a coupon code?
                                </label>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        value={coupon}
                                        onChange={e => { setCoupon(e.target.value); setCouponMsg(''); }}
                                        placeholder="Enter coupon code"
                                        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#8B4513] text-sm bg-white"
                                    />
                                    <button
                                        onClick={applyCoupon}
                                        className="bg-[#FAF8F5] border border-gray-200 hover:bg-gray-100 text-gray-900 font-bold text-sm px-8 py-2.5 rounded-lg transition">
                                        Apply
                                    </button>
                                </div>
                                {couponMsg && (
                                    <p className="text-sm mt-2 text-gray-600">{couponMsg}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-1">Try: WOOD10 or WELCOME</p>
                            </div>
                        </div>

                        {/* ── Right: Summary ── */}
                        <div className="lg:w-[380px] flex-shrink-0">
                            <div className="bg-[#FAF8F5]/50 rounded-2xl border border-gray-100 p-8">
                                <h2 className="font-bold text-lg text-gray-900 mb-6 pb-4 border-b border-gray-200">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 text-sm mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Charges</span>
                                        <span className="font-medium">Rs. {DELIVERY_CHARGE.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount</span>
                                            <span className="font-medium">− Rs. {discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between font-bold text-lg pt-6 border-t border-gray-200 mb-8">
                                    <span>Total</span>
                                    <span>Rs. {total.toLocaleString()}</span>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout', { state: { discount, total } })}
                                    className="w-full bg-[#8B4513] hover:bg-[#6b340e] text-white font-semibold py-3.5 rounded-xl transition flex justify-center items-center gap-2">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </CustomerLayout>
    );
};

export default Cart;
