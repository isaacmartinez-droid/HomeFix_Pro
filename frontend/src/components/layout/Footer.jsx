import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface-container-low text-on-surface-variant py-8 border-t border-outline-variant mt-auto">
      <div className="max-w-container-max mx-auto px-lg flex justify-between items-center text-label-md font-label-md">
        <div>&copy; {new Date().getFullYear()} HomeFix Pro. Todos los derechos reservados.</div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-primary">Términos de Servicio</a>
          <a href="#" className="hover:text-primary">Privacidad</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
