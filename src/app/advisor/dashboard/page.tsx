'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Goback from "@/components/GoBack";
import {
  Bell,
  CheckCircle,
  XCircle,
  User,
  Clock,
  Filter,
  Search,
  SortAsc,
  SortDesc,
} from "lucide-react";

export default function AdvisorDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const router = useRouter();

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/connections/advisor/requests');
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

  const handleAccept = async (id: number) => {
    try {
      const response = await fetch(`/api/connections/advisor/response/${id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Accepted', response_message: 'Sim, aceito a sua solicitação' }),
      });
      if (!response.ok) throw new Error('Erro ao aceitar solicitação');
      const data = await response.json();
      console.log('Solicitação aceita:', data);
      setRequests(requests.map(req => (req.id === id ? { ...req, status: 'Accepted' } : req)));
    } catch (error) {
      console.error('Erro ao aceitar solicitação:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`/api/connections/advisor/response/${id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected', response_message: 'Não posso aceitar agora' }),
      });
      if (!response.ok) throw new Error('Erro ao rejeitar solicitação');
      const data = await response.json();
      console.log('Solicitação rejeitada:', data);
      setRequests(requests.map(req => (req.id === id ? { ...req, status: 'Rejected' } : req)));
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = !searchQuery || 
      req.student_username.toLowerCase().includes(searchQuery.toLowerCase()) || 
      req.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || req.status.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const sortedRequests = [...filteredRequests].sort((a, b) =>
    sortOrder === "asc"
      ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-br from-blue-700 to-emerald-600 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Dashboard do Orientador</h1>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white">
              <Bell size={20} className="text-white" aria-label="Notificações" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-emerald-400 rounded-full text-xs text-white flex items-center justify-center">
                {requests.length}
              </span>
            </button>
            <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <User size={16} aria-label="Perfil do usuário" />
            </div>
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
                transition={{ delay: 0.1 * (index + 1) }}
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
        <section aria-labelledby="filters-heading" className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="w-full sm:w-1/3">
              <label htmlFor="search" className="sr-only">Buscar aluno ou mensagem</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  placeholder="Buscar aluno ou mensagem"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
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
                {sortOrder === "asc" ? <SortAsc size={16} className="text-blue-700" /> : <SortDesc size={16} className="text-blue-700" />}
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
            </div>
          </div>
        </section>

        {/* Lista de Solicitações */}
        <section aria-labelledby="requests-heading">
          <h2 id="requests-heading" className="sr-only">Solicitações de orientação</h2>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
            </div>
          ) : sortedRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-lg p-12 text-center border border-gray-100"
            >
              <Bell size={48} className="text-gray-300 mb-4 mx-auto" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Nenhuma solicitação encontrada</h3>
              <p className="text-gray-500">
                {searchQuery || filter !== "all"
                  ? "Nenhuma solicitação corresponde aos filtros."
                  : "Você não tem solicitações pendentes no momento."}
              </p>
            </motion.div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-6">
              {sortedRequests.map((req) => (
                <motion.article
                  key={req.id}
                  variants={item}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{req.student_username}</h3>
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
                    <div className="flex flex-col gap-2 md:w-48">
                      {req.status === "Pending" ? (
                        <>
                          <button
                            onClick={() => handleAccept(req.id)}
                            className="flex items-center justify-center bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                          >
                            <CheckCircle size={16} className="mr-2" /> Aceitar
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="flex items-center justify-center bg-white border border-red-500 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                          >
                            <XCircle size={16} className="mr-2" /> Rejeitar
                          </button>
                        </>
                      ) : (
                        <span
                          className={`px-4 py-2 rounded-lg text-white text-center ${
                            req.status === "Accepted" ? "bg-emerald-600" : "bg-red-600"
                          }`}
                        >
                          {req.status === "Accepted" ? "Aceita" : "Rejeitada"}
                        </span>
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