import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username:     '',
        email:        '',
        phone:        '',
        address:      '',
        password:     '',
        roleID:       4,    // default = Customer
    });

    const [error,   setError]   = useState('');
    const [success, setSuccess] = useState('');
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
        await axiosInstance.post('/auth/register', {
            username: form.username,
            email:    form.email,
            password: form.password,
            roleID:   parseInt(form.roleID),
            phone:    form.phone,     // <--- ADD THIS
            address:  form.address    // <--- ADD THIS
        });

        setSuccess('Registered successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);

    } catch (err) {
        setError(err.response?.data?.message || 'Registration failed.');
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 w-full max-w-xl border border-gray-100">

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 inline-block relative pb-3">
                        Register
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#8B4513] rounded-full"></div>
                    </h1>
                </div>

                {/* Error / Success */}
                {error && (
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm border border-red-100">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm border border-green-100">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                required
                                placeholder="Enter your name"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Enter your address"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition placeholder-gray-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                placeholder="Create a password"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8B4513] focus:border-transparent transition placeholder-gray-400 pr-12"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B4513] focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Client Type
                        </label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5">
                                    <input 
                                        type="radio" 
                                        name="roleID" 
                                        value={4} 
                                        checked={form.roleID == 4} 
                                        onChange={handleChange}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#8B4513] transition cursor-pointer" 
                                    />
                                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#8B4513] scale-0 peer-checked:scale-100 transition-transform"></div>
                                </div>
                                <span className="text-gray-700 group-hover:text-gray-900 transition font-medium">Individual</span>
                            </label>

                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5">
                                    <input 
                                        type="radio" 
                                        name="roleID" 
                                        value={5} // Using 5 as business hypothetically, or just pass 4 for both if it's the same
                                        checked={form.roleID == 5} 
                                        onChange={handleChange}
                                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#8B4513] transition cursor-pointer" 
                                    />
                                    <div className="absolute w-2.5 h-2.5 rounded-full bg-[#8B4513] scale-0 peer-checked:scale-100 transition-transform"></div>
                                </div>
                                <span className="text-gray-700 group-hover:text-gray-900 transition font-medium">Business</span>
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8B4513] hover:bg-[#6b340e] text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50 mt-6 shadow-lg shadow-[#8B4513]/20"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#8B4513] font-bold hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;
