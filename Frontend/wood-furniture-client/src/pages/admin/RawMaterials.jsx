
// ============================================================
//  FILE 2: src/pages/admin/RawMaterials.jsx
// ============================================================
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import { Search, Plus, X, Edit } from 'lucide-react';

const emptyMaterial = { materialName: '', unit: 'kg', stockQty: '', reorderLevel: '', costPerUnit: '', supplier: '' };

const RawMaterials = () => {
    const [materials, setMaterials] = useState([]);
    const [filtered,  setFiltered]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [search,    setSearch]    = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editing,   setEditing]   = useState(null);
    const [form,      setForm]      = useState(emptyMaterial);
    const [saving,    setSaving]    = useState(false);
    const [error,     setError]     = useState('');

    const fetchMaterials = () => {
        setLoading(true);
        axiosInstance.get('/rawmaterials').then(res => {
            setMaterials(res.data);
            setFiltered(res.data);
        }).catch(() => { setMaterials([]); setFiltered([]); })
          .finally(() => setLoading(false));
    };

    useEffect(() => { fetchMaterials(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(materials.filter(m => m.materialName?.toLowerCase().includes(q) || m.supplier?.toLowerCase().includes(q)));
    }, [search, materials]);

    const openAdd = () => { setEditing(null); setForm(emptyMaterial); setError(''); setShowModal(true); };
    const openEdit = (m) => {
        setEditing(m);
        setForm({ materialName: m.materialName, unit: m.unit, stockQty: m.stockQty, reorderLevel: m.reorderLevel, costPerUnit: m.costPerUnit, supplier: m.supplier || '' });
        setError('');
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = { ...form, stockQty: parseFloat(form.stockQty), reorderLevel: parseFloat(form.reorderLevel), costPerUnit: parseFloat(form.costPerUnit) };
            if (editing) await axiosInstance.put(`/rawmaterials/${editing.materialID}`, payload);
            else         await axiosInstance.post('/rawmaterials', payload);
            setShowModal(false);
            fetchMaterials();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save.');
        } finally {
            setSaving(false);
        }
    };

    const getStockColor = (status) => {
        if (status === 'In Stock')     return 'bg-green-100 text-green-700';
        if (status === 'Out of Stock') return 'bg-red-100 text-red-700';
        return 'bg-amber-100 text-amber-700';
    };

    return (
        <AdminLayout title="Raw Materials">
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"><X size={20} /></button>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">{editing ? 'Edit Material' : 'Add Raw Material'}</h2>
                        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
                                    <input type="text" required value={form.materialName} onChange={e => setForm({...form, materialName: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                    <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600">
                                        {['kg','m3','pcs','litre'].map(u => <option key={u}>{u}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
                                    <input type="number" required value={form.stockQty} onChange={e => setForm({...form, stockQty: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                                    <input type="number" required value={form.reorderLevel} onChange={e => setForm({...form, reorderLevel: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Per Unit</label>
                                    <input type="number" required value={form.costPerUnit} onChange={e => setForm({...form, costPerUnit: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                    <input type="text" value={form.supplier} onChange={e => setForm({...form, supplier: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition">Cancel</button>
                                <button type="submit" disabled={saving} className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50">
                                    {saving ? 'Saving...' : (editing ? 'Update' : 'Add Material')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white" />
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm w-full sm:w-auto justify-center">
                    <Plus size={18} /> Add Material
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Material</th>
                                <th className="py-4 px-6 font-semibold">Unit</th>
                                <th className="py-4 px-6 font-semibold">In Stock</th>
                                <th className="py-4 px-6 font-semibold">Reorder Level</th>
                                <th className="py-4 px-6 font-semibold">Cost/Unit</th>
                                <th className="py-4 px-6 font-semibold">Supplier</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="8" className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                                        <p>Loading materials...</p>
                                    </div>
                                </td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan="8" className="py-12 text-center text-gray-400">No materials found.</td></tr>
                            ) : (
                                filtered.map(m => (
                                    <tr key={m.materialID} className="hover:bg-gray-50/50 transition">
                                        <td className="py-4 px-6 font-semibold text-gray-900">{m.materialName}</td>
                                        <td className="py-4 px-6 text-gray-600">{m.unit}</td>
                                        <td className="py-4 px-6 font-medium text-gray-900">{m.stockQty}</td>
                                        <td className="py-4 px-6 text-gray-600">{m.reorderLevel}</td>
                                        <td className="py-4 px-6 text-gray-900">Rs. {m.costPerUnit?.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-gray-600">{m.supplier || '—'}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStockColor(m.stockStatus)}`}>
                                                {m.stockStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end">
                                                <button onClick={() => openEdit(m)} className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition">
                                                    <Edit size={16} />
                                                </button>
                                            </div>
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

export default RawMaterials;
