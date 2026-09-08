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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#E1E7F0]">
      {/* Page Header */}
      <div className="pb-8 border-b border-[#1E2430]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#99EEFF]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Atelier Catalog • Harsha's Creation Couture</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display mt-1">
              {selectedCategory ? `${selectedCategory} Collection` : 'All Atelier Silhouettes'}
            </h1>
            <p className="text-xs sm:text-sm text-[#8B95A5] mt-1.5">
              Showing {pagination.total} engineered luxury garments
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-[#11141B] border border-[#232A38] rounded-full text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 hover:border-[#99EEFF]/40"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#99EEFF]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-[#11141B] border border-[#232A38] rounded-full px-4 py-2 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#99EEFF]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-white bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-[#11141B] text-white">Sort by: Newest Drops</option>
                <option value="price_asc" className="bg-[#11141B] text-white">Price: Low to High</option>
                <option value="price_desc" className="bg-[#11141B] text-white">Price: High to Low</option>
                <option value="rating" className="bg-[#11141B] text-white">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(selectedCategory || selectedGender || selectedSize || searchParam) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-[#1E2430]">
            <span className="text-xs text-[#8B95A5] font-medium">Active filters:</span>

            {searchParam && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#161B24] text-white rounded-full text-xs font-medium border border-[#232A38]">
                Search: "{searchParam}"
                <button type="button" onClick={() => setSearchParams({})} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#161B24] text-white rounded-full text-xs font-medium border border-[#232A38]">
                {selectedCategory}
                <button type="button" onClick={() => setSelectedCategory('')} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedGender && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#161B24] text-white rounded-full text-xs font-medium border border-[#232A38]">
                Gender: {selectedGender}
                <button type="button" onClick={() => setSelectedGender('')} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSize && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#161B24] text-white rounded-full text-xs font-medium border border-[#232A38]">
                Size: {selectedSize}
                <button type="button" onClick={() => setSelectedSize('')} className="hover:text-rose-400">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-400 hover:underline ml-2"
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
                <div key={n} className="aspect-[3/4] bg-[#11141B] rounded-3xl border border-[#232A38] animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-[#11141B] rounded-3xl border border-[#232A38] p-8">
              <div className="w-16 h-16 rounded-full bg-[#161B24] border border-[#232A38] flex items-center justify-center text-[#8B95A5] mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">No matching garments found</h3>
              <p className="text-xs text-[#8B95A5] max-w-sm mx-auto mt-1 mb-6">
                Try widening your price range or clearing some category and size filters.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black rounded-full text-xs font-bold uppercase tracking-wider font-display"
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
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#0E1117] text-[#E1E7F0] shadow-2xl p-6 overflow-y-auto border-l border-[#232A38]">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E2430] mb-6">
                <h3 className="text-lg font-bold text-white font-display">Filter Garments</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#8B95A5] hover:text-white"
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
                className="w-full mt-6 py-3 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black rounded-full text-xs font-bold uppercase tracking-wider font-display shadow-cyan-subtle"
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
