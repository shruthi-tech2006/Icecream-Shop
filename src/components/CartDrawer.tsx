import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    setActiveView,
  } = useShop();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col border-l border-stone-200">
            {/* Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-800" />
                <h2 className="font-serif text-lg font-bold text-stone-900">Your Gelato Bag</h2>
                <span className="text-xs text-stone-500 font-medium">({cart.length} creations)</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-stone-800">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs">
                    Choose artisanal waffle cones, creamy organic gelato scoops, and toasted crunches to begin.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setActiveView('builder');
                    }}
                    className="mt-2 py-2 px-4 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition"
                  >
                    Build a Custom Sundae
                  </button>
                </div>
              ) : (
                cart.map(item => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs space-y-2 relative"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-stone-900">
                          {item.customName}
                        </h4>
                        <p className="text-xs text-stone-600 font-medium">
                          {item.vessel.name} · {item.scoopCount} Scoops
                        </p>
                      </div>
                      <span className="font-mono text-xs font-bold text-stone-900">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    {/* Flavors color dots */}
                    <div className="flex flex-wrap gap-1.5 py-1">
                      {item.flavors.map((f, fIdx) => (
                        <span
                          key={fIdx}
                          className="inline-flex items-center gap-1 text-[11px] text-stone-600 bg-stone-50 px-2 py-0.5 rounded border border-stone-100"
                        >
                          <span
                            className="w-2 h-2 rounded-full border border-black/10"
                            style={{ backgroundColor: f.color }}
                          />
                          <span>{f.name.split(' ')[0]}</span>
                        </span>
                      ))}
                    </div>

                    {/* Drizzles & Toppings summary */}
                    {(item.drizzles.length > 0 || item.toppings.length > 0) && (
                      <p className="text-[11px] text-stone-500">
                        {[
                          ...item.drizzles.map(d => d.name.split(' ')[0]),
                          ...item.toppings.map(t => t.name.split(' ')[0]),
                        ].join(' · ')}
                      </p>
                    )}

                    {/* Quantity Stepper & Remove */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="p-1 text-stone-500 hover:text-stone-900 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-semibold px-1 text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="p-1 text-stone-500 hover:text-stone-900 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-600 transition p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-5 bg-white border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="font-mono font-bold text-stone-900 text-base">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Taxes, courier freeze delivery & promo codes calculated at checkout.
                </p>
                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-serif font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}
    </>
  );
};
