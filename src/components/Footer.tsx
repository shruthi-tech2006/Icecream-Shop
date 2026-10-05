import React from 'react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useShop();

  return (
    <footer className="border-t border-stone-200/80 bg-[#F5F2EB] py-12 text-stone-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <span className="text-xl font-serif font-black text-stone-900 tracking-tight block">
              Veluto
            </span>
            <p className="text-xs text-stone-500 leading-relaxed max-w-xs">
              Handcrafted small-batch gelato and churned creamery. Sourced from organic pastures and single-origin groves.
            </p>
            <div className="text-[11px] text-stone-400">
              <span>Boutique Flagship: 450 Hayes Street, San Francisco</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-stone-900 text-sm">Experience</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveView('builder')}
                  className="hover:text-stone-900 transition cursor-pointer"
                >
                  Custom Scoop Bar
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('tracker')}
                  className="hover:text-stone-900 transition cursor-pointer"
                >
                  Live Order & Cryo Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('loyalty')}
                  className="hover:text-stone-900 transition cursor-pointer"
                >
                  The Scoop Club Rewards
                </button>
              </li>
            </ul>
          </div>

          {/* Sourcing Transparency */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-stone-900 text-sm">Artisanal Sourcing</h4>
            <div className="space-y-1 text-stone-500 text-[11px] leading-relaxed">
              <p>Sicilian Bronte Pistachios D.O.P.</p>
              <p>Madagascar Cured Bourbon Vanilla</p>
              <p>Antwerp 72% Single Origin Cocoa</p>
              <p>Brittany Fleur de Sel Butter Caramel</p>
            </div>
          </div>

          {/* Operations & Staff */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-stone-900 text-sm">Operations</h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setActiveView('admin')}
                  className="text-stone-600 hover:text-stone-900 transition underline underline-offset-4 cursor-pointer"
                >
                  Kitchen Display & Tub Inventory
                </button>
              </li>
              <li className="text-[11px] text-stone-500">
                Daily Hours: 12:00 PM – 11:00 PM
              </li>
              <li className="text-[11px] text-emerald-700 font-medium">
                Cryo-Delivery Active: Within 8 Miles
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Clean unboxed metadata with separators */}
        <div className="pt-8 border-t border-stone-300/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Veluto Creamery Co.</span>
            <span aria-hidden="true">·</span>
            <span>All rights reserved</span>
            <span aria-hidden="true">·</span>
            <span>Zero Artificial Stabilizers</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Pasture to Scoop</span>
            <span aria-hidden="true">·</span>
            <span>PCI Level 1 Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
