'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();
  const [isFirstMount, setIsFirstMount] = useState(true);

  // Removemos a animação na montagem inicial
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsFirstMount(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={isFirstMount ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          type: "spring", 
          stiffness: 380, 
          damping: 30,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Para usar esse componente, basta envolver sua página ou layout:
// Em _app.tsx ou layout.tsx:
// 
// import { PageTransition } from '@/components/PageTransition';
//
// export default function Layout({ children }) {
//   return (
//     <PageTransition>
//       {children}
//     </PageTransition>
//   );
// }