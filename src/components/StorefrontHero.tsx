import React from 'react';
import { useShop } from '../context/ShopContext';
import { APP_IMAGES } from '../assets/images';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Award, Heart } from 'lucide-react';

export const StorefrontHero: React.FC = () => {
  const { setActiveView, flavors } = useShop();

  const featuredFlavors = flavors.slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-stone-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 border border-stone-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
          {/* Hero Copy */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-amber-400">
                Artisanal Gelato & Churned Cream
              </span>
              <span className="text-stone-600">·</span>
              <span className="text-xs text-stone-300">Small Batch Daily</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
              Bespoke Scoops. Pure Terroir.
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed">
              Craft your own custom multi-scoop creation with volcanic Bronte pistachios, single-origin dark cocoa, and warm house brioche. Monitored with live -16°C cryogenic courier dispatch.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('builder')}
                className="py-3.5 px-6 bg-amber-500 hover:bg-amber-400 text-stone-950 font-serif font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <span>Design Your Custom Sundae</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('loyalty')}
                className="py-3.5 px-5 bg-stone-800/80 hover:bg-stone-800 text-stone-200 text-sm font-semibold rounded-xl border border-stone-700 transition cursor-pointer"
              >
                Join Scoop Club (Earn $5)
              </button>
            </div>

            {/* Proof Trust Markers */}
            <div className="pt-6 border-t border-stone-800/80 grid grid-cols-3 gap-4 text-xs text-stone-400">
              <div>
                <p className="font-serif font-bold text-white text-sm">100% Organic</p>
                <p className="text-[11px] text-stone-400">Pasture-fed dairy</p>
              </div>
              <div>
                <p className="font-serif font-bold text-white text-sm">-16°C Cryo-Pack</p>
                <p className="text-[11px] text-stone-400">Zero-melt delivery</p>
              </div>
              <div>
                <p className="font-serif font-bold text-white text-sm">5★ Rating</p>
                <p className="text-[11px] text-stone-400">Over 1,400 reviews</p>
              </div>
            </div>
          </div>

          {/* Hero Imagery */}
          <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-full">
            <img
              src={APP_IMAGES.heroGelato}
              alt="Artisanal Gelato Display"
              className="absolute inset-0 w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Scrim gradient for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-stone-900 via-stone-900/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* 2. SIGNATURE FLAVORS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-stone-600 mb-1">
              Curated Churns
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              Today's Master Flavor Selection
            </h2>
          </div>
          <button
            onClick={() => setActiveView('builder')}
            className="text-xs font-semibold text-amber-900 hover:text-amber-800 transition flex items-center gap-1"
          >
            <span>Explore all 10 flavors in builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFlavors.map(flavor => (
            <div
              key={flavor.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="w-7 h-7 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: flavor.color }}
                  />
                  <span className="text-[11px] font-medium text-stone-600">
                    {flavor.origin}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-stone-900 group-hover:text-amber-900 transition">
                  {flavor.name}
                </h3>
                <p className="text-[11px] italic text-stone-600 mt-0.5">
                  {flavor.italianName}
                </p>

                <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                  {flavor.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-600 font-mono tabular-nums">
                  {flavor.caloriesPerScoop} kcal
                </span>
                <button
                  onClick={() => setActiveView('builder')}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-800 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Customise →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ARTISANAL CRAFT SHOWCASE (DUAL BANNER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Waffle Cone Spotlight */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="h-64 overflow-hidden relative">
              <img
                src={APP_IMAGES.waffleConeTriple}
                alt="Handmade Waffle Cone Triple"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-xs text-amber-200 text-xs font-serif px-3 py-1 rounded-full">
                Pressed to Order
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Freshly Rolled Vanilla Bean Waffles
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Hand-pressed on vintage cast-iron presses every morning with cultured European butter and raw Tahitian vanilla seeds. Available dipped in dark ganache and dusted with roasted hazelnuts.
              </p>
              <button
                onClick={() => setActiveView('builder')}
                className="text-xs font-bold text-stone-900 hover:text-amber-800 transition flex items-center gap-1 pt-1"
              >
                <span>Select this vessel in builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Brioche Sandwich Spotlight */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="h-64 overflow-hidden relative">
              <img
                src={APP_IMAGES.briocheGelato}
                alt="Brioche Gelato Sandwich"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-xs text-amber-200 text-xs font-serif px-3 py-1 rounded-full">
                Sicilian Tradition
              </div>
            </div>
            <div className="p-6 sm:p-8 space-y-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                Warm Toasted Brioche con Gelato
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                The authentic Palermo breakfast: sweet golden egg brioche sliced warm from the stone oven and crowned with generous mounds of slow-churned gelato.
              </p>
              <button
                onClick={() => setActiveView('builder')}
                className="text-xs font-bold text-stone-900 hover:text-amber-800 transition flex items-center gap-1 pt-1"
              >
                <span>Select this vessel in builder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VIRAL INVITE PROMO TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-100/60 border border-amber-300/80 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-900">
              Invite Friends & Save Together
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Give $5.00 Off, Get 100 Cone Coins
            </h3>
            <p className="text-xs sm:text-sm text-stone-700">
              Share your favorite custom scoop recipe card with friends on WhatsApp or X. Once they taste their first scoop, your Cone Coins arrive automatically.
            </p>
          </div>
          <button
            onClick={() => setActiveView('loyalty')}
            className="py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-serif font-semibold text-xs sm:text-sm rounded-xl shadow-sm transition whitespace-nowrap cursor-pointer"
          >
            Get Your Personal Invite Link
          </button>
        </div>
      </section>
    </div>
  );
};
