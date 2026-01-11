import { Order, OrderItem } from './index';

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: OrderWithItems[];
}

export interface EmailTemplate {
  to: string;
  subject: string;
  message: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';