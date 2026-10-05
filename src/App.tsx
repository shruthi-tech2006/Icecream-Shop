import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StorefrontHero } from './components/StorefrontHero';
import { ScoopBuilder } from './components/ScoopBuilder';
import { OrderTracker } from './components/OrderTracker';
import { LoyaltyClub } from './components/LoyaltyClub';
import { AdminDashboard } from './components/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, applyPromoCode, triggerNotification, recentAlerts } = useShop();

  // Handle URL Referral code on mount (?ref=CODE)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');
      if (refCode) {
        applyPromoCode(refCode).then(res => {
          if (res.success) {
            triggerNotification('Friend Invite Applied!', 'Enjoy $5.00 off your first custom creation!');
          }
        });
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-stone-900 selection:bg-amber-200">
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && <StorefrontHero />}
        {activeView === 'builder' && <ScoopBuilder />}
        {activeView === 'tracker' && <OrderTracker />}
        {activeView === 'loyalty' && <LoyaltyClub />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Floating Active Alerts Toast Banner (Zero pill spam, clean quiet toast) */}
      {recentAlerts.length > 0 && recentAlerts[0] && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full pointer-events-none">
          <div className="bg-stone-900 text-white p-3.5 rounded-xl shadow-xl border border-stone-800 flex items-start gap-3 pointer-events-auto transition transform translate-y-0">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3 h-3" />
            </div>
            <div className="flex-1 text-xs">
              <p className="font-semibold text-white">{recentAlerts[0].title}</p>
              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">{recentAlerts[0].time}</span>
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}
