
// ============================================================
//  FILE 2: src/pages/admin/RawMaterials.jsx
// ============================================================
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import axiosInstance from '../../api/axiosInstance';
import { Search, Plus, X, Edit, FileText, Download } from 'lucide-react';

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
    
    // Purchase Order state
    const [showPOModal, setShowPOModal] = useState(false);
    const [selectedMaterials, setSelectedMaterials] = useState({});
    const [poData, setPoData] = useState(null);

    const fetchMaterials = () => {
        setLoading(true);
        setError('');
        axiosInstance.get('/rawmaterials').then(res => {
            setMaterials(res.data);
            setFiltered(res.data);
        }).catch(err => { 
            const errorMsg = err.response?.data?.message || err.message || 'Failed to load raw materials';
            setError(errorMsg);
            console.error('Error fetching materials:', err);
            setMaterials([]); 
            setFiltered([]); 
        }).finally(() => setLoading(false));
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

    // Handle material selection for PO
    const handleMaterialToggle = (materialID) => {
        setSelectedMaterials(prev => {
            const newSelected = { ...prev };
            if (newSelected[materialID]) {
                delete newSelected[materialID];
            } else {
                newSelected[materialID] = { qty: 1 };
            }
            return newSelected;
        });
    };

    const handleMaterialQtyChange = (materialID, qty) => {
        setSelectedMaterials(prev => ({
            ...prev,
            [materialID]: { qty: parseInt(qty) || 0 }
        }));
    };

    const generatePO = () => {
        const selected = Object.keys(selectedMaterials).map(id => {
            const mat = materials.find(m => m.materialID == id);
            return {
                ...mat,
                orderQty: selectedMaterials[id].qty
            };
        });

        if (selected.length === 0) {
            setError('Please select at least one material');
            return;
        }

        // Group by supplier
        const grouped = {};
        selected.forEach(item => {
            const supplier = item.supplier || 'Unknown Supplier';
            if (!grouped[supplier]) {
                grouped[supplier] = [];
            }
            grouped[supplier].push(item);
        });

        setPoData({ grouped, selectedItems: selected });
        setShowPOModal(false);
    };

    const downloadPO = () => {
        if (!poData) return;

        const { grouped, selectedItems } = poData;
        let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Purchase Order</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #333; }
        .po-number { color: #666; font-size: 14px; }
        .company-info { margin-bottom: 20px; padding: 10px; background: #f5f5f5; border-radius: 5px; }
        .supplier-section { margin-bottom: 30px; page-break-inside: avoid; }
        .supplier-name { font-size: 16px; font-weight: bold; margin: 15px 0 10px 0; color: #333; border-bottom: 2px solid #8B5A2B; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background-color: #8B5A2B; color: white; padding: 10px; text-align: left; font-size: 12px; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .total { font-weight: bold; text-align: right; }
        .footer { margin-top: 40px; font-size: 12px; color: #666; }
        .print-date { margin-top: 20px; font-size: 12px; color: #999; }
        @media print {
            body { margin: 0; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PURCHASE ORDER</h1>
        <p class="po-number">Generated: ${new Date().toLocaleDateString('en-PK')}</p>
    </div>

    <div class="company-info">
        <strong>From:</strong> Wood Furniture Management System<br>
        <strong>Date:</strong> ${new Date().toLocaleDateString('en-PK')}<br>
        <strong>Status:</strong> Pending
    </div>
`;

        // Generate PO for each supplier
        Object.entries(grouped).forEach(([supplier, items]) => {
            htmlContent += `
    <div class="supplier-section">
        <div class="supplier-name">Supplier: ${supplier}</div>
        <table>
            <thead>
                <tr>
                    <th>Material Name</th>
                    <th>Unit</th>
                    <th>Order Qty</th>
                    <th>Unit Price (Rs.)</th>
                    <th>Total (Rs.)</th>
                </tr>
            </thead>
            <tbody>
`;
            let supplierTotal = 0;
            items.forEach(item => {
                const total = (item.costPerUnit || 0) * item.orderQty;
                supplierTotal += total;
                htmlContent += `
                <tr>
                    <td>${item.materialName}</td>
                    <td>${item.unit}</td>
                    <td>${item.orderQty}</td>
                    <td>${(item.costPerUnit || 0).toLocaleString()}</td>
                    <td>${total.toLocaleString()}</td>
                </tr>
`;
            });
            htmlContent += `
                <tr style="background-color: #f0f0f0;">
                    <td colspan="4" class="total">Subtotal:</td>
                    <td class="total">Rs. ${supplierTotal.toLocaleString()}</td>
                </tr>
            </tbody>
        </table>
    </div>
`;
        });

        const grandTotal = selectedItems.reduce((sum, item) => sum + ((item.costPerUnit || 0) * item.orderQty), 0);

        htmlContent += `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #333;">
        <div style="text-align: right; font-size: 16px; font-weight: bold; margin: 20px 0;">
            Grand Total: Rs. ${grandTotal.toLocaleString()}
        </div>
    </div>

    <div class="footer">
        <p><strong>Terms & Conditions:</strong></p>
        <ul>
            <li>Delivery terms to be agreed upon with supplier</li>
            <li>Payment terms: As per company policy</li>
            <li>Quality checks will be performed upon delivery</li>
        </ul>
    </div>

    <div class="print-date">
        <p>This is a system-generated document. Please print and submit to supplier.</p>
    </div>
</body>
</html>
`;

        // Create and download
        const element = document.createElement('a');
        const file = new Blob([htmlContent], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = `PO_${new Date().getTime()}.html`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <AdminLayout title="Raw Materials">
            {/* PO Generation Modal */}
            {showPOModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowPOModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Generate Purchase Order</h2>
                        <p className="text-sm text-gray-600 mb-6">Select materials and quantities to generate a purchase order</p>

                        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

                        <div className="bg-gray-50 rounded-xl p-4 space-y-3 max-h-96 overflow-y-auto mb-6">
                            {materials.length === 0 ? (
                                <p className="text-gray-500 text-sm">No materials available</p>
                            ) : (
                                materials.map(mat => {
                                    const isSelected = selectedMaterials[mat.materialID];
                                    return (
                                        <div key={mat.materialID} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-amber-300">
                                            <input
                                                type="checkbox"
                                                checked={!!isSelected}
                                                onChange={() => handleMaterialToggle(mat.materialID)}
                                                className="w-5 h-5 rounded border-gray-300 text-amber-600 cursor-pointer"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900">{mat.materialName}</p>
                                                <p className="text-xs text-gray-500">
                                                    Supplier: {mat.supplier || 'N/A'} | Stock: {mat.stockQty} {mat.unit} | Price: Rs. {mat.costPerUnit?.toLocaleString() || 'N/A'}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={isSelected.qty}
                                                        onChange={e => handleMaterialQtyChange(mat.materialID, e.target.value)}
                                                        className="w-20 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                                                        placeholder="Qty"
                                                    />
                                                    <span className="text-sm text-gray-600 whitespace-nowrap">{mat.unit}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowPOModal(false)}
                                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={generatePO}
                                className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl font-medium transition"
                            >
                                Generate PO
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={() => { setSelectedMaterials({}); setError(''); setShowPOModal(true); }} 
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm flex-1 sm:flex-initial justify-center">
                        <FileText size={18} /> Generate PO
                    </button>
                    <button onClick={openAdd} className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm flex-1 sm:flex-initial justify-center">
                        <Plus size={18} /> Add Material
                    </button>
                </div>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

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
