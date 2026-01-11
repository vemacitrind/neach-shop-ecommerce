-- Categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'out_of_stock', 'low_stock')),
  featured BOOLEAN DEFAULT false,
  popularity_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Product categories junction table
CREATE TABLE public.product_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  UNIQUE(product_id, category_id)
);

-- Product reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10, 2) NOT NULL,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total DECIMAL(10, 2) NOT NULL
);

-- Admin profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Public read policies (categories and products are public)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Product categories are viewable by everyone" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "Approved reviews are viewable by everyone" ON public.reviews FOR SELECT USING (approved = true);

-- Admin policies for categories
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for products
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Admin policies for product categories
CREATE POLICY "Admins can manage product categories" ON public.product_categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Reviews policies
CREATE POLICY "Anyone can create reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders policies (public can create, only admin can view/manage)
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage orders" ON public.orders FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Order items policies
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User roles policies
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Generate order number function
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER generate_order_number_trigger BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Belts', 'belts', 'Premium leather belts for every occasion', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'),
('Wallets', 'wallets', 'Elegant wallets and cardholders', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400'),
('Sunglasses', 'sunglasses', 'Designer sunglasses and eyewear', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'),
('Watches', 'watches', 'Luxury timepieces for the modern gentleman', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400');

-- Insert sample products
INSERT INTO public.products (name, slug, description, price, original_price, image_url, stock_status, featured, popularity_score) VALUES
('Classic Leather Belt', 'classic-leather-belt', 'Handcrafted genuine leather belt with brushed gold buckle', 89.00, 120.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 'in_stock', true, 95),
('Executive Wallet', 'executive-wallet', 'Premium bifold wallet with RFID protection', 149.00, NULL, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600', 'in_stock', true, 88),
('Aviator Sunglasses', 'aviator-sunglasses', 'Titanium frame aviators with polarized lenses', 199.00, 250.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600', 'in_stock', true, 92),
('Minimalist Watch', 'minimalist-watch', 'Swiss movement with Italian leather strap', 299.00, NULL, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600', 'in_stock', true, 85),
('Braided Leather Belt', 'braided-leather-belt', 'Artisan braided belt with antique brass buckle', 79.00, NULL, 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600', 'in_stock', false, 72),
('Slim Card Holder', 'slim-card-holder', 'Minimalist card holder in premium leather', 69.00, 85.00, 'https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=600', 'in_stock', false, 78);

-- Link products to categories
INSERT INTO public.product_categories (product_id, category_id)
SELECT p.id, c.id FROM public.products p, public.categories c WHERE p.slug = 'classic-leather-belt' AND c.slug = 'belts';
INSERT INTO public.product_categories (product_id, category_id)
SELECT p.id, c.id FROM public.products p, public.categories c WHERE p.slug = 'braided-leather-belt' AND c.slug = 'belts';
INSERT INTO public.product_categories (product_id, category_id)
SELECT p.id, c.id FROM public.products p, public.categories c WHERE p.slug = 'executive-wallet' AND c.slug = 'wallets';
INSERT INTO public.product_categories (product_id, category_id)
SELECT p.id, c.id FROM public.products p, public.categories c WHERE p.slug = 'slim-card-holder' AND c.slug = 'wallets';
INSERT INTO public.product_categories (product_id, category_id)
SELECT p.id, c.id FROM public.products p, public.categories c WHERE p.slug = 'aviator-sunglasses' AND c.slug = 'sunglasses';
INSERT INTO public.product_categories (product_id, category_id)
SELECT p.id, c.id FROM public.products p, public.categories c WHERE p.slug = 'minimalist-watch' AND c.slug = 'watches';

-- Insert sample reviews
INSERT INTO public.reviews (product_id, customer_name, customer_email, rating, comment, approved)
SELECT p.id, 'James W.', 'james@example.com', 5, 'Exceptional quality. The leather is soft yet durable.', true
FROM public.products p WHERE p.slug = 'classic-leather-belt';

INSERT INTO public.reviews (product_id, customer_name, customer_email, rating, comment, approved)
SELECT p.id, 'Michael R.', 'michael@example.com', 4, 'Great wallet, perfect size for my cards.', true
FROM public.products p WHERE p.slug = 'executive-wallet';