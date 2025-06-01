
import { useChat } from "@/contexts/ChatContext";
import { BrainCircuit, Code, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export function TypingIndicator() {
  const { activeModel } = useChat();
  
  return (
    <div className="flex items-center gap-3 py-4">
      <div className={cn(
        "h-8 w-8 flex items-center justify-center rounded-full",
        activeModel === "moseb-ai" && "bg-red-500",
        activeModel === "moseb-reason" && "bg-teal-600",
        activeModel === "moseb-code" && "bg-yellow-600",
      )}>
        {activeModel === "moseb-ai" && <BrainCircuit className="h-4 w-4 text-white" />}
        {activeModel === "moseb-reason" && <Lightbulb className="h-4 w-4 text-white" />}
        {activeModel === "moseb-code" && <Code className="h-4 w-4 text-white" />}
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-4 py-3 rounded-lg">
        <span className="typing-dot" style={{ animationDelay: "0s" }}></span>
        <span className="typing-dot" style={{ animationDelay: "0.2s" }}></span>
        <span className="typing-dot" style={{ animationDelay: "0.4s" }}></span>
      </div>
    </div>
  );
}
