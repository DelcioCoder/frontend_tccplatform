'use client';
import { useUserType } from '@/hooks/useUserType';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  const { userType, isLoading } = useUserType();

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  // Loading text animation variants
  const loadingTextVariants = {
    animate: {
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  // Loading line animation variants
  const loadingLineVariants = {
    initial: { width: 0, left: 0 },
    animate: {
      width: ["0%", "100%", "0%"],
      left: ["0%", "0%", "100%"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-700 to-emerald-600 text-white relative overflow-hidden">
      <div className="max-w-4xl w-full mx-auto text-center px-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={textVariants}
          className="font-montserrat text-5xl font-bold mb-6 leading-tight"
        >
          Transforme Seu TCC em uma Jornada Excepcional
        </motion.h1>
        
        <motion.p
          initial="hidden"
          animate="visible"
          variants={textVariants}
          transition={{ delay: 0.4 }}
          className="text-xl mb-8 opacity-90"
        >
          Conecte-se com os melhores orientadores de Angola e eleve sua pesquisa acadêmica a novos patamares.
        </motion.p>
        
        {isLoading ? (
          <div className="flex flex-col justify-center items-center">
            <motion.div
              className="text-white text-xl font-semibold mb-2"
              animate="animate"
              variants={loadingTextVariants}
            >
              <span className="bg-gradient-to-r from-blue-300 to-emerald-300 text-transparent text-3xl bg-clip-text font-bold">TCCLink</span>
            </motion.div>
            
            {/* Animated loading line */}
            <div className="w-48 h-1 bg-white bg-opacity-20 relative overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-white absolute top-0 rounded-full"
                initial="initial"
                animate="animate"
                variants={loadingLineVariants}
              />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: userType === 'student' ? 1 : 0,
              y: userType === 'student' ? 0 : 30,
              transition: { duration: 0.8, delay: userType === 'student' ? 0.3 : 0, ease: 'easeOut' }
            }}
            className="flex justify-center"
          >
            {userType === 'student' && (
              <Link
                href="/connect"
                className="inline-block px-8 py-4 bg-blue-700 text-white rounded-full font-semibold hover:bg-blue-800 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
              >
                Encontre seu Orientador
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}