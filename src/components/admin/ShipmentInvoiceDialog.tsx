import type { ChangeEvent } from "react";
import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { FileDown, Loader2, Plus, Receipt, Trash2, Upload } from "lucide-react";
import logo from "@/assets/cloud-shipment-logo.png";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ReceiptTheme =
  | "ocean"
  | "midnight"
  | "emerald"
  | "slate"
  | "darkNavy"
  | "navy"
  | "royalWhite"
  | "charcoal";

interface ShipmentInvoiceData {
  trackingNumber: string;
  shipmentName: string;
  senderName: string;
  receiverName: string;
  origin: string;
  destination: string;
  shipmentType: string;
  quantity: number;
  weight?: string | null;
  courier?: string | null;
  registeredAt?: string | null;
  estimatedDelivery?: string | null;
  paymentReason?: string | null;
}

interface DynamicField {
  id: string;
  label: string;
  value: string;
}

interface ShipmentInvoiceDialogProps {
  shipment: ShipmentInvoiceData;
  triggerLabel?: string;
  triggerVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const THEMES: Record<ReceiptTheme, { label: string; headerClass: string; chipClass: string }> = {
  ocean: {
    label: "Ocean Blue",
    headerClass: "bg-primary text-primary-foreground",
    chipClass: "bg-primary/12 text-primary",
  },
  midnight: {
    label: "Midnight Black",
    headerClass: "bg-foreground text-background",
    chipClass: "bg-foreground/10 text-foreground",
  },
  emerald: {
    label: "Emerald Green",
    headerClass: "bg-success text-success-foreground",
    chipClass: "bg-success/12 text-success",
  },
  slate: {
    label: "Steel Slate",
    headerClass: "bg-secondary text-secondary-foreground",
    chipClass: "bg-muted text-foreground",
  },
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

export const ShipmentInvoiceDialog = ({
  shipment,
  triggerLabel = "Receipt / Invoice",
  triggerVariant = "outline",
  triggerSize = "sm",
  className,
}: ShipmentInvoiceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ReceiptTheme>("ocean");
  const [shipmentName, setShipmentName] = useState(shipment.shipmentName || `${shipment.shipmentType} Shipment`);
  const [displayFee, setDisplayFee] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [note, setNote] = useState("");
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const summaryFields = useMemo(
    () => [
      { label: "Tracking Number", value: shipment.trackingNumber },
      { label: "Courier", value: shipment.courier || "Cloud Shipment" },
      { label: "Registered", value: formatDate(shipment.registeredAt) },
      { label: "Estimated Delivery", value: formatDate(shipment.estimatedDelivery) },
      { label: "Origin", value: shipment.origin },
      { label: "Destination", value: shipment.destination },
      { label: "Quantity", value: String(shipment.quantity) },
      { label: "Weight", value: shipment.weight || "—" },
    ],
    [shipment],
  );

  const addField = () => {
    setDynamicFields((current) => [...current, { id: crypto.randomUUID(), label: "", value: "" }]);
  };

  const updateField = (id: string, key: "label" | "value", value: string) => {
    setDynamicFields((current) => current.map((field) => (field.id === id ? { ...field, [key]: value } : field)));
  };

  const removeField = (id: string) => {
    setDynamicFields((current) => current.filter((field) => field.id !== id));
  };

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file for the receipt logo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCustomLogo(typeof reader.result === "string" ? reader.result : null);
      setLogoName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePdf = async () => {
    if (!contentRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      const imgData = canvas.toDataURL("image/png");
      const ratio = Math.min(width / canvas.width, height / canvas.height);
      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= height;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= height;
      }

      pdf.save(`${shipment.trackingNumber.toLowerCase()}-invoice.pdf`);
      toast.success("Receipt PDF downloaded.");
    } catch (error) {
      toast.error("Could not generate the receipt PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const activeTheme = THEMES[theme];
  const cleanFields = dynamicFields.filter((field) => field.label.trim() || field.value.trim());
  const previewLogo = customLogo || logo;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize} className={className}>
          <Receipt className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Printable shipping label / invoice</DialogTitle>
          <DialogDescription>Customize the header, fee, payment details, note, and extra fields before downloading the PDF.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="space-y-3 rounded-xl border border-border bg-secondary/35 p-4">
              <div className="space-y-2">
                <Label>Receipt Color Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(THEMES).map(([key, option]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTheme(key as ReceiptTheme)}
                      className={cn(
                        "rounded-xl border px-3 py-3 text-left text-sm transition",
                        theme === key ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-accent",
                      )}
                    >
                      <span className={cn("mb-2 block h-3 rounded-full", option.headerClass)} />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shipment-name">Shipment Name</Label>
                <Input id="shipment-name" value={shipmentName} onChange={(e) => setShipmentName(e.target.value)} placeholder="Shipment Name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt-logo">Upload Logo</Label>
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-border bg-background px-3 py-3 text-sm text-muted-foreground hover:bg-accent/50">
                  <span className="truncate">{logoName || "Choose file"}</span>
                  <Upload className="h-4 w-4" />
                  <input id="receipt-logo" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
                <p className="text-xs text-muted-foreground">Logo will be embedded in the generated PDF.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display-fee">Display Fee</Label>
                <Input id="display-fee" value={displayFee} onChange={(e) => setDisplayFee(e.target.value)} placeholder="e.g. $500" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Input id="payment-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="Enter the payment method used" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt-note">Note to appear on receipt</Label>
                <Textarea id="receipt-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for this receipt" />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold">Additional Dynamic Fields</h3>
                  <p className="text-xs text-muted-foreground">Add extra label/value pairs under Additional Info.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addField}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {dynamicFields.length === 0 && <p className="text-sm text-muted-foreground">No extra fields added yet.</p>}
                {dynamicFields.map((field) => (
                  <div key={field.id} className="grid gap-2 rounded-xl border border-border/80 p-3">
                    <Input value={field.label} onChange={(e) => updateField(field.id, "label", e.target.value)} placeholder="Label" />
                    <div className="flex gap-2">
                      <Input value={field.value} onChange={(e) => updateField(field.id, "value", e.target.value)} placeholder="Value" />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeField(field.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="button" className="w-full" onClick={handleGeneratePdf} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
              Download PDF
            </Button>
          </div>

          <div className="rounded-2xl border border-border bg-muted/25 p-4">
            <div ref={contentRef} className="mx-auto w-full max-w-[794px] rounded-[28px] bg-white p-6 text-left text-[hsl(215_45%_12%)] shadow-soft sm:p-8">
              <div className={cn("rounded-[24px] px-6 py-6", activeTheme.headerClass)}>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-4">
                    <img src={previewLogo} alt="Cloud Shipment logo" className="h-20 w-auto max-w-[260px] object-contain brightness-[1.04]" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/70">Shipping Invoice</p>
                      <h2 className="mt-2 text-3xl font-semibold leading-tight">{shipmentName || "Shipment Invoice"}</h2>
                      <p className="mt-2 max-w-xl text-sm text-white/80">
                        Cloud Shipment logistics record for {shipment.senderName} to {shipment.receiverName}.
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm backdrop-blur">
                    <p className="text-white/70">Tracking Number</p>
                    <p className="mt-1 text-lg font-semibold">{shipment.trackingNumber}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Shipment Parties</p>
                  <div className="mt-4 space-y-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sender</p>
                      <p className="font-semibold text-foreground">{shipment.senderName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Receiver</p>
                      <p className="font-semibold text-foreground">{shipment.receiverName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Route</p>
                      <p className="font-semibold text-foreground">
                        {shipment.origin} → {shipment.destination}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Billing Snapshot</p>
                  <div className="mt-4 grid gap-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Display Fee</span>
                      <span className="font-semibold text-foreground">{displayFee || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Payment Method</span>
                      <span className="font-semibold text-foreground">{paymentMethod || shipment.paymentReason || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">Shipment Type</span>
                      <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", activeTheme.chipClass)}>{shipment.shipmentType}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Shipment Summary</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {summaryFields.map((item) => (
                    <div key={item.label} className="rounded-xl bg-secondary/45 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                      <p className="mt-2 text-sm font-semibold text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {note && (
                <div className="mt-6 rounded-2xl border border-border p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Note</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">{note}</p>
                </div>
              )}

              {cleanFields.length > 0 && (
                <div className="mt-6 rounded-2xl border border-border p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Additional Info</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {cleanFields.map((field) => (
                      <div key={field.id} className="rounded-xl border border-border/80 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{field.label || "Custom Field"}</p>
                        <p className="mt-2 text-sm font-semibold text-foreground">{field.value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentInvoiceDialog;