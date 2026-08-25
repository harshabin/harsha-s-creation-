import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductFilter from '../components/product/ProductFilter';
import { SlidersHorizontal, ArrowUpDown, X, Search, Sparkles } from 'lucide-react';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State from URL query parameters
  const categoryParam = searchParams.get('category') || '';
  const genderParam = searchParams.get('gender') || '';
  const sizeParam = searchParams.get('size') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const searchParam = searchParams.get('search') || '';
  const isFeaturedParam = searchParams.get('isFeatured') || '';
  const isNewArrivalParam = searchParams.get('isNewArrival') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedGender, setSelectedGender] = useState(genderParam);
  const [selectedSize, setSelectedSize] = useState(sizeParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [priceRange, setPriceRange] = useState(8000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Sync state when URL search params change
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedGender(searchParams.get('gender') || '');
    setSelectedSize(searchParams.get('size') || '');
    setSortBy(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Fetch products whenever filters update
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const query = {
          sort: sortBy,
          maxPrice: priceRange,
          page: 1,
          limit: 24
        };

        if (selectedCategory) query.category = selectedCategory;
        if (selectedGender) query.gender = selectedGender;
        if (selectedSize) query.size = selectedSize;
        if (searchParam) query.search = searchParam;
        if (isFeaturedParam) query.isFeatured = isFeaturedParam;
        if (isNewArrivalParam) query.isNewArrival = isNewArrivalParam;

        const res = await productService.getProducts(query);
        if (res.success) {
          setProducts(res.data);
          setPagination(res.pagination);
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, selectedGender, selectedSize, sortBy, priceRange, searchParam, isFeaturedParam, isNewArrivalParam]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedGender('');
    setSelectedSize('');
    setPriceRange(8000);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="pb-8 border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Atelier Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-950 font-display mt-1">
              {selectedCategory ? `${selectedCategory} Collection` : 'All Own-Brand Apparel'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Showing {pagination.total} engineered luxury garments
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-3 py-1.5 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-stone-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="newest">Sort by: Newest Drops</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(selectedCategory || selectedGender || selectedSize || searchParam) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-stone-100">
            <span className="text-xs text-stone-400 font-medium">Active filters:</span>

            {searchParam && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 text-white rounded-full text-xs font-medium">
                Search: "{searchParam}"
                <button type="button" onClick={() => setSearchParams({})} className="hover:text-stone-300">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-xs font-medium border border-stone-200">
                {selectedCategory}
                <button type="button" onClick={() => setSelectedCategory('')} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedGender && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-xs font-medium border border-stone-200">
                Gender: {selectedGender}
                <button type="button" onClick={() => setSelectedGender('')} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSize && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-xs font-medium border border-stone-200">
                Size: {selectedSize}
                <button type="button" onClick={() => setSelectedSize('')} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-600 hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Grid & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Desktop Sidebar Filter */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28">
            <ProductFilter
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="aspect-[3/4] bg-stone-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 font-display">No matching garments found</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-6">
                Try widening your price range or clearing some category and size filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-stone-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-800"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
                <h3 className="text-lg font-bold text-stone-900 font-display">Filter Garments</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-500 hover:text-stone-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilter
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                onResetFilters={handleResetFilters}
              />

              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-6 py-3 bg-stone-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
