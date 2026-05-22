import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import { getAllProducts } from '../../api/productApi';
import { ChevronRight, Star, SlidersHorizontal, ShoppingCart } from 'lucide-react';

const categories = ['Chairs', 'Tables', 'Cabinets', 'Sofas', 'Beds', 'Accessories'];
const woodTypes  = ['Teak', 'Oak', 'Walnut', 'Sheesham', 'Mango Wood'];

const Shop = () => {
    const navigate                        = useNavigate();
    const [searchParams]                  = useSearchParams();
    const [products,    setProducts]      = useState([]);
    const [loading,     setLoading]       = useState(true);
    const [search,      setSearch]        = useState('');
    const [showFilters, setShowFilters]   = useState(false);
    const [toast,       setToast]         = useState('');
    const [selectedCats,  setSelectedCats]  = useState([]);
    const [selectedWoods, setSelectedWoods] = useState([]);

    // Pre-select category from URL query e.g. /shop?category=Chairs
    useEffect(() => {
        const cat = searchParams.get('category');
        if (cat) setSelectedCats([cat]);
    }, [searchParams]);

    useEffect(() => {
        getAllProducts()
            .then(res => setProducts(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const toggleCat  = (c) => setSelectedCats(prev  => prev.includes(c)  ? prev.filter(x => x !== c)  : [...prev, c]);
    const toggleWood = (w) => setSelectedWoods(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]);

    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchSearch = p.productName.toLowerCase().includes(search.toLowerCase());
            const matchCat    = selectedCats.length  === 0 || selectedCats.some(c  => p.categoryName?.includes(c));
            const matchWood   = selectedWoods.length === 0 || selectedWoods.some(w => p.material?.includes(w));
            return matchSearch && matchCat && matchWood;
        });
    }, [products, search, selectedCats, selectedWoods]);

    const addToCart = (e, p) => {
        e.preventDefault();
        e.stopPropagation();
        const cart   = JSON.parse(localStorage.getItem('cart') || '[]');
        const exists = cart.find(i => i.productID === p.productID);
        if (exists) exists.quantity += 1;
        else cart.push({ ...p, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));

        // Show toast
        setToast(`${p.productName} added to cart!`);
        setTimeout(() => setToast(''), 2500);
    };

    const resetFilters = () => {
        setSelectedCats([]);
        setSelectedWoods([]);
        setSearch('');
    };

    return (
        <CustomerLayout>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 z-50 bg-amber-800 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
                    <ShoppingCart size={16} />
                    <span className="text-sm font-medium">{toast}</span>
                </div>
            )}

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-amber-800">Home</Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-medium">Products</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8">

                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="md:hidden flex items-center justify-center gap-2 w-full bg-white border border-gray-200 py-3 rounded-lg text-gray-700 font-medium mb-2 shadow-sm">
                    <SlidersHorizontal size={18} /> {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

                {/* Sidebar Filters */}
                <aside className={`md:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} md:block bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                        <button onClick={resetFilters} className="text-xs text-amber-700 font-medium hover:underline">
                            Reset
                        </button>
                    </div>

                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gray-50"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="mb-8">
                        <h3 className="font-semibold text-gray-800 mb-4">Category</h3>
                        <div className="space-y-3">
                            {categories.map(c => (
                                <label key={c} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedCats.includes(c)}
                                        onChange={() => toggleCat(c)}
                                        className="w-4 h-4 rounded accent-amber-800"
                                    />
                                    <span className="text-gray-600 text-sm">{c}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Wood Type Filter */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-4">Wood Type</h3>
                        <div className="space-y-3">
                            {woodTypes.map(w => (
                                <label key={w} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedWoods.includes(w)}
                                        onChange={() => toggleWood(w)}
                                        className="w-4 h-4 rounded accent-amber-800"
                                    />
                                    <span className="text-gray-600 text-sm">{w}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-amber-900">All Products</h1>
                        <p className="text-gray-500 text-sm">
                            Showing {filtered.length} of {products.length} products
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[1,2,3,4,5,6].map(i => (
                                <div key={i} className="bg-white h-80 rounded-2xl shadow-sm border border-gray-100"></div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search query.</p>
                            <button onClick={resetFilters}
                                className="mt-6 bg-amber-900 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map(p => (
                                <div key={p.productID}
                                    onClick={() => navigate(`/shop/${p.productID}`)}
                                    className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-lg transition duration-300 flex flex-col border border-gray-100 relative group cursor-pointer">

                                    <div className="bg-gray-50 rounded-xl h-56 flex items-center justify-center mb-4 overflow-hidden">
                                        {p.images?.[0]
                                            ? <img src={`http://localhost:5059/${p.images[0].imagePath}`}
                                                alt={p.productName}
                                                className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
                                            : <img src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=300&q=80"
                                                className="h-full w-full object-cover group-hover:scale-105 transition duration-500 opacity-60"
                                                alt="Placeholder" />
                                        }
                                    </div>

                                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{p.productName}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{p.material}</p>

                                    <div className="flex items-center justify-between mb-4 mt-auto">
                                        <p className="text-amber-900 font-bold text-xl">
                                            Rs. {p.basePrice?.toLocaleString()}
                                        </p>
                                        <div className="flex text-amber-500 text-sm gap-0.5">
                                            {[1,2,3,4].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                            <Star size={14} fill="currentColor" className="text-gray-300" />
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => addToCart(e, p)}
                                        className="w-full bg-amber-900 text-white font-medium py-2.5 rounded-lg hover:bg-amber-800 transition relative z-20">
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Shop;
