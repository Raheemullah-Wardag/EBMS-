import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, Users, UserCheck, CalendarDays, 
    BriefcaseBusiness, Boxes, ShoppingCart, 
    FileText, UserCog, PackageSearch, Factory, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';

const navItems = [
    { label: 'Dashboard',    path: '/admin',                 icon: LayoutDashboard, roles: ['Admin','Manager'] },
    { label: 'HR Management',isHeader: true,                 roles: ['Admin','Manager'] },
    { label: 'Employees',    path: '/admin/employees',       icon: Users, roles: ['Admin','Manager'] },
    { label: 'Attendance',   path: '/admin/attendance',      icon: UserCheck, roles: ['Admin','Manager'] },
    { label: 'Payroll',      path: '/admin/payroll',         icon: BriefcaseBusiness, roles: ['Admin','Manager'] },
    { label: 'Finance',      isHeader: true,                 roles: ['Admin','Manager'] },
    { label: 'Reports',      path: '/admin/reports',         icon: FileText, roles: ['Admin'] },
    { label: 'Inventory',    isHeader: true,                 roles: ['Admin','Manager'] },
    { label: 'Raw Materials',path: '/admin/raw-materials',   icon: Boxes, roles: ['Admin','Manager'] },
    { label: 'Finished Goods',path: '/admin/products',       icon: PackageSearch, roles: ['Admin','Manager'] },
    { label: 'Purchase Orders',path: '/admin/purchase-orders', icon: ShoppingCart, roles: ['Admin','Manager'] },
    { label: 'Production Batches', path: '/admin/production', icon: Factory, roles: ['Admin','Manager'] },
    { label: 'Sales',        isHeader: true,                 roles: ['Admin','Manager'] },
    { label: 'Orders',       path: '/admin/orders',          icon: ShoppingCart, roles: ['Admin','Manager'] },
    { label: 'User Management',isHeader: true,               roles: ['Admin'] },
    { label: 'Users',        path: '/admin/users',           icon: UserCog, roles: ['Admin'] },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filtered = navItems.filter(item => item.roles.includes(user?.role));

    return (
        <aside className={`
            bg-[#1c1c1c] text-white flex flex-col
            transition-all duration-300
            ${collapsed ? 'w-20' : 'w-64'}
            min-h-screen z-20 shadow-xl
        `}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-600 text-white flex items-center justify-center rounded-md font-serif italic text-xl shrink-0">W</div>
                    {!collapsed && <span className="font-bold text-lg tracking-wide text-white whitespace-nowrap">WoodCraft</span>}
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
                {filtered.map((item, idx) => {
                    if (item.isHeader) {
                        if (collapsed) return <div key={idx} className="my-4 border-t border-gray-800 mx-4"></div>;
                        return (
                            <div key={idx} className="px-6 py-2 mt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {item.label}
                            </div>
                        );
                    }

                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={collapsed ? item.label : ''}
                            className={`
                                flex items-center gap-4 px-6 py-3 mx-2 rounded-lg mb-1 text-sm transition font-medium
                                ${isActive
                                    ? 'bg-amber-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                            `}
                        >
                            <Icon size={18} className={isActive ? "text-white" : "text-gray-400 group-hover:text-white"} />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Toggle & Logout */}
            <div className="p-4 border-t border-gray-800 space-y-2">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center w-full py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition"
                >
                    {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span className="text-sm font-medium">Collapse</span></div>}
                </button>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/50 mt-2">
                    <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center font-bold shrink-0">
                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.username || 'Admin User'}</p>
                            <p className="text-xs text-gray-400 truncate">{user?.role || 'Admin'}</p>
                        </div>
                    )}
                    {!collapsed && (
                        <button onClick={handleLogout} className="text-gray-400 hover:text-white transition p-1">
                            <LogOut size={18} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
