
import { useChat, type AIModel } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";

interface SuggestionsProps {
  model: AIModel;
}

export function ModelSuggestions({ model }: SuggestionsProps) {
  const { sendMessage } = useChat();

  const suggestions = {
    "moseb-ai": [
      "Explain the history of artificial intelligence",
      "Write a short poem about nature",
      "What are the best travel destinations in 2025?",
      "Tell me about traditional Moroccan cooking"
    ],
    "moseb-reason": [
      "Compare and contrast quantum computing with classical computing",
      "Analyze the implications of climate change on global agriculture",
      "What are the ethical considerations in AI development?",
      "Explain the philosophical concept of existentialism"
    ],
    "moseb-code": [
      "Write a React component for a responsive navigation bar",
      "How do I implement a binary search tree in Python?",
      "Create a SQL query to analyze customer purchase patterns",
      "Explain how to use async/await in JavaScript"
    ],
  };

  const currentSuggestions = suggestions[model] || [];

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-3xl mx-auto">
      {currentSuggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          onClick={() => handleSuggestionClick(suggestion)}
          className="text-sm text-left h-auto py-3 px-4 whitespace-normal overflow-hidden overflow-ellipsis"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
