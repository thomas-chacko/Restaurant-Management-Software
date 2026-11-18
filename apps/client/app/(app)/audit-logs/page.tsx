import { ComingSoon } from "@/components/ui/ComingSoon";
import { FileText } from "lucide-react";

export default function AuditLogsPage() {
  return (
    <ComingSoon
      title="Audit Logs"
      description="View all money-sensitive actions and system audit trail"
      icon={FileText}
    />
  );
}
