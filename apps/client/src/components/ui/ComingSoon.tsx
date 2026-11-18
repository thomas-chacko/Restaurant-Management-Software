import { Card, CardContent } from "./card";
import { LucideIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function ComingSoon({ title, description, icon: Icon }: ComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
              <Icon className="h-8 w-8 text-zinc-400" />
            </div>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-zinc-900">{title}</h2>
          <p className="text-zinc-500">{description}</p>
          <div className="mt-6 inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
            Coming Soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
