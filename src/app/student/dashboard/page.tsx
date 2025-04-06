'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Goback from "@/components/GoBack";

import {
  Bell,
  User,
  Clock,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";

export default function StudentDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const router = useRouter();

  // Função para buscar os pedidos enviados pelo estudante
  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/connections/student/requests/');
        if (response.ok) {
          const data = await response.json();
          setRequests(data.results);
        } else {
          console.error('Erro ao buscar solicitações', response.status);
        }
      } catch (error) {
        console.error('Erro ao buscar solicitações', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Filtragem: pesquisa por orientador ou mensagem
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      !searchQuery ||
      req.advisor_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" || req.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Ordenação: por data de criação (ascendente ou descendente)
  const sortedRequests = [...filteredRequests].sort((a, b) =>
    sortOrder === "asc"
      ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Variáveis para animação com Framer Motion
  const container = { 
    hidden: { opacity: 0 }, 
    show: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    } 
  };
  
  const item = { 
    hidden: { opacity: 0, y: 20 }, 
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    } 
  };

  const cardHover = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-br from-blue-700 to-emerald-600 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Meus Pedidos de Orientação</h1>
          <div className="flex items-center gap-4">
            <motion.button 
              className="relative p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={20} className="text-white" aria-label="Notificações" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-400 rounded-full text-xs text-white flex items-center justify-center">
                {requests.length}
              </span>
            </motion.button>
            <motion.div 
              className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={16} aria-label="Perfil do usuário" />
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Estatísticas */}
        <section aria-labelledby="stats-heading" className="mb-8">
          <h2 id="stats-heading" className="sr-only">Estatísticas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: <Clock size={24} />, title: "Pendentes", value: requests.filter(r => r.status === "Pending").length, color: "blue" },
              { icon: <CheckCircle size={24} />, title: "Aceitas", value: requests.filter(r => r.status === "Accepted").length, color: "emerald" },
              { icon: <XCircle size={24} />, title: "Rejeitadas", value: requests.filter(r => r.status === "Rejected").length, color: "red" },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1), type: "spring", stiffness: 100 }}
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-700 mr-4`}>{stat.icon}</div>
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <h3 className={`text-2xl font-bold text-${stat.color}-700`}>{stat.value}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Filtros e Pesquisa */}
        <section className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <motion.div 
            className="w-full sm:w-1/3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="search" className="sr-only">Buscar orientador ou mensagem</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="search"
                placeholder="Buscar orientador ou mensagem"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
          <motion.div 
            className="flex gap-4 w-full sm:w-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-blue-700" />
              <select
                id="filter"
                className="w-full sm:w-auto bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="pending">Pendentes</option>
                <option value="accepted">Aceitas</option>
                <option value="rejected">Rejeitadas</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              {sortOrder === "asc" ? (
                <SortAsc size={16} className="text-blue-700" />
              ) : (
                <SortDesc size={16} className="text-blue-700" />
              )}
              <select
                id="sort"
                className="w-full sm:w-auto bg-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">Mais antigas</option>
                <option value="desc">Mais recentes</option>
              </select>
            </div>
          </motion.div>
        </section>

        {/* Lista de Solicitações */}
        <section aria-labelledby="requests-heading">
          <h2 id="requests-heading" className="sr-only">Pedidos de orientação</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <motion.div 
                className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </div>
          ) : sortedRequests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="bg-white rounded-lg shadow-lg p-12 text-center border border-gray-100"
            >
              <Bell size={48} className="text-gray-300 mb-4 mx-auto" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-500">
                {searchQuery || filter !== "all"
                  ? "Nenhum pedido corresponde aos filtros atuais."
                  : "Você ainda não enviou nenhum pedido de orientação."}
              </p>
            </motion.div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-6"
            >
              {sortedRequests.map((req) => (
                <motion.article
                  key={req.id}
                  variants={item}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  variants={cardHover}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{req.advisor_username}</h3>
                          <time className="text-sm text-gray-500">
                            {req.created_at ? new Date(req.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </time>
                        </div>
                      </div>
                      <blockquote className="mt-3 bg-blue-50 p-4 rounded-md border border-blue-100">
                        <p className="text-gray-700">{req.message}</p>
                      </blockquote>
                      {req.tags?.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tags relacionadas">
                          {req.tags.map((tag: string, index: number) => (
                            <li key={index}>
                              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-100">
                                {tag}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-2 md:w-48">
                      <span
                        className={`px-4 py-2 rounded-lg text-white text-center ${
                          req.status === "Accepted"
                            ? "bg-emerald-600"
                            : req.status === "Rejected"
                            ? "bg-red-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {req.status === "Accepted"
                          ? "Aceita"
                          : req.status === "Rejected"
                          ? "Rejeitada"
                          : "Pendente"}
                      </span>
                      {req.status === "Accepted" && (
                        <motion.button
                          onClick={() => router.push(`/messages?request=${req.id}`)}
                          className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <MessageSquare size={16} className="mr-2" /> Iniciar Conversa
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
              <Goback />
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}