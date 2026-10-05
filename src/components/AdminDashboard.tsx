import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { OrderStatus, Flavor, AnalyticsSummary } from '../types';
import { 
  Package, 
  BarChart3, 
  ChefHat, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Truck,
  RotateCcw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    flavors,
    allOrders,
    updateOrderStatus,
    updateFlavorStock,
    restockTub,
    refreshMenuAndInventory,
    triggerNotification,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'kds' | 'inventory' | 'analytics'>('kds');
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [allOrders]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch {
      // Keep state
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshMenuAndInventory();
    await fetchAnalytics();
    setIsRefreshing(false);
    triggerNotification('Admin Data Refreshed', 'Synced latest kitchen queue & inventory counts');
  };

  const activeOrders = allOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const completedOrders = allOrders.filter(o => o.status === 'completed');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Bar Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-600">
              Staff & Operations Portal
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-emerald-800 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
              Live Kitchen POS
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Creamery Kitchen & Inventory Operations
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('kds')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
            activeTab === 'kds'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          <span>Kitchen Queue (KDS) ({activeOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Tub Inventory & Toggles</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Sales & Flavor Analytics</span>
        </button>
      </div>

      {/* TAB 1: KITCHEN DISPLAY SYSTEM */}
      {activeTab === 'kds' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-serif font-bold text-stone-900">
              Active Production Tickets ({activeOrders.length} pending)
            </h2>
            <span className="text-xs text-stone-500">Auto-refresh active</span>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-stone-900">All Orders Fulfilled!</h3>
              <p className="text-xs text-stone-500 mt-1">
                The gelato scooping queue is clear. New orders will appear here instantaneously.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders.map(order => {
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <span className="font-mono text-xs font-bold text-stone-900">
                          #{order.id}
                        </span>
                        <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs font-bold text-stone-900">{order.customerName}</p>
                        <p className="text-[11px] text-stone-500">
                          {order.orderType === 'delivery' ? `Delivery: ${order.deliveryAddress}` : `Pickup: ${order.pickupTable}`}
                        </p>
                      </div>

                      {/* Item list */}
                      <div className="mt-3 space-y-2 border-t border-stone-100 pt-3">
                        {order.items.map(item => (
                          <div key={item.id} className="text-xs">
                            <div className="flex justify-between font-medium text-stone-900">
                              <span>{item.quantity}× {item.customName}</span>
                              <span className="text-stone-500">{item.scoopCount} scoops</span>
                            </div>
                            <p className="text-[11px] text-stone-500 pl-2">
                              Vessel: {item.vessel.name}
                            </p>
                            <p className="text-[11px] text-stone-500 pl-2">
                              Flavors: {item.flavors.map(f => f.name.split(' ')[0]).join(', ')}
                            </p>
                            {item.drizzles.length > 0 && (
                              <p className="text-[11px] text-amber-800 pl-2">
                                Drizzle: {item.drizzles.map(d => d.name).join(', ')}
                              </p>
                            )}
                            {item.toppings.length > 0 && (
                              <p className="text-[11px] text-stone-600 pl-2">
                                Crunch: {item.toppings.map(t => t.name).join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stage Transition Control */}
                    <div className="pt-3 border-t border-stone-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span>Total: ${order.total.toFixed(2)}</span>
                        <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {order.status === 'received' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'crafting')}
                            className="col-span-2 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Start Scooping
                          </button>
                        )}
                        {order.status === 'crafting' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'chilling')}
                            className="col-span-2 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Lock in Cryo Chill (-16°C)
                          </button>
                        )}
                        {order.status === 'chilling' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                            className="col-span-2 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Hand to Courier / Ready
                          </button>
                        )}
                        {order.status === 'out_for_delivery' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="col-span-2 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            Confirm Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY & TUB MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900">
                Gelato Tub Levels & Live Menu Toggles
              </h2>
              <p className="text-xs text-stone-500">
                Toggling off marks flavor "Sold Out" instantly across all customer devices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flavors.map(flavor => {
              const pct = Math.min(100, Math.round((flavor.scoopsRemaining / 50) * 100));
              const isLow = flavor.scoopsRemaining <= 25 && flavor.inStock;

              return (
                <div
                  key={flavor.id}
                  className={`p-4 rounded-xl border transition flex flex-col justify-between space-y-3 ${
                    !flavor.inStock
                      ? 'bg-stone-50 border-stone-200'
                      : isLow
                      ? 'bg-amber-50/40 border-amber-300'
                      : 'bg-white border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-6 h-6 rounded-full border border-black/10 shrink-0 shadow-xs"
                        style={{ backgroundColor: flavor.color }}
                      />
                      <div>
                        <h4 className="font-serif font-bold text-sm text-stone-900">
                          {flavor.name}
                        </h4>
                        <p className="text-[11px] text-stone-500">{flavor.origin}</p>
                      </div>
                    </div>

                    {/* Stock Switch */}
                    <button
                      onClick={() => updateFlavorStock(flavor.id, flavor.scoopsRemaining, !flavor.inStock)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                        flavor.inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {flavor.inStock ? 'In Stock' : 'Marked Sold Out'}
                    </button>
                  </div>

                  {/* Meter */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-stone-600">
                      <span>Scoops Left in Tub:</span>
                      <strong className="font-mono tabular-nums">{flavor.scoopsRemaining} / 50</strong>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          !flavor.inStock
                            ? 'bg-stone-300'
                            : isLow
                            ? 'bg-amber-600'
                            : 'bg-emerald-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Restock action */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    {isLow && (
                      <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Low Inventory Alert
                      </span>
                    )}
                    <button
                      onClick={() => restockTub(flavor.id)}
                      className="ml-auto px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Restock Tub (+45)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SALES & ANALYTICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block">Today's Revenue</span>
              <p className="text-2xl font-serif font-bold text-stone-900 mt-1 tabular-nums">
                ${analytics.todayRevenue.toFixed(2)}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +18.4% vs yesterday
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block">Orders Fulfilled</span>
              <p className="text-2xl font-serif font-bold text-stone-900 mt-1 tabular-nums">
                {analytics.todayOrdersCount}
              </p>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Avg wait: 7.2 mins
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block">Average Order Value</span>
              <p className="text-2xl font-serif font-bold text-stone-900 mt-1 tabular-nums">
                ${analytics.averageOrderValue.toFixed(2)}
              </p>
              <span className="text-[11px] text-stone-500 mt-1 block">
                2.8 scoops per ticket
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs font-medium text-stone-500 block">Scoop Club Patrons</span>
              <p className="text-2xl font-serif font-bold text-amber-900 mt-1 tabular-nums">
                {analytics.totalLoyaltyMembers}
              </p>
              <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                74% repeat patronage
              </span>
            </div>
          </div>

          {/* Flavor Leaderboard & Hourly Traffic */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Flavors */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-serif font-bold text-stone-900">
                Top Performing Artisanal Flavors
              </h3>
              <div className="space-y-3">
                {analytics.topFlavors.map(flavor => (
                  <div key={flavor.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-stone-800">{flavor.name}</span>
                      <span className="font-mono text-stone-500 tabular-nums">{flavor.scoopsSold} scoops ({flavor.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-700 rounded-full"
                        style={{ width: `${flavor.percentage * 2.5}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hourly Order Volume */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-sm font-serif font-bold text-stone-900">
                Hourly Peak Order Velocity
              </h3>
              <div className="flex items-end gap-3 h-48 pt-6 pb-2">
                {analytics.hourlyTraffic.map(hour => {
                  const maxOrders = 35;
                  const barHeight = Math.round((hour.orders / maxOrders) * 100);
                  return (
                    <div key={hour.hour} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-mono text-stone-500 tabular-nums">{hour.orders}</span>
                      <div
                        className="w-full bg-stone-900 hover:bg-amber-700 rounded-t-md transition-all duration-300"
                        style={{ height: `${barHeight}%` }}
                      />
                      <span className="text-[10px] font-medium text-stone-600 whitespace-nowrap">{hour.hour}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
