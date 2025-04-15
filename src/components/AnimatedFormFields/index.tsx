'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { School, BookOpen, Calendar, Briefcase, Book, FileText } from 'lucide-react';

interface ProfileFormProps {
  userType: 'student' | 'advisor' | string | null;
  profile: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const AnimatedFormFields = ({ userType, profile, handleChange }: ProfileFormProps) => {
  return (
    <motion.div
      key={userType}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {userType === 'student' ? (
        <>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <School className="mr-2 text-blue-700" size={18} />
              Instituição
            </label>
            <input
              type="text"
              name="institution"
              value={profile.institution}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Nome da sua instituição de ensino"
            />
          </div>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <BookOpen className="mr-2 text-blue-700" size={18} />
              Curso
            </label>
            <input
              type="text"
              name="course"
              value={profile.course}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Seu curso acadêmico"
            />
          </div>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <Calendar className="mr-2 text-blue-700" size={18} />
              Ano de Conclusão
            </label>
            <input
              type="number"
              name="graduation_year"
              value={profile.graduation_year}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Ano previsto para conclusão"
            />
          </div>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <Book className="mr-2 text-blue-700" size={18} />
              Interesse no TCC
            </label>
            <textarea
              name="tcc_interest"
              value={profile.tcc_interest}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Descreva seus interesses para o TCC"
            ></textarea>
          </div>
        </>
      ) : (
        <>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <BookOpen className="mr-2 text-blue-700" size={18} />
              Especialização
            </label>
            <input
              type="text"
              name="specialization"
              value={profile.specialization}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Sua área de especialização"
            />
          </div>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <Briefcase className="mr-2 text-blue-700" size={18} />
              Experiência
            </label>
            <textarea
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Descreva sua experiência acadêmica e profissional"
            ></textarea>
          </div>
          <div>
            <label className="flex items-center text-gray-700 font-semibold mb-1">
              <FileText className="mr-2 text-blue-700" size={18} />
              Biografia
            </label>
            <textarea
              name="biography"
              value={profile.biography}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Compartilhe um pouco sobre você"
            ></textarea>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AnimatedFormFields;
