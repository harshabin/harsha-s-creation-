import React, { useState } from 'react';
import { Ruler, X } from 'lucide-react';

const SizeSelector = ({ sizes = [], selectedSize, onSelectSize }) => {
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#E1E7F0]">
          Select Size: <span className="text-[#99EEFF] font-extrabold">{selectedSize}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowSizeGuide(true)}
          className="text-xs font-semibold text-[#8B95A5] hover:text-[#99EEFF] flex items-center gap-1 underline underline-offset-2 transition-colors"
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
              className={`py-2.5 px-3 rounded-xl text-xs font-bold font-display transition-all border ${
                isSelected
                  ? 'bg-[#99EEFF] text-black border-[#99EEFF] shadow-cyan-subtle scale-105'
                  : 'bg-[#11141B] text-[#8B95A5] border-[#232A38] hover:border-[#99EEFF]/40 hover:text-white'
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#11141B] border border-[#232A38] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-[#E1E7F0]">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2430]">
              <h3 className="text-base font-bold text-white font-display">
                Atelier Garment Measurements (Inches)
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeGuide(false)}
                className="p-1 text-[#8B95A5] hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#232A38] bg-[#161B24] text-[#8B95A5] font-bold uppercase tracking-wider">
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest</th>
                    <th className="p-2.5">Length</th>
                    <th className="p-2.5">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2430] text-[#8B95A5]">
                  <tr><td className="p-2.5 font-bold text-white">XS</td><td className="p-2.5">38"</td><td className="p-2.5">26.5"</td><td className="p-2.5">18.5"</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">S</td><td className="p-2.5">40"</td><td className="p-2.5">27.5"</td><td className="p-2.5">19.5"</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">M</td><td className="p-2.5">42"</td><td className="p-2.5">28.5"</td><td className="p-2.5">20.5"</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">L</td><td className="p-2.5">44"</td><td className="p-2.5">29.5"</td><td className="p-2.5">21.5"</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">XL</td><td className="p-2.5">46"</td><td className="p-2.5">30.5"</td><td className="p-2.5">22.5"</td></tr>
                  <tr><td className="p-2.5 font-bold text-white">XXL</td><td className="p-2.5">48"</td><td className="p-2.5">31.5"</td><td className="p-2.5">23.5"</td></tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-[#8B95A5] mt-4 leading-relaxed">
              *All pieces feature our custom relaxed drop-shoulder cut. If you prefer a tailored fit, choose one size down.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
