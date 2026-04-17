/** Generates a tracking number in format CS-YYYY-MM-XXXXXX */
export function generateTrackingNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CS-${year}-${month}-${random}`;
}

export const SHIPMENT_STATUSES = [
  { value: "queued", label: "Queued", progress: 10 },
  { value: "in_transit", label: "In Transit", progress: 50 },
  { value: "out_for_delivery", label: "Out for Delivery", progress: 85 },
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
    case "delivered": return "bg-success/15 text-success";
  }
}
