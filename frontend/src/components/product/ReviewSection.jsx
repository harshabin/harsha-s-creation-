import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { formatDate } from '../../utils/formatters';

const ReviewSection = ({ productId, reviews = [], onReviewSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await productService.createReview(productId, {
        rating,
        title,
        comment
      });

      if (res.success) {
        setSuccessMessage('Thank you! Your verified review has been published.');
        setTitle('');
        setComment('');
        setShowForm(false);
        if (onReviewSubmitted) onReviewSubmitted();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="mt-16 pt-12 border-t border-stone-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-stone-100">
        <div>
          <h3 className="text-2xl font-bold text-stone-900 font-display">
            Customer Reviews ({reviews.length})
          </h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(Number(avgRating))
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-stone-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-extrabold text-stone-950 font-display">{avgRating} out of 5</span>
            <span className="text-xs text-stone-500">Based on {reviews.length} verified ratings</span>
          </div>
        </div>

        {user ? (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="self-start px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showForm ? 'Cancel Review' : 'Write a Review'}</span>
          </button>
        ) : (
          <a
            href="/login"
            className="self-start px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Sign in to Write Review
          </a>
        )}
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="my-8 p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 animate-fade-in">
          <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Share Your Experience with this Garment
          </h4>

          {/* Star Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-stone-300 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-stone-700">{rating} Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Headline / Summary</label>
            <input
              type="text"
              placeholder="e.g. Exceptional heavyweight fabric & flawless drape"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-stone-950"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Review *</label>
            <textarea
              rows="3"
              required
              placeholder="Tell other customers about the fit, fabric feel, durability, and styling..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-stone-950"
            />
          </div>

          {errorMessage && (
            <p className="text-xs font-semibold text-rose-600">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {submitting ? 'Publishing...' : 'Submit Review'}
          </button>
        </form>
      )}

      {successMessage && (
        <div className="my-4 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
          {successMessage}
        </div>
      )}

      {/* Reviews List */}
      <div className="mt-8 space-y-6 divide-y divide-stone-100">
        {reviews.length === 0 ? (
          <p className="text-xs text-stone-400 py-6">Be the first to review this own-brand garment!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="pt-6 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center text-xs font-bold uppercase">
                    {rev.user?.name ? rev.user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    {rev.user?.name || 'Verified Customer'}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle className="w-3 h-3" />
                    Verified Purchase
                  </span>
                </div>
                <span className="text-[11px] text-stone-400">{formatDate(rev.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>

              {rev.title && <h5 className="text-sm font-bold text-stone-900">{rev.title}</h5>}
              <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
