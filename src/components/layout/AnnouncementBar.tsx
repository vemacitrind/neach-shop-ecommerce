export function AnnouncementBar() {
  const text = "Utrayan Offer - Visit shop at address: 65/503, Ambewadi Rd, Gujarat Housing Board, Amraiwadi, Ahmedabad, Gujarat 380026 • Call us at +91 987921-3871 • Free shipping on orders over ₹999 or under 5km radius • ";
  
  return (
    <div className="bg-primary text-primary-foreground py-2 text-sm overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        <span className="mr-16">{text}</span>
        <span className="mr-16">{text}</span>
        <span className="mr-16">{text}</span>
      </div>
    </div>
  );
}