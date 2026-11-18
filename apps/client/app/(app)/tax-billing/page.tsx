import { ComingSoon } from "@/components/ui/ComingSoon";
import { Receipt } from "lucide-react";

export default function TaxBillingPage() {
  return (
    <ComingSoon
      title="Tax & Billing Settings"
      description="Configure GST, tax rates, and invoice templates"
      icon={Receipt}
    />
  );
}
