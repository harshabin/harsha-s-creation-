import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatCurrency } from '../utils/formatters';
import SizeSelector from '../components/product/SizeSelector';
import ReviewSection from '../components/product/ReviewSection';
import ProductCard from '../components/product/ProductCard';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Check,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await productService.getProductById(id);
      if (res.success && res.data) {
        setProductData(res.data);
        if (res.data.product?.sizes?.length > 0) {
          setSelectedSize(res.data.product.sizes[0]);
        }
        if (res.data.product?.colors?.length > 0) {
          setSelectedColor(res.data.product.colors[0].name);
        }
      }
    } catch (err) {
      console.error('Error loading product details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-4 bg-stone-200 w-48 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-[3/4] bg-stone-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 w-3/4 rounded" />
            <div className="h-6 bg-stone-200 w-1/4 rounded" />
            <div className="h-24 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!productData || !productData.product) {
    return (
      <div className="max-w-md mx-auto my-24 text-center p-8 bg-white rounded-3xl border border-stone-200">
        <h3 className="text-xl font-bold text-stone-900 font-display">Product Not Found</h3>
        <p className="text-xs text-stone-500 mt-2 mb-6">This item may have been discontinued or sold out.</p>
        <Link to="/shop" className="px-6 py-2.5 bg-stone-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const { product, reviews, relatedProducts } = productData;
  const isFavorite = isInWishlist(product._id);
  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async () => {
    const res = await addToCart(product, selectedSize, selectedColor, quantity);
    if (res.success) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    await addToCart(product, selectedSize, selectedColor, quantity);
    navigate('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-stone-500 mb-8">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-stone-900">Shop</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-stone-900">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-950 font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Interactive Media Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 relative group shadow-sm">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md">
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-24 rounded-xl overflow-hidden bg-stone-100 border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-stone-950 ring-2 ring-stone-950/20 scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Buy Box & Specifications (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
                {product.category} • {product.gender} Silhouette
              </span>
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`p-2.5 rounded-full border transition-colors ${
                  isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
                title={isFavorite ? 'Saved to Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-display mt-1">
              {product.name}
            </h1>

            {/* Ratings Summary */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-stone-900">{product.rating || '4.9'}</span>
              <span className="text-xs text-stone-400">({product.numReviews || 0} reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-3xl font-extrabold text-stone-950 font-display">
              {formatCurrency(currentPrice)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base text-stone-400 line-through">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Save {formatCurrency(product.price - product.discountPrice)}
                </span>
              </>
            )}
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-900 block">
                Color: <span className="text-brand-600">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === c.name
                        ? 'border-stone-950 ring-2 ring-stone-950/20 scale-110'
                        : 'border-white hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <SizeSelector
            sizes={product.sizes}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
          />

          {/* Quantity & Stock */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center border border-stone-300 rounded-xl bg-white p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg disabled:opacity-30"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-stone-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right">
              {product.stock > 0 ? (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  ● In Stock ({product.stock} units ready)
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-950 hover:bg-stone-800 text-white'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag • {formatCurrency(currentPrice * quantity)}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full py-3.5 px-6 rounded-2xl text-xs font-bold uppercase tracking-widest bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-md"
            >
              Instant Buy Now
            </button>
          </div>

          {/* Delivery & Trust Highlights */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-brand-700" />
              <span>Complimentary Express Shipping on orders over ₹1,999</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-brand-700" />
              <span>14-day hassle-free exchanges with doorstep pickup</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-700" />
              <span>100% Genuine Own-Brand heavyweight textiles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="mt-16 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="flex border-b border-stone-200 gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'details'
                ? 'text-stone-950 border-b-2 border-stone-950'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Garment Story & Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fabric')}
            className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'fabric'
                ? 'text-stone-950 border-b-2 border-stone-950'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Fabric & Care Specs
          </button>
        </div>

        <div className="pt-6">
          {activeTab === 'details' ? (
            <div className="prose text-stone-700 text-sm leading-relaxed max-w-3xl">
              <p>{product.description}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <h5 className="font-bold text-stone-900 uppercase tracking-wider mb-1">Textile Composition</h5>
                <p className="text-stone-600">{product.fabricDetails?.composition || '100% Organic Heavyweight Cotton'}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <h5 className="font-bold text-stone-900 uppercase tracking-wider mb-1">Care & Longevity</h5>
                <p className="text-stone-600">{product.fabricDetails?.care || 'Machine wash cold, air dry in shade'}</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <h5 className="font-bold text-stone-900 uppercase tracking-wider mb-1">Silhouette & Fit</h5>
                <p className="text-stone-600">{product.fabricDetails?.fit || 'Custom Relaxed Drop-Shoulder Drape'}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ReviewSection
        productId={product._id}
        reviews={reviews}
        onReviewSubmitted={fetchProduct}
      />

      {/* Related Products Grid */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-stone-950 font-display">
              Pair With Similar Essentials
            </h3>
            <Link to={`/shop?category=${product.category}`} className="text-xs font-bold uppercase tracking-wider text-brand-700 hover:underline">
              View All {product.category}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
