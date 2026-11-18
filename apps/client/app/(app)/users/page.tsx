import { ComingSoon } from "@/components/ui/ComingSoon";
import { Shield } from "lucide-react";

export default function UsersPage() {
  return (
    <ComingSoon
      title="Users & Roles"
      description="Manage user accounts, permissions, and role-based access"
      icon={Shield}
    />
  );
}
