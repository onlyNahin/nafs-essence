import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useApp } from '../App';
import StoreLayout from '../components/StoreLayout';

const Checkout: React.FC = () => {
  const { settings, products } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const initialProduct = location.state?.product || products[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    productId: initialProduct?.id || '',
    size: initialProduct?.sizes?.[0] || '6ml',
    quantity: 1
  });

  const selectedProduct = products.find(p => p.id === formData.productId);
  const total = selectedProduct ? selectedProduct.price * formData.quantity : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const orderData = {
      customerName: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      address: formData.address,
      items: [{
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: formData.quantity,
        price: selectedProduct.price,
        size: formData.size
      }],
      total: total,
      status: 'Pending',
      date: new Date().toLocaleString(),
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      alert('Order placed successfully! We will contact you soon.');
      navigate('/');
    } catch (err) {
      alert('Error placing order. Please try again.');
    }
  };

  return (
    <StoreLayout>
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-4xl font-black">Checkout</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Full Name" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-primary" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-primary" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <input required placeholder="Mobile Number" className="bg-white/5 border border-white/10 p-4 rounded-xl w-full outline-none focus:border-primary" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
            <textarea required placeholder="Full Shipping Address" className="bg-white/5 border border-white/10 p-4 rounded-xl w-full h-32 outline-none focus:border-primary" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <button type="submit" className="w-full h-16 rounded-xl font-bold text-black text-lg transition-transform active:scale-95" style={{ backgroundColor: settings.primaryColor }}>Confirm Order ৳{total}</button>
          </form>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 h-fit sticky top-24">
             <h3 className="text-xl font-bold mb-6">Order Summary</h3>
             {selectedProduct && (
               <div className="flex gap-4">
                 <img src={selectedProduct.image} className="size-20 rounded-xl object-cover" alt="" />
                 <div>
                   <p className="font-bold">{selectedProduct.name}</p>
                   <p className="text-sm text-gray-500">{formData.size} • Qty: {formData.quantity}</p>
                   <p className="text-primary font-bold" style={{ color: settings.primaryColor }}>৳{total}</p>
                 </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </StoreLayout>
  );
};

export default Checkout;