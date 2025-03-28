'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Home, Users, MessageCircle, User, Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 shadow-sm z-50 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <GraduationCap className="h-8 w-8 text-emerald-600" />
            <span className="bg-gradient-to-r from-blue-800 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent font-montserrat">
              TCC Connect
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-grow max-w-2xl mx-8">
            <div className="flex items-center bg-blue-50 rounded-full px-4 py-2 shadow-sm transition-all focus-within:bg-blue-100 focus-within:shadow-md">
              <Search className="h-5 w-5 text-blue-700 mr-2" />
              <input
                type="text"
                placeholder="Pesquisar orientadores, áreas, temas..."
                className="w-full bg-transparent outline-none text-sm placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="flex items-center gap-6">
            <NavLink href="/" icon={<Home className="h-5 w-5" />} text="Início" />
            <NavLink href="/connect" icon={<Users className="h-5 w-5" />} text="Conectar" />
            <NavLink href="/messages" icon={<MessageCircle className="h-5 w-5" />} text="Mensagens" />
            <NavLink href="/profile" icon={<User className="h-5 w-5" />} text="Perfil" />
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-emerald-600" />
            <span className="bg-gradient-to-r from-blue-800 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent font-montserrat">
              TCC Connect
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-blue-800 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="pt-4">
              <div className="flex items-center bg-blue-50 rounded-full px-4 py-2 shadow-sm mb-4">
                <Search className="h-5 w-5 text-blue-700 mr-2" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="w-full bg-transparent outline-none text-sm placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-4">
                <MobileNavLink href="/" icon={<Home className="h-5 w-5" />} text="Início" />
                <MobileNavLink href="/connect" icon={<Users className="h-5 w-5" />} text="Conectar" />
                <MobileNavLink href="/messages" icon={<MessageCircle className="h-5 w-5" />} text="Mensagens" />
                <MobileNavLink href="/profile" icon={<User className="h-5 w-5" />} text="Perfil" />
              </div>
            </div>
          </div>
        )}
      </nav>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap');
        
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </header>
  );
};

const NavLink = ({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) => (
  <Link href={href} className="group flex items-center gap-2 text-gray-600 hover:text-blue-800 transition-colors">
    {icon}
    <span className="text-sm font-medium relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-blue-800 after:transition-all group-hover:after:w-full">
      {text}
    </span>
  </Link>
);

const MobileNavLink = ({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) => (
  <Link href={href} className="flex items-center gap-3 p-2 text-gray-600 hover:bg-blue-50 rounded-lg">
    {icon}
    <span className="text-base font-medium">{text}</span>
  </Link>
);

