import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Package, 
  MapPin, 
  Calendar, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Copy,
  Share2,
  Printer,
  FileText,
  PackageCheck,
  Send,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import ShipmentMap from '@/components/ShipmentMap';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { progressForStatus, statusLabel } from '@/lib/shipment';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import logo from '@/assets/cloud-shipment-logo.png';

// Types for shipment data
interface TrackingEvent {
  id: string;
  status: string;
  rawStatus: string | null;
  location: string;
  timestamp: string;
  description: string;
  completed: boolean;
}

interface ShipmentData {
  trackingNumber: string;
  status: 'pending' | 'in-transit' | 'out-for-delivery' | 'delivered' | 'exception';
  origin: string;
  destination: string;
  estimatedDelivery: string;
  progress: number;
  carrier: string;
  weight: string;
  service: string;
  events: TrackingEvent[];
  senderName: string;
  senderEmail: string | null;
  senderPhone: string | null;
  receiverName: string;
  receiverEmail: string | null;
  receiverPhone: string | null;
  description: string | null;
  images: string[];
  quantity: number;
  isFragile: boolean;
}

const Track = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [error, setError] = useState('');

  // Check for tracking number in URL on mount
  useEffect(() => {
    const urlTrackingNumber = searchParams.get('n');
    if (urlTrackingNumber) {
      setTrackingNumber(urlTrackingNumber);
      handleTrack(urlTrackingNumber);
    }
  }, []);

  const handleTrack = async (number: string = trackingNumber) => {
    if (!number.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');
    setShipment(null);

    try {
      setSearchParams({ n: number });

      const { data: shipmentRow, error: shipErr } = await supabase
        .from('shipments')
        .select('*')
        .ilike('tracking_number', number.trim())
        .maybeSingle();

      if (shipErr) throw shipErr;
      if (!shipmentRow) {
        setError('No shipment found for this tracking number.');
        toast.error('Shipment not found');
        return;
      }

      const { data: eventsRows } = await supabase
        .from('shipment_events')
        .select('*')
        .eq('shipment_id', shipmentRow.id)
        .order('event_at', { ascending: true });

      const statusMap: Record<string, ShipmentData['status']> = {
        queued: 'pending',
        in_transit: 'in-transit',
        out_for_delivery: 'out-for-delivery',
        delivered: 'delivered',
      };

      const events: TrackingEvent[] = (eventsRows ?? []).map((e) => ({
        id: e.id,
        status: e.status ? statusLabel(e.status) : 'Update',
        rawStatus: e.status ?? null,
        location: e.location ?? shipmentRow.origin,
        timestamp: format(new Date(e.event_at), 'yyyy-MM-dd hh:mm a'),
        description: e.note ?? '',
        completed: true,
      }));

      const real: ShipmentData = {
        trackingNumber: shipmentRow.tracking_number,
        status: statusMap[shipmentRow.status] ?? 'pending',
        origin: shipmentRow.origin,
        destination: shipmentRow.destination,
        estimatedDelivery: shipmentRow.estimated_delivery_date
          ? format(new Date(shipmentRow.estimated_delivery_date), 'PPP')
          : 'TBD',
        progress: shipmentRow.progress ?? progressForStatus(shipmentRow.status),
        carrier: shipmentRow.courier ?? 'Cloud Shipment',
        weight: shipmentRow.weight ? `${shipmentRow.weight} kg` : '—',
        service: shipmentRow.is_express ? 'Express' : (shipmentRow.shipment_type ?? 'Standard'),
        events,
        senderName: shipmentRow.sender_name,
        senderEmail: shipmentRow.sender_email,
        senderPhone: shipmentRow.sender_phone,
        receiverName: shipmentRow.receiver_name,
        receiverEmail: shipmentRow.receiver_email,
        receiverPhone: shipmentRow.receiver_phone,
        description: shipmentRow.description,
        images: Array.isArray(shipmentRow.images) ? shipmentRow.images : [],
        quantity: shipmentRow.quantity ?? 1,
        isFragile: shipmentRow.is_fragile ?? false,
      };

      setShipment(real);
      toast.success('Tracking information found!');
    } catch (err) {
      console.error(err);
      setError('Unable to find shipment. Please check your tracking number and try again.');
      toast.error('Tracking failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTracking = () => {
    if (shipment) {
      navigator.clipboard.writeText(shipment.trackingNumber);
      toast.success('Tracking number copied!');
    }
  };

  const handleDownloadReceipt = async () => {
    if (!shipment) return;
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = 40;

      // Header band with logo
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, pageW, 90, 'F');
      try {
        doc.addImage(logo, 'PNG', margin, 18, 54, 54);
      } catch { /* ignore image errors */ }
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Cloud Shipment', margin + 70, 45);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Official Shipment Receipt', margin + 70, 62);
      doc.setFontSize(9);
      doc.text(`Generated: ${format(new Date(), 'PPP p')}`, pageW - margin, 45, { align: 'right' });
      doc.text(`Tracking #: ${shipment.trackingNumber}`, pageW - margin, 62, { align: 'right' });

      y = 120;
      doc.setTextColor(15, 23, 42);

      // Status banner
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(margin, y, pageW - margin * 2, 50, 6, 6, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Status', margin + 14, y + 20);
      doc.setFontSize(14);
      doc.setTextColor(37, 99, 235);
      const statusText = shipment.status === 'out-for-delivery'
        ? 'Out for Delivery'
        : shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1);
      doc.text(`${statusText}  •  ${shipment.progress}%`, margin + 14, y + 38);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`ETA: ${shipment.estimatedDelivery}`, pageW - margin - 14, y + 30, { align: 'right' });
      y += 70;

      // Two-column section helper
      const sectionTitle = (title: string) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(title.toUpperCase(), margin, y);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y + 4, pageW - margin, y + 4);
        y += 18;
      };

      const row = (label: string, value: string) => {
        if (!value) return;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(label, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        const lines = doc.splitTextToSize(value, pageW - margin * 2 - 110);
        doc.text(lines, margin + 110, y);
        y += Math.max(14, lines.length * 12);
      };

      sectionTitle('Sender');
      row('Name', shipment.senderName);
      if (shipment.senderEmail) row('Email', shipment.senderEmail);
      if (shipment.senderPhone) row('Phone', shipment.senderPhone);
      row('Origin', shipment.origin);
      y += 8;

      sectionTitle('Receiver');
      row('Name', shipment.receiverName);
      if (shipment.receiverEmail) row('Email', shipment.receiverEmail);
      if (shipment.receiverPhone) row('Phone', shipment.receiverPhone);
      row('Destination', shipment.destination);
      y += 8;

      sectionTitle('Package');
      row('Carrier', shipment.carrier);
      row('Service', shipment.service);
      row('Weight', shipment.weight);
      row('Quantity', String(shipment.quantity));
      if (shipment.isFragile) row('Handling', 'Fragile');
      if (shipment.description) row('Description', shipment.description);
      y += 8;

      // Journey timeline
      if (shipment.events.length > 0) {
        if (y > 700) { doc.addPage(); y = 60; }
        sectionTitle('Journey');
        shipment.events.slice(-6).forEach((ev) => {
          if (y > 760) { doc.addPage(); y = 60; }
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(15, 23, 42);
          doc.text(`• ${ev.status}`, margin, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(100, 116, 139);
          doc.text(ev.timestamp, pageW - margin, y, { align: 'right' });
          y += 12;
          if (ev.description) {
            const desc = doc.splitTextToSize(ev.description, pageW - margin * 2 - 12);
            doc.text(desc, margin + 12, y);
            y += desc.length * 11;
          }
          if (ev.location) {
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(8);
            doc.text(`@ ${ev.location}`, margin + 12, y);
            doc.setFontSize(9);
            y += 12;
          }
          y += 4;
        });
      }

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 30;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, footerY - 12, pageW - margin, footerY - 12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Cloud Shipment • Official Receipt • This document is computer-generated.', pageW / 2, footerY, { align: 'center' });

      doc.save(`CloudShipment-Receipt-${shipment.trackingNumber}.pdf`);
      toast.success('Receipt downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate receipt');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'delivered': 'bg-green-100 text-green-700 border-green-200',
      'in-transit': 'bg-blue-100 text-blue-700 border-blue-200',
      'out-for-delivery': 'bg-purple-100 text-purple-700 border-purple-200',
      'pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'exception': 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || 'bg-slate-100 text-slate-700';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-transit':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'out-for-delivery':
        return <MapPin className="w-5 h-5 text-purple-600" />;
      case 'exception':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Cloud Shipment" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Track Shipment</h1>
                <p className="text-slate-500 mt-1 text-sm">
                  Enter your tracking number to get real-time updates
                </p>
              </div>
            </div>
            {user && (
              <Button variant="outline" onClick={() => window.location.href = '/admin/shipments'}>
                View All Shipments
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  placeholder="Enter tracking number (e.g., CLD-8291-5734)"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button 
                onClick={() => handleTrack()} 
                disabled={isLoading}
                className="h-12 px-8"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Tracking...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Track
                  </div>
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {shipment && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${getStatusColor(shipment.status)}`}>
                  {getStatusIcon(shipment.status)}
                </div>
                <div>
                  <p className="text-sm text-slate-500">Tracking Number</p>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-900 font-mono">
                      {shipment.trackingNumber}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={handleCopyTracking} className="h-8 w-8">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={getStatusColor(shipment.status)}>
                  {shipment.status === 'out-for-delivery' ? 'Out for Delivery' : 
                   shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleDownloadReceipt} className="gap-2">
                  <Printer className="w-4 h-4" />
                  Print Receipt
                </Button>
                <Button variant="outline" size="icon" title="Share">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Live Route Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ShipmentMap shipment={{
                      origin: shipment.origin,
                      destination: shipment.destination,
                      status: shipment.status,
                      progress: shipment.progress,
                      estimatedDelivery: shipment.estimatedDelivery,
                      trackingNumber: shipment.trackingNumber
                    }} />
                  </CardContent>
                </Card>

                {/* Vertical Stepper - Shipment Journey */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle>Shipment Journey</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Progress</span>
                        <span className="text-sm font-bold text-blue-600 font-mono">{shipment.progress}%</span>
                      </div>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-700 ease-out"
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const stages = [
                        { key: 'label_created', label: 'Label Created', description: 'Shipment registered in our system', icon: FileText, progress: 1 },
                        { key: 'picked_up', label: 'Picked Up', description: 'Courier has collected the item', icon: PackageCheck, progress: 25 },
                        { key: 'in_transit', label: 'In Transit', description: 'Package is moving between hubs', icon: Truck, progress: 50 },
                        { key: 'out_for_delivery', label: 'Out for Delivery', description: 'Final vehicle dispatched to receiver', icon: Send, progress: 85 },
                        { key: 'delivered', label: 'Delivered', description: 'Handed over to receiver', icon: Home, progress: 100 },
                      ];

                      // Map admin status -> index of the CURRENT (active) stage.
                      // The matching stage shows the pulsing blue indicator; all stages BEFORE it are marked completed.
                      const statusToCurrentIdx: Record<string, number> = {
                        'pending': 0,
                        'in-transit': 2,
                        'out-for-delivery': 3,
                        'delivered': 4,
                        'exception': 2,
                      };
                      // Raw DB enum -> stage index (events use raw enum values like 'in_transit')
                      const rawStatusToIdx: Record<string, number> = {
                        'queued': 0,
                        'in_transit': 2,
                        'out_for_delivery': 3,
                        'delivered': 4,
                      };

                      // Use the HIGHEST stage from either the row status or the latest event status.
                      // This keeps the Journey in sync with Recent Updates even if the row wasn't synced.
                      let currentIdx = statusToCurrentIdx[shipment.status] ?? 0;
                      for (const ev of shipment.events) {
                        if (ev.rawStatus && rawStatusToIdx[ev.rawStatus] !== undefined) {
                          currentIdx = Math.max(currentIdx, rawStatusToIdx[ev.rawStatus]);
                        }
                      }

                      return (
                        <div className="relative">
                          {stages.map((stage, index) => {
                            const isDelivered = shipment.status === 'delivered';
                            const isCompleted = isDelivered || index < currentIdx;
                            const isCurrent = !isDelivered && index === currentIdx;
                            const isUpcoming = !isCompleted && !isCurrent;
                            const StageIcon = stage.icon;

                            const matchedEvent = shipment.events.find(e =>
                              e.status.toLowerCase().includes(stage.label.toLowerCase().split(' ')[0])
                            );

                            return (
                              <div key={stage.key} className="flex gap-4 pb-8 last:pb-0">
                                <div className="flex flex-col items-center">
                                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                    isCompleted
                                      ? 'bg-green-600 border-green-600 text-white'
                                      : isCurrent
                                      ? 'border-blue-600 text-white'
                                      : 'bg-white border-slate-300 text-slate-400'
                                  }`}>
                                    {isCurrent && (
                                      <>
                                        <span className="absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping" />
                                        <span className="absolute inset-0 rounded-full bg-blue-600" />
                                      </>
                                    )}
                                    <span className="relative z-10">
                                      {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                      ) : (
                                        <StageIcon className="w-5 h-5" />
                                      )}
                                    </span>
                                  </div>
                                  {index !== stages.length - 1 && (
                                    <div className={`w-0.5 flex-1 mt-2 min-h-[40px] ${
                                      isCompleted ? 'bg-green-600' : 'bg-slate-200'
                                    }`} />
                                  )}
                                </div>
                                <div className="flex-1 pt-1.5">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <h4 className={`font-semibold ${
                                      isCompleted ? 'text-slate-900' : isCurrent ? 'text-blue-700' : 'text-slate-400'
                                    }`}>
                                      {stage.label}
                                      {isCurrent && (
                                        <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                          Current
                                        </span>
                                      )}
                                    </h4>
                                    {matchedEvent && (
                                      <span className="text-xs text-slate-500 font-mono">
                                        {matchedEvent.timestamp}
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-sm mt-1 ${
                                    isUpcoming ? 'text-slate-400' : 'text-slate-600'
                                  }`}>
                                    {matchedEvent?.description || stage.description}
                                  </p>
                                  {matchedEvent?.location && (
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {matchedEvent.location}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {shipment.events.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-200">
                        <h5 className="text-sm font-semibold text-slate-700 mb-3">Recent Updates</h5>
                        <div className="space-y-2">
                          {shipment.events.slice(-3).reverse().map((event) => (
                            <div key={event.id} className="text-sm bg-slate-50 rounded-lg p-3">
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-medium text-slate-900">{event.status}</span>
                                <span className="text-xs text-slate-500 font-mono whitespace-nowrap">{event.timestamp}</span>
                              </div>
                              {event.description && <p className="text-slate-600 mt-1">{event.description}</p>}
                              {event.location && (
                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />{event.location}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Sender & Receiver */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sender & Receiver</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sender</h4>
                      <p className="font-semibold text-slate-900">{shipment.senderName}</p>
                      {shipment.senderEmail && (
                        <p className="text-sm text-slate-600 break-all">
                          <a href={`mailto:${shipment.senderEmail}`} className="hover:underline">
                            {shipment.senderEmail}
                          </a>
                        </p>
                      )}
                      {shipment.senderPhone && (
                        <p className="text-sm text-slate-600">
                          <a href={`tel:${shipment.senderPhone}`} className="hover:underline">
                            {shipment.senderPhone}
                          </a>
                        </p>
                      )}
                      <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                        <MapPin className="w-3 h-3" /> {shipment.origin}
                      </p>
                    </div>
                    <div className="space-y-2 md:border-l md:pl-6 border-slate-200">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Receiver</h4>
                      <p className="font-semibold text-slate-900">{shipment.receiverName}</p>
                      {shipment.receiverEmail && (
                        <p className="text-sm text-slate-600 break-all">
                          <a href={`mailto:${shipment.receiverEmail}`} className="hover:underline">
                            {shipment.receiverEmail}
                          </a>
                        </p>
                      )}
                      {shipment.receiverPhone && (
                        <p className="text-sm text-slate-600">
                          <a href={`tel:${shipment.receiverPhone}`} className="hover:underline">
                            {shipment.receiverPhone}
                          </a>
                        </p>
                      )}
                      <p className="text-xs text-slate-500 flex items-center gap-1 pt-1">
                        <MapPin className="w-3 h-3" /> {shipment.destination}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Package Description */}
                {shipment.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Package Description
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {shipment.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Package Images */}
                {shipment.images.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Package Images ({shipment.images.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {shipment.images.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                          >
                            <img
                              src={url}
                              alt={`Package ${i + 1}`}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Delivery Estimate */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Estimated Delivery</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{shipment.estimatedDelivery}</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Your package is on schedule
                    </p>
                  </CardContent>
                </Card>

                {/* Shipment Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Shipment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Carrier</span>
                      <span className="font-medium">{shipment.carrier}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Service</span>
                      <span className="font-medium">{shipment.service}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Weight</span>
                      <span className="font-medium">{shipment.weight}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Quantity</span>
                      <span className="font-medium">{shipment.quantity}</span>
                    </div>
                    {shipment.isFragile && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Handling</span>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Fragile</Badge>
                        </div>
                      </>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">From</span>
                      <span className="font-medium text-right">{shipment.origin}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">To</span>
                      <span className="font-medium text-right">{shipment.destination}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Need Help */}
                <Card className="bg-slate-50">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">Need Help?</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      Have questions about your delivery? Our support team is here to help.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => toast.info('Support chat coming soon!')}>
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!shipment && !isLoading && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to Track</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Enter your tracking number above to see real-time updates on your shipment location and estimated delivery time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Track;
