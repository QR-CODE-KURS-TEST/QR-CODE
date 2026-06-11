import { Card, CardContent } from "@/components/ui/card";
import { Hammer } from "lucide-react";

export function ComingSoon({ phase }: { phase: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Hammer className="size-6" />
        </div>
        <p className="text-sm text-muted-foreground">
          Dieser Bereich wird gerade gebaut ({phase}).
        </p>
      </CardContent>
    </Card>
  );
}
