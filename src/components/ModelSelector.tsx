
import { useChat, type AIModel } from "@/contexts/ChatContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelBadge } from "@/components/ModelBadge";

export function ModelSelector() {
  const { activeModel, setActiveModel } = useChat();

  return (
    <div className="w-full max-w-xs">
      <Select
        value={activeModel}
        onValueChange={(value) => setActiveModel(value as AIModel)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a model">
            {activeModel && (
              <div className="flex items-center">
                <ModelBadge model={activeModel} />
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="moseb-ai">Moseb AI</SelectItem>
          <SelectItem value="moseb-reason">Moseb Reason</SelectItem>
          <SelectItem value="moseb-code">Moseb Code</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
