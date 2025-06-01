
import { type Message } from "@/contexts/ChatContext";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Book, Smile, RefreshCw, Download } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useChat } from "@/contexts/ChatContext";
import { toast } from "sonner";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { sendMessage } = useChat();
  const isUser = message.role === "user";
  
  // Function to extract code blocks from markdown
  const extractCodeBlocks = (content: string): string => {
    const codeBlockRegex = /```[\s\S]*?```/g;
    const matches = content.match(codeBlockRegex);
    if (!matches) return "";
    return matches.join('\n\n').replace(/```[\w]*/g, '').replace(/```/g, '').trim();
  };
  
  // Define model-specific styling
  const getModelColor = (model: string) => {
    switch (model) {
      case "moseb-ai":
        return "bg-red-500";
      case "moseb-reason":
        return "bg-teal-600";
      case "moseb-code":
        return "bg-blue-600";
      default:
        return "bg-red-500";
    }
  };

  // Check if the message contains image generation data
  const checkForImageGeneration = () => {
    try {
      // Try to parse the message content as JSON
      const parsedContent = JSON.parse(message.content);
      if (parsedContent && parsedContent.type === "image-generation" && parsedContent.imageUrl) {
        return parsedContent;
      }
    } catch (e) {
      // Not JSON or not an image generation message
      return null;
    }
    return null;
  };
  
  const imageData = checkForImageGeneration();

  // Function to regenerate an image
  const handleRegenerateImage = async () => {
    if (!imageData) return;
    setIsRegenerating(true);
    
    try {
      await sendMessage(`create an image of ${imageData.content}`);
    } catch (error) {
      console.error("Error regenerating image:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Function to download the image
  const handleDownloadImage = async () => {
    if (!imageData) return;
    
    try {
      // Fetch the image and convert it to blob
      const response = await fetch(imageData.imageUrl);
      
      if (!response.ok) {
        throw new Error('Failed to download image');
      }
      
      const blob = await response.blob();
      
      // Create a URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create an anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Generate a filename based on content with timestamp
      const filename = `${imageData.content.slice(0, 20).replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.png`;
      link.download = filename;
      
      // Append to body, click and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Release the blob URL
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast.error('Failed to download image. Please try again.');
    }
  };
  
  return (
    <div className={cn("flex items-start gap-3 py-4 relative", 
      isUser ? "justify-end" : ""
    )}>
      {!isUser && (
        <Avatar className={cn("h-8 w-8 text-white", getModelColor(message.model))}>
          {message.model === 'moseb-ai' ? (
            <Book className="h-4 w-4" />
          ) : (
            <span className="text-xs font-semibold">AI</span>
          )}
        </Avatar>
      )}
      
      <div className={cn(
        "rounded-lg px-4 py-3 max-w-[80%] animate-fade-in relative group",
        isUser 
          ? "bg-yellow-500 text-white" 
          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      )}>
        {!isUser && !imageData && (
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={message.content} />
            {message.model === 'moseb-code' && extractCodeBlocks(message.content) && (
              <CopyButton text={extractCodeBlocks(message.content)} variant="codeOnly" className="ml-1" />
            )}
          </div>
        )}
        
        {imageData ? (
          <div className="space-y-3">
            <p className="mb-2 font-medium">Generated image of: {imageData.content}</p>
            <div className="relative">
              <img 
                src={imageData.imageUrl} 
                alt={`Generated: ${imageData.content}`}
                className="w-full rounded-lg shadow-md"
              />
              <div className="mt-2 flex justify-end gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleRegenerateImage}
                  disabled={isRegenerating}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  {isRegenerating ? 'Generating...' : 'Regenerate'}
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleDownloadImage}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        ) : isUser && message.content.toLowerCase().startsWith("create an image of") ? (
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>
        ) : message.role === "assistant" ? (
          <ReactMarkdown
            className="prose prose-sm dark:prose-invert max-w-none"
            components={{
              code(props) {
                const { children, className, ...rest } = props;
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <div className="bg-gray-200 dark:bg-gray-700 rounded p-2 my-2 overflow-x-auto">
                    <code className="text-sm" {...rest}>
                      {children}
                    </code>
                  </div>
                ) : (
                  <code className="bg-gray-200 dark:bg-gray-700 rounded px-1 py-0.5" {...rest}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
          <Smile className="h-4 w-4" />
        </Avatar>
      )}
    </div>
  );
}
