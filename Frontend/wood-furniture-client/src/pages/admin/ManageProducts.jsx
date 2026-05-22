// import { useState, useEffect } from 'react';
// import AdminLayout from '../../components/AdminLayout';
// import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/productApi';
// import { Plus, Search, Edit, Trash2, X, Check } from 'lucide-react';
 
// const ITEMS_PER_PAGE = 10;
 
// const emptyForm = {
//     categoryID:   '',
//     productName:  '',
//     sku:          '',
//     description:  '',
//     material:     '',
//     dimensions:   '',
//     basePrice:    '',
//     stockQty:     '',
//     reorderLevel: 5,
// };
 
// const ManageProducts = () => {
//     const [products, setProducts] = useState([]);
//     const [filtered, setFiltered] = useState([]);
//     const [loading,  setLoading]  = useState(true);
//     const [search,   setSearch]   = useState('');
//     const [page,     setPage]     = useState(1);
 
//     // Modal state
//     const [showModal, setShowModal] = useState(false);
//     const [editing,   setEditing]   = useState(null); // null = add, object = edit
//     const [form,      setForm]      = useState(emptyForm);
//     const [saving,    setSaving]    = useState(false);
//     const [error,     setError]     = useState('');
 
//     // Confirm delete
//     const [deleteID, setDeleteID] = useState(null);
 
//     const fetchProducts = () => {
//         setLoading(true);
//         getAllProducts()
//             .then(res => {
//                 setProducts(res.data);
//                 setFiltered(res.data);
//             })
//             .catch(err => console.error(err))
//             .finally(() => setLoading(false));
//     };
 
//     useEffect(() => { fetchProducts(); }, []);
 
//     // ── Search filter ──────────────────────────────────────
//     useEffect(() => {
//         const q = search.toLowerCase();
//         setFiltered(products.filter(p =>
//             p.productName.toLowerCase().includes(q) ||
//             p.categoryName?.toLowerCase().includes(q) ||
//             p.material?.toLowerCase().includes(q)
//         ));
//         setPage(1);
//     }, [search, products]);
 
//     // ── Pagination ─────────────────────────────────────────
//     const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//     const paginated  = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);
 
//     // ── Open Add Modal ─────────────────────────────────────
//     const openAdd = () => {
//         setEditing(null);
//         setForm(emptyForm);
//         setError('');
//         setShowModal(true);
//     };
 
//     // ── Open Edit Modal ────────────────────────────────────
//     const openEdit = (p) => {
//         setEditing(p);
//         setForm({
//             categoryID:   p.categoryID,
//             productName:  p.productName,
//             sku:          p.sku,
//             description:  p.description || '',
//             material:     p.material    || '',
//             dimensions:   p.dimensions  || '',
//             basePrice:    p.basePrice,
//             stockQty:     p.stockQty,
//             reorderLevel: p.reorderLevel,
//         });
//         setError('');
//         setShowModal(true);
//     };
 
//     // ── Save (Add or Edit) ─────────────────────────────────
//     const handleSave = async (e) => {
//         e.preventDefault();
//         setSaving(true);
//         setError('');
//         try {
//             const payload = {
//                 ...form,
//                 categoryID:   parseInt(form.categoryID),
//                 basePrice:    parseFloat(form.basePrice),
//                 stockQty:     parseInt(form.stockQty),
//                 reorderLevel: parseInt(form.reorderLevel),
//             };
//             if (editing) {
//                 await updateProduct(editing.productID, payload);
//             } else {
//                 await createProduct(payload);
//             }
//             setShowModal(false);
//             fetchProducts();
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to save product.');
//         } finally {
//             setSaving(false);
//         }
//     };
 
//     // ── Delete ─────────────────────────────────────────────
//     const handleDelete = async () => {
//         try {
//             await deleteProduct(deleteID);
//             setDeleteID(null);
//             fetchProducts();
//         } catch (err) {
//             console.error(err);
//         }
//     };
 
//     const getStatusColor = (status) => {
//         if (status === 'In Stock')     return 'bg-green-100 text-green-800';
//         if (status === 'Out of Stock') return 'bg-red-100 text-red-800';
//         return 'bg-amber-100 text-amber-800';
//     };
 
//     return (
//         <AdminLayout title="Finished Goods (Products)">
 
//             {/* ── Add/Edit Modal ── */}
//             {showModal && (
//                 <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
//                         <button onClick={() => setShowModal(false)}
//                             className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
//                             <X size={20} />
//                         </button>
//                         <h2 className="text-xl font-bold text-gray-900 mb-6">
//                             {editing ? 'Edit Product' : 'Add New Product'}
//                         </h2>
 
//                         {error && (
//                             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
//                                 {error}
//                             </div>
//                         )}
 
//                         <form onSubmit={handleSave} className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="col-span-2">
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
//                                     <input type="text" required value={form.productName}
//                                         onChange={e => setForm({...form, productName: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                                     <input type="number" required value={form.categoryID}
//                                         onChange={e => setForm({...form, categoryID: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
//                                     <input type="text" required value={form.sku}
//                                         onChange={e => setForm({...form, sku: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
//                                     <input type="text" value={form.material}
//                                         onChange={e => setForm({...form, material: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
//                                     <input type="text" value={form.dimensions}
//                                         onChange={e => setForm({...form, dimensions: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (Rs.)</label>
//                                     <input type="number" required value={form.basePrice}
//                                         onChange={e => setForm({...form, basePrice: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
//                                     <input type="number" required value={form.stockQty}
//                                         onChange={e => setForm({...form, stockQty: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div className="col-span-2">
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                                     <textarea value={form.description} rows={3}
//                                         onChange={e => setForm({...form, description: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none" />
//                                 </div>
//                             </div>
 
//                             <div className="flex gap-3 pt-2">
//                                 <button type="button" onClick={() => setShowModal(false)}
//                                     className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition">
//                                     Cancel
//                                 </button>
//                                 <button type="submit" disabled={saving}
//                                     className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50">
//                                     {saving ? 'Saving...' : (editing ? 'Update' : 'Add Product')}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
 
//             {/* ── Delete Confirm Modal ── */}
//             {deleteID && (
//                 <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
//                         <Trash2 size={40} className="text-red-500 mx-auto mb-4" />
//                         <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
//                         <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
//                         <div className="flex gap-3">
//                             <button onClick={() => setDeleteID(null)}
//                                 className="flex-1 border border-gray-200 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition">
//                                 Cancel
//                             </button>
//                             <button onClick={handleDelete}
//                                 className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl transition">
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
 
//             {/* ── Search + Add Button ── */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                 <div className="relative w-full sm:w-96">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                         type="text"
//                         placeholder="Search products by name or category..."
//                         value={search}
//                         onChange={e => setSearch(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
//                     />
//                 </div>
//                 <button onClick={openAdd}
//                     className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm w-full sm:w-auto justify-center">
//                     <Plus size={18} /> Add New Product
//                 </button>
//             </div>
 
//             {/* ── Table ── */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse min-w-[800px]">
//                         <thead>
//                             <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
//                                 <th className="py-4 px-6 font-semibold">Product</th>
//                                 <th className="py-4 px-6 font-semibold">Category</th>
//                                 <th className="py-4 px-6 font-semibold">Price</th>
//                                 <th className="py-4 px-6 font-semibold">Stock</th>
//                                 <th className="py-4 px-6 font-semibold">Status</th>
//                                 <th className="py-4 px-6 font-semibold text-right">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 text-sm">
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="6" className="py-12 text-center">
//                                         <div className="flex flex-col items-center gap-2 text-gray-400">
//                                             <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
//                                             <p>Loading products...</p>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ) : paginated.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="6" className="py-12 text-center text-gray-400">
//                                         No products found.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 paginated.map(product => {
//                                     const mainImg = product.images?.find(i => i.isMain) || product.images?.[0];
//                                     return (
//                                         <tr key={product.productID} className="hover:bg-gray-50/50 transition">
//                                             <td className="py-4 px-6">
//                                                 <div className="flex items-center gap-4">
//                                                     <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
//                                                         {mainImg
//                                                             ? <img src={`${import.meta.env.VITE_API_URL?.replace('/api','')}/${mainImg.imagePath}`}
//                                                                 alt={product.productName}
//                                                                 className="w-full h-full object-cover" />
//                                                             : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">🪑</div>
//                                                         }
//                                                     </div>
//                                                     <div>
//                                                         <p className="font-semibold text-gray-900">{product.productName}</p>
//                                                         <p className="text-xs text-gray-500">{product.material}</p>
//                                                     </div>
//                                                 </div>
//                                             </td>
//                                             <td className="py-4 px-6">
//                                                 <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
//                                                     {product.categoryName}
//                                                 </span>
//                                             </td>
//                                             <td className="py-4 px-6 font-semibold text-gray-900">
//                                                 Rs. {product.basePrice?.toLocaleString()}
//                                             </td>
//                                             <td className="py-4 px-6 text-gray-600">
//                                                 {product.stockQty}
//                                             </td>
//                                             <td className="py-4 px-6">
//                                                 <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.stockStatus)}`}>
//                                                     {product.stockStatus}
//                                                 </span>
//                                             </td>
//                                             <td className="py-4 px-6">
//                                                 <div className="flex justify-end gap-2">
//                                                     <button onClick={() => openEdit(product)}
//                                                         className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition">
//                                                         <Edit size={16} />
//                                                     </button>
//                                                     <button onClick={() => setDeleteID(product.productID)}
//                                                         className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition">
//                                                         <Trash2 size={16} />
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
 
//                 {/* Pagination */}
//                 {!loading && filtered.length > 0 && (
//                     <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
//                         <span>
//                             Showing {((page-1)*ITEMS_PER_PAGE)+1} to {Math.min(page*ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries
//                         </span>
//                         <div className="flex gap-2">
//                             <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
//                                 className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 text-xs">
//                                 Previous
//                             </button>
//                             {Array.from({length: totalPages}, (_,i) => i+1).map(p => (
//                                 <button key={p} onClick={() => setPage(p)}
//                                     className={`px-3 py-1 border rounded-lg text-xs transition
//                                         ${page===p ? 'bg-amber-700 text-white border-amber-700' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
//                                     {p}
//                                 </button>
//                             ))}
//                             <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
//                                 className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 text-xs">
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </AdminLayout>
//     );
// };
 
// export default ManageProducts;
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../../api/productApi';
import { Plus, Search, Edit, Trash2, X, Check } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const emptyForm = {
    categoryID:   '',
    productName:  '',
    sku:          '',
    description:  '',
    material:     '',
    dimensions:   '',
    basePrice:    '',
    stockQty:     '',
    reorderLevel: 5,
};

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    
    // 1️⃣ NEW: State to hold Categories for the Dropdown
    const [categories, setCategories] = useState([]); 
    
    const [loading,  setLoading]  = useState(true);
    const [search,   setSearch]   = useState('');
    const [page,     setPage]     = useState(1);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editing,   setEditing]   = useState(null); // null = add, object = edit
    const [form,      setForm]      = useState(emptyForm);
    const [saving,    setSaving]    = useState(false);
    const [error,     setError]     = useState('');

    // Confirm delete
    const [deleteID, setDeleteID] = useState(null);

    const fetchProducts = () => {
        setLoading(true);
        getAllProducts()
            .then(res => {
                setProducts(res.data);
                setFiltered(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    // 2️⃣ NEW: Function to fetch categories from your ASP.NET API
    const fetchCategories = async () => {
        try {
            // Update this URL if your category endpoint is different
            const response = await fetch(`${import.meta.env.VITE_API_URL}/Category`);
            const data = await response.json();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories", err);
        }
    };

    useEffect(() => { 
        fetchProducts(); 
        fetchCategories(); // Call it when component loads
    }, []);

    // ── Search filter ──────────────────────────────────────
    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(products.filter(p =>
            p.productName.toLowerCase().includes(q) ||
            p.categoryName?.toLowerCase().includes(q) ||
            p.material?.toLowerCase().includes(q)
        ));
        setPage(1);
    }, [search, products]);

    // ── Pagination ─────────────────────────────────────────
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated  = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);

    // ── Open Add Modal ─────────────────────────────────────
    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setError('');
        setShowModal(true);
    };

    // ── Open Edit Modal ────────────────────────────────────
    const openEdit = (p) => {
        setEditing(p);
        // 3️⃣ FIXED: Ensure categoryID is stored as a string so the select dropdown can match option values
        setForm({
            categoryID:   p.categoryID != null ? p.categoryID.toString() : '',
            productName:  p.productName || '',
            sku:          p.sku || '',
            description:  p.description || '',
            material:     p.material    || '',
            dimensions:   p.dimensions  || '',
            basePrice:    p.basePrice || '',
            stockQty:     p.stockQty || '',
            reorderLevel: p.reorderLevel || 5,
        });
        setError('');
        setShowModal(true);
    };

    // ── Save (Add or Edit) ─────────────────────────────────
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            // 4️⃣ FIXED: Added || 0 to prevent NaN, which completely prevents the 400 Bad Request API Error
            const payload = {
                categoryID:   parseInt(form.categoryID?.toString() || '0', 10) || 0,
                productName:  form.productName || '',
                sku:          form.sku || '',
                description:  form.description || '',
                material:     form.material || '',
                dimensions:   form.dimensions || '',
                basePrice:    parseFloat(form.basePrice) || 0,
                stockQty:     parseInt(form.stockQty, 10) || 0,
                reorderLevel: parseInt(form.reorderLevel, 10) || 5,
            };

            if (editing) {
                await updateProduct(editing.productID, payload);
            } else {
                await createProduct(payload);
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            console.error("API Payload Error:", err.response?.data);
            setError(err.response?.data?.title || err.response?.data?.message || 'Failed to save product.');
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────
    const handleDelete = async () => {
        try {
            await deleteProduct(deleteID);
            setDeleteID(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        if (status === 'In Stock')     return 'bg-green-100 text-green-800';
        if (status === 'Out of Stock') return 'bg-red-100 text-red-800';
        return 'bg-amber-100 text-amber-800';
    };

    return (
        <AdminLayout title="Finished Goods (Products)">

            {/* ── Add/Edit Modal ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {editing ? 'Edit Product' : 'Add New Product'}
                        </h2>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                    <input type="text" required value={form.productName}
                                        onChange={e => setForm({...form, productName: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                
                                {/* 5️⃣ FIXED: Replaced Input with Select Dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select 
                                        required 
                                        value={form.categoryID} 
                                        onChange={e => setForm({...form, categoryID: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                                    >
                                        <option value="" disabled>Select Category...</option>
                                        {categories.map((cat) => (
                                            <option key={cat.categoryID} value={cat.categoryID}>
                                                {cat.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                                    <input type="text" required value={form.sku}
                                        onChange={e => setForm({...form, sku: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                    <input type="text" value={form.material}
                                        onChange={e => setForm({...form, material: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                                    <input type="text" value={form.dimensions}
                                        onChange={e => setForm({...form, dimensions: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (Rs.)</label>
                                    <input type="number" required value={form.basePrice}
                                        onChange={e => setForm({...form, basePrice: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Qty</label>
                                    <input type="number" required value={form.stockQty}
                                        onChange={e => setForm({...form, stockQty: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea value={form.description} rows={3}
                                        onChange={e => setForm({...form, description: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 resize-none" />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50">
                                    {saving ? 'Saving...' : (editing ? 'Update' : 'Add Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ── */}
            {deleteID && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
                        <Trash2 size={40} className="text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
                        <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteID(null)}
                                className="flex-1 border border-gray-200 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl transition">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Search + Add Button ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search products by name or category..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                    />
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm w-full sm:w-auto justify-center">
                    <Plus size={18} /> Add New Product
                </button>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Product</th>
                                <th className="py-4 px-6 font-semibold">Category</th>
                                <th className="py-4 px-6 font-semibold">Price</th>
                                <th className="py-4 px-6 font-semibold">Stock</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                                            <p>Loading products...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-gray-400">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(product => {
                                    const mainImg = product.images?.find(i => i.isMain) || product.images?.[0];
                                    return (
                                        <tr key={product.productID} className="hover:bg-gray-50/50 transition">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                                        {mainImg
                                                            ? <img src={`${import.meta.env.VITE_API_URL?.replace('/api','')}/${mainImg.imagePath}`}
                                                                alt={product.productName}
                                                                className="w-full h-full object-cover" />
                                                            : <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">🪑</div>
                                                        }
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{product.productName}</p>
                                                        <p className="text-xs text-gray-500">{product.material}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                                    {product.categoryName}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 font-semibold text-gray-900">
                                                Rs. {product.basePrice?.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6 text-gray-600">
                                                {product.stockQty}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.stockStatus)}`}>
                                                    {product.stockStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openEdit(product)}
                                                        className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button onClick={() => setDeleteID(product.productID)}
                                                        className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!loading && filtered.length > 0 && (
                    <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50/50">
                        <span>
                            Showing {((page-1)*ITEMS_PER_PAGE)+1} to {Math.min(page*ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                                className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 text-xs">
                                Previous
                            </button>
                            {Array.from({length: totalPages}, (_,i) => i+1).map(p => (
                                <button key={p} onClick={() => setPage(p)}
                                    className={`px-3 py-1 border rounded-lg text-xs transition
                                        ${page===p ? 'bg-amber-700 text-white border-amber-700' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                                    {p}
                                </button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                                className="px-3 py-1 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 text-xs">
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageProducts;