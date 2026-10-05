import React, { createContext, useContext, useState, useEffect } from 'react';
import { Flavor, Vessel, Drizzle, Topping, CustomScoopOrder, Order, OrderStatus, LoyaltyProfile } from '../types';
import { INITIAL_FLAVORS, INITIAL_VESSELS, INITIAL_DRIZZLES, INITIAL_TOPPINGS } from '../data/menuData';
import { notificationManager } from '../utils/notifications';

interface ShopContextType {
  flavors: Flavor[];
  vessels: Vessel[];
  drizzles: Drizzle[];
  toppings: Topping[];
  cart: CustomScoopOrder[];
  activeOrder: Order | null;
  allOrders: Order[];
  loyaltyProfile: LoyaltyProfile;
  discountCode: string | null;
  discountAmount: number;
  activeView: 'home' | 'builder' | 'tracker' | 'loyalty' | 'invite' | 'admin';
  isCartOpen: boolean;
  recentAlerts: { id: string; title: string; time: string; type: 'info' | 'success' | 'alert' }[];
  notificationPermission: NotificationPermission;
  setIsCartOpen: (open: boolean) => void;
  setActiveView: (view: 'home' | 'builder' | 'tracker' | 'loyalty' | 'invite' | 'admin') => void;
  setActiveOrder: (order: Order | null) => void;
  addToCart: (item: CustomScoopOrder) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  placeOrder: (checkoutData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    orderType: 'delivery' | 'pickup';
    deliveryAddress?: string;
    pickupTable?: string;
    paymentMethod: 'card' | 'apple_pay' | 'google_pay';
    tip: number;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  requestNotificationPermission: () => Promise<void>;
  triggerNotification: (title: string, body?: string) => void;
  refreshMenuAndInventory: () => Promise<void>;
  updateFlavorStock: (id: string, scoops: number, inStock: boolean) => Promise<void>;
  restockTub: (id: string) => Promise<void>;
  lookupLoyaltyProfile: (phone: string) => Promise<void>;
  redeemLoyaltyReward: (code: string, pointsCost: number, discount: number) => Promise<boolean>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flavors, setFlavors] = useState<Flavor[]>(INITIAL_FLAVORS);
  const [vessels, setVessels] = useState<Vessel[]>(INITIAL_VESSELS);
  const [drizzles, setDrizzles] = useState<Drizzle[]>(INITIAL_DRIZZLES);
  const [toppings, setToppings] = useState<Topping[]>(INITIAL_TOPPINGS);
  const [cart, setCart] = useState<CustomScoopOrder[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [discountCode, setDiscountCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [activeView, setActiveView] = useState<'home' | 'builder' | 'tracker' | 'loyalty' | 'invite' | 'admin'>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [recentAlerts, setRecentAlerts] = useState<{ id: string; title: string; time: string; type: 'info' | 'success' | 'alert' }[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const [loyaltyProfile, setLoyaltyProfile] = useState<LoyaltyProfile>({
    phone: '5552345678',
    name: 'Eleanor Vance',
    referralCode: 'VELUTO-ELEANOR-77',
    points: 340,
    tier: 'Sundae Connoisseur',
    lifetimeOrders: 8,
    friendsInvited: 3,
    bonusEarnedDollars: 15.00,
  });

  // Initial load
  useEffect(() => {
    fetchMenu();
    fetchOrders();
    setNotificationPermission(notificationManager.getPermissionState());
  }, []);

  const triggerNotification = (title: string, body?: string) => {
    notificationManager.sendPush(title, { body });
    const newAlert = {
      id: `alert-${Date.now()}-${Math.random()}`,
      title,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'info' as const,
    };
    setRecentAlerts(prev => [newAlert, ...prev].slice(0, 8));
  };

  const requestNotificationPermission = async () => {
    const res = await notificationManager.requestPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      triggerNotification('🔔 Order Alerts Active', 'You will receive real-time push updates for every scoop status!');
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        const data = await res.json();
        if (data.flavors) setFlavors(data.flavors);
        if (data.vessels) setVessels(data.vessels);
        if (data.drizzles) setDrizzles(data.drizzles);
        if (data.toppings) setToppings(data.toppings);
      }
    } catch {
      // Fallback already pre-set
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data: Order[] = await res.json();
        setAllOrders(data);
        if (!activeOrder && data.length > 0) {
          // Preselect latest order for tracking convenience
          setActiveOrder(data[0]);
        }
      }
    } catch {
      // Keep state
    }
  };

  const refreshMenuAndInventory = async () => {
    await fetchMenu();
    await fetchOrders();
  };

  const addToCart = (item: CustomScoopOrder) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, item];
    });
    triggerNotification(`Added "${item.customName}" to your bag`, `${item.scoopCount} scoops in ${item.vessel.name}`);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(p => p.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => prev.map(p => {
      if (p.id === itemId) {
        const newQty = p.quantity + delta;
        return newQty > 0 ? { ...p, quantity: newQty } : null;
      }
      return p;
    }).filter(Boolean) as CustomScoopOrder[]);
  };

  const clearCart = () => {
    setCart([]);
    setDiscountCode(null);
    setDiscountAmount(0);
  };

  const applyPromoCode = async (code: string) => {
    const clean = code.trim().toUpperCase();
    try {
      const res = await fetch('/api/referrals/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: clean }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setDiscountCode(clean);
        setDiscountAmount(data.discountDollars);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Invalid promotion code' };
      }
    } catch {
      // fallback local validation for known demo codes
      if (clean.startsWith('VELUTO') || clean === 'SWEETFRIEND' || clean === 'COIN-SAVE5') {
        setDiscountCode(clean);
        setDiscountAmount(5.00);
        return { success: true, message: 'Code applied: $5.00 off' };
      }
      return { success: false, message: 'Unable to validate code at this time' };
    }
  };

  const removePromoCode = () => {
    setDiscountCode(null);
    setDiscountAmount(0);
  };

  const placeOrder = async (checkoutData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    orderType: 'delivery' | 'pickup';
    deliveryAddress?: string;
    pickupTable?: string;
    paymentMethod: 'card' | 'apple_pay' | 'google_pay';
    tip: number;
  }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const tax = Math.round(subtotal * 0.088 * 100) / 100;
    const deliveryFee = checkoutData.orderType === 'delivery' ? (subtotal > 25 ? 0 : 2.99) : 0;
    const total = Math.max(0, Math.round((subtotal - discountAmount + tax + checkoutData.tip + deliveryFee) * 100) / 100);

    const payload = {
      ...checkoutData,
      items: cart,
      subtotal,
      discount: discountAmount,
      tax,
      deliveryFee,
      total,
      loyaltyCodeApplied: discountCode || undefined,
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error('Order processing failed. Please check payment credentials.');
    }

    const createdOrder: Order = await res.json();
    setAllOrders(prev => [createdOrder, ...prev]);
    setActiveOrder(createdOrder);
    clearCart();
    setIsCartOpen(false);
    setActiveView('tracker');

    triggerNotification(
      `🎉 Order #${createdOrder.id} Confirmed!`,
      `We've queued your handcrafted scoops. Estimated: ${createdOrder.estimatedDeliveryMinutes} mins`
    );

    // Refresh inventory in background
    fetchMenu();

    return createdOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated: Order = await res.json();
        setAllOrders(prev => prev.map(o => o.id === orderId ? updated : o));
        if (activeOrder && activeOrder.id === orderId) {
          setActiveOrder(updated);
        }

        const statusDescriptions: Record<OrderStatus, string> = {
          received: 'Your order was confirmed and entered the kitchen queue.',
          crafting: 'Chef Artisan is hand-scooping your bespoke gelato flavors.',
          chilling: 'Deep-freeze cryo stabilization active (-16°C).',
          out_for_delivery: 'Courier dispatched! Track live on the map.',
          completed: 'Your artisanal gelato has been delivered. Enjoy!',
          cancelled: 'Order was cancelled.',
        };

        triggerNotification(`Order #${orderId}: ${updated.timeline.find(s => s.status === status)?.title || status}`, statusDescriptions[status]);
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const updateFlavorStock = async (id: string, scoops: number, inStock: boolean) => {
    try {
      const res = await fetch(`/api/inventory/flavor/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scoopsRemaining: scoops, inStock }),
      });
      if (res.ok) {
        const updated: Flavor = await res.json();
        setFlavors(prev => prev.map(f => f.id === id ? updated : f));
      }
    } catch {
      setFlavors(prev => prev.map(f => f.id === id ? { ...f, scoopsRemaining: scoops, inStock } : f));
    }
  };

  const restockTub = async (id: string) => {
    try {
      const res = await fetch(`/api/inventory/restock-tub/${id}`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const updated: Flavor = await res.json();
        setFlavors(prev => prev.map(f => f.id === id ? updated : f));
        triggerNotification(`Restocked ${updated.name}`, `Added 45 fresh scoops to tub`);
      }
    } catch {
      setFlavors(prev => prev.map(f => f.id === id ? { ...f, scoopsRemaining: f.scoopsRemaining + 45, inStock: true } : f));
    }
  };

  const lookupLoyaltyProfile = async (phone: string) => {
    try {
      const res = await fetch(`/api/loyalty/${phone}`);
      if (res.ok) {
        const prof = await res.json();
        setLoyaltyProfile(prof);
      }
    } catch {
      // Keep default
    }
  };

  const redeemLoyaltyReward = async (code: string, pointsCost: number, discount: number) => {
    if (loyaltyProfile.points < pointsCost) {
      return false;
    }
    try {
      const res = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loyaltyProfile.phone, pointsCost }),
      });
      if (res.ok) {
        setLoyaltyProfile(prev => ({ ...prev, points: prev.points - pointsCost }));
        setDiscountCode(code);
        setDiscountAmount(discount);
        triggerNotification('Reward Voucher Redeemed!', `${code} applied to your cart: -$${discount.toFixed(2)}`);
        return true;
      }
    } catch {
      // Offline fallback
      setLoyaltyProfile(prev => ({ ...prev, points: prev.points - pointsCost }));
      setDiscountCode(code);
      setDiscountAmount(discount);
      return true;
    }
    return false;
  };

  return (
    <ShopContext.Provider value={{
      flavors,
      vessels,
      drizzles,
      toppings,
      cart,
      activeOrder,
      allOrders,
      loyaltyProfile,
      discountCode,
      discountAmount,
      activeView,
      isCartOpen,
      recentAlerts,
      notificationPermission,
      setIsCartOpen,
      setActiveView,
      setActiveOrder,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      applyPromoCode,
      removePromoCode,
      placeOrder,
      updateOrderStatus,
      requestNotificationPermission,
      triggerNotification,
      refreshMenuAndInventory,
      updateFlavorStock,
      restockTub,
      lookupLoyaltyProfile,
      redeemLoyaltyReward,
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
