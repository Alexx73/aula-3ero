import { Navbar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cerrar el menú al cambiar de ruta
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Manejar el clic en el botón de toggle
  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar el menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <Navbar
      fluid
      className="w-full bg-white border-b border-gray-200 shadow-sm fixed left-0 z-50"
      style={{ top: 'calc(-1 * var(--nav-vertical-shift, 0px))' }}
    >
      <div className="flex flex-wrap justify-between items-center w-full px-4 md:px-8">
        <div className="flex flex-col items-start gap-1">
          <Navbar.Brand as={Link} to="/" onClick={handleLinkClick} className="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-4"
              alt="Logo"
            />
            <span className="text-md md:text-md font-semibold text-gray-900 dark:text-white ml-2">
              Aula de Inglés de 3er año
            </span>
          </Navbar.Brand>
          {!isHome && (
            <Link
              to="/"
              onClick={handleLinkClick}
              className="ml-10 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-orange-500 px-3 py-1 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/30 transition hover:brightness-110"
            >
              ← Volver
            </Link>
          )}
        </div>

        {/* BOTÓN DE MENÚ RESPONSIVE */}
        {/* <Navbar.Toggle onClick={handleToggle} className="focus:ring-0 focus:outline-none" /> */}

        {/* MENÚ DE NAVEGACIÓN */}
        {/* <Navbar.Collapse className={isMenuOpen ? "block" : "hidden md:block"}>
          <Navbar.Link as={Link} to="/" active={isActive("/")} onClick={handleLinkClick}>
            Inicio
          </Navbar.Link>

          <Navbar.Link
            as={Link}
            to="/alphabet"
            active={isActive("/alphabet")}
            onClick={handleLinkClick}
          >
            The Alphabet
          </Navbar.Link>

          <Navbar.Link
            as={Link}
            to="/number"
            active={isActive("/number")}
            onClick={handleLinkClick}
          >
            Numbers
          </Navbar.Link>

        
        </Navbar.Collapse> */}
      </div>
    </Navbar>
  );
}
