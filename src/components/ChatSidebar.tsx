import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare, Trash2, X, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onPricingClick?: () => void;
}

export function ChatSidebar({ isOpen, onClose, onPricingClick }: ChatSidebarProps) {
  const { chats, currentChat, createNewChat, selectChat, deleteChat, clearChat } = useChat();
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  return (
    <div 
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex flex-col w-72 bg-[#FDF3E0] dark:bg-gray-800 border-r border-yellow-200 dark:border-gray-700 transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:relative"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-yellow-200 dark:border-gray-700">
        <div className="flex items-center justify-center flex-1">
          <img 
            src="/lovable-uploads/bbc968a1-8e46-4e62-bcf3-efbf9d7de558.png" 
            alt="Moseb AI Logo" 
            className="h-12 w-12"
          />
        </div>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="p-4 space-y-2">
        <Button 
          onClick={createNewChat} 
          className="w-full flex gap-2 bg-red-500 hover:bg-red-600 text-white" 
        >
          <Plus className="h-5 w-5" />
          New Chat
        </Button>
        
        <Button 
          onClick={() => {
            onPricingClick?.();
            if (isMobile) {
              onClose();
            }
          }}
          variant="outline"
          className="w-full flex gap-2" 
        >
          <CreditCard className="h-5 w-5" />
          API Pricing
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="space-y-1 p-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className="relative"
              onMouseEnter={() => setHoveredChatId(chat.id)}
              onMouseLeave={() => setHoveredChatId(null)}
            >
              <Button
                variant={currentChat?.id === chat.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left truncate h-auto py-3 px-3",
                  currentChat?.id === chat.id ? "bg-yellow-100 dark:bg-gray-700" : "",
                  "dark:text-white text-black"
                )}
                onClick={() => {
                  selectChat(chat.id);
                  if (isMobile) {
                    onClose();
                  }
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2 shrink-0" />
                <span className="truncate">{chat.title}</span>
              </Button>
              
              {(hoveredChatId === chat.id || (isMobile && currentChat?.id === chat.id)) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
