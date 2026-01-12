import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Package } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      navigate(`/order-status/${orderId.trim()}`);
    }, 1000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Track Your Order
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter your order ID to check the status of your shipment
            </p>
          </div>

          {/* Track Form */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <form onSubmit={handleTrackOrder} className="space-y-6">
              <div>
                <label htmlFor="orderId" className="block text-sm font-medium mb-2">
                  Order ID
                </label>
                <div className="relative">
                  <Input
                    id="orderId"
                    type="text"
                    placeholder="Enter your order ID (e.g., ORD-123456)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  You can find your order ID in your confirmation email
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading || !orderId.trim()}
              >
                {loading ? 'Searching...' : 'Track Order'}
              </Button>
            </form>
          </div>

          {/* Help Section */}
          <div className="bg-muted rounded-lg p-6">
            <h3 className="font-medium mb-3">Need Help?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Order ID can be found in your confirmation email
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Orders typically process within 1-2 business days
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Contact us at +91 98792-13871 for assistance
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}