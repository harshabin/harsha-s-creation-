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
      setImages(['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80']);
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
      setError('Please provide at least one valid image URL');
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-stone-950 font-display">
              {product ? 'Edit Garment Details' : 'Add New Own-Brand Garment'}
            </h3>
            <p className="text-xs text-stone-500">Configure specifications, stock, and imagery</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Garment Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Heavyweight Loopback French Terry Hoodie"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-stone-950"
            />
          </div>

          {/* Category & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Gender Silhouette *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Base Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="2999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Discount Price (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="2499 (optional)"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
                Available Stock Units *
              </label>
              <input
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
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
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
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
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Product Images (URLs) *</span>
              </label>
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="text-xs font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Image URL</span>
              </button>
            </div>
            <div className="space-y-2">
              {images.map((img, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={img}
                    onChange={(e) => handleImageUrlChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageUrl(index)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100"
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
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1">
              Garment Description *
            </label>
            <textarea
              rows="3"
              required
              placeholder="Detail the cut, drape, custom hardware, styling advice..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white"
            />
          </div>

          {/* Fabric & Fit Details */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Fabric Composition & Care Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Composition</label>
                <input
                  type="text"
                  value={composition}
                  onChange={(e) => setComposition(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Care Guide</label>
                <input
                  type="text"
                  value={care}
                  onChange={(e) => setCare(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Fit Silhouette</label>
                <input
                  type="text"
                  value={fit}
                  onChange={(e) => setFit(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
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
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs font-semibold text-stone-700">Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={(e) => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
              />
              <span className="text-xs font-semibold text-stone-700">Mark as New Drop</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-stone-700 hover:bg-stone-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
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
