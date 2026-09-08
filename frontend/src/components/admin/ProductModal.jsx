import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { productService } from '../../services/productService';

const CATEGORIES = ['Hoodies', 'T-Shirts', 'Jackets', 'Shirts', 'Pants', 'Dresses', 'Accessories'];
const GENDERS = ['Men', 'Women', 'Unisex'];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const ProductModal = ({ isOpen, onClose, product, onSaveSuccess }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Hoodies');
  const [gender, setGender] = useState('Unisex');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState(20);
  const [images, setImages] = useState(['']);
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL']);
  const [composition, setComposition] = useState('100% Premium Combed Cotton (480 GSM)');
  const [care, setCare] = useState('Machine wash cold, gentle cycle, hang dry');
  const [fit, setFit] = useState('Relaxed Oversized Drop-Shoulder Fit');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setCategory(product.category || 'Hoodies');
      setGender(product.gender || 'Unisex');
      setPrice(product.price || '');
      setDiscountPrice(product.discountPrice || '');
      setStock(product.stock !== undefined ? product.stock : 20);
      setImages(product.images && product.images.length > 0 ? product.images : ['']);
      setDescription(product.description || '');
      setSizes(product.sizes || ['S', 'M', 'L', 'XL']);
      setComposition(product.fabricDetails?.composition || '100% Cotton');
      setCare(product.fabricDetails?.care || 'Machine wash cold');
      setFit(product.fabricDetails?.fit || 'Relaxed Fit');
      setIsFeatured(product.isFeatured || false);
      setIsNewArrival(product.isNewArrival || false);
    } else {
      // Defaults for new product
      setName('');
      setCategory('Hoodies');
      setGender('Unisex');
      setPrice('');
      setDiscountPrice('');
      setStock(25);
      setImages(['/assets/products/hoodie_black.jpg']);
      setDescription('');
      setSizes(['S', 'M', 'L', 'XL']);
      setComposition('100% Organic Heavyweight French Terry (480 GSM)');
      setCare('Machine wash cold inside out, line dry in shade');
      setFit('Signature Relaxed Drop-Shoulder Silhouette');
      setIsFeatured(false);
      setIsNewArrival(true);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleAddImageUrl = () => {
    setImages([...images, '']);
  };

  const handleImageUrlChange = (index, value) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleRemoveImageUrl = (index) => {
    if (images.length === 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleSize = (size) => {
    if (sizes.includes(size)) {
      if (sizes.length > 1) {
        setSizes(sizes.filter((s) => s !== size));
      }
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const validImages = images.filter((img) => img.trim() !== '');
    if (validImages.length === 0) {
      setError('Please provide at least one valid image URL or path');
      setSaving(false);
      return;
    }

    const payload = {
      name,
      category,
      gender,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: Number(stock),
      images: validImages,
      description,
      sizes,
      fabricDetails: {
        composition,
        care,
        fit
      },
      isFeatured,
      isNewArrival
    };

    try {
      if (product && product._id) {
        await productService.updateProduct(product._id, payload);
      } else {
        await productService.createProduct(payload);
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#11141B] border border-[#232A38] text-[#E1E7F0] rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#232A38] sticky top-0 bg-[#11141B]/95 backdrop-blur-sm z-10">
          <div>
            <h3 className="text-xl font-bold text-white font-display">
              {product ? 'Edit Garment Details' : 'Add New Own-Brand Garment'}
            </h3>
            <p className="text-xs text-[#8B95A5]">Configure specifications, stock, and imagery</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8B95A5] hover:text-white rounded-full hover:bg-[#161B24] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-4 p-3 bg-rose-950/40 border border-rose-800/60 text-rose-300 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
              Garment Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Heavyweight Loopback French Terry Hoodie"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
            />
          </div>

          {/* Category & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#11141B] text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
                Gender Silhouette *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g} className="bg-[#11141B] text-white">{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
                Base Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="2999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
                Discount Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="2499 (optional)"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
                Available Stock Units *
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-2 font-mono">
              Available Sizes
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => {
                const isSelected = sizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#99EEFF] text-black border-[#99EEFF] shadow-cyan-subtle'
                        : 'bg-[#161B24] text-[#8B95A5] border-[#232A38] hover:border-[#99EEFF]/40'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image URLs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#8B95A5] flex items-center gap-1.5 font-mono">
                <ImageIcon className="w-3.5 h-3.5 text-[#99EEFF]" />
                <span>Product Images (Paths or URLs) *</span>
              </label>
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="text-xs font-semibold text-[#99EEFF] hover:text-[#B3F2FF] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image Slot</span>
              </button>
            </div>
            <div className="space-y-2">
              {images.map((img, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    placeholder="/assets/products/hoodie_black.jpg or image URL"
                    value={img}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrl(index)}
                      className="p-2 text-[#8B95A5] hover:text-rose-400 rounded-lg hover:bg-[#161B24] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B95A5] mb-1 font-mono">
              Garment Description *
            </label>
            <textarea
              rows="3"
              required
              placeholder="Detail the cut, drape, custom hardware, styling advice..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-[#161B24] border border-[#232A38] text-white rounded-xl focus:border-[#99EEFF] focus:outline-none transition-colors"
            />
          </div>

          {/* Fabric & Fit Details */}
          <div className="p-4 bg-[#161B24]/70 rounded-2xl border border-[#232A38] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#99EEFF]"></span>
              Fabric Composition & Care Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#8B95A5] mb-1">Composition</label>
                <input
                  type="text"
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#11141B] border border-[#232A38] text-white rounded-lg focus:border-[#99EEFF] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#8B95A5] mb-1">Care Guide</label>
                <input
                  type="text"
                  value={care}
                  onChange={(e) => setCare(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#11141B] border border-[#232A38] text-white rounded-lg focus:border-[#99EEFF] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#8B95A5] mb-1">Fit Silhouette</label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#11141B] border border-[#232A38] text-white rounded-lg focus:border-[#99EEFF] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded accent-[#99EEFF]"
              />
              <span className="text-xs font-semibold text-[#E1E7F0]">Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 rounded accent-[#99EEFF]"
              />
              <span className="text-xs font-semibold text-[#E1E7F0]">Mark as New Drop</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232A38]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#8B95A5] hover:text-white hover:bg-[#161B24] border border-[#232A38] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#99EEFF] hover:bg-[#B3F2FF] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-cyan-subtle disabled:opacity-50 font-display"
            >
              {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;

