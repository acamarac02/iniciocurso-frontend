import React, { useState } from 'react';
import Layout from './components/Layout';
import SelectModule from './components/SelectModule';
import ModuleSummary from './components/ModuleSummary';
import SelectionOrder from './components/SelectionOrder';
import Preferences from './components/Preferences';
import ControlPanel from './components/ControlPanel';

function App() {
  const [currentPage, setCurrentPage] = useState('select-module');
  const [userRole] = useState<'teacher' | 'admin'>('admin'); // Set to 'admin' to show Control Panel

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
    <Layout currentPage={currentPage} onPageChange={setCurrentPage} userRole={userRole}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;