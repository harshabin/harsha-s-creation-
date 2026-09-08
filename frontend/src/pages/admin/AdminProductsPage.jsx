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
    <div className="space-y-6 text-[#E1E7F0]">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Apparel Catalog & Inventory
          </h1>
          <p className="text-xs text-[#8B95A5] mt-1">
            Manage Harsha's Creation pieces, pricing, sizes, textile descriptions, and stock counts
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="px-6 py-3 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black rounded-full text-xs font-bold uppercase tracking-widest font-display flex items-center gap-2 transition-all shadow-cyan-subtle"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Garment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#11141B] rounded-3xl border border-[#232A38] p-4 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-xl">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by garment title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#161B24] border border-[#232A38] rounded-xl text-white placeholder-[#8B95A5] focus:outline-none focus:border-[#99EEFF]"
          />
          <Search className="w-4 h-4 text-[#8B95A5] absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-[#8B95A5] font-medium">Department:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#161B24] border border-[#232A38] rounded-xl focus:border-[#99EEFF] focus:outline-none cursor-pointer"
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
      <div className="bg-[#11141B] rounded-3xl border border-[#232A38] overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-xs text-[#8B95A5] animate-pulse">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#8B95A5]">No matching garments found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161B24] border-b border-[#1E2430] text-[#8B95A5] font-bold uppercase tracking-wider">
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
              <tbody className="divide-y divide-[#1E2430]">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-[#161B24]/60 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images?.[0]}
                          alt=""
                          className="w-12 h-14 rounded-xl object-cover bg-stone-900 border border-[#232A38]"
                        />
                        <div>
                          <p className="font-bold text-white font-display line-clamp-1">{product.name}</p>
                          <p className="text-[#8B95A5] text-[11px] mt-0.5">
                            {product.isFeatured ? '✦ Featured' : ''} {product.isNewArrival ? '• New Drop' : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-[#E1E7F0]">{product.category}</td>
                    <td className="p-4 text-[#8B95A5]">{product.gender}</td>
                    <td className="p-4">
                      <p className="font-bold text-[#99EEFF] font-display">
                        {formatCurrency(product.discountPrice > 0 ? product.discountPrice : product.price)}
                      </p>
                      {product.discountPrice > 0 && (
                        <p className="text-[10px] text-[#8B95A5] line-through">
                          {formatCurrency(product.price)}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      {product.stock <= 5 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/60 text-rose-400 border border-rose-800/50">
                          Low: {product.stock} left
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
                          {product.stock} in stock
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {product.sizes?.map((sz) => (
                          <span key={sz} className="px-2 py-0.5 bg-[#161B24] border border-[#232A38] text-[#8B95A5] rounded-md text-[10px] font-semibold">
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
                          className="p-2 text-[#8B95A5] hover:text-[#99EEFF] hover:bg-[#161B24] rounded-lg transition-colors"
                          title="Edit Garment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirmId === product._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDelete(product._id)}
                              className="px-2.5 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold font-display"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2.5 py-1 bg-[#161B24] border border-[#232A38] text-[#8B95A5] rounded-lg text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(product._id)}
                            className="p-2 text-[#8B95A5] hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
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
