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
    <div className="mt-16 pt-12 border-t border-[#1E2430] text-[#E1E7F0]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#1E2430]">
        <div>
          <h3 className="text-2xl font-bold text-white font-display">
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
                      : 'text-stone-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-extrabold text-white font-display">{avgRating} out of 5</span>
            <span className="text-xs text-[#8B95A5]">Based on {reviews.length} verified ratings</span>
          </div>
        </div>

        {user ? (
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="self-start px-5 py-2.5 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black font-bold font-display rounded-full text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-cyan-subtle"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showForm ? 'Cancel Review' : 'Write a Review'}</span>
          </button>
        ) : (
          <a
            href="/login"
            className="self-start px-5 py-2.5 bg-[#11141B] hover:bg-[#161B24] border border-[#232A38] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Sign in to Write Review
          </a>
        )}
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="my-8 p-6 bg-[#11141B] rounded-3xl border border-[#232A38] space-y-4 animate-fade-in text-[#E1E7F0]">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            Share Your Experience with this Garment
          </h4>

          {/* Star Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#8B95A5] mb-1.5">Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-stone-600 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoverRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-700'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-[#99EEFF]">{rating} Stars</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8B95A5] mb-1">Headline / Summary</label>
            <input
              type="text"
              placeholder="e.g. Exceptional heavyweight fabric & flawless drape"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[#161B24] border border-[#232A38] rounded-xl text-white placeholder-[#8B95A5] focus:outline-none focus:border-[#99EEFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8B95A5] mb-1">Detailed Review *</label>
            <textarea
              rows="3"
              required
              placeholder="Tell other customers about the fit, fabric feel, durability, and styling..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[#161B24] border border-[#232A38] rounded-xl text-white placeholder-[#8B95A5] focus:outline-none focus:border-[#99EEFF]"
            />
          </div>

          {errorMessage && (
            <p className="text-xs font-semibold text-rose-400">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black font-bold font-display rounded-full text-xs uppercase tracking-wider transition-all shadow-cyan-subtle disabled:opacity-50"
          >
            {submitting ? 'Publishing...' : 'Submit Review'}
          </button>
        </form>
      )}

      {successMessage && (
        <div className="my-4 p-4 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 rounded-2xl text-xs font-semibold">
          {successMessage}
        </div>
      )}

      {/* Reviews List */}
      <div className="mt-8 space-y-6 divide-y divide-[#1E2430]">
        {reviews.length === 0 ? (
          <p className="text-xs text-[#8B95A5] py-6">Be the first to review this atelier garment!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="pt-6 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#161B24] border border-[#232A38] text-[#99EEFF] flex items-center justify-center text-xs font-bold uppercase font-display">
                    {rev.user?.name ? rev.user.name.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-bold text-white">
                    {rev.user?.name || 'Verified Customer'}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                    <CheckCircle className="w-3 h-3" />
                    Verified Purchase
                  </span>
                </div>
                <span className="text-[11px] text-[#8B95A5]">{formatDate(rev.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                    }`}
                  />
                ))}
              </div>

              {rev.title && <h5 className="text-sm font-bold text-white font-display">{rev.title}</h5>}
              <p className="text-xs text-[#8B95A5] leading-relaxed">{rev.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
