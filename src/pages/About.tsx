import { Layout } from '@/components/layout/Layout';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              About Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Crafting premium men's accessories for the modern gentleman since 2005
            </p>
          </div>

          {/* Creator Section */}
          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-display text-2xl font-bold mb-4">Meet the Creator</h2>
                <p className="text-muted-foreground mb-4">
                  Founded by Joshi Kishor, VEDANTHOTFASHION began as a passion project to bring 
                  high-quality, stylish accessories to men who appreciate craftsmanship and design.
                </p>
                <p className="text-muted-foreground mb-4">
                  With years of experience in fashion and design, Vedant carefully curates 
                  each piece to ensure it meets our standards of quality and style.
                </p>
                <p className="text-muted-foreground">
                  Our mission is to provide premium accessories that enhance your style 
                  while maintaining affordability and exceptional customer service.
                </p>
              </div>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                <span className="text-muted-foreground"><img src="/creator.jpeg" alt="" className='rounded' /></span>
              </div>
            </div>
          </div>

          {/* Shop Info */}
          <div className="bg-card border border-border rounded-lg p-8 mb-12">
            <h2 className="font-display text-2xl font-bold mb-6">Shop Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Location</h3>
                  <p className="text-sm text-muted-foreground">
                    65/503, Ambewadi Rd, Gujarat Housing Board, Amraiwadi, Ahmedabad, Gujarat 380026
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Contact</h3>
                  <p className="text-sm text-muted-foreground">
                    Phone: +91 98792-13871<br />
                    Email: vedanthotfashion@gmail.com<br />
                    Support: 24/7 Available
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-medium mb-1">Business Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Mon - Sun: 10:00 AM - 8:00 PM<br />
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Map */}
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="font-display text-2xl font-bold mb-6">Find Us</h2>
            <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.6136503497837!2d72.62067897531324!3d23.001230379188698!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e86731a7dbe47%3A0x4ade690739482ed4!2sVedant%20Hot%20Fashion!5e0!3m2!1sen!2sin!4v1768139131477!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '0.5rem' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shop Location"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}