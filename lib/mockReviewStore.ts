export type MockReview = {
  _id: string;
  productSlug: string;
  rating: number;
  title: string;
  comment: string;
  userEmail?: string;
  guestName?: string;
  guestEmail?: string;
  isApproved: boolean;
  createdAt: string;
};

type ReviewStore = Map<string, MockReview[]>;

const globalForReviews = globalThis as unknown as { __mockReviews?: ReviewStore };
const store: ReviewStore = globalForReviews.__mockReviews ?? new Map();

// Persist across hot reloads in dev.
if (!globalForReviews.__mockReviews) {
  globalForReviews.__mockReviews = store;
}

export function listMockReviews(productSlug: string): MockReview[] {
  return store.get(productSlug) ?? [];
}

export function addMockReview(productSlug: string, review: MockReview) {
  const current = store.get(productSlug) ?? [];
  store.set(productSlug, [review, ...current]);
}
