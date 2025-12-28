import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { KOLDetailModal } from './components/KOLDetailModal';
import { DashboardPage } from './pages/DashboardPage';
import { KOLsPage } from './pages/KOLsPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { InsightsPage } from './pages/InsightsPage';
import { StoriesPage } from './pages/StoriesPage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedKOLId, setSelectedKOLId] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedKOLId(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={handleNavigate}
            onSelectKOL={setSelectedKOLId}
            onSelectCampaign={() => {
              setCurrentPage('campaigns');
            }}
          />
        );
      case 'kols':
        return <KOLsPage onSelectKOL={setSelectedKOLId} />;
      case 'campaigns':
        return <CampaignsPage />;
      case 'insights':
        return <InsightsPage />;
      case 'stories':
        return <StoriesPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} onSelectKOL={setSelectedKOLId} onSelectCampaign={() => {}} />;
    }
  };

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderPage()}
      </Layout>
      <KOLDetailModal
        kolId={selectedKOLId}
        onClose={() => setSelectedKOLId(null)}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
