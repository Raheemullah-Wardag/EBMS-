import AdminLayout from '../../components/AdminLayout';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    return (
        <AdminLayout title="Settings">
            <div className="max-w-2xl space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Account Info</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Username</span>
                            <span className="font-medium">{user?.username}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Email</span>
                            <span className="font-medium">{user?.email}</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-gray-500">Role</span>
                            <span className="font-medium">{user?.role}</span>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">System Info</h2>
                    <p className="text-sm text-gray-500">WoodCraft Management System v1.0</p>
                    <p className="text-sm text-gray-500 mt-1">Built with React + ASP.NET Core + SQL Server</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Settings;