import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Upload, Tag } from 'lucide-react';
import { adminService } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  stock_status: 'in_stock' | 'out_of_stock' | 'low_stock';
  featured: boolean;
  categories: string[];
}

interface CategoryForm {
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export const ProductsTab = () => {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { register: registerProduct, handleSubmit: handleProductSubmit, reset: resetProduct, setValue: setProductValue, watch: watchProduct } = useForm<ProductForm>();
  const { register: registerCategory, handleSubmit: handleCategorySubmit, reset: resetCategory, setValue: setCategoryValue } = useForm<CategoryForm>();

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:3001/health');
        setBackendAvailable(response.ok);
      } catch {
        setBackendAvailable(false);
      }
    };
    checkBackend();
  }, []);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.imageUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'category') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      if (type === 'product') {
        setProductValue('image_url', imageUrl);
      } else {
        setCategoryValue('image_url', imageUrl);
      }
      toast({ title: 'Success', description: 'Image uploaded successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to upload image.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: adminService.getProducts,
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminService.getCategories,
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: { product: any; categories: string[] }) => {
      const product = await adminService.createProduct(data.product);
      if (data.categories.length > 0) {
        await adminService.updateProductCategories(product.id, data.categories);
      }
      return product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsProductDialogOpen(false);
      resetProduct();
      setSelectedCategories([]);
      toast({ title: 'Success', description: 'Product created successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create product.', variant: 'destructive' });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, product, categories }: { id: string; product: any; categories: string[] }) => {
      const updatedProduct = await adminService.updateProduct(id, product);
      await adminService.updateProductCategories(id, categories);
      return updatedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      resetProduct();
      setSelectedCategories([]);
      toast({ title: 'Success', description: 'Product updated successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update product.', variant: 'destructive' });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: adminService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast({ title: 'Success', description: 'Product deleted successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete product.', variant: 'destructive' });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: adminService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsCategoryDialogOpen(false);
      resetCategory();
      toast({ title: 'Success', description: 'Category created successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create category.', variant: 'destructive' });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, category }: { id: string; category: any }) =>
      adminService.updateCategory(id, category),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
      resetCategory();
      toast({ title: 'Success', description: 'Category updated successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update category.', variant: 'destructive' });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: adminService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Success', description: 'Category deleted successfully.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete category.', variant: 'destructive' });
    },
  });

  const onProductSubmit = (data: ProductForm) => {
    const productData = {
      ...data,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      price: Number(data.price),
      original_price: data.original_price ? Number(data.original_price) : null,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, product: productData, categories: selectedCategories });
    } else {
      createProductMutation.mutate({ product: productData, categories: selectedCategories });
    }
  };

  const onCategorySubmit = (data: CategoryForm) => {
    const categoryData = {
      ...data,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
    };

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, category: categoryData });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductValue('name', product.name);
    setProductValue('description', product.description || '');
    setProductValue('price', product.price);
    setProductValue('original_price', product.original_price);
    setProductValue('image_url', product.image_url || '');
    setProductValue('stock_status', product.stock_status);
    setProductValue('featured', product.featured);
    setSelectedCategories(product.product_categories?.map((pc: any) => pc.category.id) || []);
    setIsProductDialogOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryValue('name', category.name);
    setCategoryValue('description', category.description || '');
    setCategoryValue('image_url', category.image_url || '');
    setIsCategoryDialogOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'default';
      case 'low_stock': return 'secondary';
      case 'out_of_stock': return 'destructive';
      default: return 'default';
    }
  };

  if (productsLoading || categoriesLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-lg md:text-xl">Products</CardTitle>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingProduct(null); resetProduct(); setSelectedCategories([]); }} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleProductSubmit(onProductSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input {...registerProduct('name', { required: true })} />
                      </div>
                      <div>
                        <Label htmlFor="price">Price</Label>
                        <Input type="number" step="0.01" {...registerProduct('price', { required: true })} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="original_price">Original Price</Label>
                        <Input type="number" step="0.01" {...registerProduct('original_price')} />
                      </div>
                      <div>
                        <Label htmlFor="stock_status">Stock Status</Label>
                        <Select onValueChange={(value) => setProductValue('stock_status', value as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_stock">In Stock</SelectItem>
                            <SelectItem value="low_stock">Low Stock</SelectItem>
                            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Categories</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {categories?.map((category: any) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.id}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCategories([...selectedCategories, category.id]);
                                } else {
                                  setSelectedCategories(selectedCategories.filter(id => id !== category.id));
                                }
                              }}
                            />
                            <Label htmlFor={category.id} className="text-sm">{category.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="image_url">Image</Label>
                      <div className="space-y-2">
                        <Input {...registerProduct('image_url')} placeholder="Image URL" />
                        {backendAvailable && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'product')}
                              disabled={uploading}
                              className="flex-1"
                            />
                            <Button type="button" disabled={uploading} size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea {...registerProduct('description')} rows={3} />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        onCheckedChange={(checked) => setProductValue('featured', !!checked)}
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
                        {editingProduct ? 'Update' : 'Create'} Product
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.map((product: any) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {product.product_categories?.map((pc: any) => (
                              <Badge key={pc.category.id} variant="secondary" className="text-xs">
                                {pc.category.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>
                          <Badge variant={getStockStatusColor(product.stock_status)}>
                            {product.stock_status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {product.featured && <Badge>Featured</Badge>}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-lg md:text-xl">Categories</CardTitle>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingCategory(null); resetCategory(); }} className="w-full sm:w-auto">
                    <Tag className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCategorySubmit(onCategorySubmit)} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input {...registerCategory('name', { required: true })} />
                    </div>

                    <div>
                      <Label htmlFor="image_url">Image</Label>
                      <div className="space-y-2">
                        <Input {...registerCategory('image_url')} placeholder="Image URL" />
                        {backendAvailable && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'category')}
                              disabled={uploading}
                              className="flex-1"
                            />
                            <Button type="button" disabled={uploading} size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea {...registerCategory('description')} rows={3} />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                        {editingCategory ? 'Update' : 'Create'} Category
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories?.map((category: any) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.description}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};