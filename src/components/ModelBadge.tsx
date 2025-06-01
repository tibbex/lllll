
import { type AIModel } from "@/contexts/ChatContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BrainCircuit, Code, Lightbulb } from "lucide-react";

interface ModelBadgeProps {
  model: AIModel;
  className?: string;
}

export function ModelBadge({ model, className }: ModelBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium border flex items-center gap-1.5", 
        className,
        model === "moseb-ai" && "bg-yellow-500/10 text-red-500 border-red-500/30",
        model === "moseb-reason" && "bg-teal-500/10 text-teal-600 border-teal-500/30",
        model === "moseb-code" && "bg-yellow-500/10 text-yellow-600 border-yellow-500/30"
      )}
    >
      {model === "moseb-ai" && <BrainCircuit className="h-3 w-3" />}
      {model === "moseb-reason" && <Lightbulb className="h-3 w-3" />}
      {model === "moseb-code" && <Code className="h-3 w-3" />}
      
      {model === "moseb-ai" && "Moseb AI"}
      {model === "moseb-reason" && "Moseb Reason"}
      {model === "moseb-code" && "Moseb Code"}
    </Badge>
  );
}
