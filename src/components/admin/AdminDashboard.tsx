import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Package, ShoppingCart, Users, Star, LogOut } from 'lucide-react';
import { OrdersTab } from './OrdersTab';
import { ProductsTab } from './ProductsTab';
import { ReviewsTab } from './ReviewsTab';
import { StatsCards } from './StatsCards';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/lib/admin';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { totalNotifications, markAsChecked } = useAdminNotifications();
  const { toast } = useToast();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getAdminStats,
  });

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={markAsChecked} className="flex-1 sm:flex-none">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {totalNotifications > 0 && (
              <Badge variant="destructive" className="ml-2">
                {totalNotifications}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="flex-1 sm:flex-none">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
            <Package className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Overview</span>
            <span className="sm:hidden">Home</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
            <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
            Orders
            {stats?.pendingOrders && stats.pendingOrders > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {stats.pendingOrders}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
            <Package className="h-3 w-3 md:h-4 md:w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm p-2 md:p-3">
            <Star className="h-3 w-3 md:h-4 md:w-4" />
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <StatsCards stats={stats} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentOrders.length === 0 ? (
                <p className="text-muted-foreground">No recent orders</p>
              ) : (
                <div className="space-y-4">
                  {stats?.recentOrders.map((order) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm md:text-base">{order.order_number}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{order.customer_name}</p>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        <p className="font-medium text-sm md:text-base">${order.total}</p>
                        <Badge variant={order.status === 'pending' ? 'destructive' : 'secondary'} className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};