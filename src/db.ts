import { db } from './lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc,
  query,
  where 
} from 'firebase/firestore';
import { Product, Order, SiteSettings } from './types';

// Collection References
const productsRef = collection(db, 'products');
const ordersRef = collection(db, 'orders');
const settingsRef = collection(db, 'settings');

export const firestoreService = {
  // Fetch all products
  getProducts: async (): Promise<Product[]> => {
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  // Save a new product
  saveProduct: async (product: Omit<Product, 'id'>) => {
    return await addDoc(productsRef, product);
  },

  // Fetch orders
  getOrders: async (): Promise<Order[]> => {
    const snapshot = await getDocs(ordersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  },

  // Create Order
  createOrder: async (order: Order) => {
    return await addDoc(ordersRef, order);
  }
};