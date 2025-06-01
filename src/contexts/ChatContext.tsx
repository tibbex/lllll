import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AIModel = 'moseb-ai' | 'moseb-reason' | 'moseb-code';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model: AIModel;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  model: AIModel;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  activeModel: AIModel;
  setActiveModel: (model: AIModel) => void;
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  clearChat: (chatId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [activeModel, setActiveModel] = useState<AIModel>('moseb-ai');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load chats from localStorage on initial load
  useEffect(() => {
    const storedChats = localStorage.getItem('mosebChats');
    if (storedChats) {
      try {
        const parsedChats = JSON.parse(storedChats).map((chat: any) => ({
          ...chat,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChats(parsedChats);
        
        // Set current chat to the most recent one if it exists
        if (parsedChats.length > 0) {
          setCurrentChat(parsedChats[0]);
        } else {
          createInitialChat();
        }
      } catch (error) {
        console.error('Failed to parse stored chats', error);
        createInitialChat();
      }
    } else {
      createInitialChat();
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('mosebChats', JSON.stringify(chats));
    }
  }, [chats]);

  // Generate a title after 3-5 messages
  const generateTitleFromMessages = (messages: Message[]): string => {
    if (messages.length < 1) return 'New Chat';
    
    // Use the first user message as a title
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      // Attempt to parse if it's an image generation message
      try {
        const parsedContent = JSON.parse(firstUserMessage.content);
        if (parsedContent && parsedContent.type === "image-generation") {
          return `Image: ${parsedContent.content.slice(0, 30)}${parsedContent.content.length > 30 ? '...' : ''}`;
        }
      } catch (e) {
        // Not an image message, continue with normal title extraction
      }
      
      // Truncate and clean up the message for a title
      let title = firstUserMessage.content.slice(0, 30);
      if (firstUserMessage.content.length > 30) title += '...';
      return title;
    }
    return 'New Chat';
  };

  const createInitialChat = () => {
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      title: 'New Chat',
      messages: [],
      model: activeModel,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setChats([newChat]);
    setCurrentChat(newChat);
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      title: 'New Chat',
      messages: [],
      model: activeModel,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChat(newChat);
  };

  const selectChat = (chatId: string) => {
    const selected = chats.find(chat => chat.id === chatId);
    if (selected) {
      setCurrentChat(selected);
    }
  };

  const deleteChat = (chatId: string) => {
    setChats(prevChats => {
      const updatedChats = prevChats.filter(chat => chat.id !== chatId);
      
      // If we're deleting the current chat, select another one
      if (currentChat && currentChat.id === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChat(updatedChats[0]);
        } else {
          // Create a new chat if we deleted the last one
          const newChat: Chat = {
            id: `chat_${Date.now()}`,
            title: 'New Chat',
            messages: [],
            model: activeModel,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          setCurrentChat(newChat);
          return [newChat];
        }
      }
      
      return updatedChats;
    });
  };

  const clearChat = (chatId: string) => {
    setChats(prevChats => 
      prevChats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [],
            updatedAt: new Date()
          };
        }
        return chat;
      })
    );

    if (currentChat?.id === chatId) {
      setCurrentChat(prev => prev ? {
        ...prev,
        messages: [],
        updatedAt: new Date()
      } : null);
    }
  };

  // Check if content is an image generation request
  const isImageGeneration = (content: string): boolean => {
    try {
      const parsed = JSON.parse(content);
      return parsed && parsed.type === "image-generation";
    } catch (e) {
      return false;
    }
  };

  // API call to OpenRouter based on the selected model
  const callOpenRouterAPI = async (message: string, model: AIModel): Promise<string> => {
    try {
      // Check if this is an image generation request
      if (isImageGeneration(message)) {
        // Skip AI generation for image requests
        return message;
      }
      
      let response;
      
      if (model === 'moseb-ai') {
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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",
            "HTTP-Referer": window.location.href,
            "X-Title": "Moseb AI",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "mistralai/mistral-small-3.1-24b-instruct:free",
            "messages": [
              {
                "role": "user",
                "content": [
                  {
                    "type": "text",
                    "text": message
                  }
                ]
              }
            ]
          })
        });
      } else if (model === 'moseb-reason') {
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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",
            "HTTP-Referer": window.location.href,
            "X-Title": "Moseb AI",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "nvidia/llama-3.1-nemotron-ultra-253b-v1:free",
            "messages": [
              {
                "role": "user",
                "content": message
              }
            ]
          })
        });
      } else if (model === 'moseb-code') {
        response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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",
            "HTTP-Referer": window.location.href,
            "X-Title": "Moseb AI",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "deepseek/deepseek-prover-v2:free",
            "messages": [
              {
                "role": "user",
                "content": message
              }
            ]
          })
        });
      }

      if (!response || !response.ok) {
        throw new Error('Failed to get response from API');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'No response from the AI.';
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat) return;
    
    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date(),
      model: activeModel
    };

    // Update the current chat and chats array
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage],
      updatedAt: new Date()
    };

    setCurrentChat(updatedChat);
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      )
    );

    // Skip AI response for image generation requests
    if (isImageGeneration(content)) {
      // For image generation, we directly add the assistant response
      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        content: content, // Pass through the image data
        role: 'assistant',
        timestamp: new Date(),
        model: activeModel
      };
      
      // Update with image response
      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMessage],
        updatedAt: new Date()
      };

      setCurrentChat(finalChat);
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChat.id ? finalChat : chat
        )
      );
      
      return;
    }

    // Generate AI response from API for normal text messages
    setIsLoading(true);
    try {
      const aiResponse = await callOpenRouterAPI(content, activeModel);
      
      // Create AI message
      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        model: activeModel
      };

      // Generate a title if this is the 3rd message exchange
      let chatTitle = updatedChat.title;
      const messageCount = updatedChat.messages.length;
      if ((messageCount === 3 || messageCount === 5) && chatTitle === 'New Chat') {
        chatTitle = generateTitleFromMessages(updatedChat.messages);
      }

      // Update with AI response
      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, aiMessage],
        title: chatTitle,
        updatedAt: new Date()
      };

      setCurrentChat(finalChat);
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChat.id ? finalChat : chat
        )
      );
    } catch (error) {
      console.error('Failed to generate AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider 
      value={{
        chats,
        currentChat,
        activeModel,
        setActiveModel,
        isLoading,
        sendMessage,
        createNewChat,
        selectChat,
        deleteChat,
        clearChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
