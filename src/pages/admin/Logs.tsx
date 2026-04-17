import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Log {
  id: string;
  actor_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(200).then(({ data }) => {
      setLogs((data ?? []) as Log[]);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity logs</h1>
        <p className="text-muted-foreground">Audit trail of admin actions.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <p className="p-12 text-center text-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <div className="divide-y">
              {logs.map((l) => (
                <div key={l.id} className="flex items-start justify-between p-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{l.action}</Badge>
                      {l.entity_type && <span className="text-xs text-muted-foreground">{l.entity_type}</span>}
                    </div>
                    <p className="text-muted-foreground">{l.actor_email ?? "system"}</p>
                    {l.details && <pre className="mt-1 max-w-2xl overflow-auto rounded bg-muted p-2 text-xs">{JSON.stringify(l.details, null, 2)}</pre>}
                  </div>
                  <span className="whitespace-nowrap text-xs text-muted-foreground">{format(new Date(l.created_at), "PPp")}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;
