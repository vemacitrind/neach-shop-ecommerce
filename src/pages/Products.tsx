import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Category, Product, SortOption } from '@/types';
import { fuzzySearch } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categorySlug = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          supabase.from('products').select('*'),
          supabase.from('categories').select('*').order('name'),
        ]);

        if (productsRes.data) {
          setProducts(productsRes.data as Product[]);
        }
        if (categoriesRes.data) {
          setCategories(categoriesRes.data as Category[]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Fetch products by category if category is selected
  useEffect(() => {
    async function fetchProductsByCategory() {
      if (!categorySlug) {
        // If no category, fetch all products
        setLoading(true);
        try {
          const { data } = await supabase.from('products').select('*');
          if (data) {
            setProducts(data as Product[]);
          }
        } catch (error) {
          console.error('Error fetching all products:', error);
        } finally {
          setLoading(false);
        }
        return;
      }
      
      setLoading(true);
      try {
        const { data: category } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();

        if (category) {
          const { data: productCategories } = await supabase
            .from('product_categories')
            .select('product_id')
            .eq('category_id', category.id);

          if (productCategories) {
            const productIds = productCategories.map(pc => pc.product_id);
            const { data: categoryProducts } = await supabase
              .from('products')
              .select('*')
              .in('id', productIds);

            if (categoryProducts) {
              setProducts(categoryProducts as Product[]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching products by category:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductsByCategory();
  }, [categorySlug]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (localSearch) {
      newParams.set('search', localSearch);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setLocalSearch('');
    setSortBy('newest');
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply fuzzy search
    if (searchQuery) {
      result = result.filter(product => 
        fuzzySearch(searchQuery, product.name) ||
        fuzzySearch(searchQuery, product.description || '')
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popularity':
        result.sort((a, b) => b.popularity_score - a.popularity_score);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [products, searchQuery, sortBy]);

  const currentCategory = categories.find(c => c.slug === categorySlug);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {currentCategory ? currentCategory.name : 'All Products'}
          </h1>
          {currentCategory && (
            <p className="text-muted-foreground">{currentCategory.description}</p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={!categorySlug ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('category');
                setSearchParams(newParams);
              }}
            >
              All
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={categorySlug === category.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set('category', category.slug);
                  setSearchParams(newParams);
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                className="pl-9 w-48 md:w-64"
              />
            </div>
            <Button type="submit" size="sm">Search</Button>
          </form>

          {/* Sort */}
          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active filters */}
        {(categorySlug || searchQuery) && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {categorySlug && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm">
                {currentCategory?.name}
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('category');
                    setSearchParams(newParams);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm">
                "{searchQuery}"
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('search');
                    setSearchParams(newParams);
                    setLocalSearch('');
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
        </p>

        {/* Products Grid */}
        <ProductGrid products={filteredAndSortedProducts} loading={loading} />
      </div>
    </Layout>
  );
}
