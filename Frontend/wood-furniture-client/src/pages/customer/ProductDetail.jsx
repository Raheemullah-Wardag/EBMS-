import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import { getProductByID } from '../../api/productApi';
import { ChevronRight, Star, Minus, Plus, ShoppingBag, ShieldCheck } from 'lucide-react';

const ProductDetail = () => {
    const { id }       = useParams();
    const navigate     = useNavigate();
    const [product,  setProduct]  = useState(null);
    const [mainImg,  setMainImg]  = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [toast,    setToast]    = useState('');

    useEffect(() => {
        getProductByID(id)
            .then(res => {
                setProduct(res.data);
                const main = res.data.images?.find(i => i.isMain) || res.data.images?.[0];
                setMainImg(main);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const addToCart = () => {
        const cart   = JSON.parse(localStorage.getItem('cart') || '[]');
        const exists = cart.find(i => i.productID === product.productID);
        if (exists) exists.quantity += quantity;
        else cart.push({ ...product, quantity });
        localStorage.setItem('cart', JSON.stringify(cart));

        // Show toast then navigate
        setToast('Added to cart!');
        setTimeout(() => navigate('/cart'), 1000);
    };

    // ── Loading skeleton ───────────────────────────────────
    if (loading) return (
        <CustomerLayout>
            <div className="flex animate-pulse flex-col md:flex-row gap-10">
                <div className="md:w-1/2 h-[500px] bg-gray-200 rounded-3xl"></div>
                <div className="md:w-1/2 space-y-4">
                    <div className="h-10 bg-gray-200 w-3/4 rounded-lg"></div>
                    <div className="h-6 bg-gray-200 w-1/4 rounded-lg"></div>
                    <div className="h-40 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        </CustomerLayout>
    );

    // ── Not found ──────────────────────────────────────────
    if (!product) return (
        <CustomerLayout>
            <div className="py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
                <Link to="/shop" className="text-amber-700 hover:underline mt-4 inline-block">
                    Back to Shop
                </Link>
            </div>
        </CustomerLayout>
    );

    return (
        <CustomerLayout>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 bg-amber-800 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2">
                    <ShoppingBag size={16} />
                    <span className="text-sm font-medium">{toast}</span>
                </div>
            )}

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 flex-wrap">
                <Link to="/"     className="hover:text-amber-800">Home</Link>
                <ChevronRight size={14} />
                <Link to="/shop" className="hover:text-amber-800">Products</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-medium">{product.productName}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-10 lg:gap-16">

                {/* ── Images ── */}
                <div className="md:w-1/2 flex flex-col gap-4">
                    <div className="bg-gray-50 rounded-3xl h-80 md:h-[500px] flex items-center justify-center overflow-hidden border border-gray-100">
                        {mainImg
                            ? <img src={`http://localhost:5059/${mainImg.imagePath}`}
                                alt={product.productName}
                                className="h-full w-full object-cover" />
                            : <img src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80"
                                className="h-full w-full object-cover opacity-60"
                                alt="Placeholder" />
                        }
                    </div>

                    {/* Thumbnails */}
                    {product.images && product.images.length > 0 && (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images.map(img => (
                                <button
                                    key={img.imageID}
                                    onClick={() => setMainImg(img)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition
                                        ${mainImg?.imageID === img.imageID
                                            ? 'border-amber-800 ring-2 ring-amber-800/20'
                                            : 'border-transparent hover:border-amber-200'}`}
                                >
                                    <img src={`http://localhost:5059/${img.imagePath}`}
                                        alt={img.altText}
                                        className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Info ── */}
                <div className="md:w-1/2 flex flex-col">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        {product.productName}
                    </h1>

                    {/* Stars */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex text-amber-500 gap-0.5">
                            {[1,2,3,4].map(i => <Star key={i} size={18} fill="currentColor" />)}
                            <Star size={18} fill="currentColor" className="text-gray-300" />
                        </div>
                        <span className="text-sm text-gray-500 underline cursor-pointer">(32 Reviews)</span>
                    </div>

                    <p className="text-4xl font-bold text-amber-900 mb-8">
                        Rs. {product.basePrice?.toLocaleString()}
                    </p>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Wood Type</span>
                            <span className="font-semibold text-gray-900">{product.material || '—'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Dimensions</span>
                            <span className="font-semibold text-gray-900">{product.dimensions || '—'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Category</span>
                            <span className="font-semibold text-gray-900">{product.categoryName || '—'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-gray-500">Stock Status</span>
                            <span className={`font-semibold ${product.stockStatus === 'Out of Stock' ? 'text-red-600' : 'text-green-600'}`}>
                                {product.stockStatus}
                            </span>
                        </div>
                    </div>

                    {/* Quantity + Add to Cart */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <div className="flex items-center border border-gray-300 rounded-lg h-12 w-full sm:w-32 bg-white">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition">
                                <Minus size={16} />
                            </button>
                            <span className="flex-1 text-center font-semibold text-gray-900">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition">
                                <Plus size={16} />
                            </button>
                        </div>

                        <button
                            onClick={addToCart}
                            disabled={product.stockStatus === 'Out of Stock'}
                            className="flex-1 flex items-center justify-center gap-2 bg-amber-900 hover:bg-amber-800 text-white h-12 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/20">
                            <ShoppingBag size={18} /> Add to Cart
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/custom-order')}
                        className="w-full border-2 border-amber-900 text-amber-900 bg-white h-12 rounded-lg font-bold hover:bg-amber-50 transition mb-10">
                        Request Custom Order
                    </button>

                    {/* Tabs */}
                    <div>
                        <div className="flex gap-8 border-b border-gray-200 mb-6">
                            {[
                                { key: 'description', label: 'Description' },
                                { key: 'details',     label: 'Details' },
                                { key: 'reviews',     label: 'Reviews (32)' },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`pb-3 border-b-2 font-medium transition
                                        ${activeTab === tab.key
                                            ? 'border-amber-900 text-gray-900 font-bold'
                                            : 'border-transparent text-gray-500 hover:text-gray-900'}`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'description' && (
                            <div className="text-gray-600 leading-relaxed text-sm">
                                <p className="mb-4">
                                    {product.description || 'This solid wood furniture piece is a perfect blend of comfort and elegance. Made from premium quality wood, it is durable and designed to last for years.'}
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-amber-700" /> 100% Solid Wood</li>
                                    <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-amber-700" /> Premium Quality Finish</li>
                                    <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-amber-700" /> Strong & Durable</li>
                                </ul>
                            </div>
                        )}

                        {activeTab === 'details' && (
                            <div className="text-sm text-gray-600 space-y-3">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">SKU</span>
                                    <span className="font-medium">{product.sku || '—'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Material</span>
                                    <span className="font-medium">{product.material || '—'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Dimensions</span>
                                    <span className="font-medium">{product.dimensions || '—'}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Weight</span>
                                    <span className="font-medium">{product.weightKG ? `${product.weightKG} kg` : '—'}</span>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-sm text-gray-500 text-center py-6">
                                <Star size={32} className="text-amber-300 mx-auto mb-2" fill="currentColor" />
                                <p>Reviews coming soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default ProductDetail;
