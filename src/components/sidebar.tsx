import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LineChart, ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation(); // Get current route location

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to check if a menu item is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`border-r bg-muted/40 h-full transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-64'} hidden md:block relative`}>
      <div className="flex h-full flex-col gap-2">
        {/* Sidebar Header */}
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src='/src/assets/images/FULL_LOGO_RAIL_MADAD.png' className={`w-6 h-6 ${isCollapsed && 'mx-auto'}`} alt="Logo" />
            {!isCollapsed && <span>RailEase</span>}
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link to="/dashboard" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isCollapsed ? 'justify-center' : ''} ${isActive('/dashboard') ? 'bg-[#1971c2] text-white' : ''}`}>
              <Home className="h-4 w-4" />
              {!isCollapsed && 'Dashboard'}
            </Link>
    
            <Link to="/analytics" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${isCollapsed ? 'justify-center' : ''} ${isActive('/analytics') ? 'bg-[#1971c2] text-white' : ''}`}>
              <LineChart className="h-4 w-4" />
              {!isCollapsed && 'Analytics'}
            </Link>
          </nav>
        </div>

        {/* Collapse/Expand Button */}
        <button
          className="absolute bottom-4 right-4 text-muted-foreground hover:text-primary transition-all"
          onClick={toggleSidebar}
        >
          {isCollapsed ? <ArrowRightFromLine className="h-5 w-5" /> : <ArrowLeftFromLine className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
