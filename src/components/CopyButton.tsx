
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CopyButtonProps {
  text: string;
  variant?: "default" | "codeOnly";
  className?: string;
}

export function CopyButton({ text, variant = "default", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: variant === "codeOnly" ? "Code copied to clipboard" : "Text copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`h-7 w-7 rounded-full transition-colors ${className}`}
      onClick={handleCopy}
      title={variant === "codeOnly" ? "Copy code" : "Copy text"}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
