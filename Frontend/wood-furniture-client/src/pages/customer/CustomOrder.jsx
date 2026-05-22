import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import { placeCustomOrder } from '../../api/orderApi';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
 
const CustomOrder = () => {
    const navigate     = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState('');
    const [success, setSuccess] = useState(false);
 
    // REMOVED customerID from initial state
    const [form, setForm] = useState({
        furnitureType: '',
        woodType:      '',
        finish:        '',
        dimensions:    '',
        specialNotes:  '',
        quotedPrice:   '',
        discount:      0,
        shippingAddr:  '',
    });
 
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // REMOVED customerID from the API payload
            await placeCustomOrder({
                discount:      parseFloat(form.discount) || 0,
                shippingAddr:  form.shippingAddr,
                furnitureType: form.furnitureType,
                woodType:      form.woodType,
                finish:        form.finish,
                dimensions:    form.dimensions,
                specialNotes:  form.specialNotes,
                quotedPrice:   parseFloat(form.quotedPrice) || 0,
            });
            setSuccess(true);
            setTimeout(() => navigate('/my-orders'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to place order. Please try again.');
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
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Submitted!</h2>
                    <p className="text-gray-500 mb-1">We'll contact you to confirm the details.</p>
                    <p className="text-gray-400 text-sm">Redirecting to My Orders...</p>
                </div>
            </div>
        </CustomerLayout>
    );
 
    return (
        <CustomerLayout>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-amber-800">Home</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-medium">Custom Order</span>
            </div>
 
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Order</h1>
                <p className="text-gray-500 mb-8">Design your own furniture — we'll bring your ideas to life.</p>
 
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}
 
                <form onSubmit={handleSubmit}
                    className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* REMOVED Customer ID Input entirely */}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Furniture Type</label>
                            <input type="text" name="furnitureType" value={form.furnitureType}
                                onChange={handleChange} required placeholder="e.g. Dining Table"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Wood Type</label>
                            <select name="woodType" value={form.woodType} onChange={handleChange} required
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700">
                                <option value="">Select wood type</option>
                                {['Sheesham','Teak','Oak','Walnut','Mango Wood'].map(w => (
                                    <option key={w} value={w}>{w}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Finish</label>
                            <select name="finish" value={form.finish} onChange={handleChange} required
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700">
                                <option value="">Select finish</option>
                                {['Natural','Walnut Stain','Mahogany','White Wash','Matte Black'].map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                            <input type="text" name="dimensions" value={form.dimensions}
                                onChange={handleChange} placeholder="e.g. 180cm x 90cm x 75cm"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget (Rs.)</label>
                            <input type="number" name="quotedPrice" value={form.quotedPrice}
                                onChange={handleChange} required placeholder="Your budget"
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700" />
                        </div>
                    </div>
 
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                        <input type="text" name="shippingAddr" value={form.shippingAddr}
                            onChange={handleChange} required
                            placeholder="Your delivery address"
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700" />
                    </div>
 
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Notes</label>
                        <textarea name="specialNotes" value={form.specialNotes}
                            onChange={handleChange} rows={4}
                            placeholder="Describe any special requirements, design preferences..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700 resize-none" />
                    </div>
 
                    <button type="submit" disabled={loading}
                        className="w-full bg-[#8B4513] hover:bg-[#6b340e] text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50 shadow-lg shadow-amber-900/20">
                        {loading ? 'Submitting...' : 'Submit Custom Order'}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
};
 
export default CustomOrder;