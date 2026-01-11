import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/lib/admin';

export const useAdminNotifications = () => {
  const [lastChecked, setLastChecked] = useState(Date.now());
  
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminService.getAdminStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: adminService.getOrders,
    refetchInterval: 30000,
  });

  const newOrdersCount = orders?.filter(
    order => new Date(order.created_at).getTime() > lastChecked
  ).length || 0;

  const pendingOrdersCount = stats?.pendingOrders || 0;

  const markAsChecked = () => {
    setLastChecked(Date.now());
  };

  return {
    newOrdersCount,
    pendingOrdersCount,
    totalNotifications: newOrdersCount + pendingOrdersCount,
    markAsChecked,
  };
};