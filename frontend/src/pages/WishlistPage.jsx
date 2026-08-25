import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-6 border-b border-stone-200">
        <h1 className="text-3xl font-extrabold text-stone-950 font-display">Saved Pieces</h1>
        <p className="text-xs text-stone-500 mt-1">
          {wishlist.length} {wishlist.length === 1 ? 'garment' : 'garments'} saved in your private wishlist
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 mt-8">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 font-display">Your Wishlist is Empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-6">
            Save your favorite own-brand items to easily find and purchase them later.
          </p>
          <Link
            to="/shop"
            className="px-6 py-2.5 bg-stone-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-800"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
