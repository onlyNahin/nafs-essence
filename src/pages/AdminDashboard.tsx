
import React from 'react';
import { useApp } from '../App';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard: React.FC = () => {
  const { orders, products, settings } = useApp();

  const stats = [
    { label: 'Total Revenue', value: `৳${orders.reduce((acc, o) => acc + o.total, 0)}`, icon: 'payments', color: 'text-green-500' },
    { label: 'Pending Orders', value: orders.filter(o => o.status === 'Pending').length, icon: 'pending_actions', color: 'text-yellow-500' },
    { label: 'Total Products', value: products.length, icon: 'inventory_2', color: 'text-blue-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Overview</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="p-8 rounded-2xl bg-[#1a1a1a] border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-4xl font-black">{stat.value}</p>
              </div>
              <div className={`size-12 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders Mini Table */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-xl font-bold">Recent Form Submissions</h3>
            <span className="text-xs text-primary font-bold uppercase tracking-widest" style={{ color: settings.primaryColor }}>Live Update</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.02] text-gray-500 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 font-mono font-bold text-primary" style={{ color: settings.primaryColor }}>{order.id}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold">{order.customerName}</span>
                        <span className="text-[10px] text-gray-500">{order.mobile}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        order.status === 'Pending' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : 
                        order.status === 'Delivered' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                        'bg-blue-500/10 border-blue-500/30 text-blue-500'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold">৳{order.total}</td>
                    <td className="p-4 text-gray-500">{order.date}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-600">No orders received yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
