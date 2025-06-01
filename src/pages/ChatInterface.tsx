import { useState, useEffect, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatInput } from "@/components/ChatInput";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ModelSelector } from "@/components/ModelSelector";
import { ModelBadge } from "@/components/ModelBadge";
import { ModelSuggestions } from "@/components/ModelSuggestions";
import { PricingPlans } from "@/components/PricingPlans";
import { Menu, Settings as SettingsIcon, ArrowLeft } from "lucide-react";
import { Settings } from "@/components/Settings";

export default function ChatInterface() {
  const { isAuthenticated, user } = useAuth();
  const { currentChat, isLoading, activeModel } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages, isLoading]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FEF7E6] dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Chat Sidebar */}
      <ChatSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onPricingClick={() => setShowPricing(true)}
      />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-yellow-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {showPricing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPricing(false)}
                className="mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              {!showPricing && (
                <img 
                  src="/lovable-uploads/bbc968a1-8e46-4e62-bcf3-efbf9d7de558.png" 
                  alt="Moseb AI Logo" 
                  className="h-10 w-10"
                />
              )}
              <span className="font-bold text-xl text-red-500">
                {showPricing ? "API Pricing" : ""}
              </span>
            </div>
            
            {!showPricing && (
              <div className="flex-1">
                <ModelSelector />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2 hidden sm:block">
              {user?.name || 'Guest'}
            </span>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setSettingsOpen(true)}
              title="Settings"
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {showPricing ? (
            <div className="h-full overflow-y-auto">
              <PricingPlans />
            </div>
          ) : (
            <div className="h-full flex flex-col overflow-hidden">
              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                {currentChat && currentChat.messages.length > 0 ? (
                  <div className="space-y-0">
                    {currentChat.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-center space-y-4 max-w-xl">
                      <div className="mb-6 flex flex-col items-center gap-3">
                        <img 
                          src="/lovable-uploads/bbc968a1-8e46-4e62-bcf3-efbf9d7de558.png" 
                          alt="Moseb AI Logo" 
                          className="h-24 w-24"
                        />
                      </div>
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        How can I help you today?
                      </h2>
                      <div className="flex justify-center">
                        <ModelBadge model={activeModel} className="text-sm" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                        Ask me anything, from simple questions to complex problems. I'm here to assist with information, creative tasks, and more.
                      </p>
                      <div className="mt-6 w-full">
                        <ModelSuggestions model={activeModel} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-yellow-200 dark:border-gray-700">
                <ChatInput />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings Dialog */}
      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
