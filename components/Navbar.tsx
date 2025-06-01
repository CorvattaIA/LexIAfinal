
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavLinkContent: React.FC<{ to: string; children: React.ReactNode; onClick?: () => void }> = ({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to === "/services" && location.pathname.startsWith("/auto-asistencia-lexia")); // Example active logic for services

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block md:inline-block px-4 py-3 md:py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out font-title title-case-es
                  hover:text-[var(--sunshine)] focus:outline-none focus:ring-2 focus:ring-[var(--sunshine)] focus:ring-opacity-50
                  ${isActive ? 'text-[var(--sunshine)] md:bg-transparent md:text-[var(--sunshine)]' : 'text-white hover:bg-white/10 md:hover:bg-transparent'}`}
    >
      {children}
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

  useEffect(() => {
    setIsMobileMenuOpen(false); 
  }, [location.pathname]);

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
    <nav className="bg-[var(--steel-blue)] text-white backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-[var(--coal)]/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="text-3xl md:text-4xl font-black font-title hover:opacity-80 transition-opacity">
              <span className="text-[var(--sunshine)]">Ciber</span><span className="text-white">abogados</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-baseline space-x-1">
            {navItems.map(item => (
              <NavLinkContent key={item.to} to={item.to}>{item.label}</NavLinkContent>
            ))}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-white hover:text-[var(--sunshine)] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--sunshine)]"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Abrir menú principal"
            >
              {isMobileMenuOpen ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--steel-blue-light)] shadow-xl z-40 border-t border-[var(--coal)]/10" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <NavLinkContent key={item.to} to={item.to} onClick={toggleMobileMenu}>{item.label}</NavLinkContent>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
