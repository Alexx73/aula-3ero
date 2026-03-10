import { Navbar, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NavBar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
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
      className="w-full bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50"
    >
      <div className="flex flex-wrap justify-between items-center w-full px-4 md:px-8">
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/" onClick={handleLinkClick}>
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Logo"
          />
          <span className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white ml-2">
            Aula de Inglés de 3er Año
          </span>
        </Navbar.Brand>

        {/* BOTÓN DE MENÚ RESPONSIVE */}
        <Navbar.Toggle onClick={handleToggle} className="focus:ring-0 focus:outline-none" />

        {/* MENÚ DE NAVEGACIÓN */}
        <Navbar.Collapse className={isMenuOpen ? "block" : "hidden md:block"}>
          <Navbar.Link as={Link} to="/" active={isActive("/")} onClick={handleLinkClick}>
            Inicio
          </Navbar.Link>

          <Navbar.Link
            as={Link}
            to="/book"
            active={isActive("/book")}
            onClick={handleLinkClick}
          >
            English book
          </Navbar.Link>

          {/* <Navbar.Link
            as={Link}
            to="/number"
            active={isActive("/number")}
            onClick={handleLinkClick}
          >
            Numbers
          </Navbar.Link> */}

          {/* <Navbar.Link
            as={Link}
            to="/questions"
            active={isActive("/questions")}
            onClick={handleLinkClick}
          >
            Personal Info
          </Navbar.Link> */}

          {/* <Navbar.Link
            as={Link}
            to="/jobs"
            active={isActive("/jobs")}
            onClick={handleLinkClick}
          >
            Jobs
          </Navbar.Link> */}

          {/* <Navbar.Link
            as={Link}
            to="/family"
            active={isActive("/family")}
            onClick={handleLinkClick}
          >
           Family
          </Navbar.Link> */}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}