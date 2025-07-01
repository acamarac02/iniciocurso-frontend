import React from 'react';
import { Settings, User } from 'lucide-react';

export default function Preferences() {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center">
          <Settings className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account settings and teaching preferences
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
        <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
        <p className="text-gray-600">
          User preferences and settings will be available here
        </p>
      </div>
    </div>
  );
}