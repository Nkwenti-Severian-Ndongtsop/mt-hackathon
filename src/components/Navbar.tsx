import React from 'react';
import { Menu, LogOut } from 'lucide-react';

interface NavbarProps {
  user: { name: string } | null;
  onLogout: () => void;
}

export function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Menu className="h-6 w-6" />
          <span className="text-xl font-bold">Mountains Tech</span>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.name}</span>
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 hover:text-indigo-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}