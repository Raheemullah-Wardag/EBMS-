
// ============================================================
//  FILE 4: src/pages/admin/Payroll.jsx  (Shifts page too)
// ============================================================
import AdminLayout from '../../components/AdminLayout';
import { useState, useEffect } from 'react';
import { getAllEmployees } from '../../api/employeeApi';

const Payroll = () => {
    const [employees, setEmployees] = useState([]);
    const [loading,   setLoading]   = useState(true);

    useEffect(() => {
        getAllEmployees()
            .then(res => setEmployees(res.data))
            .finally(() => setLoading(false));
    }, []);

    const totalSalary = employees.reduce((sum, e) => sum + (e.salary || 0), 0);

    return (
        <AdminLayout title="Payroll">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Total Payroll</p>
                    <p className="text-2xl font-bold text-green-700">Rs. {totalSalary.toLocaleString()}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Total Employees</p>
                    <p className="text-2xl font-bold text-blue-700">{employees.length}</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Active Employees</p>
                    <p className="text-2xl font-bold text-amber-700">{employees.filter(e => e.isActive).length}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-4 px-6 font-semibold">Employee</th>
                                <th className="py-4 px-6 font-semibold">Department</th>
                                <th className="py-4 px-6 font-semibold">Job Title</th>
                                <th className="py-4 px-6 font-semibold">Salary</th>
                                <th className="py-4 px-6 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {loading ? (
                                <tr><td colSpan="5" className="py-12 text-center">
                                    <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
                                </td></tr>
                            ) : employees.map(emp => (
                                <tr key={emp.employeeID} className="hover:bg-gray-50/50 transition">
                                    <td className="py-4 px-6 font-semibold text-gray-900">{emp.fullName}</td>
                                    <td className="py-4 px-6 text-gray-600">{emp.department || '—'}</td>
                                    <td className="py-4 px-6 text-gray-600">{emp.jobTitle || '—'}</td>
                                    <td className="py-4 px-6 font-bold text-gray-900">Rs. {emp.salary?.toLocaleString()}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {emp.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Payroll;