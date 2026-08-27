import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface EmailRecipient {
  email: string;
  name?: string;
}

interface SendUpdateDialogProps {
  recipients: EmailRecipient[];
  triggerLabel?: string;
  disabled?: boolean;
}

const SendUpdateDialog = ({ recipients, triggerLabel = "Send Update", disabled }: SendUpdateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const validRecipients = recipients.filter((r) => r.email && r.email.trim() !== "");

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in both subject and message.");
      return;
    }
    if (validRecipients.length === 0) {
      toast.error("No valid email addresses in your selection.");
      return;
    }
    setSending(true);
    const { data, error } = await supabase.functions.invoke("send-notification", {
      body: {
        recipients: validRecipients,
        type: "custom",
        data: { subject, message },
      },
    });
    setSending(false);
    if (error) {
      toast.error(error.message || "Failed to send.");
      return;
    }
    const sent = data?.sent ?? 0;
    const failed = data?.failed ?? 0;
    if (failed > 0) {
      toast.warning(`Sent to ${sent}, but ${failed} failed.`);
    } else {
      toast.success(`Email sent to ${sent} recipient${sent === 1 ? "" : "s"}.`);
    }
    setOpen(false);
    setSubject("");
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={disabled || validRecipients.length === 0}>
          <Mail className="h-4 w-4" />
          {triggerLabel} {recipients.length > 0 && `(${recipients.length})`}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send email update</DialogTitle>
          <DialogDescription>
            Sending to {validRecipients.length} recipient{validRecipients.length === 1 ? "" : "s"}:{" "}
            {validRecipients.slice(0, 3).map((r) => r.name || r.email).join(", ")}
            {validRecipients.length > 3 ? ` and ${validRecipients.length - 3} more` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Update on your shipment" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Message</label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message here…" rows={6} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={sending}>Cancel</Button>
          <Button onClick={handleSend} disabled={sending}>{sending ? "Sending…" : "Send"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SendUpdateDialog;
