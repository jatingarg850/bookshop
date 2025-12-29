'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchReviews();
  }, [page]);

  async function fetchReviews() {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const res = await fetch(`/api/admin/reviews?${params}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview(reviewId: string) {
    if (!confirm('Delete this review?')) return;

    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  }

  const pages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <h1 className="font-heading text-3xl font-bold mb-8">Reviews Management</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-600">No reviews found</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {reviews.map((review) => (
              <Card key={review._id}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{review.title}</h3>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={i < review.rating ? '⭐' : '☆'}>
                            {i < review.rating ? '⭐' : '☆'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Product: <span className="font-semibold">{review.productId?.name}</span>
                    </p>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>
                        By: {review.userId ? 'Registered User' : review.guestName || 'Anonymous'}
                      </span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteReview(review._id)}
                    className="text-red-600 border-red-300"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? 'primary' : 'outline'}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
