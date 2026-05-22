// import { useState, useEffect } from 'react';
// import AdminLayout from '../../components/AdminLayout';
// import { getAllEmployees, createEmployee, updateEmployee } from '../../api/employeeApi';
// import { Plus, Search, Edit, X, User } from 'lucide-react';
 
// const ITEMS_PER_PAGE = 10;
 
// const emptyForm = {
//     firstName:  '',
//     lastName:   '',
//     nationalID: '',
//     phone:      '',
//     jobTitle:   '',
//     department: '',
//     hireDate:   '',
//     salary:     '',
// };
 
// const ManageEmployees = () => {
//     const [employees, setEmployees] = useState([]);
//     const [filtered,  setFiltered]  = useState([]);
//     const [loading,   setLoading]   = useState(true);
//     const [search,    setSearch]    = useState('');
//     const [page,      setPage]      = useState(1);
 
//     const [showModal, setShowModal] = useState(false);
//     const [editing,   setEditing]   = useState(null);
//     const [form,      setForm]      = useState(emptyForm);
//     const [saving,    setSaving]    = useState(false);
//     const [error,     setError]     = useState('');
 
//     const fetchEmployees = () => {
//         setLoading(true);
//         getAllEmployees()
//             .then(res => {
//                 setEmployees(res.data);
//                 setFiltered(res.data);
//             })
//             .catch(err => console.error(err))
//             .finally(() => setLoading(false));
//     };
 
//     useEffect(() => { fetchEmployees(); }, []);
 
//     useEffect(() => {
//         const q = search.toLowerCase();
//         setFiltered(employees.filter(e =>
//             e.fullName?.toLowerCase().includes(q) ||
//             e.jobTitle?.toLowerCase().includes(q) ||
//             e.department?.toLowerCase().includes(q)
//         ));
//         setPage(1);
//     }, [search, employees]);
 
//     const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//     const paginated  = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);
 
//     const openAdd = () => {
//         setEditing(null);
//         setForm(emptyForm);
//         setError('');
//         setShowModal(true);
//     };
 
//     const openEdit = (e) => {
//         setEditing(e);
//         setForm({
//             firstName:  e.firstName  || '',
//             lastName:   e.lastName   || '',
//             nationalID: e.nationalID || '',
//             phone:      e.phone      || '',
//             jobTitle:   e.jobTitle   || '',
//             department: e.department || '',
//             hireDate:   e.hireDate?.split('T')[0] || '',
//             salary:     e.salary     || '',
//         });
//         setError('');
//         setShowModal(true);
//     };
 
//     const handleSave = async (ev) => {
//         ev.preventDefault();
//         setSaving(true);
//         setError('');
//         try {
//             const payload = { ...form, salary: parseFloat(form.salary) };
//             if (editing) await updateEmployee(editing.employeeID, payload);
//             else         await createEmployee(payload);
//             setShowModal(false);
//             fetchEmployees();
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to save employee.');
//         } finally {
//             setSaving(false);
//         }
//     };
 
//     return (
//         <AdminLayout title="Employees">
 
//             {/* Modal */}
//             {showModal && (
//                 <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
//                     <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
//                         <button onClick={() => setShowModal(false)}
//                             className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
//                             <X size={20} />
//                         </button>
//                         <h2 className="text-xl font-bold text-gray-900 mb-6">
//                             {editing ? 'Edit Employee' : 'Add New Employee'}
//                         </h2>
 
//                         {error && (
//                             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
//                                 {error}
//                             </div>
//                         )}
 
//                         <form onSubmit={handleSave} className="space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                                     <input type="text" required value={form.firstName}
//                                         onChange={e => setForm({...form, firstName: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                                     <input type="text" required value={form.lastName}
//                                         onChange={e => setForm({...form, lastName: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
//                                     <input type="text" value={form.jobTitle}
//                                         onChange={e => setForm({...form, jobTitle: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
//                                     <select value={form.department}
//                                         onChange={e => setForm({...form, department: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600">
//                                         <option value="">Select department</option>
//                                         {['Production','Management','Sales','Finance','HR','Logistics'].map(d => (
//                                             <option key={d}>{d}</option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                                     <input type="text" value={form.phone}
//                                         onChange={e => setForm({...form, phone: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
//                                     <input type="text" value={form.nationalID}
//                                         onChange={e => setForm({...form, nationalID: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
//                                     <input type="date" required value={form.hireDate}
//                                         onChange={e => setForm({...form, hireDate: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Rs.)</label>
//                                     <input type="number" required value={form.salary}
//                                         onChange={e => setForm({...form, salary: e.target.value})}
//                                         className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
//                                 </div>
//                             </div>
 
//                             <div className="flex gap-3 pt-2">
//                                 <button type="button" onClick={() => setShowModal(false)}
//                                     className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition">
//                                     Cancel
//                                 </button>
//                                 <button type="submit" disabled={saving}
//                                     className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50">
//                                     {saving ? 'Saving...' : (editing ? 'Update' : 'Add Employee')}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
 
//             {/* Search + Add */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                 <div className="relative w-full sm:w-96">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                     <input
//                         type="text"
//                         placeholder="Search by name, title or department..."
//                         value={search}
//                         onChange={e => setSearch(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
//                     />
//                 </div>
//                 <button onClick={openAdd}
//                     className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm w-full sm:w-auto justify-center">
//                     <Plus size={18} /> Add Employee
//                 </button>
//             </div>
 
//             {/* Table */}
//             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse min-w-[700px]">
//                         <thead>
//                             <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
//                                 <th className="py-4 px-6 font-semibold">Employee</th>
//                                 <th className="py-4 px-6 font-semibold">Department</th>
//                                 <th className="py-4 px-6 font-semibold">Job Title</th>
//                                 <th className="py-4 px-6 font-semibold">Phone</th>
//                                 <th className="py-4 px-6 font-semibold">Hire Date</th>
//                                 <th className="py-4 px-6 font-semibold">Salary</th>
//                                 <th className="py-4 px-6 font-semibold">Status</th>
//                                 <th className="py-4 px-6 font-semibold text-right">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100 text-sm">
//                             {loading ? (
//                                 <tr>
//                                     <td colSpan="8" className="py-12 text-center">
//                                         <div className="flex flex-col items-center gap-2 text-gray-400">
//                                             <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
//                                             <p>Loading employees...</p>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ) : paginated.length === 0 ? (
//                                 <tr>
//                                     <td colSpan="8" className="py-12 text-center text-gray-400">
//                                         No employees found.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 paginated.map(emp => (
//                                     <tr key={emp.employeeID} className="hover:bg-gray-50/50 transition">
//                                         <td className="py-4 px-6">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
//                                                     <User size={16} className="text-amber-700" />
//                                                 </div>
//                                                 <div>
//                                                     <p className="font-semibold text-gray-900">{emp.fullName}</p>
//                                                     <p className="text-xs text-gray-400">ID: {emp.employeeID}</p>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="py-4 px-6">
//                                             <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
//                                                 {emp.department || '—'}
//                                             </span>
//                                         </td>
//                                         <td className="py-4 px-6 text-gray-600">{emp.jobTitle || '—'}</td>
//                                         <td className="py-4 px-6 text-gray-600">{emp.phone || '—'}</td>
//                                         <td className="py-4 px-6 text-gray-500">
//                                             {emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('en-PK', {
//                                                 year: 'numeric', month: 'short', day: 'numeric'
//                                             }) : '—'}
//                                         </td>
//                                         <td className="py-4 px-6 font-semibold text-gray-900">
//                                             Rs. {emp.salary?.toLocaleString()}
//                                         </td>
//                                         <td className="py-4 px-6">
//                                             <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
//                                                 ${emp.isActive
//                                                     ? 'bg-green-100 text-green-700'
//                                                     : 'bg-red-100 text-red-700'}`}>
//                                                 {emp.isActive ? 'Active' : 'Inactive'}
//                                             </span>
//                                         </td>
//                                         <td className="py-4 px-6">
//                                             <div className="flex justify-end">
//                                                 <button onClick={() => openEdit(emp)}
//                                                     className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition">
//                                                     <Edit size={16} />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))
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
 
// export default ManageEmployees;
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getAllEmployees, createEmployee, updateEmployee } from '../../api/employeeApi';
import { Plus, Search, Edit, X, User } from 'lucide-react';
 
const ITEMS_PER_PAGE = 10;
 
// 1. ADDED NEW FIELDS TO EMPTY FORM
const emptyForm = {
    firstName:  '',
    lastName:   '',
    nationalID: '',
    phone:      '',
    jobTitle:   '',
    department: '',
    hireDate:   '',
    salary:     '',
    username:   '',
    email:      '',
    password:   '',
   
};
 
const ManageEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [filtered,  setFiltered]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [search,    setSearch]    = useState('');
    const [page,      setPage]      = useState(1);
 
    const [showModal, setShowModal] = useState(false);
    const [editing,   setEditing]   = useState(null);
    const [form,      setForm]      = useState(emptyForm);
    const [saving,    setSaving]    = useState(false);
    const [error,     setError]     = useState('');
 
    const fetchEmployees = () => {
        setLoading(true);
        getAllEmployees()
            .then(res => {
                setEmployees(res.data);
                setFiltered(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };
 
    useEffect(() => { fetchEmployees(); }, []);
 
    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(employees.filter(e =>
            e.fullName?.toLowerCase().includes(q) ||
            e.jobTitle?.toLowerCase().includes(q) ||
            e.department?.toLowerCase().includes(q)
        ));
        setPage(1);
    }, [search, employees]);
 
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated  = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);
 
    const openAdd = () => {
        setEditing(null);
        setForm(emptyForm);
        setError('');
        setShowModal(true);
    };
 
    const openEdit = (e) => {
        setEditing(e);
        // 2. MAPPED NEW FIELDS FOR EDITING (Password left blank intentionally)
        setForm({
            firstName:  e.firstName  || '',
            lastName:   e.lastName   || '',
            nationalID: e.nationalID || '',
            phone:      e.phone      || '',
            jobTitle:   e.jobTitle   || '',
            department: e.department || '',
            hireDate:   e.hireDate?.split('T')[0] || '',
            salary:     e.salary     || '',
            username:   e.username   || '', 
            email:      e.email      || '',
            password:   '', 
         
        });
        setError('');
        setShowModal(true);
    };
 
    const handleSave = async (ev) => {
        ev.preventDefault();
        setSaving(true);
        setError('');
        try {
            const payload = { ...form, salary: parseFloat(form.salary) };
            if (editing) await updateEmployee(editing.employeeID, payload);
            else         await createEmployee(payload);
            setShowModal(false);
            fetchEmployees();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save employee.');
        } finally {
            setSaving(false);
        }
    };
 
    return (
        <AdminLayout title="Employees">
 
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            {editing ? 'Edit Employee' : 'Add New Employee'}
                        </h2>
 
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                                {error}
                            </div>
                        )}
 
                        <form onSubmit={handleSave} className="space-y-4">
                            
                            {/* Personal Details Section */}
                            <h3 className="text-md font-semibold text-gray-800 border-b pb-2">Personal & Job Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input type="text" required value={form.firstName}
                                        onChange={e => setForm({...form, firstName: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input type="text" required value={form.lastName}
                                        onChange={e => setForm({...form, lastName: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                    <input type="text" value={form.jobTitle}
                                        onChange={e => setForm({...form, jobTitle: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <select value={form.department}
                                        onChange={e => setForm({...form, department: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600">
                                        <option value="">Select department</option>
                                        {['Production','Management','Sales','Finance','HR','Logistics'].map(d => (
                                            <option key={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input type="text" value={form.phone}
                                        onChange={e => setForm({...form, phone: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                                    <input type="text" value={form.nationalID}
                                        onChange={e => setForm({...form, nationalID: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                                    <input type="date" required value={form.hireDate}
                                        onChange={e => setForm({...form, hireDate: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Rs.)</label>
                                    <input type="number" required value={form.salary}
                                        onChange={e => setForm({...form, salary: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                            </div>

                            {/* 3. NEW ACCOUNT DETAILS SECTION */}
                            <h3 className="text-md font-semibold text-gray-800 border-b pb-2 mt-6">Account Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input type="text" required={!editing} value={form.username}
                                        onChange={e => setForm({...form, username: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" required={!editing} value={form.email}
                                        onChange={e => setForm({...form, email: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password {editing && <span className="text-xs text-gray-400 font-normal ml-2">(Leave blank to keep current password)</span>}
                                    </label>
                                    <input type="password" required={!editing} value={form.password}
                                        onChange={e => setForm({...form, password: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                            </div>
 
                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50">
                                    {saving ? 'Saving...' : (editing ? 'Update Employee' : 'Add Employee')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
 
            {/* Search + Add */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, title or department..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                    />
                </div>
                <button onClick={openAdd}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm w-full sm:w-auto justify-center">
                    <Plus size={18} /> Add Employee
                </button>
            </div>
 
            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Employee</th>
                                <th className="py-4 px-6 font-semibold">Department</th>
                                <th className="py-4 px-6 font-semibold">Job Title</th>
                                <th className="py-4 px-6 font-semibold">Phone</th>
                                <th className="py-4 px-6 font-semibold">Hire Date</th>
                                <th className="py-4 px-6 font-semibold">Salary</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                                            <p>Loading employees...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-gray-400">
                                        No employees found.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(emp => (
                                    <tr key={emp.employeeID} className="hover:bg-gray-50/50 transition">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                                    <User size={16} className="text-amber-700" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{emp.fullName}</p>
                                                    <p className="text-xs text-gray-400">ID: {emp.employeeID}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                {emp.department || '—'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{emp.jobTitle || '—'}</td>
                                        <td className="py-4 px-6 text-gray-600">{emp.phone || '—'}</td>
                                        <td className="py-4 px-6 text-gray-500">
                                            {emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('en-PK', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            }) : '—'}
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-gray-900">
                                            Rs. {emp.salary?.toLocaleString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                                ${emp.isActive
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'}`}>
                                                {emp.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex justify-end">
                                                <button onClick={() => openEdit(emp)}
                                                    className="text-blue-500 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition">
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
 
export default ManageEmployees;