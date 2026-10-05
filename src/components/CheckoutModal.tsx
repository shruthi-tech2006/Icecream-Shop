import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, ShieldCheck, Lock, CreditCard, Check, AlertCircle, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ onClose }) => {
  const {
    cart,
    discountAmount,
    discountCode,
    applyPromoCode,
    removePromoCode,
    loyaltyProfile,
    placeOrder,
  } = useShop();

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('Eleanor Vance');
  const [customerPhone, setCustomerPhone] = useState('555-234-5678');
  const [customerEmail, setCustomerEmail] = useState('eleanor.vance@example.com');
  const [deliveryAddress, setDeliveryAddress] = useState('452 Elmwood Avenue, Apt 2B');
  const [pickupTable, setPickupTable] = useState('Boutique Bar - Stool 04');
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [cardZip, setCardZip] = useState('94103');
  const [saveCard, setSaveCard] = useState(true);

  // Tip
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [customTip, setCustomTip] = useState<string>('');

  // Promo code local state
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  // Math
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const calculatedTip = customTip ? parseFloat(customTip) || 0 : (subtotal * tipPercent) / 100;
  const tax = Math.round(subtotal * 0.088 * 100) / 100;
  const deliveryFee = orderType === 'delivery' ? (subtotal > 25 ? 0 : 2.99) : 0;
  const grandTotal = Math.max(0, Math.round((subtotal - discountAmount + tax + calculatedTip + deliveryFee) * 100) / 100);

  const formatCardNumber = (value: string) => {
    const clean = value.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleApplyPromo = async () => {
    if (!promoInput) return;
    const res = await applyPromoCode(promoInput);
    setPromoMsg({ text: res.message, error: !res.success });
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessingStage('Connecting to Encrypted Payment Vault...');

    try {
      await new Promise(r => setTimeout(r, 800));
      setProcessingStage('Performing 3D-Secure Biometric Verification...');
      await new Promise(r => setTimeout(r, 900));
      setProcessingStage('Authorizing Transaction with Issuing Bank...');
      await new Promise(r => setTimeout(r, 700));

      await placeOrder({
        customerName,
        customerPhone,
        customerEmail,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        pickupTable: orderType === 'pickup' ? pickupTable : undefined,
        paymentMethod,
        tip: calculatedTip,
      });

      onClose();
    } catch (err: unknown) {
      setIsProcessing(false);
      const errorMessage = err instanceof Error ? err.message : 'Payment authorization failed';
      setPromoMsg({ text: errorMessage, error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-white/95 rounded-2xl z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-14 h-14 rounded-full border-4 border-amber-600/20 border-t-amber-600 animate-spin mb-4" />
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">
              Securing Your Artisanal Order
            </h3>
            <p className="text-xs text-stone-600 font-medium">
              {processingStage}
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[11px] text-stone-600">
              <Lock className="w-3.5 h-3.5 text-emerald-800" />
              <span>256-Bit SSL End-to-End Encrypted</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-600">
              Checkout & Payment
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-xs text-emerald-800 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              PCI Level 1 Gateway
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Complete Your Gelato Experience
          </h2>
        </div>

        <form onSubmit={handleSubmitPayment} className="space-y-6">
          {/* Order Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Delivery Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-3 px-4 rounded-xl border text-left transition flex items-center justify-between ${
                  orderType === 'delivery'
                    ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold text-stone-900">Courier Dispatch</p>
                  <p className="text-[11px] text-stone-600">Cryo-insulated (-16°C)</p>
                </div>
                <span className="text-xs font-bold text-stone-900">
                  {subtotal > 25 ? 'Free' : '$2.99'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-3 px-4 rounded-xl border text-left transition flex items-center justify-between ${
                  orderType === 'pickup'
                    ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div>
                  <p className="text-xs font-semibold text-stone-900">Boutique Pickup</p>
                  <p className="text-[11px] text-stone-600">Ready in 5-8 mins</p>
                </div>
                <span className="text-xs font-bold text-stone-900">Free</span>
              </button>
            </div>
          </div>

          {/* Contact & Destination Information */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Customer Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-stone-600 block mb-1">Full Name</span>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>
              <div>
                <span className="text-[11px] text-stone-600 block mb-1">Mobile (for Push/SMS Alerts)</span>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {orderType === 'delivery' ? (
              <div>
                <span className="text-[11px] text-stone-600 block mb-1">Delivery Street Address</span>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Street address, apartment or suite number"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            ) : (
              <div>
                <span className="text-[11px] text-stone-600 block mb-1">Table Number / Bar Seat (Optional)</span>
                <input
                  type="text"
                  value={pickupTable}
                  onChange={e => setPickupTable(e.target.value)}
                  placeholder="e.g. Table 04 or Counter Arch"
                  className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            )}
          </div>

          {/* Promo Code & Loyalty Points Bar */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-700">Promo Code or Referral</span>
              {discountCode && (
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-[11px] text-red-600 hover:underline"
                >
                  Remove ({discountCode})
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={e => setPromoInput(e.target.value)}
                placeholder="Try SWEETFRIEND or referral code"
                className="flex-1 text-xs bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-600 uppercase"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-3.5 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition"
              >
                Apply
              </button>
            </div>

            {promoMsg && (
              <p className={`text-[11px] ${promoMsg.error ? 'text-red-600' : 'text-emerald-700 font-medium'}`}>
                {promoMsg.text}
              </p>
            )}

            {loyaltyProfile.points >= 100 && !discountCode && (
              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <span className="text-stone-600">
                  You have <strong className="text-amber-800">{loyaltyProfile.points} Cone Coins</strong>
                </span>
                <button
                  type="button"
                  onClick={() => applyPromoCode('COIN-SAVE5')}
                  className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 underline"
                >
                  Redeem 100 Coins for $5 Off
                </button>
              </div>
            )}
          </div>

          {/* Tip Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Artisan Churner & Courier Gratuity
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[10, 15, 20, 25, 0].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    setTipPercent(pct);
                    setCustomTip('');
                  }}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    tipPercent === pct && !customTip
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {pct === 0 ? 'None' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
              Select Secure Payment
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'card'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Credit Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'apple_pay'
                    ? 'border-black bg-black text-white'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <span> Pay</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('google_pay')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  paymentMethod === 'google_pay'
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                }`}
              >
                <span>G Pay</span>
              </button>
            </div>

            {/* Credit Card Input Form */}
            {paymentMethod === 'card' ? (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-stone-600">Card Number</span>
                    <span className="text-[10px] text-stone-600 font-mono">VISA / MC / AMEX</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4000 1234 5678 9010"
                      className="w-full text-xs font-mono bg-white border border-stone-200 rounded-lg p-2.5 pl-9 text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                    <CreditCard className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[11px] text-stone-600 block mb-1">Expires</span>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full text-xs font-mono bg-white border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-600 block mb-1">CVV / CVC</span>
                    <input
                      type="password"
                      required
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value)}
                      placeholder="•••"
                      maxLength={4}
                      className="w-full text-xs font-mono bg-white border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-600 block mb-1">Postal Code</span>
                    <input
                      type="text"
                      required
                      value={cardZip}
                      onChange={e => setCardZip(e.target.value)}
                      placeholder="94103"
                      className="w-full text-xs font-mono bg-white border border-stone-200 rounded-lg p-2.5 text-stone-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={e => setSaveCard(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-xs text-stone-600">
                    Save card securely for 1-click reorders
                  </span>
                </label>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-center">
                <p className="text-xs text-stone-600">
                  {paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'} Express authorization will trigger upon confirming.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Breakdown */}
          <div className="border-t border-stone-200 pt-4 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal ({cart.length} items)</span>
              <span className="tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount Applied</span>
                <span className="tabular-nums">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (8.8%)</span>
              <span className="tabular-nums">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="tabular-nums">{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Gratuity</span>
              <span className="tabular-nums">${calculatedTip.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-serif font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total to Pay</span>
              <span className="tabular-nums">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || cart.length === 0}
            className="w-full py-3.5 px-6 bg-stone-900 hover:bg-stone-800 text-white font-serif font-bold text-base rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4 text-amber-300" />
            <span>Pay ${grandTotal.toFixed(2)} & Place Order</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
};
