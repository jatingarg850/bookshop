'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

interface ReviewSectionProps {
  productSlug: string;
}

export function ReviewSection({ productSlug }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    guestName: '',
    guestEmail: '',
  });

  useEffect(() => {
    fetchReviews();
  }, [productSlug]);

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setAvgRating(parseFloat(data.avgRating));
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({
          rating: 5,
          title: '',
          comment: '',
          guestName: '',
          guestEmail: '',
        });
        setShowForm(false);
        fetchReviews();
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-12 pt-12 border-t">
      <h2 className="font-heading text-2xl font-bold mb-6">Customer Reviews</h2>

      {/* Rating Summary */}
      <Card className="mb-8">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary-600 mb-2">{avgRating}</div>
            <div className="flex gap-1 justify-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-2xl">
                  {i < Math.round(avgRating) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex-1">
            {!showForm && (
              <Button onClick={() => setShowForm(true)} className="w-full">
                {session ? 'Write a Review' : 'Sign in to Review'}
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Review Form */}
      {showForm && (
        <Card className="mb-8">
          <h3 className="font-heading text-xl font-bold mb-4">Write Your Review</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    {star <= formData.rating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Review Title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                required
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
              />
            </div>

            {!session && (
              <>
                <Input
                  label="Your Name"
                  required
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                />
                <Input
                  label="Your Email"
                  type="email"
                  required
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                />
              </>
            )}

            <div className="flex gap-4">
              <Button type="submit" isLoading={submitting}>
                Submit Review
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Reviews List */}
      {loading ? (
        <p className="text-center text-gray-600">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-600">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review._id}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{review.title}</h4>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-lg">
                        {i < review.rating ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{review.comment}</p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  By {review.userId ? 'Verified Buyer' : review.guestName || 'Anonymous'}
                </span>
                <span>{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
