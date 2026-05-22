import Navbar from './Navbar';

const CustomerLayout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
            <Navbar />
            <main className="flex-1 w-full pb-10">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 text-gray-500 text-center py-6 text-sm">
                © 2025 WoodCraft — Premium Handmade Furniture
            </footer>
        </div>
    );
};

export default CustomerLayout;