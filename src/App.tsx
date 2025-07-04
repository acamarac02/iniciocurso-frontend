import React, { useState } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import SelectModule from './components/SelectModule';
import ModuleSummary from './components/ModuleSummary';
import SelectionOrder from './components/SelectionOrder';
import Preferences from './components/Preferences';
import ControlPanel from './components/ControlPanel';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('select-module');
  const [userRole, setUserRole] = useState<'teacher' | 'admin'>('teacher');

  const handleLogin = (role: 'teacher' | 'admin') => {
    setUserRole(role);
    setIsLoggedIn(true);
    // Set initial page based on role
    setCurrentPage(role === 'admin' ? 'control-panel' : 'select-module');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('select-module');
    setUserRole('teacher');
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'select-module':
        return (
          <SelectModule 
            onNavigateToSelectionOrder={() => setCurrentPage('selection-order')}
          />
        );
      case 'module-summary':
        return <ModuleSummary />;
      case 'selection-order':
        return <SelectionOrder />;
      case 'preferences':
        return <Preferences />;
      case 'control-panel':
        return userRole === 'admin' ? <ControlPanel /> : <SelectModule />;
      default:
        return <SelectModule />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage} 
      userRole={userRole}
      onLogout={handleLogout}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;