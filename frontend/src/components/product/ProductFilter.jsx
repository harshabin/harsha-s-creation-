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
    <div className="bg-[#11141B] rounded-3xl border border-[#232A38] p-6 space-y-6 shadow-card text-[#E1E7F0]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#1E2430]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#99EEFF]" />
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white font-display">
            Refine Atelier
          </h3>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-[11px] font-semibold text-[#8B95A5] hover:text-[#99EEFF] flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B95A5] mb-3">
          Silhouette Category
        </h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat || (cat === 'All' && !selectedCategory);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat === 'All' ? '' : cat)}
                className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#99EEFF] text-black font-bold shadow-cyan-subtle'
                    : 'text-[#8B95A5] hover:bg-[#161B24] hover:text-white'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender Selection */}
      <div className="pt-4 border-t border-[#1E2430]">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B95A5] mb-3">
          Gender / Line
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {GENDERS.map((gender) => {
            const isSelected = selectedGender === gender || (gender === 'All' && !selectedGender);
            return (
              <button
                key={gender}
                type="button"
                onClick={() => setSelectedGender(gender === 'All' ? '' : gender)}
                className={`py-2 px-3 rounded-full text-xs font-medium text-center transition-all ${
                  isSelected
                    ? 'bg-[#99EEFF] text-black font-bold shadow-cyan-subtle'
                    : 'bg-[#161B24] border border-[#232A38] text-[#8B95A5] hover:text-white hover:border-[#99EEFF]/40'
                }`}
              >
                {gender}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sizes Selection */}
      <div className="pt-4 border-t border-[#1E2430]">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B95A5] mb-3">
          Measurement / Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                className={`py-2 rounded-full text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-[#99EEFF] text-black border-[#99EEFF] shadow-cyan-subtle'
                    : 'bg-[#161B24] border-[#232A38] text-[#8B95A5] hover:text-white hover:border-[#99EEFF]/40'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="pt-4 border-t border-[#1E2430]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B95A5]">
            Upper Price Limit
          </h4>
          <span className="text-xs font-bold text-[#99EEFF]">
            {formatCurrency(priceRange)}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="8000"
          step="250"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-1.5 bg-[#1E2430] rounded-lg appearance-none cursor-pointer accent-[#99EEFF]"
        />
        <div className="flex justify-between text-[10px] text-[#8B95A5] font-semibold mt-1.5">
          <span>₹500</span>
          <span>₹8,000+</span>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
