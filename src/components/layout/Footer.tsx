import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-semibold tracking-tight">
                <span className="text-primary">VEDANT</span>
                <span className="text-foreground">HOTFASHION</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Premium men's accessories crafted for the modern gentleman. 
              Quality materials, timeless designs.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Shop</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/products?category=belts" className="text-muted-foreground hover:text-primary transition-colors">
                Belts
              </Link>
              <Link to="/products?category=wallets" className="text-muted-foreground hover:text-primary transition-colors">
                Wallets
              </Link>
              <Link to="/products?category=sunglasses" className="text-muted-foreground hover:text-primary transition-colors">
                Sunglasses
              </Link>
              <Link to="/products?category=watches" className="text-muted-foreground hover:text-primary transition-colors">
                Watches
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Support</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
              <span className="text-muted-foreground">
                +91 98792-13871
              </span>
              <Link to="/track-order" className="text-muted-foreground hover:text-primary transition-colors">
                Track Order
              </Link>
              <Link to="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                Returns
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Vedant Hot Fashion. All rights reserved.
          </p>
          <Link 
            to="/admin" 
            className="text-sm text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
