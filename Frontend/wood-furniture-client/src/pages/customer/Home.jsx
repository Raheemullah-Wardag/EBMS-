import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerLayout from '../../components/CustomerLayout';
import { getAllProducts } from '../../api/productApi';
import { getImageUrl } from '../../api/imageUrl';
import { Star, Truck, Home as HomeIcon, Scissors, Leaf } from 'lucide-react';

const categories = [
    { name: 'Chairs',      img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=300&q=80' },
    { name: 'Tables',      img: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=300&q=80' },
    { name: 'Cabinets',    img: 'https://images.unsplash.com/photo-1601760561441-16420502c7e0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Sofas',       img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=300&q=80' },
    { name: 'Beds',        img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=300&q=80' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80' },
];

const Home = () => {
    const navigate = useNavigate();
    const [bestsellers, setBestsellers] = useState([]);
    const [loading, setLoading]         = useState(true);

    useEffect(() => {
        getAllProducts()
            .then(res => setBestsellers(res.data.slice(0, 4)))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const addToCart = (e, product) => {
        e.stopPropagation(); // prevent card click navigation
        const cart   = JSON.parse(localStorage.getItem('cart') || '[]');
        const exists = cart.find(i => i.productID === product.productID);
        if (exists) exists.quantity += 1;
        else cart.push({ ...product, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        navigate('/cart');
    };

    return (
        <CustomerLayout>
            <div className="bg-[#FAF8F5] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

                    {/* Hero Section */}
                    <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
                        <div className="md:w-1/2 pr-0 md:pr-12">
                            <h1 className="text-5xl md:text-[64px] font-bold text-gray-900 leading-[1.1] mb-6 font-serif">
                                Premium<br />Handmade<br />Furniture
                            </h1>
                            <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-md font-medium">
                                Crafted with finest quality wood<br />for your dream space.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/shop"
                                    className="bg-[#8B4513] hover:bg-[#6b340e] text-white px-8 py-3.5 rounded-lg font-medium transition shadow-lg shadow-[#8B4513]/20">
                                    Shop Now
                                </Link>
                                <Link to="/custom-order"
                                    className="bg-white hover:bg-gray-50 text-gray-900 border-none px-8 py-3.5 rounded-lg font-medium transition shadow-sm">
                                    Custom Order
                                </Link>
                            </div>
                        </div>
                        <div className="md:w-1/2 h-80 md:h-[500px] w-full rounded-tr-[100px] rounded-bl-[100px] overflow-hidden shadow-xl">
                            <img
                                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80"
                                alt="Premium living room furniture"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                </div>

                <div className="bg-white rounded-t-[40px] pt-16 pb-20 shadow-[-10px_-10px_30px_rgba(0,0,0,0.02)] border-t border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">

                        {/* Features Row */}
                        <div className="flex flex-wrap justify-between gap-8 mb-20 border-b border-gray-100 pb-12">
                            {[
                                { icon: <Leaf size={32} strokeWidth={1.5} />,     label: 'Premium Quality', desc: 'Finest materials' },
                                { icon: <Scissors size={32} strokeWidth={1.5} />, label: 'Handmade',        desc: 'Made with passion' },
                                { icon: <HomeIcon size={32} strokeWidth={1.5} />, label: 'Custom Made',     desc: 'Tailored to you' },
                                { icon: <Truck size={32} strokeWidth={1.5} />,    label: 'Fast Delivery',   desc: 'Safe & reliable' },
                            ].map(f => (
                                <div key={f.label} className="flex items-center gap-4">
                                    <div className="text-[#8B4513]">{f.icon}</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{f.label}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Shop by Category */}
                        <div className="mb-20">
                            <div className="flex justify-between items-end mb-8">
                                <h2 className="text-[22px] font-bold text-gray-900">Shop by Category</h2>
                                <Link to="/shop" className="text-gray-500 text-sm font-medium hover:text-[#8B4513] transition">View all</Link>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                                {categories.map((cat, idx) => (
                                    <div key={idx}
                                        onClick={() => navigate(`/shop?category=${cat.name}`)}
                                        className="cursor-pointer group flex flex-col items-center">
                                        <div className="w-full aspect-square rounded-[24px] overflow-hidden mb-4 bg-gray-50">
                                            <img src={cat.img} alt={cat.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                        </div>
                                        <span className="font-bold text-sm text-gray-900 group-hover:text-[#8B4513] transition">{cat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bestselling Products */}
                        <div className="mb-10">
                            <div className="flex justify-between items-end mb-8">
                                <h2 className="text-[22px] font-bold text-gray-900">Bestselling Products</h2>
                                <Link to="/shop" className="text-gray-500 text-sm font-medium hover:text-[#8B4513] transition">View all</Link>
                            </div>

                            {loading ? (
                                <div className="flex space-x-4 animate-pulse">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex-1 bg-gray-100 h-80 rounded-3xl"></div>
                                    ))}
                                </div>
                            ) : bestsellers.length === 0 ? (
                                <p className="text-center text-gray-400 py-10">No products available.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {bestsellers.map(p => (
                                        <div key={p.productID}
                                            onClick={() => navigate(`/shop/${p.productID}`)}
                                            className="bg-white rounded-3xl p-4 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col border border-gray-100/50 group cursor-pointer shadow-sm">
                                            <div className="bg-gray-50 rounded-2xl h-60 flex items-center justify-center mb-5 overflow-hidden relative">
                                                {p.images?.[0]
                                                    ? <img src={getImageUrl(p.images[0].imagePath)}
                                                        alt={p.productName}
                                                        className="h-full w-full object-cover group-hover:scale-105 transition duration-700" />
                                                    : <img src={categories[1].img}
                                                        className="h-full w-full object-cover group-hover:scale-105 transition duration-700 opacity-80"
                                                        alt="Placeholder" />
                                                }
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-[15px] mb-1 line-clamp-1">{p.productName}</h3>
                                            <p className="text-gray-500 text-xs font-medium mb-4">{p.material}</p>

                                            <div className="flex items-center justify-between mt-auto">
                                                <div>
                                                    <p className="text-gray-900 font-bold text-[15px]">
                                                        Rs. {p.basePrice?.toLocaleString()}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1 text-sm font-semibold text-gray-700">
                                                        <Star size={14} className="text-[#FFB800]" fill="#FFB800" />
                                                        <span>4.8</span>
                                                        <span className="text-gray-400 font-normal">(32)</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => addToCart(e, p)}
                                                    className="bg-[#8B4513] hover:bg-[#6b340e] text-white text-xs px-3 py-2 rounded-lg transition">
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Home;
