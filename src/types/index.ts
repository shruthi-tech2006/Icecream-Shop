export type DietaryTag = 'Vegan' | 'Gluten-Free' | 'Nut-Free' | 'Dairy-Free' | 'Contains Nuts';

export interface Flavor {
  id: string;
  name: string;
  italianName: string;
  description: string;
  color: string;
  accentColor: string;
  tags: DietaryTag[];
  caloriesPerScoop: number;
  inStock: boolean;
  scoopsRemaining: number;
  popularity: number; // 1-100 for analytics
  origin: string;
}

export interface Vessel {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  iconName: string;
  inStock: boolean;
}

export interface Drizzle {
  id: string;
  name: string;
  price: number;
  calories: number;
  color: string;
  inStock: boolean;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  calories: number;
  tags: DietaryTag[];
  inStock: boolean;
}

export interface CustomScoopOrder {
  id: string;
  customName: string;
  vessel: Vessel;
  scoopCount: 1 | 2 | 3 | 4;
  flavors: Flavor[];
  drizzles: Drizzle[];
  toppings: Topping[];
  specialInstructions?: string;
  unitPrice: number;
  quantity: number;
}

export type OrderStatus = 
  | 'received' 
  | 'crafting' 
  | 'chilling' 
  | 'out_for_delivery' 
  | 'completed' 
  | 'cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  pickupTable?: string;
  items: CustomScoopOrder[];
  subtotal: number;
  discount: number;
  tax: number;
  tip: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay';
  paymentStatus: 'paid' | 'pending';
  loyaltyPointsEarned: number;
  loyaltyCodeApplied?: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryMinutes: number;
  riderName?: string;
  riderPhone?: string;
  riderLat?: number;
  riderLng?: number;
  freezerBagTempCelsius?: number;
  timeline: OrderTimelineStep[];
}

export interface LoyaltyProfile {
  phone: string;
  name: string;
  referralCode: string;
  points: number;
  tier: 'Sprinkle Scout' | 'Sundae Connoisseur' | 'Gelato Royale';
  lifetimeOrders: number;
  friendsInvited: number;
  bonusEarnedDollars: number;
}

export interface RewardVoucher {
  id: string;
  title: string;
  pointsCost: number;
  discountDollars: number;
  description: string;
  code: string;
}

export interface AnalyticsSummary {
  todayRevenue: number;
  todayOrdersCount: number;
  averageOrderValue: number;
  totalLoyaltyMembers: number;
  topFlavors: { name: string; scoopsSold: number; percentage: number }[];
  hourlyTraffic: { hour: string; orders: number }[];
}
