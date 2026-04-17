const ShipmentMap = () => {
  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-lg border border-slate-200">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        src="https://www.google.com/maps/embed/v1/directions?key=YOUR_API_KEY&origin=Washington,DC&destination=New+Jersey&mode=driving"
        allowFullScreen
      ></iframe>
      {/* If you don't have an API key, use this simple preview below instead */}
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1552554.437341395!2d-76.0369!3d39.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1713330000000!5m2!1sen!2sus" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={true} 
        loading="lazy" 
      />
    </div>
  );
};

export default ShipmentMap;
