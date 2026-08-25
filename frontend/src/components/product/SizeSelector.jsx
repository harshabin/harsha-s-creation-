import React, { useState } from 'react';
import { Ruler, X } from 'lucide-react';

const SizeSelector = ({ sizes = [], selectedSize, onSelectSize }) => {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-900">
          Select Size: <span className="text-brand-600 font-extrabold">{selectedSize}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowSizeGuide(true)}
          className="text-xs font-semibold text-stone-600 hover:text-stone-950 flex items-center gap-1 underline underline-offset-2"
        >
          <Ruler className="w-3.5 h-3.5" />
          <span>Size Guide</span>
        </button>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                isSelected
                  ? 'bg-stone-950 text-white border-stone-950 shadow-md scale-105'
                  : 'bg-white text-stone-800 border-stone-300 hover:border-stone-500'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900 font-display">
                Atelier Garment Measurements (Inches)
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="p-1 text-stone-400 hover:text-stone-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-700 font-bold uppercase">
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Length</th>
                    <th className="p-2.5">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-600">
                  <tr><td className="p-2.5 font-bold text-stone-900">XS</td><td className="p-2.5">38"</td><td className="p-2.5">26.5"</td><td className="p-2.5">18.5"</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">S</td><td className="p-2.5">40"</td><td className="p-2.5">27.5"</td><td className="p-2.5">19.5"</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">M</td><td className="p-2.5">42"</td><td className="p-2.5">28.5"</td><td className="p-2.5">20.5"</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">L</td><td className="p-2.5">44"</td><td className="p-2.5">29.5"</td><td className="p-2.5">21.5"</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">XL</td><td className="p-2.5">46"</td><td className="p-2.5">30.5"</td><td className="p-2.5">22.5"</td></tr>
                  <tr><td className="p-2.5 font-bold text-stone-900">XXL</td><td className="p-2.5">48"</td><td className="p-2.5">31.5"</td><td className="p-2.5">23.5"</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-stone-400 mt-4 leading-relaxed">
              *All pieces feature our custom relaxed drop-shoulder cut. If you prefer a tailored fit, choose one size down.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
