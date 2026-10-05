import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Vessel, Flavor, Drizzle, Topping, CustomScoopOrder, DietaryTag } from '../types';
import { SundaeVisualizer } from './SundaeVisualizer';
import { Sparkles, Check, Plus, Minus, Share2, ShoppingBag, Shuffle, AlertCircle } from 'lucide-react';
import { SocialShareModal } from './SocialShareModal';

const CHEF_SUNDAE_NAMES = [
  'The Sicilian Sunset',
  'Pistachio & Velvet Noir',
  'Valensole Honey Cloud',
  'Midnight Ganache Drift',
  'Alfonso Citrus Breeze',
  'Matcha Forest Twilight',
  'Brittany Salted Crown',
  'Tuscan Praline Royale',
  'Oregon Marionberry Dream',
];

const BASE_PRICES: Record<number, number> = {
  1: 4.75,
  2: 7.50,
  3: 9.75,
  4: 11.50,
};

export const ScoopBuilder: React.FC = () => {
  const { vessels, flavors, drizzles, toppings, addToCart } = useShop();

  const [selectedVessel, setSelectedVessel] = useState<Vessel>(vessels[0]);
  const [scoopCount, setScoopCount] = useState<1 | 2 | 3 | 4>(3);
  const [selectedFlavors, setSelectedFlavors] = useState<Flavor[]>([
    flavors[0], // Pistachio
    flavors[2], // Dark Ganache
    flavors[5], // Salted Caramel
  ]);
  const [activeScoopSlot, setActiveScoopSlot] = useState<number>(0);
  const [selectedDrizzles, setSelectedDrizzles] = useState<Drizzle[]>([drizzles[0]]);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([toppings[0]]);
  const [dietaryFilter, setDietaryFilter] = useState<'All' | DietaryTag>('All');
  const [customName, setCustomName] = useState<string>('The Sicilian Sunset');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<'vessel' | 'flavors' | 'toppings'>('flavors');

  // Handle changing scoop count
  const handleScoopCountChange = (count: 1 | 2 | 3 | 4) => {
    setScoopCount(count);
    if (selectedFlavors.length > count) {
      setSelectedFlavors(prev => prev.slice(0, count));
    } else if (selectedFlavors.length < count) {
      const extra = count - selectedFlavors.length;
      const candidates = flavors.filter(f => f.inStock);
      const newFlavors = [...selectedFlavors];
      for (let i = 0; i < extra; i++) {
        newFlavors.push(candidates[(selectedFlavors.length + i) % candidates.length]);
      }
      setSelectedFlavors(newFlavors);
    }
  };

  const handleSelectFlavor = (flavor: Flavor) => {
    if (!flavor.inStock) return;
    const updated = [...selectedFlavors];
    updated[activeScoopSlot] = flavor;
    setSelectedFlavors(updated);
    // advance active slot to next
    if (activeScoopSlot < scoopCount - 1) {
      setActiveScoopSlot(activeScoopSlot + 1);
    }
  };

  const toggleDrizzle = (drizzle: Drizzle) => {
    if (selectedDrizzles.some(d => d.id === drizzle.id)) {
      setSelectedDrizzles(prev => prev.filter(d => d.id !== drizzle.id));
    } else {
      setSelectedDrizzles(prev => [...prev, drizzle]);
    }
  };

  const toggleTopping = (topping: Topping) => {
    if (selectedToppings.some(t => t.id === topping.id)) {
      setSelectedToppings(prev => prev.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings(prev => [...prev, topping]);
    }
  };

  const handleSurpriseName = () => {
    const random = CHEF_SUNDAE_NAMES[Math.floor(Math.random() * CHEF_SUNDAE_NAMES.length)];
    setCustomName(random);
  };

  // Price Calculation
  const baseScoopPrice = BASE_PRICES[scoopCount] || 7.50;
  const vesselPrice = selectedVessel.price;
  // 1st drizzle is free, additional +price
  const drizzlePrice = selectedDrizzles.length > 1 
    ? selectedDrizzles.slice(1).reduce((sum, d) => sum + d.price, 0) 
    : 0;
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const totalUnitPrice = Math.round((baseScoopPrice + vesselPrice + drizzlePrice + toppingsPrice) * 100) / 100;

  // Total Calories
  const totalCalories = (selectedVessel.calories || 0) +
    selectedFlavors.reduce((sum, f) => sum + (f?.caloriesPerScoop || 0), 0) +
    selectedDrizzles.reduce((sum, d) => sum + (d?.calories || 0), 0) +
    selectedToppings.reduce((sum, t) => sum + (t?.calories || 0), 0);

  // Filtered flavors
  const filteredFlavors = flavors.filter(flavor => {
    if (dietaryFilter === 'All') return true;
    return flavor.tags.includes(dietaryFilter);
  });

  const handleAddToCart = () => {
    const customOrder: CustomScoopOrder = {
      id: `custom-${Date.now()}`,
      customName: customName || 'Custom Sundae Creation',
      vessel: selectedVessel,
      scoopCount,
      flavors: selectedFlavors,
      drizzles: selectedDrizzles,
      toppings: selectedToppings,
      unitPrice: totalUnitPrice,
      quantity: 1,
    };
    addToCart(customOrder);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Info */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-widest font-semibold text-stone-600 mb-2">
          Interactive Gelato Bar
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          Craft Your Bespoke Sundae
        </h1>
        <p className="text-sm text-stone-600 mt-2">
          Select handcrafted vessels, churned-daily organic gelato, warm house drizzles, and hand-toasted crunches.
        </p>
      </div>

      {/* Main Grid: Visualizer Sticky Left, Customizer Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visualizer & Live Creation Passport */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-stone-400">RECIPE PASSPORT</span>
              <span className="text-stone-300">·</span>
              <span className="text-xs text-stone-600">{scoopCount} Scoops</span>
            </div>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
              title="Share or save digital sundae card"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Card</span>
            </button>
          </div>

          {/* Interactive Stack Visualizer */}
          <div className="py-4">
            <SundaeVisualizer
              vessel={selectedVessel}
              flavors={selectedFlavors}
              drizzles={selectedDrizzles}
              toppings={selectedToppings}
              scoopCount={scoopCount}
              size="lg"
            />
          </div>

          {/* Custom Name Input */}
          <div className="mt-4 pt-4 border-t border-stone-100">
            <label className="block text-xs font-medium text-stone-700 mb-1.5">
              Name Your Masterpiece
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="e.g. Pistachio Twilight"
                maxLength={32}
                className="flex-1 text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition"
              />
              <button
                onClick={handleSurpriseName}
                title="Random chef recipe name"
                className="px-3 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors flex items-center gap-1"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Surprise</span>
              </button>
            </div>
          </div>

          {/* Calorie & Nutritional Spec Bar */}
          <div className="mt-4 p-3 bg-stone-50 rounded-xl flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-900 tabular-nums">{totalCalories}</span>
              <span>kcal total</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
              <span>{selectedVessel.name.split(' ')[0]}</span>
              <span>·</span>
              <span>{selectedDrizzles.length} Drizzle</span>
              <span>·</span>
              <span>{selectedToppings.length} Crunch</span>
            </div>
          </div>

          {/* Action Price & Add to Bag */}
          <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-stone-600 block">Total Price</span>
              <span className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                ${totalUnitPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step Nav Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl">
            <button
              onClick={() => setActiveStep('vessel')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition ${
                activeStep === 'vessel'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              1. Choose Vessel
            </button>
            <button
              onClick={() => setActiveStep('flavors')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition ${
                activeStep === 'flavors'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              2. Scoops ({scoopCount})
            </button>
            <button
              onClick={() => setActiveStep('toppings')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition ${
                activeStep === 'toppings'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              3. Drizzles & Crunches
            </button>
          </div>

          {/* STEP 1: VESSELS */}
          {activeStep === 'vessel' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-serif font-semibold text-stone-900">
                  Select Your Base Vessel
                </h3>
                <span className="text-xs text-stone-600">Freshly rolled & baked</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vessels.map(vessel => {
                  const isSelected = selectedVessel.id === vessel.id;
                  return (
                    <button
                      key={vessel.id}
                      onClick={() => setSelectedVessel(vessel)}
                      className={`text-left p-4 rounded-xl border transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600/30'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-stone-900">{vessel.name}</p>
                          <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                            {vessel.description}
                          </p>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                        <span className="text-stone-600 tabular-nums">{vessel.calories} kcal</span>
                        <span className="font-semibold text-stone-900 tabular-nums">
                          {vessel.price === 0 ? 'Included' : `+$${vessel.price.toFixed(2)}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setActiveStep('flavors')}
                  className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition"
                >
                  Continue to Scoops →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCOOPS & FLAVORS */}
          {activeStep === 'flavors' && (
            <div className="space-y-6">
              {/* Scoop Count Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Number of Scoops
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([1, 2, 3, 4] as const).map(count => (
                    <button
                      key={count}
                      onClick={() => handleScoopCountChange(count)}
                      className={`py-2.5 px-3 rounded-xl border text-center transition ${
                        scoopCount === count
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400'
                      }`}
                    >
                      <span className="block text-sm font-serif font-bold">
                        {count} {count === 1 ? 'Scoop' : 'Scoops'}
                      </span>
                      <span className={`text-[11px] block mt-0.5 tabular-nums ${scoopCount === count ? 'text-stone-300' : 'text-stone-600'}`}>
                        ${BASE_PRICES[count].toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Scoop Slots Selector */}
              <div className="p-3 bg-white rounded-xl border border-stone-200">
                <p className="text-xs font-semibold text-stone-500 mb-2">
                  Assign Flavors to Scoop Layers (Click to change target):
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {Array.from({ length: scoopCount }).map((_, idx) => {
                    const flavor = selectedFlavors[idx];
                    const isActive = activeScoopSlot === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveScoopSlot(idx)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition shrink-0 ${
                          isActive
                            ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                            : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: flavor?.color || '#ddd' }}
                        />
                        <div className="text-left">
                          <p className="text-[11px] font-semibold text-stone-500">
                            Layer {idx + 1}
                          </p>
                          <p className="text-xs font-serif font-medium text-stone-900 truncate max-w-[110px]">
                            {flavor ? flavor.name.split(' ')[0] : 'Choose Flavor'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dietary Filter Segmented Control */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Browse Artisanal Flavors
                  </span>
                  <span className="text-xs text-stone-600">
                    Targeting: <strong>Layer {activeScoopSlot + 1}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                  {(['All', 'Vegan', 'Gluten-Free', 'Nut-Free', 'Dairy-Free'] as const).map(tag => (
                    <button
                      key={tag}
                      onClick={() => setDietaryFilter(tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                        dietaryFilter === tag
                          ? 'bg-stone-900 text-white'
                          : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavor Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                {filteredFlavors.map(flavor => {
                  const isCurrentSlotChosen = selectedFlavors[activeScoopSlot]?.id === flavor.id;
                  const timesChosen = selectedFlavors.filter(f => f?.id === flavor.id).length;

                  return (
                    <div
                      key={flavor.id}
                      onClick={() => handleSelectFlavor(flavor)}
                      className={`p-3.5 rounded-xl border transition flex flex-col justify-between cursor-pointer relative ${
                        !flavor.inStock
                          ? 'opacity-50 cursor-not-allowed bg-stone-100 border-stone-200'
                          : isCurrentSlotChosen
                          ? 'border-amber-600 bg-amber-50/30 ring-1 ring-amber-600/30'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-xs"
                              style={{ backgroundColor: flavor.color }}
                            />
                            <div>
                              <p className="text-sm font-serif font-bold text-stone-900 leading-tight">
                                {flavor.name}
                              </p>
                              <p className="text-[11px] italic text-stone-600">
                                {flavor.italianName}
                              </p>
                            </div>
                          </div>
                          {timesChosen > 0 && (
                            <span className="text-[10px] font-semibold bg-stone-900 text-white px-1.5 py-0.5 rounded-full shrink-0">
                              {timesChosen}×
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-stone-600 mt-2 line-clamp-2">
                          {flavor.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
                        <span className="text-stone-600">{flavor.origin}</span>
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums">{flavor.caloriesPerScoop} kcal</span>
                          {flavor.scoopsRemaining <= 25 && flavor.inStock && (
                            <span className="text-amber-800 font-medium">Low stock</span>
                          )}
                          {!flavor.inStock && (
                            <span className="text-red-700 font-semibold">Sold Out</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setActiveStep('vessel')}
                  className="px-4 py-2 border border-stone-200 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 transition"
                >
                  ← Back to Vessel
                </button>
                <button
                  onClick={() => setActiveStep('toppings')}
                  className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition"
                >
                  Continue to Drizzles & Crunches →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DRIZZLES & TOPPINGS */}
          {activeStep === 'toppings' && (
            <div className="space-y-6">
              {/* Drizzles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-serif font-bold text-stone-900">
                    Artisanal Warm Drizzles
                  </h3>
                  <span className="text-xs text-amber-800 font-medium">
                    1st Drizzle is Complimentary
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {drizzles.map(drizzle => {
                    const isSelected = selectedDrizzles.some(d => d.id === drizzle.id);
                    return (
                      <button
                        key={drizzle.id}
                        onClick={() => toggleDrizzle(drizzle)}
                        className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/50'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: drizzle.color }}
                          />
                          <div>
                            <p className="text-xs font-semibold text-stone-900">{drizzle.name}</p>
                            <p className="text-[11px] text-stone-600 tabular-nums">+{drizzle.calories} kcal</p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-stone-600">
                          {selectedDrizzles.length === 0 || (selectedDrizzles.length === 1 && isSelected)
                            ? 'Free'
                            : `+$${drizzle.price.toFixed(2)}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Handcrafted Toppings & Crunches */}
              <div>
                <h3 className="text-sm font-serif font-bold text-stone-900 mb-2">
                  Handcrafted Crunches & Accents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {toppings.map(topping => {
                    const isSelected = selectedToppings.some(t => t.id === topping.id);
                    return (
                      <button
                        key={topping.id}
                        onClick={() => toggleTopping(topping)}
                        className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/50'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-semibold text-stone-900">{topping.name}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-stone-600 mt-0.5">
                            <span>+{topping.calories} kcal</span>
                            {topping.tags.includes('Contains Nuts') && (
                              <>
                                <span>·</span>
                                <span className="text-amber-800">Nuts</span>
                              </>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-medium text-stone-900 tabular-nums">
                          +${topping.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setActiveStep('flavors')}
                  className="px-4 py-2 border border-stone-200 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 transition"
                >
                  ← Back to Scoops
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Custom Creation to Bag</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Share / Viral Invite Card Modal */}
      {isShareModalOpen && (
        <SocialShareModal
          vessel={selectedVessel}
          flavors={selectedFlavors}
          drizzles={selectedDrizzles}
          toppings={selectedToppings}
          customName={customName}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
};
