import { ComingSoon } from "@/components/ui/ComingSoon";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <ComingSoon
      title="Settings"
      description="Configure system settings, integrations, and preferences"
      icon={Settings}
    />
  );
}
