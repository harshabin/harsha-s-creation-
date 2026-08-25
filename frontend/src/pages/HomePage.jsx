import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Flame, Star, ChevronRight } from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/product/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

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
      desc: '480 GSM French Terry',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
      path: '/shop?category=Hoodies'
    },
    {
      name: 'Structured Outerwear',
      desc: 'Selvedge & Trench Coats',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?auto=format&fit=crop&w=600&q=80',
      path: '/shop?category=Jackets'
    },
    {
      name: 'Boxy Capsule Tees',
      desc: '260 GSM Heavy Cotton',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      path: '/shop?category=T-Shirts'
    },
    {
      name: 'Tailored Wide Pants',
      desc: 'Pleated & Cargo Cuts',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80',
      path: '/shop?category=Pants'
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] bg-stone-950 flex items-center justify-center text-white overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="Aura Wear Fashion"
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-pulse transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 pt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-widest uppercase text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Harsha's Creation • Established 2024</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-display leading-[1.1]">
            Architectural Cuts.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-100 via-amber-200 to-stone-300">
              Heavyweight Textiles.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed">
            Welcome to Harsha's Creation. Founded in 2024 with a dedication to bespoke craftsmanship, creating limited-edition streetwear and refined own-brand garments with zero compromise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-white text-stone-950 hover:bg-stone-100 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop?isFeatured=true"
              className="w-full sm:w-auto px-8 py-4 bg-stone-900/80 hover:bg-stone-800 text-white border border-stone-700 rounded-full font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <span>Featured Drops</span>
            </Link>
          </div>
        </div>
      </section>

      {/* About Me & Founder Narrative Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-14 border border-stone-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-bold uppercase tracking-widest text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>About The Founder & Atelier</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold font-display leading-tight">
                "Fashion is more than clothing — it’s an identity woven with passion."
              </h2>

              <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
                <p>
                  <strong>Harsha's Creation</strong> was founded in <strong>2024</strong> out of a personal ambition: to bridge the gap between high-end luxury silhouettes and everyday comfortable streetwear. Dissatisfied with mass-produced garments that lost their shape after a few washes, Harsha set out to engineer clothing that stands the test of time.
                </p>
                <p>
                  Every hoodie, jacket, tee, and trouser in our collection is conceived from the ground up — selecting custom 480 GSM French Terry loops, genuine Japanese selvedge denim, and breathable organic linen. We believe in small-batch releases where every stitch reflects intentional tailoring and genuine pride.
                </p>
                <p className="italic text-stone-400">
                  "Thank you for being part of our journey since 2024. When you wear Harsha's Creation, you are wearing dedication, quality, and our artistic vision."
                </p>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <div>
                  <h4 className="text-lg font-bold text-white font-display">Harsha</h4>
                  <p className="text-xs text-amber-400 font-semibold tracking-wide uppercase">Founder & Creative Director • Since 2024</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-[4/5] rounded-2xl overflow-hidden border border-stone-800 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
                  alt="Founder of Harsha's Creation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block">Atelier Studio</span>
                    <p className="text-sm font-bold text-white">Harsha's Creation • Established 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Signature Departments</span>
            <h2 className="text-3xl font-extrabold text-stone-950 font-display mt-1">Explore By Category</h2>
          </div>
          <Link to="/shop" className="text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-brand-700 flex items-center gap-1 mt-2 sm:mt-0">
            <span>View All Departments</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="group relative h-96 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 block mb-1">
                  {cat.desc}
                </span>
                <h3 className="text-xl font-bold font-display group-hover:text-amber-200 transition-colors">
                  {cat.name}
                </h3>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-stone-300 group-hover:text-white transition-colors">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-700">
              <Flame className="w-4 h-4 text-brand-600" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl font-extrabold text-stone-950 font-display mt-1">
              Featured Atelier Drops
            </h2>
          </div>
          <Link
            to="/shop?isFeatured=true"
            className="text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-brand-700 flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>View All Featured</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-stone-200 rounded-2xl animate-pulse" />
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

      {/* Craftsmanship & Brand Narrative Banner */}
      <section className="bg-stone-900 text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                The Own-Brand Philosophy
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight">
                No Middlemen.<br />Direct From Our Atelier.
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                Traditional retail models markup clothing 600% through distributor chains. At Aura Wear, we develop our own bespoke fabrics from organic long-staple cotton, dye them in zero-effluent mills, and construct each piece in small batches.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-800">
                <div>
                  <h4 className="text-3xl font-black text-white font-display">480 GSM</h4>
                  <p className="text-xs text-stone-400 mt-1">Loopback French Terry weight</p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white font-display">100%</h4>
                  <p className="text-xs text-stone-400 mt-1">Organic & Selvedge Mill Certified</p>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md"
                >
                  <span>Experience The Fit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
                  alt="Fabric craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">Fresh Silhouettes</span>
            <h2 className="text-3xl font-extrabold text-stone-950 font-display mt-1">
              New Seasonal Arrivals
            </h2>
          </div>
          <Link
            to="/shop?isNewArrival=true"
            className="text-xs font-bold uppercase tracking-wider text-stone-900 hover:text-brand-700 flex items-center gap-1 mt-2 sm:mt-0"
          >
            <span>View All New Drops</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[3/4] bg-stone-200 rounded-2xl animate-pulse" />
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
    </div>
  );
};

export default HomePage;
