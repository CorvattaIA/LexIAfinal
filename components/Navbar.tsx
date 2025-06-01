
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Typography from './ui/Typography';

interface NavLinkContentProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  isMobile?: boolean;
}

const NavLinkContent: React.FC<NavLinkContentProps> = ({ to, children, onClick, isMobile }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to === "/services" && location.pathname.startsWith("/auto-asistencia-lexia"));

  // Determinar el aria-current basado en si el enlace está activo
  const ariaCurrent = isActive ? 'page' : undefined;
  
  // Generar un ID único para el enlace para mejorar la accesibilidad
  const linkId = `nav-link-${to.replace(/\//g, '-').replace(/^-/, '')}`;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      id={linkId}
      aria-current={ariaCurrent}
      className={`block md:inline-block px-4 py-3 md:py-2 rounded-md transition-all duration-200 ease-in-out
                  hover:text-[var(--sunshine)] focus:outline-none focus:ring-2 focus:ring-[var(--sunshine)] focus:ring-opacity-50
                  ${isActive ? 'text-[var(--sunshine)] md:bg-transparent md:text-[var(--sunshine)]' : 'text-white hover:bg-white/10 md:hover:bg-transparent'}`}
    >
      <Typography 
        variant="body-small" 
        weight="medium" 
        capitalization="title-case"
        className={isMobile ? 'text-base' : ''}
      >
        {children}
      </Typography>
    </Link>
  );
};

const MenuIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  // Cerrar menú móvil al cambiar de página
  useEffect(() => {
    setIsMobileMenuOpen(false); 
  }, [location.pathname]);
  
  // Manejar navegación por teclado y accesibilidad del menú móvil
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileButtonRef.current?.focus();
      }
    };
    
    // Añadir event listener para la tecla Escape
    document.addEventListener('keydown', handleEscape);
    
    // Enfocar el primer elemento del menú cuando se abre
    if (isMobileMenuOpen && mobileMenuRef.current) {
      const firstLink = mobileMenuRef.current.querySelector('a');
      if (firstLink instanceof HTMLElement) {
        firstLink.focus();
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { to: "/", label: "Inicio" },
    { to: "/como-funciona", label: "Cómo funciona" },
    { to: "/services", label: "Servicios" },
    // Evaluation and Chat are now part of the service flow, not direct nav items
    { to: "/contact", label: "Contacto" },
  ];

  return (
    <nav 
      className="bg-[var(--steel-blue)] text-white backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-[var(--coal)]/10"
      aria-label="Navegación principal"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--sunshine)] focus:ring-opacity-50 rounded-md"
              aria-label="Ciberabogados - Ir a la página de inicio"
            >
              <Typography 
                variant="display" 
                as="span" 
                className="text-3xl md:text-4xl font-black flex items-center"
              >
                <span className="text-[var(--sunshine)]">Ciber</span>
                <span className="text-white">abogados</span>
              </Typography>
            </Link>
          </div>
          
          {/* Menú de navegación para pantallas medianas y grandes */}
          <div 
            className="hidden md:flex items-baseline space-x-1"
            role="menubar"
            aria-label="Menú de navegación principal"
          >
            {navItems.map(item => (
              <div key={item.to} role="none" className="relative">
                <NavLinkContent 
                  to={item.to}
                  role="menuitem"
                >
                  {item.label}
                </NavLinkContent>
              </div>
            ))}
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden">
            <button
              ref={mobileButtonRef}
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-white hover:text-[var(--sunshine)] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--sunshine)]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Cerrar menú principal" : "Abrir menú principal"}
            >
              {isMobileMenuOpen ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-[var(--steel-blue-light)] shadow-xl z-40 border-t border-[var(--coal)]/10 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        id="mobile-menu"
        ref={mobileMenuRef}
        role="menu"
        aria-labelledby="mobile-menu-button"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map(item => (
            <div key={item.to} role="none">
              <NavLinkContent 
                to={item.to} 
                onClick={toggleMobileMenu} 
                isMobile={true}
                role="menuitem"
              >
                {item.label}
              </NavLinkContent>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
