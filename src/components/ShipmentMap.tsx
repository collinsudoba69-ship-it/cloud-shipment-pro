import React from 'react';

const ShipmentMap = () => {
  // This URL shows the corridor between Washington DC and New Jersey
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d1554581.565345638!2d-76.32623377759604!3d39.31561756230528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x89b7c6de5af6677b%3A0x36041774e6776524!2sWashington%2C%20DC!3m2!1d38.9071923!2d-77.0368707!4m5!1s0x89c0fb959e00409f%3A0x2eb27d0791d055f7!2sNew%20Jersey!3m2!1d40.0583238!2d-74.4056612!5e0!3m2!1sen!2sus!4v1713340000000!5m2!1sen!2sus";

  return (
    <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-inner bg-slate-100 border border-slate-200">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Cloud Shipment Live Route"
        className="grayscale-[20%] contrast-[1.1]"
      />
    </div>
  );
};

export default ShipmentMap;
