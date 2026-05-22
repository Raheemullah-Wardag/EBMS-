import AdminLayout from '../../components/AdminLayout';

const Shifts = () => (
    <AdminLayout title="Shifts">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-5xl mb-4">🕐</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Shifts Management</h3>
            <p className="text-gray-500">Shift scheduling will be available in the next update.</p>
        </div>
    </AdminLayout>
);

export default Shifts;