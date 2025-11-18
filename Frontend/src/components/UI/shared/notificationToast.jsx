// components/ui/shared/NotificationToast.jsx
import { useToast } from "@/components/ui/use-toast";

export function NotificationToast({ title, description, variant = "default" }) {
  const { toast } = useToast();

  toast({
    title,
    description,
    variant, // "default", "destructive", "success"
  });

  return null; // no UI, just triggers toast
}
