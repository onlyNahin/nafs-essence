import React from 'react';
import { useApp } from '../App';
import AdminLayout from '../components/AdminLayout';
import { db } from '../lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';

const AdminOrders: React.FC = () => {
  const { orders, settings } = useApp();

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, {
        status: newStatus
      });
      // No need to manually update state; the onSnapshot in App.tsx handles it!
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update order status.");
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order record?")) {
      try {
        await deleteDoc(doc(db, 'orders', id));
      } catch (error) {
        alert("Error deleting order.");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Order Management</h1>
            <p className="text-gray-500 text-sm mt-2">Manage customer requests and fulfillment status.</p>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
            <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">Active Orders: </span>
            <span className="text-xl font-black" style={{ color: settings.primaryColor }}>{orders.length}</span>
          </div>
        </header>

        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.02] text-gray-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-5">Customer</th>
                <th className="p-5">Product Details</th>
                <th className="p-5">Shipping Address</th>
                <th className="p-5">Status</th>
                <th className="p-5">Total</th>
                <th className="p-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="p-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-white">{order.customerName}</span>
                      <span className="text-xs text-gray-500">{order.mobile}</span>
                      <span className="text-[10px] text-gray-600">{order.date}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs text-gray-300">
                        <span className="font-bold" style={{ color: settings.primaryColor }}>{item.quantity}x</span> {item.productName} ({item.size})
                      </div>
                    ))}
                  </td>
                  <td className="p-5">
                    <p className="text-xs text-gray-500 max-w-[200px] leading-relaxed">{order.address}</p>
                  </td>
                  <td className="p-5">
                    <select 
                      className="bg-[#121212] border border-white/10 rounded-lg text-xs px-3 py-2 outline-none focus:border-primary cursor-pointer"
                      value={order.status}
                      style={{ color: order.status === 'Delivered' ? '#10b981' : '#f4c025' }}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-5 font-black text-lg">৳{order.total}</td>
                  <td className="p-5">
                    <button 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-gray-600">
                    <span className="material-symbols-outlined text-4xl mb-4 block opacity-20">order_approve</span>
                    No orders have been placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;