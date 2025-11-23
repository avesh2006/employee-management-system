import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Banknote, 
  MessageSquareText, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck,
  UserPlus,
  Settings
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, active }: { icon: any, label: string, to: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-6 py-3 transition-colors duration-200 ${
      active 
        ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-center h-16 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
          <ShieldCheck className="mr-2" />
          <h1 className="text-xl font-bold tracking-wide">EMS</h1>
        </div>

        <nav className="mt-6 flex flex-col space-y-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
          
          <SidebarItem icon={CalendarCheck} label="Attendance" to="/attendance" active={location.pathname === '/attendance'} />
          <SidebarItem icon={UserPlus} label="Leave" to="/leave" active={location.pathname === '/leave'} />
          <SidebarItem icon={Banknote} label="Salary" to="/salary" active={location.pathname === '/salary'} />
          
          <div className="pt-4 pb-2">
            <div className="border-t border-gray-200"></div>
          </div>
          
          <SidebarItem icon={MessageSquareText} label="AI Assistant" to="/assistant" active={location.pathname === '/assistant'} />
          <SidebarItem icon={Settings} label="Edit Profile" to="/profile" active={location.pathname === '/profile'} />
          
          {isAdmin && (
             <SidebarItem icon={ShieldCheck} label="Audit Logs" to="/audit-logs" active={location.pathname === '/audit-logs'} />
          )}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
           <div className="flex items-center space-x-3 mb-4 px-2">
              <img src={user?.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-teal-500 object-cover" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                {/* Changed email font color to black as requested */}
                <p className="text-xs text-black font-medium truncate">{user?.email}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
           </div>
           <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
           >
             <LogOut size={16} className="mr-2" />
             Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm z-40">
          <div className="flex items-center text-blue-700 font-bold">
            <ShieldCheck className="mr-2" /> EMS
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};