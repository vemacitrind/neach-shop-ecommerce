import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Package, Mail } from 'lucide-react';
import { Order, OrderItem } from '@/types';

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<(OrderItem & { products?: any })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderNumber) {
        setLoading(false);
        return;
      }

      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('order_number', orderNumber)
          .single();

        if (orderError || !orderData) {
          setLoading(false);
          return;
        }

        setOrder(orderData as Order);
        
        const { data: itemsData,error:itemError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (
              id,
              name,
              slug,
              image_url,
              description
            )
          `)
          .eq('order_id', orderData.id);
        console.log(itemError);
        setOrderItems(itemsData || []);
      } catch (error) {
        // Silent error handling
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-2" />
            <div className="h-4 bg-muted rounded w-48 mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Thank You for Your Order!
            </h1>
            <p className="text-lg text-muted-foreground">
              Your order has been placed successfully.
            </p>
          </div>

          {/* Order Info */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-display text-xl font-semibold">{order.order_number}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t border-b border-border">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Shipping Address</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_name}<br />
                    {order.shipping_address}<br />
                    {order.city}, {order.postal_code}<br />
                    {order.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium mb-1">Contact Details</p>
                  <p className="text-sm text-muted-foreground">
                    {order.customer_email}<br />
                    {order.customer_phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="py-6">
              <h3 className="font-medium mb-4">Order Items</h3>
              {orderItems.length > 0 ? (
                <div className="space-y-4">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 bg-muted/50 border border-border rounded-lg">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.products?.image_url || '/placeholder.svg'}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{item.product_name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {item.products?.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </span>
                          <span className="font-medium text-sm">
                            {formatPrice(item.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No items found</p>
              )}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping_cost === 0 ? 'Free' : formatPrice(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2">
                <span>Total</span>
                <span className="font-display text-lg text-primary">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-muted rounded-lg p-6 mb-8">
            <h3 className="font-medium mb-3">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                You will receive an order confirmation email shortly
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Our team will process your order within 1-2 business days
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Payment will be collected upon delivery (Cash on Delivery)
              </li>
            </ul>
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
