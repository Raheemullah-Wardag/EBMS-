import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { markAttendance } from '../../api/attendanceApi';
import { getEmployeeByUserID } from '../../api/employeeApi';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const AttendanceEntry = () => {
    const { login } = useAuth();
    const [form, setForm] = useState({
        employeeID: '',
        username: '',
        password: '',
        status: 'Present',
        notes: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (!form.employeeID || !form.username || !form.password) {
                throw new Error('Employee ID, username and password are required.');
            }

            const loginRes = await axiosInstance.post('/auth/login', {
                username: form.username,
                password: form.password,
            });

            if (loginRes.data.role !== 'Employee') {
                throw new Error('Only employees can mark attendance on this page.');
            }

            login(loginRes.data.token);

            const employeeRes = await getEmployeeByUserID(loginRes.data.userID);
            if (employeeRes.data.employeeID !== parseInt(form.employeeID, 10)) {
                throw new Error('This employee ID does not match your login credentials.');
            }

            const now = new Date();
            const currentDate = now.toISOString().slice(0, 10);
            const currentTime = now.toTimeString().slice(0, 5);

            await markAttendance({
                employeeID: parseInt(form.employeeID, 10),
                workDate: currentDate,
                checkIn: currentTime,
                checkOut: null,
                status: form.status,
                notes: form.notes || null,
            });

            setSuccess('Attendance has been marked successfully.');
            setForm({
                ...form,
                password: '',
                checkIn: '',
                checkOut: '',
                notes: '',
                status: 'Present',
            });
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to submit attendance.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Employee Attendance</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your employee ID and login to mark your attendance.
                        <br />If you already have an account, use the same credentials.
                    </p>
                </div>

                <div className="bg-white py-8 px-6 shadow rounded-3xl border border-gray-200">
                    {error && (
                        <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm">
                            {success}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                            <input
                                name="employeeID"
                                value={form.employeeID}
                                onChange={handleChange}
                                type="text"
                                inputMode="numeric"
                                placeholder="Enter your employee ID"
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                type="text"
                                placeholder="Username or email"
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    className="w-full rounded-2xl border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-2xl border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Date recorded</p>
                                <p className="mt-2 font-semibold text-gray-900">{new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl border border-gray-200 p-4">
                                <p className="text-sm text-gray-500">Time recorded</p>
                                <p className="mt-2 font-semibold text-gray-900">{new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                            >
                                <option>Present</option>
                                <option>Absent</option>
                                <option>Leave</option>
                                <option>HalfDay</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Optional notes"
                                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-600"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl bg-amber-700 text-white py-3 text-sm font-semibold shadow-lg shadow-amber-200/20 hover:bg-amber-800 transition disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Mark Attendance'}
                        </button>
                    </form>
                </div>

                <div className="text-center text-sm text-gray-500">
                    Already logged in? <Link to="/admin" className="text-amber-600 font-medium hover:text-amber-700">Go to dashboard</Link>
                </div>
            </div>
        </div>
    );
};

export default AttendanceEntry;
