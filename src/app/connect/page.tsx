'use client'
import { useEffect, useState, useRef, useCallback } from "react";
import AdvisorCard from "@/components/AdvisorCard";
import RequestModal from "@/components/RequestModal";
import { Advisor, Student } from "@/types/advisor";
import { getAdvisors } from "@/lib/api/advisors";
import { getAuthenticatedUser } from "@/lib/api/auth";
import Spinner from "@/components/Spinner";
import Goback from "@/components/GoBack";

export default function Connect() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Advisor | Student | null>(null);
  const [nextUrl, setNextUrl] = useState<string | null>("initial"); // "initial" é um estado especial para primeira carga
  const [hasError, setHasError] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Busca o usuário autenticado
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getAuthenticatedUser();
        if (user) {
          setUserType(user.user_type);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    };
    fetchUser();
  }, []);

  // Função para carregar mais orientadores
  const loadMoreAdvisors = useCallback(async () => {
    // Não carregar se já estiver carregando, se houver erro, ou se não houver mais páginas (nextUrl === null)
    if (loading || hasError || nextUrl === null) return;
    
    try {
      setLoading(true);
      
      // Determina a página a buscar
      const pageToFetch = nextUrl === "initial" ? "1" : 
                          nextUrl ? new URL(nextUrl).searchParams.get("page") || "1" : "1";
      
      const advisorData = await getAdvisors(pageToFetch);
      
      // Adiciona novos orientadores ou inicia a lista
      if (nextUrl === "initial") {
        setAdvisors(advisorData.results);
      } else {
        setAdvisors(prev => [...prev, ...advisorData.results]);
      }
      
      // Atualiza a próxima URL
      setNextUrl(advisorData.next);
      setHasError(false);
    } catch (error) {
      console.error("Erro ao carregar orientadores:", error);
      setHasError(true);
      setNextUrl(null); // Para parar as tentativas de carregamento
    } finally {
      setLoading(false);
    }
  }, [loading, nextUrl, hasError]);

  // Carrega dados iniciais quando userType é definido
  useEffect(() => {
    if (userType === "student" && nextUrl === "initial") {
      loadMoreAdvisors();
    }
  }, [userType, loadMoreAdvisors, nextUrl]);

  // Configura o Intersection Observer para infinite scroll
  useEffect(() => {
    // Não configura o observer se não houver mais páginas, se estiver carregando ou se houver erro
    if (nextUrl === null || loading || hasError) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Quando o elemento observado se torna visível e não é a carga inicial
        if (entries[0].isIntersecting && nextUrl !== "initial") {
          loadMoreAdvisors();
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [nextUrl, loading, loadMoreAdvisors, hasError]);

  const handleConnect = (user: Advisor | Student) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  // Botão para tentar novamente quando houver erro
  const handleRetry = () => {
    setHasError(false);
    // Restaura o último URL válido, se houver
    if (nextUrl === null && advisors.length > 0) {
      // Tenta a próxima página após a última bem-sucedida
      const nextPage = Math.ceil(advisors.length / 5) + 1; // Assumindo 5 itens por página
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      setNextUrl(`${apiUrl}/profiles/advisors/?page=${nextPage}`);
    } else if (advisors.length === 0) {
      // Se não houver nenhum orientador, reinicia do zero
      setNextUrl("initial");
    }
  };

  if (!userType) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  return (
    <div className="container mx-auto p-4 pb-16">
      <h1 className="text-2xl font-bold mb-6">
        {userType === "student" ? "Conectar com Orientadores" : "Conectar com Estudantes"}
      </h1>
      
      {/* Grid de cartões de orientadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {userType === "student" &&
          advisors.map((advisor) => (
            <AdvisorCard 
              key={advisor.user_id} 
              advisor={advisor} 
              onConnect={handleConnect} 
            />
          ))}
      </div>
      
      {/* Área de observação para o infinite scroll */}
      <div 
        ref={observerTarget} 
        className="w-full flex justify-center items-center py-8 mt-2"
      >
        {loading && <Spinner />}
        
        {hasError && (
          <div className="text-center">
            <p className="text-red-500 mb-2">Erro ao carregar mais orientadores</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tentar novamente
            </button>
          </div>
        )}
        
        {!loading && !hasError && nextUrl === null && advisors.length > 0 && (
          <p className="text-gray-500">Não há mais orientadores para mostrar</p>
        )}
        
        {!loading && !hasError && nextUrl === null && advisors.length === 0 && (
          <p className="text-gray-500">Nenhum orientador encontrado</p>
        )}
      </div>
      
      {/* Modal de solicitação de conexão */}
      {selectedUser && (
        <RequestModal
          isOpen={isModalOpen}
          onClose={closeModal}
          user={selectedUser}
        />
      )}
      <Goback />
    </div>
  );
}