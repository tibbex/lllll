
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function WebSearchButton() {
  const { toast } = useToast();

  const handleWebSearch = () => {
    toast({
      title: "Web search initiated",
      description: "Searching the web for relevant information",
    });
    
    // In a real application, this would trigger a web search API call
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleWebSearch}
      className="border-yellow-300 dark:border-gray-700 hover:bg-yellow-100 dark:hover:bg-gray-700"
    >
      <Search className="h-4 w-4 mr-2" />
      Web Search
    </Button>
  );
}
