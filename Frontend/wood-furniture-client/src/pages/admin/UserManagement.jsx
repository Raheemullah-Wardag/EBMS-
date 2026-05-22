import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import { Search, Plus, X, Shield } from 'lucide-react';

const ROLES = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Manager' },
    { id: 3, name: 'Employee' },
    { id: 4, name: 'Customer' },
];

const UserManagement = () => {
    const [users,    setUsers]    = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [search,   setSearch]   = useState('');
    const [showModal,setShowModal]= useState(false);
    const [saving,   setSaving]   = useState(false);
    const [error,    setError]    = useState('');

    const [form, setForm] = useState({
        username: '', email: '', password: '', roleID: 3
    });

    const fetchUsers = () => {
        setLoading(true);
        axiosInstance.get('/users').then(res => {
            setUsers(res.data);
            setFiltered(res.data);
        }).catch(() => {
            // fallback — users endpoint may not exist yet
            setUsers([]);
            setFiltered([]);
        }).finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(users.filter(u =>
            u.username?.toLowerCase().includes(q) ||
            u.email?.toLowerCase().includes(q) ||
            u.roleName?.toLowerCase().includes(q)
        ));
    }, [search, users]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await axiosInstance.post('/auth/register', {
                username: form.username,
                email:    form.email,
                password: form.password,
                roleID:   parseInt(form.roleID),
            });
            setShowModal(false);
            setForm({ username: '', email: '', password: '', roleID: 3 });
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AdminLayout title="User Management">

            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={20} /></button>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New User</h2>
                        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select value={form.roleID} onChange={e => setForm({...form, roleID: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600">
                                    {ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50">
                                    {saving ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white" />
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm w-full sm:w-auto justify-center">
                    <Plus size={18} /> Add User
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">User</th>
                                <th className="py-4 px-6 font-semibold">Email</th>
                                <th className="py-4 px-6 font-semibold">Role</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                                        <p>Loading users...</p>
                                    </div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="5" className="py-12 text-center text-gray-400">No users found.</td></tr>
                            ) : (
                                filtered.map(u => (
                                    <tr key={u.userID} className="hover:bg-gray-50/50 transition">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                                                    {u.username?.[0]?.toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-gray-900">{u.username}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{u.email}</td>
                                        <td className="py-4 px-6">
                                            <span className="flex items-center gap-1 text-xs font-medium">
                                                <Shield size={12} className="text-amber-600" /> {u.roleName}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default UserManagement;


