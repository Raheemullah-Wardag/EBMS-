import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import { Search } from 'lucide-react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [filtered,  setFiltered]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [search,    setSearch]    = useState('');

    useEffect(() => {
        axiosInstance.get('/customers')
            .then(res => { setCustomers(res.data); setFiltered(res.data); })
            .catch(() => { setCustomers([]); setFiltered([]); })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(customers.filter(c =>
            c.email?.toLowerCase().includes(q) ||
            c.firstName?.toLowerCase().includes(q) ||
            c.companyName?.toLowerCase().includes(q)
        ));
    }, [search, customers]);

    return (
        <AdminLayout title="Customers">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white" />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Customer</th>
                                <th className="py-4 px-6 font-semibold">Type</th>
                                <th className="py-4 px-6 font-semibold">Email</th>
                                <th className="py-4 px-6 font-semibold">Phone</th>
                                <th className="py-4 px-6 font-semibold">City</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="6" className="py-12 text-center">
                                    <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="6" className="py-12 text-center text-gray-400">No customers found.</td></tr>
                            ) : (
                                filtered.map(c => (
                                    <tr key={c.customerID} className="hover:bg-gray-50/50 transition">
                                        <td className="py-4 px-6 font-semibold text-gray-900">
                                            {c.customerType === 'B2B' ? c.companyName : `${c.firstName || ''} ${c.lastName || ''}`.trim()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.customerType === 'B2B' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {c.customerType}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{c.email}</td>
                                        <td className="py-4 px-6 text-gray-600">{c.phone || '—'}</td>
                                        <td className="py-4 px-6 text-gray-600">{c.city || '—'}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {c.isActive ? 'Active' : 'Inactive'}
                                            </span>
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

export default Customers;