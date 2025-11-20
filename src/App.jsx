// src/App.jsx - CORRIGIDO COM ROTA /clientes/:id

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Landing from './pages/landing/Landing';
import Contact from './pages/landing/Contact';
import About from './pages/landing/About';
import Demo from './pages/landing/Demo';
import Help from './pages/landing/Help';
import Documentation from './pages/landing/Documentation';
import Dashboard from './pages/Dashboard';
import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import Produtos from './pages/Produtos';
import Caixa from './pages/Caixa';
import Financeiro from './pages/Financeiro';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import Perfil from './pages/Perfil';
import AgendaOnline from './pages/AgendaOnline';
import Avaliacao from './pages/Avaliacao';
import ClienteDetalhesPage from './pages/ClienteDetalhesPage';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { SalaoProvider } from './contexts/SalaoContext';
import notificationService from './services/notificationService';

// Componente de Rota Protegida
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Layout principal do sistema
const SystemLayout = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    try {
      if (notificationService && typeof notificationService.getSettings === 'function') {
        const settings = notificationService.getSettings();
        if (settings?.autoStart) {
          notificationService.start();
        }
      }
    } catch (error) {
      console.warn('Notification service not available:', error);
    }
    
    return () => {
      try {
        if (notificationService && typeof notificationService.stop === 'function') {
          notificationService.stop();
        }
      } catch (error) {
        console.warn('Error stopping notification service:', error);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <button
          onClick={() => setSidebarExpanded(true)}
          className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
        >
          <Menu size={24} />
        </button>

        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SalaoProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/help" element={<Help />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/agenda/:salaoId" element={<AgendaOnline />} />
            <Route path="/avaliacao/:salaoId/:token" element={<Avaliacao />} />

            {/* Rotas protegidas com layout */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <SystemLayout>
                  <Dashboard />
                </SystemLayout>
              </ProtectedRoute>
            } />

            <Route path="/agendamentos" element={
              <ProtectedRoute>
                <SystemLayout>
                  <Agendamentos />
                </SystemLayout>
              </ProtectedRoute>
            } />

            <Route path="/clientes" element={
              <ProtectedRoute>
                <SystemLayout>
                  <Clientes />
                </SystemLayout>
              </ProtectedRoute>
            } />

            {/* NOVA ROTA: Página Dedicada de Detalhes do Cliente */}
            <Route path="/clientes/:id" element={
              <ProtectedRoute>
                <SystemLayout>
                  <ClienteDetalhesPage />
                </SystemLayout>
              </ProtectedRoute>
            } />

            <Route path="/servicos" element={
              <ProtectedRoute>
                <SystemLayout>
                  <Servicos />
                </SystemLayout>
              </ProtectedRoute>
            } />

            <Route path="/produtos" element={
              <ProtectedRoute>
                <SystemLayout>
                  <Produtos />
                </SystemLayout>
              </ProtectedRoute>
            } />

            <Route path="/caixa" element={
              <ProtectedRoute>
                <SystemLayout>
                  <Caixa />
                </SystemLayout>
              </ProtectedRoute>
            } />

            <Route path="/financeiro" element={
              <ProtectedRoute>
                <SystemLayout>
                  <Financeiro />
                </SystemLayout>
              </ProtectedRoute>
            } />

            <Route path="/relatorios" element={
              <ProtectedRoute>
                <SystemLayout>
                  <Relatorios />
                </SystemLayout>
              </ProtectedRoute>
            } />

            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <SystemLayout>
                  <Configuracoes />
                </SystemLayout>
              </ProtectedRoute>
            } />

            <Route path="/perfil" element={
              <ProtectedRoute>
                <SystemLayout>
                  <Perfil />
                </SystemLayout>
              </ProtectedRoute>
            } />

            {/* Redirecionar rotas inválidas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SalaoProvider>
    </AuthProvider>
  );
}

export default App;