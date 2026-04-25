/** Generates a tracking number in one of two formats, chosen at random:
 *   1) CS-YYYY-MM-XXXXXX            (e.g. CS-2026-04-A1B2C3)
 *   2) TRK-MpxXXXXXXYYMMDD          (e.g. TRK-Mpx9F3K2L260418)
 */
export function generateTrackingNumber(): string {
  const now = new Date();
  const useAlt = Math.random() < 0.5;

  if (useAlt) {
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    // 6-char alphanumeric core
    const core = Array.from({ length: 6 }, () => {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      return chars[Math.floor(Math.random() * chars.length)];
    }).join("");
    return `TRK-Mpx${core}${yy}${mm}${dd}`;
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CS-${year}-${month}-${random}`;
}

export const SHIPMENT_STATUSES = [
  { value: "queued", label: "Queued", progress: 12 },
  { value: "in_transit", label: "In Transit", progress: 55 },
  { value: "out_for_delivery", label: "Out for Delivery", progress: 78 },
  { value: "arrived", label: "Arrived", progress: 92 },
  { value: "delivered", label: "Delivered", progress: 100 },
] as const;

export type ShipmentStatus = typeof SHIPMENT_STATUSES[number]["value"];

export function progressForStatus(status: ShipmentStatus): number {
  return SHIPMENT_STATUSES.find((s) => s.value === status)?.progress ?? 0;
}

export function statusLabel(status: ShipmentStatus): string {
  return SHIPMENT_STATUSES.find((s) => s.value === status)?.label ?? status;
}

export function statusColorClass(status: ShipmentStatus): string {
  switch (status) {
    case "queued": return "bg-muted text-muted-foreground";
    case "in_transit": return "bg-info/15 text-info";
    case "out_for_delivery": return "bg-warning/15 text-warning";
    case "arrived": return "bg-info/15 text-info";
    case "delivered": return "bg-success/15 text-success";
  }
}
