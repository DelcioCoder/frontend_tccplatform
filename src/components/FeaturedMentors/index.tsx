'use client'
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Mentor {
  name: string;
  specialty: string;
  image: string;
}

const mentors: Mentor[] = [
  {
    name: "Dra. Ana Lopes",
    specialty: "Especialista em Direito Constitucional",
    image: "/placeholders/ana-lopes.jpg"
  },
  {
    name: "Prof. José Almeida",
    specialty: "Líder em Pesquisa em Engenharia",
    image: "/placeholders/jose-almeida.jpg"
  },
  {
    name: "Dr. Pedro Santos",
    specialty: "Inovador em Pesquisas de Saúde",
    image: "/placeholders/pedro-santos.jpg"
  }
];

export default function FeaturedMentors() {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-montserrat text-center text-blue-700 mb-12">
          Orientadores de Excelência
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {mentors.map((mentor, index) => (
            <motion.div
              key={mentor.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              transition={{ delay: index * 0.2 }}
              className="bg-blue-50 rounded-xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-2 transition-all"
            >
              <div className="mb-6 flex justify-center">
                <Image 
                  src={mentor.image} 
                  alt={mentor.name}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-blue-700 object-cover"
                />
              </div>
              <h3 className="text-xl font-montserrat text-blue-700 mb-2">
                {mentor.name}
              </h3>
              <p className="text-gray-600">
                {mentor.specialty}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

