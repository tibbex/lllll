
import { useState, useRef } from "react";
import { useChat } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon, Search, Image, RefreshCw, Download } from "lucide-react";
import { WebSearchInput } from "@/components/WebSearchInput";
import { useToast } from "@/components/ui/use-toast";
import { CommandDialog, Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showWebSearch, setShowWebSearch] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();
  const { sendMessage, isLoading, activeModel } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Check if this is an image generation command
    if (message.trim().toLowerCase().startsWith("create an image of")) {
      const prompt = message.trim().substring("create an image of".length).trim();
      if (prompt) {
        generateImage(prompt);
      } else {
        toast({
          title: "Empty prompt",
          description: "Please specify what image to create after 'create an image of'.",
          variant: "destructive",
        });
      }
      return;
    }

    const userMessage = message;
    setMessage("");
    
    await sendMessage(userMessage);
    
    // Focus back to textarea after sending
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleWebSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Here we would normally call a web search API
      // For now, we'll just simulate it and add the results to the message
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage((prev) => prev + (prev ? "\n\n" : "") + `Web search results for: ${query}\n(Simulated results)`);
      setShowWebSearch(false);
    } finally {
      setIsSearching(false);
    }
  };

  const generateImage = async (promptText?: string) => {
    const imagePrompt = promptText || message.trim();
    
    if (!imagePrompt) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt to generate an image.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      // Encode the prompt for use in the URL
      const encodedPrompt = encodeURIComponent(imagePrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
      
      // Create a preview image to check if it's loading properly
      const img = new window.Image();
      img.src = imageUrl;
      
      // Wait for the image to load or fail
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        // Set a timeout in case it takes too long
        setTimeout(resolve, 5000);
      });
      
      // Send the prompt as a message with image preview data
      const imageMessage = {
        content: promptText || message,
        imageUrl: imageUrl,
        type: "image-generation"
      };
      
      // Clear the input
      setMessage("");
      
      await sendMessage(JSON.stringify(imageMessage));
      
      toast({
        title: "Image generated",
        description: "The image has been added to the chat.",
      });
      
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Function to insert the image generation command
  const insertImageCommand = () => {
    setMessage("create an image of ");
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Position cursor at the end of the text
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  // Get color based on active model
  const getButtonColor = () => {
    switch (activeModel) {
      case "moseb-ai": 
        return "bg-red-500 hover:bg-red-600";
      case "moseb-reason": 
        return "bg-teal-600 hover:bg-teal-700";
      case "moseb-code": 
        return "bg-blue-600 hover:bg-blue-700";
      default: 
        return "bg-red-500 hover:bg-red-600";
    }
  };

  return (
    <div className="space-y-2">
      {showWebSearch && (
        <WebSearchInput 
          onSearch={handleWebSearch}
          isSearching={isSearching}
        />
      )}
      
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Moseb AI..."
          className="pr-24 min-h-[60px] resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          disabled={isLoading || isSearching || isGeneratingImage}
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => setShowWebSearch(!showWebSearch)}
            className="h-8 w-8 text-gray-500 hover:text-blue-500"
            title="Web search"
            disabled={isLoading || isGeneratingImage}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant={isGeneratingImage ? "default" : "ghost"}
            onClick={insertImageCommand}
            className={`h-8 w-8 ${isGeneratingImage ? 'text-white bg-green-500' : 'text-gray-500 hover:text-green-500'}`}
            title="Insert image generation command"
            disabled={isLoading || isSearching || isGeneratingImage}
          >
            <Image className="h-4 w-4" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isLoading || isSearching || isGeneratingImage}
            className={`h-8 w-8 text-white ${getButtonColor()}`}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
