import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorite = isInWishlist(product._id);
  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const colorName = product.colors?.[0]?.name || '';
    const res = await addToCart(product, selectedSize, colorName, 1);
    if (res.success) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 2000);
    }
  };

  const primaryImage = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
  const hoverImage = product.images?.[1] || primaryImage;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/80 overflow-hidden hover:shadow-xl hover:border-stone-300 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Box */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100">
        <Link to={`/shop/${product._id || product.slug}`}>
          <img
            src={isHovered ? hoverImage : primaryImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 bg-stone-900 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-sm">
              New Drop
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2.5 py-1 bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-sm">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorite
              ? 'bg-rose-50 text-rose-600 shadow-md'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-stone-900 shadow-sm'
          }`}
          title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Quick Size Selection Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 flex flex-col gap-2 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            {product.sizes?.map((size) => (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`w-7 h-7 rounded-md text-[11px] font-bold transition-all ${
                  selectedSize === size
                    ? 'bg-white text-stone-950 shadow-md scale-105'
                    : 'bg-black/40 text-white hover:bg-black/60'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={product.stock === 0}
            className={`w-full py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              addedAnimation
                ? 'bg-emerald-600 text-white'
                : 'bg-white hover:bg-stone-100 text-stone-950 shadow-md'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag!</span>
              </>
            ) : product.stock === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add • {selectedSize}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-brand-700">
              {product.category} • {product.gender}
            </span>
            <div className="flex items-center gap-1 text-stone-800 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-stone-400 font-normal">({product.numReviews || 12})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link
            to={`/shop/${product._id || product.slug}`}
            className="text-sm font-semibold text-stone-900 group-hover:text-brand-700 transition-colors line-clamp-1 block"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Color Swatches */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-stone-950 font-display">
              {formatCurrency(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center -space-x-1">
              {product.colors.slice(0, 3).map((c, i) => (
                <span
                  key={i}
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] text-stone-500 pl-1">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
