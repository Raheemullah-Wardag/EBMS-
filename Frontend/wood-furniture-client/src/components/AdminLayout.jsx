import { useState } from 'react';
import Sidebar from './Sidebar';
import { Bell, Search } from 'lucide-react';

const AdminLayout = ({ children, title }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar */}
            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden h-screen">

                {/* Top Bar */}
                <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    
                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 w-64 bg-gray-50"
                            />
                        </div>
                        
                        <button className="relative text-gray-500 hover:text-gray-800 transition">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    {children}
                </main>

            </div>
        </div>
    );
};

export default AdminLayout;
