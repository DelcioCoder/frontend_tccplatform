'use client';
import { useEffect, useState, useRef, useCallback, KeyboardEvent } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Types
export interface ChatMessage {
  id: number;
  conversation: number;
  sender: number;
  sender_username: string;
  recipient_username: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface MessagePagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatMessage[];
}

export interface PrivateChatProps {
  conversationId: number;
  currentUserId: number;
  currentUserType: string;
  initialMessages?: ChatMessage[];
  onError?: (error: Error) => void;
}

interface ChatInfo {
  name: string;
  status: string;
}

const Spinner = () => (
  <motion.div
    className="w-6 h-6 border-3 border-t-transparent border-blue-600 rounded-full"
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
  />
);

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  isAdvisor: boolean;
  formattedTime: string;
}

const MessageBubble = ({ message, isCurrentUser, isAdvisor, formattedTime }: MessageBubbleProps) => {
  const bubbleClasses = isCurrentUser
    ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
    : isAdvisor
      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
      : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 border border-gray-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`
        rounded-2xl px-3 py-2 sm:px-4 sm:py-3 mb-2 
        w-fit max-w-[80%] sm:max-w-md
        text-sm shadow-sm
        ${bubbleClasses}
      `}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-medium ${isCurrentUser || isAdvisor ? 'text-white/90' : 'text-gray-700'}`}>
          {message.sender_username}
          {isAdvisor && ' (Orientador)'}
        </span>
        <span className={`text-xs ${isCurrentUser || isAdvisor ? 'text-white/70' : 'text-gray-500'}`}>
          {formattedTime}
        </span>
      </div>
      <p className={`break-words ${isCurrentUser || isAdvisor ? 'text-white' : 'text-gray-800'}`}>
        {message.content}
      </p>
    </motion.div>
  );
};

interface DateSeparatorProps {
  date: string;
}

const DateSeparator = ({ date }: DateSeparatorProps) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex justify-center my-4"
  >
    <span className="px-4 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 shadow-sm">
      {date}
    </span>
  </motion.div>
);

export default function PrivateChat({
  conversationId,
  currentUserId,
  currentUserType,
  initialMessages = [],
  onError
}: PrivateChatProps) {
  // States
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [totalMessages, setTotalMessages] = useState(0);
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const isInitialLoadRef = useRef(true);
  const previousScrollHeightRef = useRef(0);

  const SOCKET_RETRY_DELAY = 3000;
  const SOCKET_MAX_RETRIES = 3;

  const sortMessages = (msgs: ChatMessage[]) =>
    [...msgs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const handleError = useCallback((error: Error) => {
    console.error(error);
    onError ? onError(error) : toast.error(error.message);
  }, [onError]);

  const fetchTokenFromServer = async (): Promise<string | null> => {
    try {
      const response = await fetch('/api/auth/token');
      if (!response.ok) throw new Error('Falha ao obter token de autenticação');
      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      handleError(error instanceof Error ? error : new Error('Erro desconhecido'));
      return null;
    }
  };

  function getInterlocutorName(msgs: ChatMessage[], userId: number): string {
    // First try to find a message from another participant
    const otherMessage = msgs.find(m => m.sender !== userId);
    if (otherMessage) return otherMessage.sender_username;

    // If not found, look for a message from the current user to get the recipient
    const myMessage = msgs.find(m => m.sender === userId);
    if (myMessage) return myMessage.recipient_username;

    // If there are no messages
    return "Nova conversa";
  }

  useEffect(() => {
    if (messages.length > 0) {
      const interlocutorName = getInterlocutorName(messages, currentUserId);
      setChatInfo({
        name: interlocutorName,
        status: "Online"
      });
    } else {
      setChatInfo({
        name: "Nova conversa",
        status: "Online"
      });
    }
  }, [messages, currentUserId]);

  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      try {
        const token = await fetchTokenFromServer();
        if (!token) throw new Error('Token de autenticação não disponível');
        setAccessToken(token);
      } catch (error) {
        handleError(error instanceof Error ? error : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    };
    initialize();
  }, [handleError]);

  const fetchMessages = useCallback(async (url?: string) => {
    if (!accessToken) return;
    const isInitialLoad = !url;
    isInitialLoad ? setIsLoading(true) : setIsLoadingMore(true);
    try {
      const apiUrl = url || `${process.env.NEXT_PUBLIC_API_URL}/chat/conversations/${conversationId}/messages/`;
      const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${accessToken}` } });
      if (!response.ok) throw new Error(`Erro ao buscar mensagens: ${response.status}`);
      const data: MessagePagination = await response.json();

      setTotalMessages(data.count);
      setNextPageUrl(data.next);
      setHasMoreMessages(!!data.next);

      if (isInitialLoad) {
        setMessages(sortMessages(data.results));
      } else {
        setMessages(prev => [...sortMessages(data.results), ...prev]);
      }
      return data;
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      handleError(error instanceof Error ? error : new Error('Falha ao carregar mensagens'));
      return null;
    } finally {
      isInitialLoad ? setIsLoading(false) : setIsLoadingMore(false);
    }
  }, [accessToken, conversationId, handleError]);

  useEffect(() => {
    if (accessToken) {
      fetchMessages();
    }
  }, [accessToken, fetchMessages]);

  const loadMoreMessages = useCallback(() => {
    if (nextPageUrl && !isLoadingMore) {
      if (messagesContainerRef.current) {
        previousScrollHeightRef.current = messagesContainerRef.current.scrollHeight;
      }
      fetchMessages(nextPageUrl);
    }
  }, [nextPageUrl, isLoadingMore, fetchMessages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop < 20 && hasMoreMessages && !isLoadingMore) {
        previousScrollHeightRef.current = container.scrollHeight;
        loadMoreMessages();
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMoreMessages, isLoadingMore, loadMoreMessages]);

  useEffect(() => {
    if (!isLoadingMore && messagesContainerRef.current && previousScrollHeightRef.current > 0) {
      const container = messagesContainerRef.current;
      const newScrollHeight = container.scrollHeight;
      if (newScrollHeight > previousScrollHeightRef.current) {
        container.scrollTop = newScrollHeight - previousScrollHeightRef.current;
        previousScrollHeightRef.current = 0;
      }
    }
  }, [messages, isLoadingMore]);

  const setupWebSocket = useCallback(() => {
    if (!accessToken) return;
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    try {
      const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/ws/chat/${conversationId}/?token=${accessToken}`);
      ws.onopen = () => {
        console.log("✅ WebSocket conectado!");
        setIsSocketConnected(true);
        retryCountRef.current = 0;
      };
      ws.onerror = (error) => {
        console.error("❌ Erro no WebSocket:", error);
        setIsSocketConnected(false);
      };
      ws.onclose = (event) => {
        console.log(" WebSocket fechado:", event.reason);
        setIsSocketConnected(false);
        if (retryCountRef.current < SOCKET_MAX_RETRIES) {
          retryCountRef.current += 1;
          setTimeout(setupWebSocket, SOCKET_RETRY_DELAY);
        } else {
          toast.error("Falha na conexão do chat. Tente recarregar a página.");
        }
      };
      ws.onmessage = (event) => {
        console.log(" Mensagem recebida:", event.data);
        try {
          const data = JSON.parse(event.data);
          const newMsg: ChatMessage = {
            id: data.id || Date.now(),
            conversation: conversationId,
            sender: data.sender || currentUserId || 0,
            sender_username: data.sender_username,
            recipient_username: data.recipient_username || "",
            content: data.message,
            timestamp: data.timestamp || new Date().toISOString(),
            read: false
          };
          setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg]);
          setTotalMessages(prev => prev + 1);
        } catch (error) {
          console.error('Erro ao processar mensagem:', error);
        }
      };
      socketRef.current = ws;
    } catch (error) {
      console.error("Erro ao configurar WebSocket:", error);
      handleError(new Error('Falha ao configurar conexão do chat'));
    }
  }, [accessToken, conversationId, currentUserId, handleError]);

  useEffect(() => {
    if (accessToken) setupWebSocket();
    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [accessToken, setupWebSocket]);

  const sendMessage = useCallback(() => {
    if (!newMessage.trim() || !socketRef.current || !isSocketConnected) {
      if (!isSocketConnected && newMessage.trim()) {
        toast.error("Chat desconectado. Reconectando...");
        setupWebSocket();
      }
      return;
    }
    setIsSending(true);
    try {
      const payload = { message: newMessage.trim() };
      console.log(" Enviando mensagem:", payload);
      socketRef.current.send(JSON.stringify(payload));
      setNewMessage("");
      messageInputRef.current?.focus();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Falha ao enviar mensagem. Tente novamente.");
    } finally {
      setIsSending(false);
    }
  }, [newMessage, isSocketConnected, setupWebSocket]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isInitialLoadRef.current || (messages.length > 0 && messages[messages.length - 1]?.sender === currentUserId)) {
      scrollToBottom();
      if (isInitialLoadRef.current) isInitialLoadRef.current = false;
    }
  }, [messages, scrollToBottom, currentUserId]);

  const isCurrentUser = useCallback((senderId: number) => senderId === currentUserId, [currentUserId]);
  const isAdvisor = useCallback((senderId: number, username: string) => 
    currentUserType === 'advisor' ? senderId === currentUserId : senderId !== currentUserId && currentUserType !== 'student',
    [currentUserId, currentUserType]);

  const formatDate = useCallback((timestamp: string) => {
    const dateObj = new Date(timestamp);
    return {
      time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: dateObj.toLocaleDateString()
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <Spinner />
            <p className="mt-4 text-gray-600">Carregando conversa...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-3 py-3 bg-white border-b border-gray-200 flex items-center"
      >
        <div className="flex items-center flex-1">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
              {chatInfo?.name ? chatInfo.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-800">{chatInfo?.name || "Carregando..."}</h3>
            <div className="flex items-center text-xs text-gray-500">
              <span className={`inline-block w-2 h-2 rounded-full mr-1 ${isSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{isSocketConnected ? 'Online' : 'Desconectado'}</span>
              <span className="mx-1">•</span>
              <span>{totalMessages} mensagens</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 bg-gradient-to-b from-gray-50 to-white min-h-[50vh]"
      >
        {isLoadingMore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-2">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <Spinner />
              <span className="text-sm text-gray-600">Carregando mensagens anteriores...</span>
            </div>
          </motion.div>
        )}
        {hasMoreMessages && !isLoadingMore && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-2">
            <button
              onClick={loadMoreMessages}
              className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Carregar mensagens anteriores
            </button>
          </motion.div>
        )}
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex h-full items-center justify-center"
          >
            <div className="text-center p-8 w-full">
              <div className="bg-blue-100 rounded-full p-6 inline-block mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhuma mensagem ainda</h3>
              <p className="text-gray-600 mb-8">Seja o primeiro a iniciar esta conversa!</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={() => messageInputRef.current?.focus()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
                >
                  Iniciar conversa
                </button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => {
                const isUser = isCurrentUser(msg.sender);
                const isAdv = isAdvisor(msg.sender, msg.sender_username);
                const formattedDate = formatDate(msg.timestamp);
                const showDate = index === 0 || formattedDate.date !== formatDate(messages[index - 1].timestamp).date;
                return (
                  <motion.div key={msg.id} layout>
                    {showDate && <DateSeparator date={formattedDate.date} />}
                    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
                      <MessageBubble
                        message={msg}
                        isCurrentUser={isUser}
                        isAdvisor={isAdv}
                        formattedTime={formattedDate.time}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-3 bg-gray-50 border-t border-gray-200"
      >
        <div className="relative flex items-center bg-white rounded-full shadow-sm border border-gray-200 overflow-hidden">
          <button className="p-3 text-gray-500 hover:text-blue-600 transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <textarea
            ref={messageInputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Digite sua mensagem..."
            disabled={!isSocketConnected || isSending}
            className="flex-1 py-3 px-2 text-gray-700 focus:outline-none bg-transparent disabled:text-gray-400 resize-y overflow-auto max-h-40 w-full text-sm"
            style={{ minHeight: '60px' }}
          />
          <button className="p-3 text-gray-500 hover:text-blue-600 transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            disabled={!isSocketConnected || !newMessage.trim() || isSending}
            className={`px-6 py-3 rounded-r-full flex items-center justify-center transition-colors ${isSocketConnected && newMessage.trim() && !isSending
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isSending ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                <span>Enviando</span>
              </span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </motion.button>
        </div>
        <div className="flex justify-between px-2 pt-2">
          <div className="flex items-center text-xs text-gray-500">
            {!isSocketConnected && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                <span>Desconectado. Tentando reconectar...</span>
              </motion.div>
            )}
          </div>
          <div className="text-xs text-gray-500 italic">
            {/* Typing status will appear here */}
          </div>
        </div>
      </motion.div>
    </div>
  );
}