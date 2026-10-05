import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Bell, Menu, X, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    cart,
    setIsCartOpen,
    activeView,
    setActiveView,
    activeOrder,
    recentAlerts,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Top Bar following the strict Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => {
              setActiveView('home');
              setMobileMenuOpen(false);
            }}
            className="text-2xl font-serif font-black tracking-tight text-stone-900 hover:text-amber-900 transition-colors select-none cursor-pointer"
          >
            Veluto
          </button>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            <button
              onClick={() => setActiveView('home')}
              className={`hover:text-stone-900 transition-colors cursor-pointer ${
                activeView === 'home' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-amber-600' : ''
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => setActiveView('builder')}
              className={`hover:text-stone-900 transition-colors cursor-pointer ${
                activeView === 'builder' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-amber-600' : ''
              }`}
            >
              Custom Scoop Bar
            </button>
            <button
              onClick={() => setActiveView('tracker')}
              className={`hover:text-stone-900 transition-colors relative cursor-pointer ${
                activeView === 'tracker' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-amber-600' : ''
              }`}
            >
              <span>Live Tracker</span>
              {activeOrder && activeOrder.status !== 'completed' && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-600 ml-1.5 -translate-y-1" />
              )}
            </button>
            <button
              onClick={() => setActiveView('loyalty')}
              className={`hover:text-stone-900 transition-colors cursor-pointer ${
                activeView === 'loyalty' ? 'text-stone-950 font-semibold underline underline-offset-8 decoration-amber-600' : ''
              }`}
            >
              Scoop Club & Invites
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`text-xs text-stone-600 hover:text-stone-900 transition-colors cursor-pointer ${
                activeView === 'admin' ? 'text-stone-900 font-semibold' : ''
              }`}
            >
              Staff POS
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3">
            {/* Notification Drawer Trigger */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition relative cursor-pointer"
                title="View recent alerts"
              >
                <Bell className="w-5 h-5" />
                {recentAlerts.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-600" />
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-stone-200 shadow-xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-xs font-serif font-bold text-stone-900">Push Updates & Chimes</span>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11px] text-stone-600 hover:underline"
                    >
                      Close
                    </button>
                  </div>
                  {recentAlerts.length === 0 ? (
                    <p className="text-xs text-stone-500 py-4 text-center">No alerts yet</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {recentAlerts.map(alert => (
                        <div key={alert.id} className="text-xs p-2 rounded-lg bg-stone-50 border border-stone-100">
                          <p className="font-semibold text-stone-900">{alert.title}</p>
                          <span className="text-[10px] text-stone-600 font-mono">{alert.time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 sm:px-3 sm:py-2 text-stone-800 hover:bg-stone-100 rounded-xl border border-stone-200 transition flex items-center gap-2 cursor-pointer"
              title="Open Bag"
            >
              <ShoppingBag className="w-5 h-5 text-amber-900" />
              <span className="hidden sm:inline text-xs font-semibold">Bag</span>
              {cartItemCount > 0 && (
                <span className="font-mono text-xs font-bold bg-stone-900 text-white px-2 py-0.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-950 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-[#FBF9F5] px-4 pt-2 pb-4 space-y-2 text-sm font-medium">
            <button
              onClick={() => {
                setActiveView('home');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-stone-800 hover:text-amber-900"
            >
              Collection
            </button>
            <button
              onClick={() => {
                setActiveView('builder');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-stone-800 hover:text-amber-900"
            >
              Custom Scoop Bar
            </button>
            <button
              onClick={() => {
                setActiveView('tracker');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-stone-800 hover:text-amber-900"
            >
              Live Order Tracker
            </button>
            <button
              onClick={() => {
                setActiveView('loyalty');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-stone-800 hover:text-amber-900"
            >
              Scoop Club & Friends Referral
            </button>
            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-stone-600 hover:text-stone-900"
            >
              Staff Kitchen & Inventory POS
            </button>
          </div>
        )}
      </header>
    </>
  );
};
