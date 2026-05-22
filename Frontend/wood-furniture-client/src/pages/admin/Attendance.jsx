import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import { getAllAttendance, markAttendance } from '../../api/attendanceApi';
import { getAllEmployees } from '../../api/employeeApi';
import { Search, Plus, X } from 'lucide-react';
 
const ITEMS_PER_PAGE = 10;
const STATUSES = ['Present', 'Absent', 'Leave', 'HalfDay'];
 
const Attendance = () => {
    const [records,      setRecords]      = useState([]);
    const [employees,    setEmployees]    = useState([]);
    const [filtered,     setFiltered]     = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [search,       setSearch]       = useState('');
    const [dateFilter,   setDateFilter]   = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page,         setPage]         = useState(1);
    const [showModal,    setShowModal]    = useState(false);
    const [saving,       setSaving]       = useState(false);
    const [error,        setError]        = useState('');
 
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
 
    const [form, setForm] = useState({
        employeeID: '',
        workDate:   today,
        checkIn:    '',
        checkOut:   '',
        status:     'Present',
        notes:      '',
    });
 
    const fetchData = () => {
        setLoading(true);
        Promise.all([getAllAttendance(), getAllEmployees()])
            .then(([attRes, empRes]) => {
                setRecords(attRes.data);
                setEmployees(empRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };
 
    useEffect(() => { fetchData(); }, []);
 
    // ── Filters ────────────────────────────────────────────
    useEffect(() => {
        let result = records;
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(r => r.employeeName?.toLowerCase().includes(q));
        }
        if (dateFilter) {
            result = result.filter(r =>
                new Date(r.workDate).toLocaleDateString('en-CA') === dateFilter
            );
        }
        if (statusFilter) {
            result = result.filter(r => r.status === statusFilter);
        }
        setFiltered(result);
        setPage(1);
    }, [search, dateFilter, statusFilter, records]);
 
    // ── Today Summary ──────────────────────────────────────
    const todayRecords  = records.filter(r =>
        new Date(r.workDate).toLocaleDateString('en-CA') === today
    );
    const presentToday  = todayRecords.filter(r => r.status === 'Present').length;
    const absentToday   = todayRecords.filter(r => r.status === 'Absent').length;
    const leaveToday    = todayRecords.filter(r => r.status === 'Leave').length;
 
    // ── Pagination ─────────────────────────────────────────
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated  = filtered.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);
 
    // ── Save ───────────────────────────────────────────────
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await markAttendance({
                employeeID: parseInt(form.employeeID),
                workDate:   form.workDate,
                checkIn:    form.checkIn  || null,
                checkOut:   form.checkOut || null,
                status:     form.status,
                notes:      form.notes    || null,
            });
            setShowModal(false);
            setForm({ employeeID: '', workDate: today, checkIn: '', checkOut: '', status: 'Present', notes: '' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark attendance.');
        } finally {
            setSaving(false);
        }
    };
 
    const summaryCards = [
        { label: 'Present Today',   value: presentToday,    textColor: 'text-green-700',  bg: 'bg-green-50'  },
        { label: 'Absent Today',    value: absentToday,     textColor: 'text-red-700',    bg: 'bg-red-50'    },
        { label: 'On Leave Today',  value: leaveToday,      textColor: 'text-yellow-700', bg: 'bg-yellow-50' },
        { label: 'Total Employees', value: employees.length,textColor: 'text-blue-700',   bg: 'bg-blue-50'   },
    ];
 
    return (
        <AdminLayout title="Attendance">
 
            {/* Mark Attendance Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
                        <button onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
                            <X size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Mark Attendance</h2>
 
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                                {error}
                            </div>
                        )}
 
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                                <select required value={form.employeeID}
                                    onChange={e => setForm({...form, employeeID: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600">
                                    <option value="">Select employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.employeeID} value={emp.employeeID}>
                                            {emp.fullName}
                                        </option>
                                    ))}
                                </select>
                            </div>
 
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Date</label>
                                <input type="date" required value={form.workDate}
                                    onChange={e => setForm({...form, workDate: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                            </div>
 
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select value={form.status}
                                    onChange={e => setForm({...form, status: e.target.value})}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600">
                                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
 
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                                    <input type="time" value={form.checkIn}
                                        onChange={e => setForm({...form, checkIn: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                                    <input type="time" value={form.checkOut}
                                        onChange={e => setForm({...form, checkOut: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                                </div>
                            </div>
 
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <input type="text" value={form.notes}
                                    onChange={e => setForm({...form, notes: e.target.value})}
                                    placeholder="Optional notes..."
                                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600" />
                            </div>
 
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-50">
                                    {saving ? 'Saving...' : 'Mark Attendance'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
 
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {summaryCards.map(card => (
                    <div key={card.label} className={`${card.bg} rounded-2xl border border-gray-100 shadow-sm p-5`}>
                        <p className="text-gray-500 text-sm mb-1">{card.label}</p>
                        <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                    </div>
                ))}
            </div>
 
            {/* Search + Filters + Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Search employee..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white w-full sm:w-56" />
                    </div>
                    <input type="date" value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white">
                        <option value="">All Statuses</option>
                        {STATUSES.map(s => <option key={s}>{s}</option>)}
                    </select>
                </div>
                <button onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-sm w-full md:w-auto justify-center">
                    <Plus size={18} /> Mark Attendance
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
                                <th className="py-4 px-6 font-semibold">Date</th>
                                <th className="py-4 px-6 font-semibold">Check In</th>
                                <th className="py-4 px-6 font-semibold">Check Out</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                                <th className="py-4 px-6 font-semibold">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                                            <p>Loading attendance...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center text-gray-400">
                                        No attendance records found.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map(r => (
                                    <tr key={r.attendanceID} className="hover:bg-gray-50/50 transition">
                                        <td className="py-4 px-6 font-semibold text-gray-900">{r.employeeName}</td>
                                        <td className="py-4 px-6">
                                            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                {r.department || '—'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500">
                                            {new Date(r.workDate).toLocaleDateString('en-PK', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-4 px-6 text-gray-600">{r.checkIn  || '—'}</td>
                                        <td className="py-4 px-6 text-gray-600">{r.checkOut || '—'}</td>
                                        <td className="py-4 px-6"><StatusBadge status={r.status} /></td>
                                        <td className="py-4 px-6 text-gray-500 text-xs">{r.notes || '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
 
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
 
export default Attendance;
