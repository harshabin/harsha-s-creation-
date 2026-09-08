import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingBag, Check, ArrowUpRight } from 'lucide-react';
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

  const primaryImage = product.images?.[0] || '/assets/products/hoodie_black.jpg';
  const hoverImage = product.images?.[1] || primaryImage;

  return (
    <div
      className="group relative flex flex-col bg-[#11141B] rounded-3xl border border-[#232A38] overflow-hidden hover:border-[#99EEFF]/50 transition-all duration-500 hover:shadow-cyan-glow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Box with Smooth Zoom */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0C0E14]">
        <Link to={`/shop/${product._id || product.slug}`}>
          <img
            src={isHovered ? hoverImage : primaryImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-rose-500/90 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-widest rounded-full shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 bg-[#99EEFF] text-black text-[9px] font-extrabold uppercase tracking-widest rounded-full shadow-cyan-subtle">
              New Drop
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2.5 py-1 bg-amber-400/90 text-black text-[9px] font-extrabold uppercase tracking-widest rounded-full">
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
          className={`absolute top-3.5 right-3.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isFavorite
              ? 'bg-[#99EEFF] text-black shadow-cyan-subtle'
              : 'bg-[#08090C]/70 text-[#8B95A5] hover:text-white border border-[#232A38] hover:border-[#99EEFF]/40'
          }`}
          title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-black' : ''}`} />
        </button>

        {/* Quick Size Selection Overlay */}
        <div
          className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#08090C] via-[#08090C]/80 to-transparent transition-all duration-300 flex flex-col gap-2 ${
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
                className={`w-7 h-7 rounded-full text-[10px] font-bold tracking-wider transition-all border ${
                  selectedSize === size
                    ? 'bg-[#99EEFF] text-black border-[#99EEFF] shadow-cyan-subtle scale-105'
                    : 'bg-[#161B24] border-[#232A38] text-stone-300 hover:text-white hover:border-[#99EEFF]/50'
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
            className={`w-full py-2 px-3 rounded-full text-xs font-bold uppercase tracking-widest font-display transition-all flex items-center justify-center gap-1.5 ${
              addedAnimation
                ? 'bg-emerald-500 text-black'
                : 'bg-white hover:bg-[#99EEFF] text-black shadow-md'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : product.stock === 0 ? (
              <span>Sold Out</span>
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
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-[#11141B]">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold uppercase tracking-[0.15em] text-[9px] text-[#99EEFF]">
              {product.category} • {product.gender}
            </span>
            <div className="flex items-center gap-1 text-[#8B95A5] font-semibold text-[10px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-[#8B95A5]/60 font-normal">({product.numReviews || 14})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link
            to={`/shop/${product._id || product.slug}`}
            className="text-sm sm:text-base font-bold text-white group-hover:text-[#99EEFF] transition-colors line-clamp-1 block font-display tracking-tight"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Link */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#1E2430]">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-extrabold text-white font-display">
              {formatCurrency(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#8B95A5] line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <Link
            to={`/shop/${product._id || product.slug}`}
            className="w-8 h-8 rounded-full border border-[#232A38] bg-[#161B24] group-hover:border-[#99EEFF] group-hover:bg-[#99EEFF] group-hover:text-black text-stone-300 flex items-center justify-center transition-all"
            title="View Product"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
