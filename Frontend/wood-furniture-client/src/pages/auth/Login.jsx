import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate   = useNavigate();

    const [form, setForm]     = useState({ username: '', password: '' });
    const [error, setError]   = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.post('/auth/login', form);
            login(res.data.token);

            // Redirect based on role
            const role = res.data.role;
            if (role === 'Admin' || role === 'Manager' || role === 'Employee') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1621295693450-080546d2ec8e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHdvb2QlMjB0ZXh0dXJlfGVufDB8fDB8fHww')" }}
            >
                <div className="absolute inset-0 bg-black/60 sm:bg-black/40"></div>
                {/* Add a gradient to make it darker on the left/center where the form is */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/10 shadow-2xl">

                {/* Logo */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-amber-700 text-white flex items-center justify-center rounded-md font-serif italic text-xl shrink-0 shadow-lg">W</div>
                        <span className="font-bold text-2xl tracking-wide text-white">WoodCraft</span>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-300">Please login to your account</p>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm backdrop-blur-md">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Email or Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            className="w-full bg-white/95 border-0 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your password"
                                className="w-full bg-white/95 border-0 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600 placeholder-gray-400 pr-12"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="relative flex items-center justify-center w-4 h-4">
                                <input type="checkbox" className="peer appearance-none w-4 h-4 border border-gray-400 rounded-sm checked:bg-amber-700 checked:border-amber-700 transition cursor-pointer" />
                                <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-300 group-hover:text-white transition">Remember me</span>
                        </label>
                        <a href="#" className="text-gray-300 hover:text-white transition">Forgot Password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8B4513] hover:bg-[#6b340e] text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50 mt-4 shadow-lg shadow-black/20"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-300 mt-8">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-white font-bold hover:underline">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;
