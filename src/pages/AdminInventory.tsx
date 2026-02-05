import React, { useState } from 'react';
import { useApp } from '../App';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const AdminInventory: React.FC = () => {
  const { products, settings } = useApp();
  const [isEditing, setIsEditing] = useState<string | null>(null); // Track ID of product being edited
  const [isAdding, setIsAdding] = useState(false);
  
  const initialProductState = {
    name: '',
    price: '',
    category: 'Oud',
    image: '',
    description: ''
  };

  const [formState, setFormState] = useState(initialProductState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formState,
        price: Number(formState.price),
        lastUpdated: new Date().toISOString()
      };

      if (isEditing) {
        // UPDATE existing product
        await updateDoc(doc(db, 'products', isEditing), productData);
      } else {
        // ADD new product
        await addDoc(collection(db, 'products'), {
          ...productData,
          dateAdded: new Date().toISOString()
        });
      }
      
      closeModal();
    } catch (error) {
      console.error("Error saving product: ", error);
      alert("Failed to save product.");
    }
  };

  const openEdit = (product: any) => {
    setFormState({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      description: product.description || ''
    });
    setIsEditing(product.id);
  };

  const closeModal = () => {
    setIsAdding(false);
    setIsEditing(null);
    setFormState(initialProductState);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure? This cannot be undone.')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#0a0a0a] text-white"> {/* Visual fix for "detaching" environment */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Vault Inventory</h1>
          <p className="text-gray-500 mt-2">Manage your collection of fine essences.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-3 rounded-full font-bold text-black transition-transform hover:scale-105"
          style={{ backgroundColor: settings.primaryColor }}
        >
          + Add New Product
        </button>
      </div>

      {/* MODAL (For both Add and Edit) */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-[#141414] p-8 rounded-3xl max-w-lg w-full border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-8">{isEditing ? 'Update Essence' : 'New Essence'}</h2>
            
            <div className="space-y-4">
              <input 
                placeholder="Product Name"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none focus:border-white/30"
                value={formState.name}
                onChange={e => setFormState({...formState, name: e.target.value})}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number"
                  placeholder="Price (৳)"
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none"
                  value={formState.price}
                  onChange={e => setFormState({...formState, price: e.target.value})}
                  required
                />
                
                <select 
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-gray-400 focus:outline-none"
                  value={formState.category}
                  onChange={e => setFormState({...formState, category: e.target.value})}
                >
                  <option value="Oud">Oud</option>
                  <option value="Attar">Attar</option>
                  <option value="Musk">Musk</option>
                  <option value="Signature">Signature Collection</option>
                </select>
              </div>

              <input 
                placeholder="Image Link (URL)"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:outline-none"
                value={formState.image}
                onChange={e => setFormState({...formState, image: e.target.value})}
                required
              />

              <textarea 
                placeholder="Fragrance Notes & Description..."
                className="w-full bg-white/5 border border-white/10 p-4 rounded-xl h-32 focus:outline-none"
                value={formState.description}
                onChange={e => setFormState({...formState, description: e.target.value})}
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button type="submit" className="flex-1 py-4 rounded-xl font-bold text-black" style={{ backgroundColor: settings.primaryColor }}>
                {isEditing ? 'Save Changes' : 'Publish Product'}
              </button>
              <button type="button" onClick={closeModal} className="flex-1 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INVENTORY TABLE */}
      <div className="bg-[#141414] rounded-3xl border border-white/5 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-white/[0.02] border-b border-white/5 text-gray-500 uppercase text-xs tracking-widest">
            <tr>
              <th className="p-6">Product Details</th>
              <th className="p-6">Category</th>
              <th className="p-6">Price</th>
              <th className="p-6 text-right">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="p-6 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black border border-white/10">
                    <img src={product.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{product.name}</p>
                    <p className="text-xs text-gray-500">ID: {product.id.substring(0,8)}</p>
                  </div>
                </td>
                <td className="p-6">
                  <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                </td>
                <td className="p-6 font-mono text-lg" style={{ color: settings.primaryColor }}>৳{product.price}</td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => openEdit(product)}
                      className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-gray-300"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-3 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors text-red-500"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;