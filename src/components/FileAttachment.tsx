import React from "react";
import { X, FileImage, FileText, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileAttachmentProps {
  file: File;
  onRemove: () => void;
}

export function FileAttachment({ file, onRemove }: FileAttachmentProps) {
  // Empty implementation since this feature is now removed
  return null;
}

export function FileAttachmentList({ files, onRemove }: { files: File[], onRemove: (index: number) => void }) {
  // Empty implementation since this feature is now removed
  return null;
}
