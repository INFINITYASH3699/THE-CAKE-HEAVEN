// components/shop/product/ReviewSection.tsx
"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FiStar,
  FiMessageSquare,
  FiEdit,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";
import {
  createProductReview,
  fetchProductById,
  updateProductReview,
  deleteProductReview,
} from "@/redux/slices/productSlice";
import { RootState, AppDispatch } from "@/redux/store";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  reviews: initialReviews,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [localReviews, setLocalReviews] = useState<Review[]>(initialReviews);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { loading, product } = useSelector(
    (state: RootState) => state.products
  );

  // Update local reviews when props change
  useEffect(() => {
    if (initialReviews && initialReviews.length > 0) {
      setLocalReviews(initialReviews);
    }
  }, [initialReviews]);

  // Safely check for product reviews and use proper type checking
  const productReviews = Array.isArray(product?.reviews)
    ? (product.reviews as Review[])
    : [];

  // Display current reviews from product state if available, otherwise from props
  const displayReviews =
    productReviews.length > 0 ? productReviews : localReviews;

  // Check if user has already reviewed
  const userReview = displayReviews.find(
    (review) => user && review.user === user._id
  );

  const hasUserReviewed = !!userReview;

  // Start editing a review
  const handleEditReview = (review: Review) => {
    setRating(review.rating);
    setComment(review.comment);
    setEditingReviewId(review._id);
    setShowForm(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setRating(5);
    setComment("");
    setEditingReviewId(null);
    setShowForm(false);
  };

  // Confirm delete modal
  const showDeleteConfirmation = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setIsDeleting(true);
  };

  // Cancel delete
  const cancelDelete = () => {
    setReviewToDelete(null);
    setIsDeleting(false);
  };

  // Handle delete review
  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;

    try {
      await dispatch(
        deleteProductReview({
          productId,
          reviewId: reviewToDelete,
        })
      ).unwrap();

      toast.success("Review deleted successfully");

      // Refresh product data
      await dispatch(fetchProductById(productId)).unwrap();

      // Close delete modal
      setReviewToDelete(null);
      setIsDeleting(false);
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Submit the review (create or update)
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!comment.trim()) {
      setFormError("Please enter a review comment");
      return;
    }

    try {
      // If editing existing review
      if (editingReviewId) {
        await dispatch(
          updateProductReview({
            productId,
            reviewId: editingReviewId,
            review: {
              rating,
              comment,
            },
          })
        ).unwrap();

        toast.success("Review updated successfully!");
      } else {
        // Creating new review
        await dispatch(
          createProductReview({
            productId,
            review: {
              rating,
              comment,
            },
          })
        ).unwrap();

        toast.success("Review submitted successfully!");
      }

      // Fetch the updated product data to get the new/updated review
      await dispatch(fetchProductById(productId)).unwrap();

      // Reset form
      setComment("");
      setRating(5);
      setShowForm(false);
      setEditingReviewId(null);
    } catch (error) {
      // Error handling
      console.error("Failed to submit review:", error);
      setFormError(
        typeof error === "string"
          ? error
          : "Failed to submit review. Please try again."
      );
      toast.error("Failed to submit review");
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="mt-12 border-t pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>

        {isAuthenticated && !hasUserReviewed && !editingReviewId && (
          <button
            className="px-4 py-2 bg-pink-100 text-pink-600 rounded-md font-medium"
            onClick={() => setShowForm(!showForm)}
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            {editingReviewId ? "Edit your review" : "Share your thoughts"}
          </h3>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl text-yellow-400 focus:outline-none"
                  >
                    <FiStar className={star <= rating ? "fill-current" : ""} />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Review</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                required
              ></textarea>
              {formError && (
                <p className="text-red-500 text-sm mt-1">{formError}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:opacity-70"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : editingReviewId
                    ? "Update Review"
                    : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4 text-red-500">
              <FiAlertCircle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-medium">Delete Review</h3>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md mr-2 text-gray-700 hover:bg-gray-50"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleDeleteReview}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {displayReviews.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <FiMessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-500">Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayReviews.map((review) => (
            <div key={review._id} className="border-b pb-6">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="font-medium text-gray-800">
                    {review.name}
                  </span>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-4">
                    {formatDate(review.createdAt)}
                  </span>

                  {/* Edit/Delete buttons for user's own review */}
                  {isAuthenticated && user && review.user === user._id && (
                    <div className="flex">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="p-1.5 text-gray-500 hover:text-pink-500 transition mr-1"
                        aria-label="Edit review"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showDeleteConfirmation(review._id)}
                        className="p-1.5 text-gray-500 hover:text-red-500 transition"
                        aria-label="Delete review"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mt-2">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
