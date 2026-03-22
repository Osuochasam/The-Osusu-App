
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OsusuProvider, useOsusu } from './context/OsusuContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CircleView from './pages/CircleView';

function AppContent() {
  const { user, circle } = useOsusu();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/circle" element={user && circle ? <CircleView /> : <Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <OsusuProvider>
        <AppContent />
      </OsusuProvider>
    </BrowserRouter>
  );
}
