
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Smile } from "lucide-react";

export function Settings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app with backend, we would update the user profile here
    toast({
      title: "Settings saved",
      description: "Your profile settings have been updated",
    });
    onOpenChange(false);
  };

  const handleToggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-16 w-16 bg-blue-500 text-white">
              {user?.name ? (
                <span className="text-lg font-semibold">{user.name[0].toUpperCase()}</span>
              ) : (
                <Smile className="h-8 w-8" />
              )}
            </Avatar>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="theme-toggle">Dark Mode</Label>
            <Switch
              id="theme-toggle"
              checked={isDarkMode}
              onCheckedChange={handleToggleTheme}
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => logout()}>
              Sign Out
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
