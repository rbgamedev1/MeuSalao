// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import Produtos from './pages/Produtos';
import Financeiro from './pages/Financeiro';
import Relatorios from './pages/Relatorios';
import Configuracoes from './pages/Configuracoes';
import { SalaoProvider } from './contexts/SalaoContext';

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <SalaoProvider>
      <Router>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar 
            expanded={sidebarExpanded} 
            setExpanded={setSidebarExpanded} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden w-full">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarExpanded(true)}
              className="lg:hidden fixed top-4 left-4 z-20 p-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
            >
              <Menu size={24} />
            </button>

            <Header />
            
            <main className="flex-1 overflow-y-auto p-4 lg:p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/agendamentos" element={<Agendamentos />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/relatorios" element={<Relatorios />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </SalaoProvider>
  );
}

export default App;