import { ComingSoon } from "@/components/ui/ComingSoon";
import { Users } from "lucide-react";

export default function StaffPage() {
  return (
    <ComingSoon
      title="Staff Management"
      description="Manage staff members, schedules, attendance, and roles"
      icon={Users}
    />
  );
}
