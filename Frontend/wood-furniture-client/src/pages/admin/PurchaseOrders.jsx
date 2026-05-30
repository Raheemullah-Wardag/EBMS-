import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Search, FileText, Download, X } from 'lucide-react';
import { getAllRawMaterials } from '../../api/materialApi';

const PurchaseOrders = () => {
    const [materials, setMaterials] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');
    const [showPOModal, setShowPOModal] = useState(false);
    const [selectedMaterials, setSelectedMaterials] = useState({});
    const [poData, setPoData] = useState(null);

    const fetchMaterials = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getAllRawMaterials();
            setMaterials(res.data);
            setFiltered(res.data);
        } catch (err) {
            console.error('Error fetching raw materials:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load raw materials.');
            setMaterials([]);
            setFiltered([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMaterials(); }, []);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(materials.filter(m =>
            m.materialName?.toLowerCase().includes(q) ||
            m.supplier?.toLowerCase().includes(q)
        ));
    }, [search, materials]);

    const getStockColor = (status, qty) => {
        if (status === 'In Stock') return 'bg-green-100 text-green-700';
        if (status === 'Out of Stock') return 'bg-red-100 text-red-700';
        return qty > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    };

    const openPOModal = () => {
        if (!materials.length) {
            setError('No raw materials available to create a purchase order.');
            return;
        }
        setSelectedMaterials({});
        setError('');
        setShowPOModal(true);
    };

    const handleMaterialToggle = (materialID) => {
        setSelectedMaterials(prev => {
            const next = { ...prev };
            if (next[materialID]) {
                delete next[materialID];
            } else {
                next[materialID] = { qty: 1 };
            }
            return next;
        });
    };

    const handleMaterialQtyChange = (materialID, qty) => {
        setSelectedMaterials(prev => ({
            ...prev,
            [materialID]: { qty: parseInt(qty, 10) || 0 }
        }));
    };

    const generatePO = () => {
        const selected = Object.keys(selectedMaterials)
            .map(id => {
                const material = materials.find(m => m.materialID == id);
                return material ? { ...material, orderQty: selectedMaterials[id].qty } : null;
            })
            .filter(Boolean);

        if (selected.length === 0) {
            setError('Please select at least one raw material before generating a purchase order.');
            return;
        }

        const grouped = {};
        selected.forEach(item => {
            const supplier = item.supplier || 'Unknown Supplier';
            if (!grouped[supplier]) grouped[supplier] = [];
            grouped[supplier].push(item);
        });

        setPoData({ grouped, selectedItems: selected });
        setShowPOModal(false);
        setError('');
    };

    const downloadPO = () => {
        if (!poData) return;

        const { grouped, selectedItems } = poData;
        let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Raw Material Purchase Order</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .header { text-align: center; margin-bottom: 24px; }
    .header h1 { margin: 0; font-size: 28px; color: #333; }
    .subheader { color: #666; font-size: 14px; margin-top: 4px; }
    .company-box { background: #f7f7f7; padding: 14px; border-radius: 12px; margin-bottom: 24px; }
    .supplier-section { margin-bottom: 28px; }
    .supplier-name { font-size: 16px; font-weight: 700; margin-bottom: 10px; color: #8B5A2B; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #8B5A2B; color: #fff; font-weight: 600; }
    tr:nth-child(even) { background: #f9f9f9; }
    .total-row td { font-weight: 700; background: #f1f1f1; }
    .grand-total { text-align: right; font-size: 18px; font-weight: 700; margin-top: 18px; }
    .footer { margin-top: 32px; color: #555; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Purchase Order</h1>
    <div class="subheader">Generated: ${new Date().toLocaleDateString('en-PK')}</div>
  </div>
  <div class="company-box">
    <strong>From:</strong> Wood Furniture Management System<br />
    <strong>Date:</strong> ${new Date().toLocaleDateString('en-PK')}<br />
    <strong>Status:</strong> Pending
  </div>
`;

        Object.entries(grouped).forEach(([supplier, items]) => {
            html += `
  <div class="supplier-section">
    <div class="supplier-name">Supplier: ${supplier}</div>
    <table>
      <thead>
        <tr>
          <th>Material</th>
          <th>Unit</th>
          <th>Order Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
`;
            let supplierTotal = 0;
            items.forEach(item => {
                const total = (item.costPerUnit || 0) * item.orderQty;
                supplierTotal += total;
                html += `
        <tr>
          <td>${item.materialName}</td>
          <td>${item.unit}</td>
          <td>${item.orderQty}</td>
          <td>Rs. ${(item.costPerUnit || 0).toLocaleString()}</td>
          <td>Rs. ${total.toLocaleString()}</td>
        </tr>
`;
            });
            html += `
        <tr class="total-row">
          <td colspan="4">Supplier Subtotal</td>
          <td>Rs. ${supplierTotal.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  </div>
`;
        });

        const grandTotal = selectedItems.reduce((sum, item) => sum + ((item.costPerUnit || 0) * item.orderQty), 0);
        html += `
  <div class="grand-total">Grand Total: Rs. ${grandTotal.toLocaleString()}</div>
  <div class="footer">
    <p><strong>Terms & Conditions:</strong></p>
    <ul>
      <li>Delivery terms to be confirmed with supplier.</li>
      <li>Payment terms follow company procurement policy.</li>
      <li>All deliveries are subject to inspection and quality checks.</li>
    </ul>
  </div>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `RawMaterial_PO_${Date.now()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <AdminLayout title="Purchase Orders">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search raw materials..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                    />
                </div>
                <button
                    onClick={openPOModal}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm w-full sm:w-auto justify-center"
                >
                    <FileText size={18} /> Generate PO
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
            )}

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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                                            <p>Loading raw materials...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-gray-400">No raw materials found.</td>
                                </tr>
                            ) : (
                                filtered.map(material => (
                                    <tr key={material.materialID} className="hover:bg-gray-50 transition">
                                        <td className="py-4 px-6 font-semibold text-gray-900">{material.materialName}</td>
                                        <td className="py-4 px-6 text-gray-600">{material.unit}</td>
                                        <td className="py-4 px-6 text-gray-900">{material.stockQty}</td>
                                        <td className="py-4 px-6 text-gray-600">{material.reorderLevel}</td>
                                        <td className="py-4 px-6 text-gray-900">Rs. {material.costPerUnit?.toLocaleString()}</td>
                                        <td className="py-4 px-6 text-gray-600">{material.supplier || '—'}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStockColor(material.stockStatus, material.stockQty)}`}>
                                                {material.stockStatus || (material.stockQty > 0 ? 'In Stock' : 'Out of Stock')}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showPOModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowPOModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Select Raw Materials to Generate PO</h2>
                        <p className="text-sm text-gray-600 mb-6">Choose raw materials and quantities. The PO will be grouped by supplier.</p>

                        <div className="space-y-3 mb-6 max-h-[58vh] overflow-y-auto">
                            {materials.map(material => {
                                const selection = selectedMaterials[material.materialID];
                                return (
                                    <div key={material.materialID} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                                        <label className="flex items-center gap-3 flex-1">
                                            <input
                                                type="checkbox"
                                                checked={!!selection}
                                                onChange={() => handleMaterialToggle(material.materialID)}
                                                className="w-5 h-5 text-amber-600 border-gray-300 rounded"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">{material.materialName}</p>
                                                <p className="text-xs text-gray-500">Supplier: {material.supplier || 'N/A'} · Stock: {material.stockQty} {material.unit} · Price: Rs. {material.costPerUnit?.toLocaleString()}</p>
                                            </div>
                                        </label>
                                        {selection && (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={selection.qty}
                                                    onChange={e => handleMaterialQtyChange(material.materialID, e.target.value)}
                                                    className="w-24 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600"
                                                />
                                                <span className="text-sm text-gray-600">{material.unit}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => setShowPOModal(false)}
                                className="w-full sm:w-auto border border-gray-200 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={generatePO}
                                className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white py-3 rounded-2xl font-medium transition"
                            >
                                Generate Purchase Order
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {poData && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setPoData(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Purchase Order Preview</h2>
                        <div className="space-y-4 mb-6">
                            {Object.entries(poData.grouped).map(([supplier, items]) => (
                                <div key={supplier} className="rounded-2xl border border-gray-200 p-4">
                                    <div className="text-sm font-semibold text-amber-700 mb-3">Supplier: {supplier}</div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="py-2 px-3 text-left">Material</th>
                                                    <th className="py-2 px-3 text-right">Qty</th>
                                                    <th className="py-2 px-3 text-right">Unit Price</th>
                                                    <th className="py-2 px-3 text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map(item => {
                                                    const total = (item.costPerUnit || 0) * item.orderQty;
                                                    return (
                                                        <tr key={item.materialID} className="border-t border-gray-100">
                                                            <td className="py-2 px-3">{item.materialName}</td>
                                                            <td className="py-2 px-3 text-right">{item.orderQty}</td>
                                                            <td className="py-2 px-3 text-right">Rs. {(item.costPerUnit || 0).toLocaleString()}</td>
                                                            <td className="py-2 px-3 text-right font-semibold">Rs. {total.toLocaleString()}</td>
                                                        </tr>
                                                    );
                                                })}
                                                <tr className="bg-amber-50 font-semibold">
                                                    <td colSpan="3" className="py-2 px-3 text-right">Subtotal:</td>
                                                    <td className="py-2 px-3 text-right">Rs. {items.reduce((sum, item) => sum + ((item.costPerUnit || 0) * item.orderQty), 0).toLocaleString()}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg mb-6">
                            <p className="text-lg font-bold text-amber-900">
                                Grand Total: Rs. {poData.selectedItems.reduce((sum, item) => sum + ((item.costPerUnit || 0) * item.orderQty), 0).toLocaleString()}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => setPoData(null)}
                                className="w-full sm:w-auto border border-gray-200 text-gray-700 py-3 rounded-2xl font-medium hover:bg-gray-50 transition"
                            >
                                Edit Selection
                            </button>
                            <button
                                type="button"
                                onClick={downloadPO}
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-medium transition flex items-center justify-center gap-2"
                            >
                                <Download size={18} /> Download PO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default PurchaseOrders;