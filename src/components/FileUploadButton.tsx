import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadButtonProps {
  onFileUpload: (files: File[]) => void;
  isUploading: boolean;
  disabled?: boolean;
}

export function FileUploadButton({ onFileUpload, isUploading, disabled = false }: FileUploadButtonProps) {
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      const fileArray = Array.from(files);
      onFileUpload(fileArray);
      
      // Reset the input
      e.target.value = "";
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your file(s)",
        variant: "destructive",
      });
      
      // Reset the input on error too
      e.target.value = "";
    }
  };

  return (
    <div>
      <input
        type="file"
        id="fileUpload"
        multiple
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-gray-500 hover:text-blue-500"
        title="Attach files"
        onClick={() => document.getElementById("fileUpload")?.click()}
        disabled={isUploading || disabled}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
    </div>
  );
}
