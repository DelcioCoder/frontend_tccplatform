'use client';

import React, { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  Home,
  Users,
  MessageCircle,
  User,
  Search,
  Menu,
  X,
  LayoutDashboard
} from 'lucide-react';
import ProfileMenuModal from '../ProfileMenuModal';
import { getAuthenticatedUser } from '@/lib/api/auth';
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Estado para o menu mobile
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para o modal de perfil
  const [userType, setUserType] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserType = async () => {
      const user = await getAuthenticatedUser();
      setUserType(user?.user_type);
    };
    fetchUserType();
  }, []);

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditProfile = () => {
    setIsModalOpen(false);
    router.push('/profile');
  };

  const handleLogout = async () => {
    try {
      const response =  await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Erro ao fazer logout:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }

    setIsModalOpen(false);
    
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 shadow-sm z-50 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Desktop Navigation */}
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
            {userType === "student" && (
              <NavLink href="/connect" icon={<Users className="h-5 w-5" />} text="Conectar" />
            )}
            {userType === "student" && (
              <NavLink href="student/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" />
            )}
            {userType === "advisor" && (
              <NavLink href="advisor/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" />
            )}
            <NavLink href="/messages" icon={<MessageCircle className="h-5 w-5" />} text="Mensagens" />
            {/* Para o perfil, usamos botão que abre o modal */}
            <button
              onClick={handleProfileClick}
              className="group flex items-center gap-2 text-gray-600 hover:text-blue-800 transition-colors focus:outline-none cursor-pointer"
            >
              <User className="h-5 w-5" />
              <span className="text-sm font-medium relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-blue-800 after:transition-all group-hover:after:w-full">
                Perfil
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
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
                {userType === "student" && (
                  <MobileNavLink href="/connect" icon={<Users className="h-5 w-5" />} text="Conectar" />
                )}
                {userType === "student" && (
                  <MobileNavLink href="student/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" />
                )}  
                {userType === "advisor" && (
                  <MobileNavLink href="advisor/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} text="Dashboard" />
                )}
                <MobileNavLink href="/messages" icon={<MessageCircle className="h-5 w-5" />} text="Mensagens" />
                {/* Link de Perfil no Mobile: abre o modal */}
                <button
                  onClick={handleProfileClick}
                  className="flex items-center gap-3 p-2 text-gray-600 hover:bg-blue-50 rounded-lg w-full text-left"
                >
                  <User className="h-5 w-5" />
                  <span className="text-base font-medium">Perfil</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Modal do Perfil */}
      {isModalOpen && (
        <ProfileMenuModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap');
        .font-montserrat {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </header>
  );
}

// Componente para o link da navegação (Desktop)
const NavLink = ({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) => (
  <Link href={href} className="group flex items-center gap-2 text-gray-600 hover:text-blue-800 transition-colors">
    {icon}
    <span className="text-sm font-medium relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-blue-800 after:transition-all group-hover:after:w-full">
      {text}
    </span>
  </Link>
);

// Componente para o link de navegação (Mobile)
const MobileNavLink = ({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) => (
  <Link href={href} className="flex items-center gap-3 p-2 text-gray-600 hover:bg-blue-50 rounded-lg">
    {icon}
    <span className="text-base font-medium">{text}</span>
  </Link>
);
