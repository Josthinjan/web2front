// components/Footer.js

import React from 'react';
import Link from 'next/link';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <Link href="/privacy-policy" className="footer-link">
            Política de Privacidad
          </Link>
          <Link href="/terms-of-service" className="footer-link">
            Términos del Servicio
          </Link>
          <Link href="/contact" className="footer-link">
            Contáctanos
          </Link>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} InventoryPro. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;