import React from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const CATEGORIES = ['All', 'Hoodies', 'T-Shirts', 'Jackets', 'Shirts', 'Pants', 'Dresses', 'Accessories'];
const GENDERS = ['All', 'Men', 'Women', 'Unisex'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ProductFilter = ({
  selectedCategory,
  setSelectedCategory,
  selectedGender,
  setSelectedGender,
  selectedSize,
  setSelectedSize,
  priceRange,
  setPriceRange,
  onResetFilters
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-700" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-950 font-display">
            Refine Catalog
          </h3>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
          Category
        </h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat || (cat === 'All' && !selectedCategory);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-stone-950 text-white font-semibold shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender Selection */}
      <div className="pt-4 border-t border-stone-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
          Gender / Collection
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {GENDERS.map((gender) => {
            const isSelected = selectedGender === gender || (gender === 'All' && !selectedGender);
            return (
              <button
                key={gender}
                type="button"
                onClick={() => setSelectedGender(gender === 'All' ? '' : gender)}
                className={`py-2 px-3 rounded-xl text-xs font-medium text-center transition-all ${
                  isSelected
                    ? 'bg-brand-600 text-white font-bold shadow-sm'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {gender}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes Selection */}
      <div className="pt-4 border-t border-stone-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
          Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-stone-950 text-white border-stone-950 shadow-sm'
                    : 'bg-white text-stone-800 border-stone-200 hover:border-stone-400'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-stone-100">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Price Range
          </h4>
          <span className="text-xs font-bold text-stone-950">
            Up to {formatCurrency(priceRange)}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="8000"
          step="250"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-950"
        />
        <div className="flex justify-between text-[10px] text-stone-400 font-semibold mt-1">
          <span>₹500</span>
          <span>₹8,000+</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
