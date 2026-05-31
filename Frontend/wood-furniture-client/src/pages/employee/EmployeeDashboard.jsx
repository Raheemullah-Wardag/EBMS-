import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getEmployeeByUserID } from '../../api/employeeApi';
import { getAttendanceByEmployee } from '../../api/attendanceApi';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [employee, setEmployee] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) return;

        setLoading(true);
        setError('');

        getEmployeeByUserID(user.userID)
            .then(res => {
                setEmployee(res.data);
                return getAttendanceByEmployee(res.data.employeeID);
            })
            .then(res => setAttendance(res.data))
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Unable to load your employee data.');
            })
            .finally(() => setLoading(false));
    }, [user]);

    const presentCount = attendance.filter(r => r.status === 'Present').length;
    const absentCount = attendance.filter(r => r.status === 'Absent').length;
    const leaveCount = attendance.filter(r => r.status === 'Leave').length;
    const halfDayCount = attendance.filter(r => r.status === 'HalfDay').length;
    const recentRecords = [...attendance]
        .sort((a, b) => new Date(b.workDate) - new Date(a.workDate))
        .slice(0, 5);

    const monthlyRecords = attendance.filter(r => {
        const date = new Date(r.workDate);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });

    const monthlyPresent = monthlyRecords.filter(r => r.status === 'Present').length;
    const monthlyAbsent = monthlyRecords.filter(r => r.status === 'Absent').length;
    const monthlyLeave = monthlyRecords.filter(r => r.status === 'Leave').length;

    return (
        <AdminLayout title="My Dashboard">
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    <div className="h-10 w-3/5 bg-gray-100 rounded-xl"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, idx) => (
                            <div key={idx} className="h-32 bg-gray-100 rounded-3xl"></div>
                        ))}
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
                    {error}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6 mb-8">
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Profile</h2>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div>
                                    <p className="text-gray-500">Name</p>
                                    <p className="font-semibold text-gray-900">{employee.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Role</p>
                                    <p className="font-semibold text-gray-900">Employee</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Job title</p>
                                    <p className="font-semibold text-gray-900">{employee.jobTitle || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Department</p>
                                    <p className="font-semibold text-gray-900">{employee.department || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Phone</p>
                                    <p className="font-semibold text-gray-900">{employee.phone || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <p className="font-semibold text-gray-900">{user.email || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Salary</p>
                                    <p className="font-semibold text-gray-900">Rs. {employee.salary?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Hire Date</p>
                                    <p className="font-semibold text-gray-900">{new Date(employee.hireDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-3xl bg-green-50 p-5">
                                        <p className="text-sm text-green-700">Present</p>
                                        <p className="text-3xl font-bold text-green-900">{presentCount}</p>
                                    </div>
                                    <div className="rounded-3xl bg-red-50 p-5">
                                        <p className="text-sm text-red-700">Absent</p>
                                        <p className="text-3xl font-bold text-red-900">{absentCount}</p>
                                    </div>
                                    <div className="rounded-3xl bg-yellow-50 p-5">
                                        <p className="text-sm text-amber-700">Leave</p>
                                        <p className="text-3xl font-bold text-amber-900">{leaveCount}</p>
                                    </div>
                                    <div className="rounded-3xl bg-slate-50 p-5">
                                        <p className="text-sm text-slate-700">Half Day</p>
                                        <p className="text-3xl font-bold text-slate-900">{halfDayCount}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">This Month</h2>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center justify-between">
                                        <span>Present</span>
                                        <span className="font-semibold text-gray-900">{monthlyPresent}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Absent</span>
                                        <span className="font-semibold text-gray-900">{monthlyAbsent}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Leave</span>
                                        <span className="font-semibold text-gray-900">{monthlyLeave}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Recent Attendance</h2>
                                <p className="text-sm text-gray-500">Your last 5 attendance records</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[640px]">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="py-4 px-6 font-semibold">Date</th>
                                        <th className="py-4 px-6 font-semibold">Check In</th>
                                        <th className="py-4 px-6 font-semibold">Check Out</th>
                                        <th className="py-4 px-6 font-semibold">Status</th>
                                        <th className="py-4 px-6 font-semibold">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {recentRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-10 text-center text-gray-400">No attendance records yet.</td>
                                        </tr>
                                    ) : recentRecords.map(record => (
                                        <tr key={record.attendanceID} className="hover:bg-gray-50/50 transition">
                                            <td className="py-4 px-6 text-gray-600">{new Date(record.workDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                                            <td className="py-4 px-6 text-gray-600">{record.checkIn || '—'}</td>
                                            <td className="py-4 px-6 text-gray-600">{record.checkOut || '—'}</td>
                                            <td className="py-4 px-6"><StatusBadge status={record.status} /></td>
                                            <td className="py-4 px-6 text-gray-500">{record.notes || '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
};

export default EmployeeDashboard;
