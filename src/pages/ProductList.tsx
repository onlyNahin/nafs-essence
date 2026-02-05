
import React, { useState } from 'react';
import { useApp } from '../App';
import StoreLayout from '../components/StoreLayout';
import { Link } from 'react-router-dom';

const ProductList: React.FC = () => {
  const { products, settings } = useApp();
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category === filter);

  return (
    <StoreLayout>
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black text-white mb-4">Our Essence</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Explore our range of artisanal perfume oils, hand-poured and steeped in tradition.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
                filter === cat 
                ? 'bg-primary border-primary text-black' 
                : 'bg-white/5 border-white/10 text-white hover:border-primary/50'
              }`}
              style={filter === cat ? { backgroundColor: settings.primaryColor, borderColor: settings.primaryColor } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="flex flex-col bg-[#121212] rounded-xl overflow-hidden border border-white/5 transition-all hover:border-primary/50 group">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white leading-tight">{product.name}</h3>
                  <div className="flex items-center text-primary text-xs font-bold" style={{ color: settings.primaryColor }}>
                    {product.rating} <span className="material-symbols-outlined text-[14px]">star</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">{product.category}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xl font-bold text-white">৳{product.price}</span>
                  <Link 
                    to="/checkout" 
                    state={{ product }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-black text-xs font-bold transition-transform active:scale-95"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    Add to Cart
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StoreLayout>
  );
};

export default ProductList;
