import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 text-center">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6 mb-8">
          <Link 
            href="/sobre" 
            className="text-emerald-500 hover:text-white transition-colors"
          >
            Sobre Nós
          </Link>
          <Link 
            href="/contato" 
            className="text-emerald-500 hover:text-white transition-colors"
          >
            Contato
          </Link>
          <Link 
            href="/termos" 
            className="text-emerald-500 hover:text-white transition-colors"
          >
            Termos de Uso
          </Link>
        </div>
        <p className="text-gray-400">
          © 2024 TCC Connect. Construindo o futuro acadêmico de Angola.
        </p>
      </div>
    </footer>
  );
};

export default Footer;