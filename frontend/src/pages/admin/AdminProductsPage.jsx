import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../utils/formatters';
import ProductModal from '../../components/admin/ProductModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({ limit: 100 });
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await productService.deleteProduct(id);
      if (res.success) {
        setProducts(products.filter((p) => p._id !== id));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-display">
            Apparel Catalog & Inventory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage own-brand items, pricing, sizes, textile descriptions, and stock counts
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="px-5 py-3 bg-stone-950 hover:bg-stone-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by garment title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-1 focus:ring-stone-950"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-medium">Department:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold text-stone-800 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Hoodies">Hoodies</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Jackets">Jackets</option>
            <option value="Shirts">Shirts</option>
            <option value="Pants">Pants</option>
            <option value="Dresses">Dresses</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-xs text-stone-400">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-400">No matching garments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock Units</th>
                  <th className="p-4">Sizes</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]}
                          alt=""
                          className="w-12 h-14 rounded-xl object-cover bg-stone-100 border border-stone-200"
                        />
                        <div>
                          <p className="font-bold text-stone-900 line-clamp-1">{product.name}</p>
                          <p className="text-stone-400 text-[11px]">
                            {product.isFeatured ? '⭐ Featured' : ''} {product.isNewArrival ? '🔥 New Drop' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-stone-800">{product.category}</td>
                    <td className="p-4 text-stone-600">{product.gender}</td>
                    <td className="p-4">
                      <p className="font-bold text-stone-950">
                        {formatCurrency(product.discountPrice > 0 ? product.discountPrice : product.price)}
                      </p>
                      {product.discountPrice > 0 && (
                        <p className="text-[10px] text-stone-400 line-through">
                          {formatCurrency(product.price)}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      {product.stock <= 5 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Low: {product.stock} left
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {product.stock} in stock
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {product.sizes?.map((sz) => (
                          <span key={sz} className="px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded text-[10px] font-semibold">
                            {sz}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit Garment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirmId === product._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(product._id)}
                              className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 bg-stone-200 text-stone-700 rounded text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(product._id)}
                            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Garment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editingProduct}
        onSaveSuccess={fetchProducts}
      />
    </div>
  );
};

export default AdminProductsPage;
