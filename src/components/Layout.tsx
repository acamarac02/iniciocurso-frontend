import React from 'react';
import { User, BookOpen, BarChart3, Settings, Users, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  userRole?: 'teacher' | 'admin';
}

export default function Layout({ children, currentPage, onPageChange, userRole = 'admin' }: LayoutProps) {
  const menuItems = [
    { id: 'select-module', label: 'Select Module', icon: BookOpen },
    { id: 'module-summary', label: 'Module Summary', icon: BarChart3 },
    { id: 'selection-order', label: 'Selection Order', icon: Users },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  // Add Control Panel for admin users
  if (userRole === 'admin') {
    menuItems.splice(3, 0, { id: 'control-panel', label: 'Control Panel', icon: Shield });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">Module Assignment</h1>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                {userRole === 'admin' ? 'Department Head' : 'Teacher Dashboard'}
                {userRole === 'admin' && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              const isControlPanel = item.id === 'control-panel';
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                    isActive
                      ? isControlPanel
                        ? 'border-purple-500 text-purple-600'
                        : 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {isControlPanel && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs font-medium text-purple-700 bg-purple-100 rounded">
                      Admin
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}