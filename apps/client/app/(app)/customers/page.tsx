import { ComingSoon } from "@/components/ui/ComingSoon";
import { UserCircle } from "lucide-react";

export default function CustomersPage() {
  return (
    <ComingSoon
      title="Customer Management"
      description="Manage customer database, order history, and loyalty programs"
      icon={UserCircle}
    />
  );
}
