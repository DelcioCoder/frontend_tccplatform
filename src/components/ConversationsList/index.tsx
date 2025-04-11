"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function ConversationsList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchConversations() {
      setLoading(true);
      try {
        const response = await fetch("api/chat/conversations/", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar conversas');
        }
        const data: ConversationsResponse = await response.json();
        setConversations(data.results);
      } catch (error) {
        console.error('Erro ao buscar conversas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, []);

  function handleConversationClick(conversation: Conversation) {
    // Redireciona para a página de chat passando o conversationId na query string
    router.push(`/chat/?conversationId=${conversation.id}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando conversas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Suas Conversas</h2>
      {conversations.length === 0 ? (
        <p className="text-gray-500">Nenhuma conversa encontrada.</p>
      ) : (
        <ul className="space-y-2">
          {conversations.map(conv => (
            <li
              key={conv.id}
              onClick={() => handleConversationClick(conv)}
              className="cursor-pointer p-3 border rounded hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {/* Exibe o nome do outro participante. Adapte conforme sua lógica */}
                  {conv.advisor === /* ID do usuário logado */ 21
                    ? conv.student_username
                    : conv.advisor_username}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(conv.updated_at).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
