import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Star } from 'lucide-react';
import { adminService } from '@/lib/admin';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export const ReviewsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: adminService.getReviews,
  });

  const updateApprovalMutation = useMutation({
    mutationFn: ({ reviewId, approved }: { reviewId: string; approved: boolean }) =>
      adminService.updateReviewApproval(reviewId, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast({
        title: 'Success',
        description: 'Review approval status updated.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update review approval.',
        variant: 'destructive',
      });
    },
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Product Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {reviews?.map((review: any) => (
              <Card key={review.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{review.product?.name || 'Unknown Product'}</p>
                      <p className="text-xs text-muted-foreground">{review.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{review.customer_email}</p>
                    </div>
                    <Badge variant={review.approved ? 'default' : 'secondary'} className="text-xs">
                      {review.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm">{review.rating}/5</span>
                  </div>
                  
                  {review.comment && (
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(review.created_at), 'MMM dd, yyyy')}
                    </p>
                    <div className="flex items-center gap-1">
                      {!review.approved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateApprovalMutation.mutate({
                              reviewId: review.id,
                              approved: true,
                            })
                          }
                          className="h-8 text-xs"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                      )}
                      {review.approved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateApprovalMutation.mutate({
                              reviewId: review.id,
                              approved: false,
                            })
                          }
                          className="h-8 text-xs"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.map((review: any) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    {review.product?.name || 'Unknown Product'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{review.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{review.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm">{review.rating}/5</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="truncate">{review.comment || 'No comment'}</p>
                  </TableCell>
                  <TableCell>
                    {format(new Date(review.created_at), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={review.approved ? 'default' : 'secondary'}>
                      {review.approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!review.approved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateApprovalMutation.mutate({
                              reviewId: review.id,
                              approved: true,
                            })
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {review.approved && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateApprovalMutation.mutate({
                              reviewId: review.id,
                              approved: false,
                            })
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};