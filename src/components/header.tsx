import React from 'react';
import { Bell, CircleUser, Menu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center gap-4 border-b bg-muted/40 px-4 h-[60px] lg:px-6">
      {/* Mobile Menu Button */}
      <button className="md:hidden flex items-center justify-center border rounded-full p-2">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </button>

      {/* Search Input */}
      <div className="flex-grow relative">
      
      </div>

      {/* User Menu */}
      <div className="flex items-center gap-4">
        <button className="h-8 w-8 flex items-center justify-center border rounded-full">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </button>
        <button className="h-8 w-8 flex items-center justify-center border rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
