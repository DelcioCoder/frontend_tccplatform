// pages/chat.tsx
'use client';
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useConversation } from "@/contexts/ConversationContext";
import PrivateChat from "@/components/PrivateChat";
import { AnimatePresence, motion } from "framer-motion";

// Tipos para as conversas
interface Conversation {
  id: number;
  advisor: number;
  advisor_username: string;
  student: number;
  student_username: string;
  updated_at: string;
}

interface ConversationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Conversation[];
}

// Componente de Spinner com animação
const Spinner = () => (
  <motion.div 
    className="flex justify-center items-center p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div 
      className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  </motion.div>
);

// Componente para um item de conversa individual
const ConversationItem = ({ conversation, currentUserId, onClick }) => {
  const isAdvisor = conversation.advisor === currentUserId;
  const otherPersonName = isAdvisor ? conversation.student_username : conversation.advisor_username;
  const formattedDate = new Date(conversation.updated_at).toLocaleDateString();
  const formattedTime = new Date(conversation.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.li
      whileHover={{ scale: 1.01, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick(conversation)}
      className="cursor-pointer rounded-lg p-4 border border-gray-200 mb-2 transition-shadow hover:shadow-md"
      layout
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium">
            {otherPersonName.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {otherPersonName}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {isAdvisor ? "Aluno" : "Orientador"}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-500">{formattedDate}</p>
          <p className="text-xs font-semibold text-gray-600">{formattedTime}</p>
        </div>
      </div>
    </motion.li>
  );
};

// Componente que lista as conversas
function ConversationsList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { setConversationId } = useConversation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUserId, setCurrentUserId] = useState(21); // Valor padrão, ajuste para extrair do contexto de autenticação

  useEffect(() => {
    async function fetchConversations() {
      try {
        setLoading(true);
        const response = await fetch("api/chat/conversations/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar conversas");
        }
        const data: ConversationsResponse = await response.json();
        setConversations(data.results);
      } catch (error) {
        console.error("Erro ao buscar conversas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  // Função para tratar o clique na conversa
  function handleConversationClick(conversation: Conversation) {
    setConversationId(conversation.id);
    router.push(`/chat/?conversationId=${conversation.id}`);
  }

  // Filtragem de conversas baseada na busca
  const filteredConversations = conversations.filter(conv => {
    const otherUsername = conv.advisor === currentUserId ? conv.student_username : conv.advisor_username;
    return otherUsername.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return <Spinner />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Busca */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar conversas..."
            className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Lista de conversas */}
      {filteredConversations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-64 text-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-gray-500 font-medium">Nenhuma conversa encontrada</p>
          <p className="text-gray-400 text-sm mt-1">Tente outro termo de busca ou inicie uma nova conversa</p>
        </motion.div>
      ) : (
        <motion.ul 
          className="space-y-2 overflow-y-auto flex-1 pr-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredConversations.map((conv) => (
              <motion.div key={conv.id} variants={itemVariants}>
                <ConversationItem 
                  conversation={conv} 
                  currentUserId={currentUserId}
                  onClick={handleConversationClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

// Página principal que integra a lista de conversas e o chat privado
const ChatPage = () => {
  const { conversationId } = useConversation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Detectar tamanho de tela para responsividade
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(!conversationId);
      } else {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Configuração inicial
    
    return () => window.removeEventListener('resize', handleResize);
  }, [conversationId]);

  return (
    <div className="container mx-auto py-6 px-4 h-[calc(100vh-64px)]">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full">
        <div className="flex h-full">
          {/* Barra lateral de conversas - responsiva */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full md:w-80 border-r border-gray-200 h-full flex flex-col"
              >
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Mensagens</h2>
                  <p className="text-sm text-gray-500">Gerencie suas conversas</p>
                </div>
                <div className="flex-1 overflow-hidden p-3">
                  <ConversationsList />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Área principal do chat */}
          <div className="flex-1 flex flex-col h-full relative">
            {/* Botão para mostrar/esconder sidebar em dispositivos móveis */}
            {conversationId && (
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow-md border border-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
            
            {/* Componente de Chat */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={conversationId || 'empty'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full flex-1"
              >
                {conversationId ? (
                  <PrivateChat conversationId={conversationId} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50">
                    <div className="text-center p-8 max-w-md">
                      <div className="bg-blue-100 rounded-full p-3 inline-block mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Bem-vindo ao Chat</h3>
                      <p className="text-gray-600 mb-6">Selecione uma conversa para iniciar ou continuar um chat.</p>
                      <div className="mx-auto w-16 h-1 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exportando dinamicamente para desabilitar o SSR, se necessário
export default dynamic(() => Promise.resolve(ChatPage), { ssr: false });