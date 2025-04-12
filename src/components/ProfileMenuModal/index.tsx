'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';


interface ProfileMenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEditProfile: () => void;
    onLogout: () => void;
}

export default function ProfileMenuModal({ isOpen, onClose, onEditProfile, onLogout }: ProfileMenuModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    // Fechar o modal ao pressionar ESC
    useEffect(() => {
        const handleEscKey = (e: KeyboardEvent) => {
            if (isOpen && e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => window.removeEventListener('keydown', handleEscKey);
    }, [isOpen, onClose]);

    // Fechar o modal ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50"
        >
            <div className="p-4">
                <h2 className="mb-4 text-xl font-bold text-gray-800">Opções de Perfil</h2>
                <ul className="space-y-1">
                    <li>
                        <button
                            onClick={onEditProfile}
                            className="w-full text-left rounded-md p-3 hover:bg-gray-100 transition-colors flex items-center cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2 text-blue-600"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Editar Perfil
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={onLogout}
                            className="w-full text-left rounded-md p-3 hover:bg-gray-100 transition-colors flex items-center cursor-pointer"
                        >
                            <LogOut className="h-5 w-5 mr-2 text-blue-700" />
                            Sair
                        </button>
                    </li>
                </ul>
            </div>
        </motion.div>
    );
}