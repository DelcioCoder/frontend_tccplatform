'use client'
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CroppedImage from '../../../public/cropped.jpeg'
import CroppedImage2 from '../../../public/CroppedDiogo.jpg'
import CroppedImage3 from '../../../public/lucasCropped.jpeg'
import { StaticImageData } from 'next/image';

interface Mentor {
  name: string;
  specialty: string;
  image: string | StaticImageData;
}

const mentors: Mentor[] = [
  {
    name: "Eng. Dercio Armando",
    specialty: "Desenvolvedor de Software",
    image:  CroppedImage 
  },
  {
    name: "Prof. António D'Barros Diogo",
    specialty: "Analista clínico",
    image: CroppedImage2
  },
  {
    name: "Eng. Lucas Filipe",
    specialty: "Engenheiro de produção industrial",
    image: CroppedImage3
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
                  quality={80}
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

