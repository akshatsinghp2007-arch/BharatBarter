export type Language = 'en' | 'hi';

export type Category = 
  | 'Electronics' 
  | 'Fashion' 
  | 'Books & Stationery' 
  | 'Agriculture & Produce' 
  | 'Services' 
  | 'Home & Kitchen' 
  | 'Vehicles' 
  | 'Others';

export interface BarterItem {
  id: string;
  title: string;
  description: string;
  category: Category;
  images: string[];
  estimatedValue: number;
  city: string;
  pincode?: string;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

export type NavTab = 'home' | 'post' | 'browse' | 'profile';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
