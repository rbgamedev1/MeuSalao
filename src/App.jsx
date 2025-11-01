import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import Produtos from './pages/Produtos';
import Financeiro from './pages/Financeiro';
import Relatorios from './pages/Relatorios';
import { SalaoProvider } from './contexts/SalaoContext';

function App() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  return (
    <SalaoProvider>
      <Router>
        <div className="flex h-screen bg-gray-50">
          <Sidebar 
            expanded={sidebarExpanded} 
            setExpanded={setSidebarExpanded} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            
            <main className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/agendamentos" element={<Agendamentos />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/financeiro" element={<Financeiro />} />
                <Route path="/relatorios" element={<Relatorios />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </SalaoProvider>
  );
}

export default App;