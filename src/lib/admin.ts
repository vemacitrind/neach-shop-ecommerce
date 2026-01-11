import { supabase } from '@/integrations/supabase/client';
import { OrderWithItems, AdminStats, OrderStatus } from '@/types/admin';

export const adminService = {
  // Get all orders with items
  async getOrders(): Promise<OrderWithItems[]> {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get admin dashboard stats
  async getAdminStats(): Promise<AdminStats> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalOrders = orders?.length || 0;
    const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
    const recentOrders = orders?.slice(0, 5) || [];

    return {
      totalOrders,
      pendingOrders,
      totalRevenue,
      recentOrders
    };
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
  },

  // Get all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Get all products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          category:categories (*)
        )
      `)
      .order('name');

    if (error) throw error;
    return data || [];
  },

  // Get all reviews
  async getReviews() {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        product:products (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update review approval status
  async updateReviewApproval(reviewId: string, approved: boolean): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .update({ approved })
      .eq('id', reviewId);

    if (error) throw error;
  },

  // Create new product
  async createProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update product
  async updateProduct(id: string, product: any) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete product
  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Create category
  async createCategory(category: any) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update category
  async updateCategory(id: string, category: any) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete category
  async deleteCategory(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Update product categories
  async updateProductCategories(productId: string, categoryIds: string[]) {
    // First delete existing associations
    await supabase
      .from('product_categories')
      .delete()
      .eq('product_id', productId);

    // Then insert new associations
    if (categoryIds.length > 0) {
      const { error } = await supabase
        .from('product_categories')
        .insert(categoryIds.map(categoryId => ({
          product_id: productId,
          category_id: categoryId
        })));

      if (error) throw error;
    }
  }
};