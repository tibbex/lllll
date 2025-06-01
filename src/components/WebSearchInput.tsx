
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface WebSearchInputProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function WebSearchInput({ onSearch, isSearching }: WebSearchInputProps) {
  const [query, setQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    onSearch(query);
    toast({
      title: "Web search initiated",
      description: `Searching for: ${query}`,
    });
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the web..."
        className="flex-1"
        disabled={isSearching}
      />
      <Button
        type="submit"
        disabled={!query.trim() || isSearching}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </form>
  );
}
