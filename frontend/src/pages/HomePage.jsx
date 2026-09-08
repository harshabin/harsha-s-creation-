import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Flame,
  ChevronRight,
  Layers,
  Feather,
  Compass,
  X,
  Check
} from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/product/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pedestalModalOpen, setPedestalModalOpen] = useState(false);

  // Reson Colorway Interactive State (matching the 3 circular swatches on Figma Reson frame)
  const colorways = {
    obsidian: {
      id: 'obsidian',
      name: 'Obsidian Black',
      hex: '#0C0E14',
      borderHex: '#99EEFF',
      image: '/assets/reson/hero_obsidian.jpg',
      dropTag: 'DROP 01 • AUTUMN CORE',
      silhouette: 'High-Collar Architectural Cut',
      fabric: '480 GSM Heavy French Terry'
    },
    glacier: {
      id: 'glacier',
      name: 'Glacier Raw Cream',
      hex: '#E8E6DF',
      borderHex: '#E8E6DF',
      image: '/assets/reson/hero_glacier.jpg',
      dropTag: 'DROP 02 • UNBLEACHED CAPSULE',
      silhouette: 'Cocoon Drop-Shoulder Cut',
      fabric: '100% Organic Looped Fleece'
    },
    sage: {
      id: 'sage',
      name: 'Mineral Sage Green',
      hex: '#7A8B79',
      borderHex: '#7A8B79',
      image: '/assets/reson/hero_sage.jpg',
      dropTag: 'DROP 03 • BOTANICAL PIGMENT',
      silhouette: 'Structured Boxy Funnel-Neck',
      fabric: 'Double-Dyed Sustainable Weave'
    }
  };

  const [activeColorway, setActiveColorway] = useState('obsidian');

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featRes, newRes] = await Promise.all([
          productService.getProducts({ isFeatured: 'true', limit: 4 }),
          productService.getProducts({ isNewArrival: 'true', limit: 4 })
        ]);

        if (featRes.success) setFeaturedProducts(featRes.data);
        if (newRes.success) setNewArrivals(newRes.data);
      } catch (err) {
        console.error('Error fetching homepage products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const categories = [
    {
      name: 'Heavyweight Hoodies',
      desc: '480 GSM French Terry • Boxy Architectural Silhouette',
      image: '/assets/products/hoodie_black.jpg',
      path: '/shop?category=Hoodies'
    },
    {
      name: 'Structured Outerwear',
      desc: 'Selvedge Wool & Technical Bonded Shells',
      image: '/assets/products/trench_coat.jpg',
      path: '/shop?category=Jackets'
    },
    {
      name: 'Capsule Drop Tees',
      desc: '280 GSM Interlock Organic Cotton',
      image: '/assets/products/heavy_tee.jpg',
      path: '/shop?category=T-Shirts'
    },
    {
      name: 'Tailored Wide Pants',
      desc: 'Pleated Heavy Twill & Selvedge Denim',
      image: '/assets/products/wide_pants.jpg',
      path: '/shop?category=Pants'
    }
  ];

  const currentVariant = colorways[activeColorway];

  return (
    <div className="space-y-24 pb-24 bg-[#08090C] text-[#E1E7F0] overflow-hidden">
      {/* =========================================================================
          SECTION 1: THE SIGNATURE RESON HERO (Direct 1:1 Figma Desktop-140 Adaptation)
          ========================================================================= */}
      <section className="relative min-h-[92vh] pt-6 sm:pt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center">
        {/* Subtle Ambient Cyan Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#99EEFF]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* LEFT COLUMN: Reson Typography, Cyan CTA & 3D Pedestal Feature Card */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8 sm:space-y-10">
            {/* Top Micro-label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12151D] border border-[#232A38] text-[11px] font-bold tracking-[0.2em] uppercase text-[#99EEFF]">
              <span>✦</span>
              <span>Harsha's Creation • Bespoke Atelier</span>
            </div>

            {/* Main Display Headline (matching Figma: THE FUTURE OF LISTENING -> THE FUTURE OF WEAR) */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight font-display leading-[1.05] text-white">
                THE FUTURE<br />
                OF WEAR
              </h1>
              <p className="text-sm sm:text-base text-[#8B95A5] max-w-xl font-normal leading-relaxed">
                Designed for balanced drape, architectural silhouette, and timeless presence — letting garment structure adapt seamlessly to your form.
              </p>
            </div>

            {/* Main CTA: Reson Cyan Pill + Diagonal Arrow Circle */}
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/shop"
                className="px-8 sm:px-10 py-4 sm:py-4.5 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black font-extrabold font-display text-xs sm:text-sm tracking-[0.15em] uppercase rounded-full transition-all duration-300 shadow-cyan-glow hover:scale-[1.02] flex items-center justify-center"
              >
                <span>EXPLORE COLLECTION</span>
              </Link>

              <Link
                to="/shop"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#99EEFF] hover:bg-[#B8F4FF] text-black flex items-center justify-center transition-all duration-300 shadow-cyan-glow hover:scale-105"
                title="Browse Full Catalog"
              >
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </Link>
            </div>

            {/* BOTTOM-LEFT: Reson 3D Pedestal Feature Card (Direct Figma Component) */}
            <div className="pt-4">
              <div className="bg-white text-stone-950 rounded-3xl p-5 sm:p-6 shadow-2xl border border-white/20 relative overflow-hidden group">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  {/* Left Pedestal Imagery */}
                  <div className="sm:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 relative">
                    <img
                      src="/assets/reson/pedestal_feature.jpg"
                      alt="3D Pedestal Showcase"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-stone-950/5 pointer-events-none" />
                  </div>

                  {/* Right Pedestal Description & Discover Button */}
                  <div className="sm:col-span-7 space-y-3">
                    <p className="text-xs sm:text-sm font-extrabold tracking-tight uppercase font-display text-stone-900 leading-snug">
                      ENGINEERED TO DELIVER CLARITY, TEXTURE, AND CONTROL.
                    </p>
                    <p className="text-[11px] text-stone-600 line-clamp-2">
                      Precision-cut 480 GSM loops and raw Japanese selvedge yarn, showcased in sculptural form.
                    </p>
                    <button
                      type="button"
                      onClick={() => setPedestalModalOpen(true)}
                      className="px-5 py-2 rounded-full border border-stone-900 text-stone-950 hover:bg-stone-950 hover:text-white text-[10px] font-bold tracking-widest uppercase font-display transition-all"
                    >
                      DISCOVER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Reson Curved Model Frame with Floating Action Button & Colorway Selector */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            {/* The Signature Reson Pill Container */}
            <div className="relative w-full max-w-lg aspect-[3/4] rounded-[48px] overflow-hidden bg-[#11141B] border border-[#232A38] shadow-2xl group">
              {/* Dynamic Model Image */}
              <img
                key={currentVariant.id}
                src={currentVariant.image}
                alt={`Harsha's Creation Model in ${currentVariant.name}`}
                className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03] animate-fade-in"
              />

              {/* Gradient Darkening at Bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-transparent to-transparent opacity-80" />

              {/* Top-Right Floating Circular Arrow (matching Figma badge on model) */}
              <Link
                to={`/shop?color=${encodeURIComponent(currentVariant.name)}`}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#99EEFF] hover:bg-white text-black flex items-center justify-center shadow-cyan-glow hover:scale-110 transition-all z-20"
                title={`Shop ${currentVariant.name}`}
              >
                <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
              </Link>

              {/* Bottom Details Tag Inside Frame */}
              <div className="absolute bottom-6 left-6 right-20 z-20 space-y-1 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#99EEFF] block">
                  {currentVariant.dropTag}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold font-display">
                  {currentVariant.name}
                </h3>
                <p className="text-xs text-[#8B95A5] font-medium">
                  {currentVariant.silhouette} • {currentVariant.fabric}
                </p>
              </div>

              {/* FLOATING VERTICAL COLORWAY SELECTOR DOCK (Matching Figma 3 Circular Swatches) */}
              <div className="absolute right-5 bottom-6 z-30 flex flex-col items-center gap-2.5 p-2 rounded-full bg-[#08090C]/80 backdrop-blur-xl border border-[#232A38] shadow-2xl">
                {Object.values(colorways).map((variant) => {
                  const isSelected = activeColorway === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setActiveColorway(variant.id)}
                      className={`w-7 h-7 rounded-full transition-all duration-300 relative flex items-center justify-center ${
                        isSelected
                          ? 'ring-2 ring-[#99EEFF] ring-offset-2 ring-offset-[#08090C] scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: variant.hex }}
                      title={variant.name}
                    >
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#99EEFF] shadow-cyan-subtle" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: TEXTILE & FORM ANATOMY ("THE ENGINEERING OF RESON COUTURE")
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#12151D] border border-[#232A38] text-[10px] font-bold uppercase tracking-[0.2em] text-[#99EEFF]">
            <Layers className="w-3.5 h-3.5" />
            <span>Tactile Science & Fiber</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            ENGINEERED MATERIALITY
          </h2>
          <p className="text-xs sm:text-sm text-[#8B95A5] leading-relaxed">
            Every garment begins with bespoke fiber geometry. We reject generic blends in favor of custom-spun, heavyweight yarns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-[#11141B] rounded-3xl p-8 border border-[#232A38] hover:border-[#99EEFF]/40 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#161B24] border border-[#232A38] text-[#99EEFF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold font-display">01</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white group-hover:text-[#99EEFF] transition-colors">
              480 GSM French Terry
            </h3>
            <p className="text-xs text-[#8B95A5] leading-relaxed">
              Custom-spun zero-torque long-staple cotton loops. Double-brushed interior provides substantial structure without compromising skin comfort.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-[#8B95A5] border-t border-[#1E2430]">
              <span>Weight: Ultra-Heavy</span>
              <span className="text-[#99EEFF]">Zero Shrinkage</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#11141B] rounded-3xl p-8 border border-[#232A38] hover:border-[#99EEFF]/40 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#161B24] border border-[#232A38] text-[#99EEFF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold font-display">02</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white group-hover:text-[#99EEFF] transition-colors">
              14oz Japanese Selvedge
            </h3>
            <p className="text-xs text-[#8B95A5] leading-relaxed">
              Woven on vintage Toyoda shuttle looms in Kurashiki. Pure indigo dip with red/white selvage ID line and natural ring-spun slub texture.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-[#8B95A5] border-t border-[#1E2430]">
              <span>Loom: Vintage Shuttle</span>
              <span className="text-[#99EEFF]">Raw Rigid Fit</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#11141B] rounded-3xl p-8 border border-[#232A38] hover:border-[#99EEFF]/40 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-[#161B24] border border-[#232A38] text-[#99EEFF] flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold font-display">03</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white group-hover:text-[#99EEFF] transition-colors">
              Bonded Technical Wool
            </h3>
            <p className="text-xs text-[#8B95A5] leading-relaxed">
              Merino wool bonded with a micro-porous windproof membrane. Combines heritage formal drape with modern weatherproof utility.
            </p>
            <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-[#8B95A5] border-t border-[#1E2430]">
              <span>Rating: Weather-Shield</span>
              <span className="text-[#99EEFF]">Thermal Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: RUNWAY CATEGORIES & DEPARTMENTS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#99EEFF]">
              Curated Silhouettes
            </span>
            <h2 className="text-3xl font-extrabold text-white font-display mt-1">
              Explore By Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#8B95A5] hover:text-[#99EEFF] flex items-center gap-1.5 mt-2 sm:mt-0 transition-colors"
          >
            <span>View All Departments</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group relative h-96 rounded-3xl overflow-hidden border border-[#232A38] hover:border-[#99EEFF]/50 transition-all duration-500 shadow-xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#99EEFF] block">
                  {cat.desc}
                </span>
                <h3 className="text-xl font-bold font-display group-hover:text-[#99EEFF] transition-colors">
                  {cat.name}
                </h3>
                <div className="pt-2 flex items-center gap-1.5 text-xs font-semibold text-[#8B95A5] group-hover:text-white transition-colors">
                  <span>Explore Silhouette</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURED ATELIER DROPS (PRODUCT CATALOG)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#99EEFF]">
              <Flame className="w-3.5 h-3.5 text-[#99EEFF]" />
              <span>Harsha's Creation Limited Run</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white font-display mt-1">
              Featured Atelier Drops
            </h2>
          </div>
          <Link
            to="/shop?isFeatured=true"
            className="text-xs font-bold uppercase tracking-wider text-[#8B95A5] hover:text-[#99EEFF] flex items-center gap-1.5 mt-2 sm:mt-0 transition-colors"
          >
            <span>View All Featured</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-[#11141B] rounded-3xl border border-[#232A38] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 5: THE ATELIER MONOGRAPH (FOUNDER NARRATIVE)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#11141B] rounded-[40px] p-8 sm:p-14 border border-[#232A38] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#99EEFF]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161B24] border border-[#232A38] text-[10px] font-bold uppercase tracking-[0.2em] text-[#99EEFF]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Atelier Manifesto • Since 2024</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white leading-tight">
                "Clothing is spatial architecture engineered for human movement."
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-[#8B95A5] leading-relaxed">
                <p>
                  Founded in <strong>2024</strong>, <strong>Harsha's Creation</strong> was born from a singular vision: to create garments that marry the uncompromising standards of luxury couture with the effortless silhouette of modern streetwear.
                </p>
                <p>
                  Every hoodie, jacket, and trouser is engineered from custom raw materials — choosing 480 GSM French Terry loops, genuine Japanese selvedge denim, and bonded technical wool. We manufacture in deliberate, small-batch seasonal drops where every seam reflects surgical precision.
                </p>
                <p className="italic text-stone-400">
                  "When you wear Harsha's Creation, you are wearing dedication, tactile weight, and our purest design ambition."
                </p>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white font-display">Harsha</h4>
                  <p className="text-[10px] text-[#99EEFF] font-semibold tracking-wider uppercase">
                    Founder & Creative Director • Harsha's Creation
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-[36px] overflow-hidden border border-[#232A38] hover:border-[#99EEFF]/40 shadow-2xl transition-all duration-500 group shadow-cyan-subtle">
                <img
                  src="/assets/founder_harsha.jpg"
                  alt="Harsha - Founder of Harsha's Creation"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090C] via-[#08090C]/20 to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#99EEFF] block mb-1">
                      Bengaluru Atelier
                    </span>
                    <p className="text-base font-bold text-white font-display">Harsha's Creation • Established 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: NEW ARRIVALS DROP
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#99EEFF]">
              Autumn / Winter '26
            </span>
            <h2 className="text-3xl font-extrabold text-white font-display mt-1">
              New Seasonal Arrivals
            </h2>
          </div>
          <Link
            to="/shop?isNewArrival=true"
            className="text-xs font-bold uppercase tracking-wider text-[#8B95A5] hover:text-[#99EEFF] flex items-center gap-1.5 mt-2 sm:mt-0 transition-colors"
          >
            <span>View All New Drops</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-[#11141B] rounded-3xl border border-[#232A38] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* =========================================================================
          MODAL: 3D PEDESTAL ENGINEERING & FABRIC SHOWCASE
          ========================================================================= */}
      {pedestalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#11141B] border border-[#232A38] rounded-[36px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 text-[#E1E7F0]">
            <button
              onClick={() => setPedestalModalOpen(false)}
              className="absolute top-6 right-6 text-[#8B95A5] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#99EEFF]">
                ✦ Pedestal Exhibition No. 04
              </span>
              <h3 className="text-2xl font-bold font-display text-white">
                Engineered to Deliver Clarity, Texture, and Control
              </h3>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-900 border border-[#232A38]">
              <img
                src="/assets/reson/pedestal_feature.jpg"
                alt="3D Pedestal Specimen"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#161B24] border border-[#232A38] space-y-1">
                <span className="text-[10px] text-[#99EEFF] uppercase font-bold tracking-wider">Pedestal 01</span>
                <p className="font-bold text-white">Heavyweight Hoodie</p>
                <p className="text-[#8B95A5] text-[11px]">480 GSM Loopback with reinforced raglan drape.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#161B24] border border-[#232A38] space-y-1">
                <span className="text-[10px] text-[#99EEFF] uppercase font-bold tracking-wider">Pedestal 02</span>
                <p className="font-bold text-white">Okayama Denim</p>
                <p className="text-[#8B95A5] text-[11px]">14oz Selvedge with natural indigo shuttle weave.</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#161B24] border border-[#232A38] space-y-1">
                <span className="text-[10px] text-[#99EEFF] uppercase font-bold tracking-wider">Pedestal 03</span>
                <p className="font-bold text-white">Hardware & Accents</p>
                <p className="text-[#8B95A5] text-[11px]">Custom titanium cuff and matte hardware accents.</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1E2430]">
              <span className="text-xs text-[#8B95A5]">Available across all autumn drops</span>
              <Link
                to="/shop"
                onClick={() => setPedestalModalOpen(false)}
                className="px-6 py-2.5 bg-[#99EEFF] hover:bg-[#B8F4FF] text-black text-xs font-bold uppercase tracking-widest font-display rounded-full transition-all shadow-cyan-subtle"
              >
                Shop The Collection
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
