import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download, Printer, Image as ImageIcon } from "lucide-react";
import logoUrl from "@/assets/cloud-shipment-logo.png";

type Customer = { id: string; name: string; slug: string; goal_amount: number; tracking_number: string };
type Payment = { id: string; amount: number; reason: string; paid_at: string };

const Statement = () => {
  const { slug = "" } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data: c } = await (supabase as any).from("customers").select("*").eq("slug", slug).maybeSingle();
      if (!c) { setNotFoundState(true); setLoading(false); return; }
      setCustomer(c as Customer);
      const { data: ps } = await (supabase as any).from("payments").select("*").eq("customer_id", (c as Customer).id).order("paid_at", { ascending: true });
      setPayments((ps ?? []) as Payment[]);
      setLoading(false);
    })();
  }, [slug]);

  const renderCanvas = async () => {
    const { default: html2canvas } = await import("html2canvas");
    return html2canvas(sheetRef.current!, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
  };

  const downloadImage = async (type: "image/png" | "image/jpeg") => {
    if (!sheetRef.current) return;
    const canvas = await renderCanvas();
    const ext = type === "image/png" ? "png" : "jpg";
    const url = canvas.toDataURL(type, 0.95);
    const a = document.createElement("a");
    a.href = url;
    a.download = `statement-${slug}.${ext}`;
    a.click();
  };

  const downloadPdf = async () => {
    if (!sheetRef.current) return;
    const [canvas, { default: jsPDF }] = await Promise.all([renderCanvas(), import("jspdf")]);
    const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 36;
    const w = pageW - margin * 2;
    const ratio = w / canvas.width;
    const fullH = canvas.height * ratio;
    const pageContentH = pageH - margin * 2;
    if (fullH <= pageContentH) {
      const img = canvas.toDataURL("image/jpeg", 0.95);
      const x = margin;
      const y = (pageH - fullH) / 2;
      pdf.addImage(img, "JPEG", x, y, w, fullH);
    } else {
      const sliceSrcH = pageContentH / ratio;
      let srcY = 0;
      while (srcY < canvas.height) {
        const sliceH = Math.min(sliceSrcH, canvas.height - srcY);
        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = sliceH;
        const ctx = slice.getContext("2d")!;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, slice.width, slice.height);
        ctx.drawImage(canvas, 0, srcY, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        const sliceImg = slice.toDataURL("image/jpeg", 0.95);
        pdf.addImage(sliceImg, "JPEG", margin, margin, w, sliceH * ratio);
        srcY += sliceH;
        if (srcY < canvas.height) pdf.addPage();
      }
    }
    pdf.save(`statement-${slug}.pdf`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading statement…</div>;
  if (notFoundState || !customer) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Statement not found.</div>;

  const paid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const remaining = Math.max(0, Number(customer.goal_amount) - paid);
  const issued = new Date();

  return (
    <div className="min-h-screen bg-muted/40 py-6 px-4 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto mb-4 flex flex-wrap justify-end gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" />Print</Button>
        <Button variant="outline" size="sm" onClick={() => downloadImage("image/png")}><ImageIcon className="w-4 h-4 mr-2" />PNG</Button>
        <Button variant="outline" size="sm" onClick={() => downloadImage("image/jpeg")}><ImageIcon className="w-4 h-4 mr-2" />JPG</Button>
       <Button size="sm" onClick={downloadPdf}><Download className="w-4 h-4 mr-2" />Download PDF</Button>
      </div>

      <div ref={sheetRef} className="max-w-3xl mx-auto bg-white shadow-sm print:shadow-none border-2 border-primary/80 print:border-primary">
        <div className="p-10 print:p-12">
          <div className="flex items-start justify-between pb-6 border-b-2 border-primary">
            <img src={logoUrl} alt="Cloud Shipment" className="h-16 object-contain" />
            <div className="text-right text-xs text-muted-foreground leading-relaxed">
              <div className="font-semibold text-primary text-sm tracking-wide">CLOUD SHIPMENT</div>
              <div>cloudshipmentexpress.online</div>
              <div>Official Account Statement</div>
            </div>
          </div>

          <div className="mt-8 mb-6 text-center">
            <div className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">Statement of Account</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">Account Ledger</div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm border-y border-border py-4 mb-6">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Account Holder</div>
              <div className="font-medium">{customer.name}</div>
              <div className="text-xs text-muted-foreground mt-1">Tracking #: <span className="font-mono">{customer.tracking_number}</span></div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Issued</div>
              <div className="font-medium">{format(issued, "PPP")}</div>
              <div className="text-xs text-muted-foreground mt-1">{format(issued, "p")}</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Transaction History</div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-primary text-left">
                  <th className="py-2 pr-2 font-medium text-xs uppercase tracking-wide">Date</th>
                  <th className="py-2 px-2 font-medium text-xs uppercase tracking-wide">Time</th>
                  <th className="py-2 px-2 font-medium text-xs uppercase tracking-wide">Reason</th>
                  <th className="py-2 pl-2 font-medium text-xs uppercase tracking-wide text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan={4} className="py-6 text-center text-muted-foreground text-xs">No transactions recorded yet.</td></tr>
                ) : payments.map((p) => {
                  const d = new Date(p.paid_at);
                  return (
                    <tr key={p.id} className="border-b border-border/70">
                      <td className="py-2 pr-2">{format(d, "PP")}</td>
                      <td className="py-2 px-2 text-muted-foreground">{format(d, "p")}</td>
                      <td className="py-2 px-2">{p.reason}</td>
                      <td className="py-2 pl-2 text-right tabular-nums">${Number(p.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-xs border border-border">
              <div className="flex justify-between px-4 py-2 text-sm border-b border-border">
                <span className="text-muted-foreground">Total Paid</span>
                <span className="tabular-nums font-medium">${paid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between px-4 py-2 text-sm border-b border-border">
                <span className="text-muted-foreground">Goal</span>
                <span className="tabular-nums font-medium">${Number(customer.goal_amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between px-4 py-3 text-sm bg-primary text-primary-foreground">
                <span className="font-medium">Remaining Balance</span>
                <span className="tabular-nums font-semibold">${remaining.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-border text-center text-[10px] text-muted-foreground tracking-wide">
            This is an official statement issued by Cloud Shipment. For inquiries, contact our office.
            <div className="mt-1">© {issued.getFullYear()} Cloud Shipment. All rights reserved.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statement;
