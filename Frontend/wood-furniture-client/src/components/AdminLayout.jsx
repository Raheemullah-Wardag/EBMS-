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
