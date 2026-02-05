import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App';
import StoreLayout from '../components/StoreLayout';

const Home: React.FC = () => {
  const { settings, products } = useApp();

  // Get only the featured products (first 3)
  const featuredProducts = products.slice(0, 3);

  return (
    <StoreLayout>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1588405748353-0c58d3d3a89c?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            {settings.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-10 font-light leading-relaxed">
            {settings.heroSubtitle}
          </p>
          <Link 
            to="/shop" 
            className="inline-block px-10 py-5 rounded-full font-bold text-black transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: settings.primaryColor }}
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-4">Our Masterpieces</h2>
            <p className="text-gray-500 max-w-md">Each essence is carefully distilled to bring out the deepest notes of tradition and luxury.</p>
          </div>
          <Link to="/shop" className="text-sm font-bold border-b-2 pb-1" style={{ borderColor: settings.primaryColor }}>
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Link 
              to="/shop" 
              key={product.id} 
              className="group bg-white/5 rounded-3xl overflow-hidden border border-white/10 transition-all hover:border-white/20"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{product.category}</p>
                <h3 className="text-2xl font-bold mb-4">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black" style={{ color: settings.primaryColor }}>৳{product.price}</span>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">arrow_forward</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Ethos Section */}
      <section className="py-32 bg-white/[0.02] border-y border-white/5 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="material-symbols-outlined text-5xl mb-8" style={{ color: settings.primaryColor }}>potted_plant</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Authentic Oud, Rare Musks, and the Art of Fine Perfumery.</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            {settings.footerText}
          </p>
        </div>
      </section>
    </StoreLayout>
  );
};

export default Home;