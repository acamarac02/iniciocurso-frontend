import React, { useState } from 'react';
import Layout from './components/Layout';
import SelectModule from './components/SelectModule';
import ModuleSummary from './components/ModuleSummary';
import SelectionOrder from './components/SelectionOrder';
import Preferences from './components/Preferences';

function App() {
  const [currentPage, setCurrentPage] = useState('select-module');

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
      default:
        return <SelectModule />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;