-- Demo orders for testing admin dashboard
-- Run this after the main migration to add sample orders

-- Insert sample orders
INSERT INTO public.orders (
  customer_name, 
  customer_email, 
  customer_phone, 
  shipping_address, 
  city, 
  postal_code, 
  country, 
  status, 
  subtotal, 
  shipping_cost, 
  total,
  notes
) VALUES 
(
  'John Smith', 
  'john.smith@example.com', 
  '+1-555-0123', 
  '123 Main Street, Apt 4B', 
  'New York', 
  '10001', 
  'USA', 
  'pending', 
  299.00, 
  15.00, 
  314.00,
  'Please deliver after 6 PM'
),
(
  'Sarah Johnson', 
  'sarah.j@example.com', 
  '+1-555-0456', 
  '456 Oak Avenue', 
  'Los Angeles', 
  '90210', 
  'USA', 
  'processing', 
  149.00, 
  10.00, 
  159.00,
  'Gift wrap requested'
),
(
  'Mike Wilson', 
  'mike.wilson@example.com', 
  '+1-555-0789', 
  '789 Pine Street', 
  'Chicago', 
  '60601', 
  'USA', 
  'shipped', 
  89.00, 
  12.00, 
  101.00,
  NULL
);

-- Insert order items for the sample orders
-- Get the order IDs and product IDs for the inserts
WITH order_data AS (
  SELECT id as order_id, customer_email FROM public.orders WHERE customer_email IN ('john.smith@example.com', 'sarah.j@example.com', 'mike.wilson@example.com')
),
product_data AS (
  SELECT id as product_id, name, price FROM public.products WHERE slug IN ('minimalist-watch', 'executive-wallet', 'classic-leather-belt')
)
INSERT INTO public.order_items (order_id, product_id, product_name, product_price, quantity, total)
SELECT 
  o.order_id,
  p.product_id,
  p.name,
  p.price,
  1,
  p.price
FROM order_data o
CROSS JOIN product_data p
WHERE 
  (o.customer_email = 'john.smith@example.com' AND p.name = 'Minimalist Watch') OR
  (o.customer_email = 'sarah.j@example.com' AND p.name = 'Executive Wallet') OR
  (o.customer_email = 'mike.wilson@example.com' AND p.name = 'Classic Leather Belt');

-- Insert sample reviews
INSERT INTO public.reviews (product_id, customer_name, customer_email, rating, comment, approved)
SELECT 
  p.id,
  'Alice Brown',
  'alice.brown@example.com',
  5,
  'Amazing quality! Exactly what I was looking for.',
  false
FROM public.products p WHERE p.slug = 'executive-wallet';

INSERT INTO public.reviews (product_id, customer_name, customer_email, rating, comment, approved)
SELECT 
  p.id,
  'David Lee',
  'david.lee@example.com',
  4,
  'Great belt, very comfortable and stylish.',
  true
FROM public.products p WHERE p.slug = 'classic-leather-belt';

INSERT INTO public.reviews (product_id, customer_name, customer_email, rating, comment, approved)
SELECT 
  p.id,
  'Emma Davis',
  'emma.davis@example.com',
  5,
  'Perfect sunglasses for summer. Love the style!',
  false
FROM public.products p WHERE p.slug = 'aviator-sunglasses';