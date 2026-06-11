import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Row = { label: string; scans: number };

export function BreakdownCard({
  title,
  icon,
  data,
  chartVar = "--chart-1",
}: {
  title: string;
  icon?: React.ReactNode;
  data: Row[];
  chartVar?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.scans));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Noch keine Daten.
          </p>
        ) : (
          <div className="grid gap-2.5">
            {data.map((d) => (
              <div key={d.label} className="grid gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{d.label}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {d.scans}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(d.scans / max) * 100}%`,
                      backgroundColor: `var(${chartVar})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
