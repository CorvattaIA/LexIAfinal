
import React from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
// Old AssessmentTest is moved to DiagnosticoInicialPage
// import AssessmentTest from './components/AssessmentTest'; 
import AssistanceChat from './components/AssistanceChat';
import LexiaChat from './components/LexiaChat';
import Contact from './components/Contact';
import ServicesPage from './components/ServicesPage'; 
import DataPolicyPage from './components/DataPolicyPage';
import ComoFuncionaPage from './components/ComoFuncionaPage';
import DiagnosticoInicialPage from './components/service_pages/DiagnosticoInicialPage';
import AutoAsistenciaLexiaPage from './components/service_pages/AutoAsistenciaLexiaPage';
import ReporteEstrategicoPage from './components/service_pages/ReporteEstrategicoPage';
import IntervencionEspecializadaPage from './components/service_pages/IntervencionEspecializadaPage';
import RepresentacionIntegralPage from './components/service_pages/RepresentacionIntegralPage';

import { FOOTER_TEXT } from './constants';
import { RegisteredUser } from './types'; 

const App: React.FC = () => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = React.useState<RegisteredUser | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--deep-blue-dark)] text-[var(--text-on-dark)]">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 page-enter">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/como-funciona" element={<ComoFuncionaPage />} />
          <Route path="/services" element={<ServicesPage />} />
          
          {/* Service Specific Pages */}
          <Route 
            path="/diagnostico-inicial" 
            element={
              <DiagnosticoInicialPage 
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            } 
          />
          <Route path="/auto-asistencia-lexia" element={<AutoAsistenciaLexiaPage />} />
          <Route path="/reporte-estrategico" element={<ReporteEstrategicoPage />} />
          <Route path="/intervencion-especializada" element={<IntervencionEspecializadaPage />} />
          <Route path="/representacion-integral" element={<RepresentacionIntegralPage />} />

          {/* Existing utility/supporting routes */}
          <Route path="/chat" element={<AssistanceChat />} /> 
          <Route path="/lexia-chat" element={<LexiaChat />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/data-policy" element={<DataPolicyPage />} />
        </Routes>
      </main>
      <footer className="bg-[var(--surface-subtle)] text-[var(--text-on-dark-soft)]/80 text-center p-6 shadow-inner mt-auto border-t border-[var(--border-subtle)]/50">
        <p className="text-sm mb-1">{FOOTER_TEXT}</p>
        <p className="text-xs">
          <Link to="/data-policy" className="underline hover:text-[var(--golden-accent)] transition-colors">
            Política de Tratamiento de Datos
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default App;
