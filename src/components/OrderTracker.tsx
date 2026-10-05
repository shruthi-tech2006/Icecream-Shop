import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Thermometer, 
  Truck, 
  ChevronRight, 
  Play, 
  AlertCircle,
  Share2,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { SocialShareModal } from './SocialShareModal';

const STAGE_ORDER: OrderStatus[] = ['received', 'crafting', 'chilling', 'out_for_delivery', 'completed'];

export const OrderTracker: React.FC = () => {
  const {
    activeOrder,
    allOrders,
    setActiveOrder,
    updateOrderStatus,
    notificationPermission,
    requestNotificationPermission,
    triggerNotification,
    setActiveView,
  } = useShop();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(activeOrder?.id || (allOrders[0]?.id || ''));
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [tempFluctuation, setTempFluctuation] = useState<number>(-16.2);

  // Sync selected order
  const currentOrder = allOrders.find(o => o.id === selectedOrderId) || activeOrder || allOrders[0];

  // Minor realistic telemetry fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setTempFluctuation(prev => Number((-16.0 + (Math.random() * 0.8 - 0.4)).toFixed(1)));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleAdvanceSimulation = () => {
    if (!currentOrder) return;
    const currentIndex = STAGE_ORDER.indexOf(currentOrder.status);
    if (currentIndex < STAGE_ORDER.length - 1) {
      const nextStatus = STAGE_ORDER[currentIndex + 1];
      updateOrderStatus(currentOrder.id, nextStatus);
    }
  };

  if (!currentOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">No Active Orders Yet</h2>
        <p className="text-xs text-stone-600 mt-2 max-w-sm mx-auto">
          Craft your custom artisanal scoops and place an order to experience live dispatch and temperature tracking.
        </p>
        <button
          onClick={() => setActiveView('builder')}
          className="mt-6 px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition"
        >
          Design Your Sundae Now
        </button>
      </div>
    );
  }

  const currentStepIndex = STAGE_ORDER.indexOf(currentOrder.status);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner & Push Notification Toggle */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100/60 px-2 py-0.5 rounded">
              ORDER #{currentOrder.id}
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-stone-500 capitalize">{currentOrder.orderType}</span>
            <span className="text-stone-300">·</span>
            <span className="text-xs font-medium text-emerald-700">Payment Authorized</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            {currentOrder.status === 'completed'
              ? 'Delivered & Ready to Savor'
              : currentOrder.status === 'out_for_delivery'
              ? 'Cryo-Pack Courier Is On the Way'
              : 'Handcrafting Your Artisanal Scoops'}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            {currentOrder.orderType === 'delivery' 
              ? `Destination: ${currentOrder.deliveryAddress}` 
              : `Pickup: ${currentOrder.pickupTable || 'Boutique Front Bar'}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Push Notification button */}
          <button
            onClick={requestNotificationPermission}
            className={`px-3.5 py-2 text-xs font-medium rounded-xl border transition flex items-center gap-1.5 ${
              notificationPermission === 'granted'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>
              {notificationPermission === 'granted' ? 'Alerts Active' : 'Enable Push Alerts'}
            </span>
          </button>

          {/* Quick simulation button to advance status */}
          {currentOrder.status !== 'completed' && (
            <button
              onClick={handleAdvanceSimulation}
              title="Fast-forward order stage for evaluation"
              className="px-3.5 py-2 text-xs font-medium bg-amber-800 hover:bg-amber-900 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Simulate Next Step</span>
            </button>
          )}
        </div>
      </div>

      {/* Selector if multiple orders exist */}
      {allOrders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-stone-500 shrink-0 font-medium">Switch Order:</span>
          {allOrders.map(ord => (
            <button
              key={ord.id}
              onClick={() => {
                setSelectedOrderId(ord.id);
                setActiveOrder(ord);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg border whitespace-nowrap transition ${
                ord.id === currentOrder.id
                  ? 'border-stone-900 bg-stone-900 text-white'
                  : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
              }`}
            >
              #{ord.id} ({ord.status.replace(/_/g, ' ')})
            </button>
          ))}
        </div>
      )}

      {/* Main Grid: Status Timeline + Live Map / Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stage Timeline */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <h2 className="text-base font-serif font-bold text-stone-900 pb-3 border-b border-stone-100">
            Preparation & Delivery Stages
          </h2>

          <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
            {currentOrder.timeline.map((step, idx) => {
              const isDone = step.completed;
              const isCurrent = step.status === currentOrder.status;

              return (
                <div key={step.status} className="relative flex items-start gap-4">
                  {/* Step Marker */}
                  <div
                    className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition ${
                      isDone
                        ? 'bg-amber-800 border-amber-800 text-white'
                        : isCurrent
                        ? 'bg-white border-amber-800 text-amber-800 animate-pulse'
                        : 'bg-white border-stone-300 text-stone-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Detail */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-semibold ${
                          isDone || isCurrent ? 'text-stone-900' : 'text-stone-600'
                        }`}
                      >
                        {step.title}
                      </h4>
                      {step.timestamp && (
                        <span className="text-[11px] font-mono text-stone-600">
                          {step.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Itemized Summary Card */}
          <div className="mt-6 pt-5 border-t border-stone-100 space-y-3">
            <h3 className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
              Ordered Items
            </h3>
            {currentOrder.items.map(item => (
              <div
                key={item.id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-stone-900 font-serif">{item.customName}</p>
                  <p className="text-[11px] text-stone-600">
                    {item.vessel.name} · {item.flavors.map(f => f.name.split(' ')[0]).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-stone-900">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-[10px] text-stone-600 block">Qty: {item.quantity}</span>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center text-xs text-stone-600 pt-2">
              <span>Points Earned for Scoop Club:</span>
              <strong className="text-amber-800">+{currentOrder.loyaltyPointsEarned} Cone Coins</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Live Map & Cryo Sensor Telemetry */}
        <div className="lg:col-span-6 space-y-6">
          {/* Cryogenic Thermal Sensor Box */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                  Live Thermal Chamber
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                SENSOR ACTIVE
              </span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <span className="text-4xl font-mono font-bold text-cyan-300">
                  {tempFluctuation}°C
                </span>
                <span className="text-xs text-stone-400 block mt-1">
                  Stabilized Sub-Zero Cryo Lock
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-serif font-medium text-stone-300">
                  Optimal Solid Matrix
                </span>
                <span className="text-[11px] text-emerald-400 block">
                  Zero Melt Guarantee
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
              <span>Vacuum Flask Seal: 100% Integrity</span>
              <span>Humidity: 12%</span>
            </div>
          </div>

          {/* Interactive Stylized Dispatch Map */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-800" />
                <h3 className="text-sm font-serif font-bold text-stone-900">
                  {currentOrder.orderType === 'delivery' ? 'Live Courier Route' : 'Boutique Location'}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                <span>ETA: {currentOrder.estimatedDeliveryMinutes} MINS</span>
              </div>
            </div>

            {/* Stylized Vector Route Canvas */}
            <div className="relative h-48 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 flex items-center justify-center">
              {/* Map grid streets pattern */}
              <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 400 200">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#A8A29E" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
                {/* Transit Route curve */}
                <path
                  d="M 50 140 Q 180 50 340 100"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="4"
                  strokeDasharray="6,6"
                  className="animate-pulse"
                />
              </svg>

              {/* Start: Creamery Icon */}
              <div className="absolute left-8 bottom-10 flex flex-col items-center z-10">
                <div className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold shadow-md">
                  🍦
                </div>
                <span className="text-[10px] font-semibold text-stone-700 mt-1">Veluto Lab</span>
              </div>

              {/* Courier in Motion */}
              {currentOrder.status === 'out_for_delivery' && (
                <div 
                  className="absolute z-20 flex flex-col items-center transition-all duration-1000"
                  style={{ left: '55%', top: '35%' }}
                >
                  <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg ring-4 ring-amber-200 animate-bounce">
                    <Truck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 bg-white/90 px-1.5 py-0.5 rounded shadow-xs mt-1">
                    Courier Marco
                  </span>
                </div>
              )}

              {/* End: Destination Pin */}
              <div className="absolute right-10 top-16 flex flex-col items-center z-10">
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-md">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-semibold text-stone-700 mt-1">
                  {currentOrder.orderType === 'delivery' ? 'Your Door' : 'Table 04'}
                </span>
              </div>
            </div>

            {/* Courier Contact Card */}
            {currentOrder.riderName && (
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-sm font-serif">
                    MB
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">{currentOrder.riderName}</p>
                    <p className="text-[11px] text-stone-600">Master Cryo Courier · 4.9★</p>
                  </div>
                </div>
                <a
                  href={`tel:${currentOrder.riderPhone || '555'}`}
                  className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:border-stone-300 transition"
                  title="Call Courier"
                >
                  <Phone className="w-4 h-4 text-emerald-700" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
