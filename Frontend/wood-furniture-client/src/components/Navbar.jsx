import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingBag, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="bg-[#FAF8F5] text-gray-800 px-6 py-5 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#8B4513] text-white flex items-center justify-center rounded-md font-serif italic text-xl shadow-sm">W</div>
                    <span className="text-[#8B4513] tracking-tight">WoodCraft</span>
                </Link>

                {/* Desktop Links (Centered) */}
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-800">
                    <Link to="/" className={`relative transition hover:text-[#8B4513] ${isActive('/') ? 'text-[#8B4513]' : ''}`}>
                        Home
                        {isActive('/') && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#8B4513] rounded-full"></span>}
                    </Link>
                    <Link to="/shop" className={`relative transition hover:text-[#8B4513] ${isActive('/shop') ? 'text-[#8B4513]' : ''}`}>
                        Products <span className="text-[10px] ml-0.5 opacity-50">▼</span>
                        {isActive('/shop') && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#8B4513] rounded-full"></span>}
                    </Link>
                    <Link to="/about" className={`relative transition hover:text-[#8B4513] ${isActive('/about') ? 'text-[#8B4513]' : ''}`}>
                        About Us
                        {isActive('/about') && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#8B4513] rounded-full"></span>}
                    </Link>
                    <Link to="/custom-order" className={`relative transition hover:text-[#8B4513] ${isActive('/custom-order') ? 'text-[#8B4513]' : ''}`}>
                        Custom Order
                        {isActive('/custom-order') && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#8B4513] rounded-full"></span>}
                    </Link>
                    <Link to="/contact" className={`relative transition hover:text-[#8B4513] ${isActive('/contact') ? 'text-[#8B4513]' : ''}`}>
                        Contact
                        {isActive('/contact') && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#8B4513] rounded-full"></span>}
                    </Link>
                </div>

                {/* Desktop Icons */}
                <div className="hidden md:flex items-center gap-6">
                    <button className="text-gray-800 hover:text-[#8B4513] transition"><Search size={20} strokeWidth={2.5} /></button>
                    
                    <Link to="/cart" className="text-gray-800 hover:text-[#8B4513] transition relative">
                        <ShoppingBag size={20} strokeWidth={2.5} />
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/my-orders" className="text-gray-800 hover:text-[#8B4513] transition">
                                <User size={20} strokeWidth={2.5} />
                            </Link>
                            {(user.role === 'Admin' || user.role === 'Manager' || user.role === 'Employee') && (
                                <Link to="/admin" className="text-xs bg-[#8B4513]/10 text-[#8B4513] px-2 py-1 rounded font-semibold hover:bg-[#8B4513]/20 transition">Admin</Link>
                            )}
                            <button onClick={handleLogout} className="text-sm font-semibold text-red-600 hover:text-red-800 transition">Logout</button>
                        </div>
                    ) : (
                        <Link to="/login" className="text-gray-800 hover:text-[#8B4513] transition">
                            <User size={20} strokeWidth={2.5} />
                        </Link>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden focus:outline-none text-gray-800"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className="text-2xl">{menuOpen ? '✕' : '☰'}</span>
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden mt-4 bg-white rounded-xl shadow-lg px-4 py-4 flex flex-col gap-4 text-sm font-medium border border-gray-100 absolute w-[calc(100%-3rem)] z-50">
                    <Link to="/"             onClick={() => setMenuOpen(false)} className="hover:text-[#8B4513]">Home</Link>
                    <Link to="/shop"         onClick={() => setMenuOpen(false)} className="hover:text-[#8B4513]">Products</Link>
                    <Link to="/about"        onClick={() => setMenuOpen(false)} className="hover:text-[#8B4513]">About Us</Link>
                    <Link to="/custom-order" onClick={() => setMenuOpen(false)} className="hover:text-[#8B4513]">Custom Order</Link>
                    <Link to="/contact"      onClick={() => setMenuOpen(false)} className="hover:text-[#8B4513]">Contact</Link>
                    <div className="border-t border-gray-100 my-2"></div>
                    <Link to="/cart"         onClick={() => setMenuOpen(false)} className="hover:text-[#8B4513] flex items-center gap-2"><ShoppingBag size={18}/> Cart</Link>
                    {user ? (
                        <>
                            <Link to="/my-orders" onClick={() => setMenuOpen(false)} className="hover:text-[#8B4513] flex items-center gap-2"><User size={18}/> My Profile</Link>
                            {(user.role === 'Admin' || user.role === 'Manager') && (
                                <Link to="/admin" onClick={() => setMenuOpen(false)} className="hover:text-[#8B4513]">Admin Dashboard</Link>
                            )}
                            <button onClick={handleLogout} className="text-left text-red-600 font-semibold mt-2">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-[#8B4513] flex items-center gap-2"><User size={18}/> Login</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;