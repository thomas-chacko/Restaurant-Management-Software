import { ComingSoon } from "@/components/ui/ComingSoon";
import { Package } from "lucide-react";

export default function InventoryPage() {
  return (
    <ComingSoon
      title="Inventory Management"
      description="Track stock levels, low stock alerts, and inventory movements"
      icon={Package}
    />
  );
}
