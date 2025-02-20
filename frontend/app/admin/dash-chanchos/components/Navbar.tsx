'use client';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar = ({ activeTab, setActiveTab }: NavbarProps) => {
  return (
    <nav className="fixed w-full bg-white border-b z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex space-x-8 h-16 items-center px-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`h-full px-3 inline-flex items-center border-b-2 text-sm font-medium ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('lotes')}
            className={`h-full px-3 inline-flex items-center border-b-2 text-sm font-medium ${
              activeTab === 'lotes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lotes
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
