export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  sizes: string[];
  rating?: number; // Optional for newer products
  sku?: string;    // Optional for newer products
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  mobile: string;
  address: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    size: string;
  }[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  createdAt?: any; // Firebase Timestamp
}

export interface SiteSettings {
  websiteName: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  isDarkMode: boolean;
  heroTitle: string;
  heroSubtitle: string;
  footerText: string;
}

export interface AuthState {
  isAuthenticated: boolean | null; // null = loading, false = logged out, true = logged in
  username: string | null;
}