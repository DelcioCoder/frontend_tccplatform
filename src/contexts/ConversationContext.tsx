"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ConversationContextProps {
  conversationId: number | null;
  setConversationId: (id: number) => void;
}

const ConversationContext = createContext<ConversationContextProps>({
  conversationId: null,
  setConversationId: () => {},
});

export function ConversationProvider({ children }: { children: ReactNode }) {
  const [conversationId, setConversationIdState] = useState<number | null>(null);

  // Carregar do localStorage ao inicializar
  useEffect(() => {
    const storedId = localStorage.getItem("conversationId");
    if (storedId) {
      setConversationIdState(Number(storedId));
    }
  }, []);

  // Atualizar o localStorage sempre que o estado mudar
  const setConversationId = (id: number) => {
    localStorage.setItem("conversationId", id.toString());
    setConversationIdState(id);
  };

  return (
    <ConversationContext.Provider value={{ conversationId, setConversationId }}>
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversation() {
  return useContext(ConversationContext);
}
