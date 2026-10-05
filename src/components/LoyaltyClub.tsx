import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { REWARD_VOUCHERS } from '../data/menuData';
import { 
  Gift, 
  Sparkles, 
  Users, 
  Copy, 
  Check, 
  Share2, 
  MessageCircle, 
  Twitter, 
  Award, 
  ArrowRight,
  Search
} from 'lucide-react';
import { APP_IMAGES } from '../assets/images';

export const LoyaltyClub: React.FC = () => {
  const {
    loyaltyProfile,
    redeemLoyaltyReward,
    lookupLoyaltyProfile,
    triggerNotification,
    setActiveView,
  } = useShop();

  const [copied, setCopied] = useState(false);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const inviteCode = loyaltyProfile.referralCode;
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}?ref=${inviteCode}`
    : `https://veluto.creamery?ref=${inviteCode}`;

  const shareText = `Get $5.00 off your first handcrafted gelato sundae at Veluto Artisanal Creamery! 🍦 Use my personal invite code:`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${shareUrl}`);
      setCopied(true);
      triggerNotification('Invite Link Copied!', 'Send it to your friend to give $5 & get $5');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareToWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(url, '_blank');
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleRedeem = async (voucher: typeof REWARD_VOUCHERS[0]) => {
    setRedeemingId(voucher.id);
    const success = await redeemLoyaltyReward(voucher.code, voucher.pointsCost, voucher.discountDollars);
    setRedeemingId(null);
    if (success) {
      setActiveView('builder');
    }
  };

  const handlePhoneLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch) return;
    await lookupLoyaltyProfile(phoneSearch);
    triggerNotification('Patron Profile Loaded', `Welcome back, ${loyaltyProfile.name}!`);
  };

  // Tier calculation
  const nextTierPoints = loyaltyProfile.tier === 'Sprinkle Scout' ? 200 : loyaltyProfile.tier === 'Sundae Connoisseur' ? 500 : 1000;
  const progressPercent = Math.min(100, Math.round((loyaltyProfile.points / nextTierPoints) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-300">
              The Veluto Scoop Club
            </span>
            <span className="text-stone-600">·</span>
            <span className="text-xs text-stone-300">Earn 10 Cone Coins per $1</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            Handcrafted Gelato Perks & Rewards
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-2">
            Collect Cone Coins with each artisanal scoop, unlock secret tasting flights, and earn store credit for inviting friends.
          </p>
        </div>

        {/* Background image subtle scrim */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden sm:block">
          <img
            src={APP_IMAGES.loyaltyRewards}
            alt="Tasting flight"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Member Card & Tier Progress */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Balance Card */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-xs text-stone-400 block font-medium">PATRON STATUS</span>
                <h3 className="text-lg font-serif font-bold text-stone-900">{loyaltyProfile.name}</h3>
              </div>
              <span className="text-xs font-semibold text-amber-900 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200">
                {loyaltyProfile.tier}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-5xl font-serif font-bold text-stone-900 tabular-nums">
                {loyaltyProfile.points}
              </span>
              <div>
                <span className="text-sm font-semibold text-stone-800">Cone Coins</span>
                <span className="text-xs text-stone-500 block">≈ ${(loyaltyProfile.points / 20).toFixed(2)} value</span>
              </div>
            </div>

            {/* Progress bar to next tier */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-xs text-stone-500">
                <span>Tier Progress ({loyaltyProfile.tier})</span>
                <span className="font-mono tabular-nums">{loyaltyProfile.points} / {nextTierPoints} pts</span>
              </div>
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-100 text-center">
            <div className="p-2 bg-stone-50 rounded-xl">
              <span className="text-xs text-stone-500 block">Orders</span>
              <span className="text-sm font-serif font-bold text-stone-900">{loyaltyProfile.lifetimeOrders}</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl">
              <span className="text-xs text-stone-500 block">Friends Invited</span>
              <span className="text-sm font-serif font-bold text-stone-900">{loyaltyProfile.friendsInvited}</span>
            </div>
            <div className="p-2 bg-stone-50 rounded-xl">
              <span className="text-xs text-stone-500 block">Bonus Earned</span>
              <span className="text-sm font-serif font-bold text-emerald-700">${loyaltyProfile.bonusEarnedDollars.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Account Lookup Bar */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-serif font-bold text-stone-900 mb-1">
              Look Up Patron Membership
            </h3>
            <p className="text-xs text-stone-500">
              Enter your mobile phone number to recall saved points or switch patron cards.
            </p>
          </div>

          <form onSubmit={handlePhoneLookup} className="space-y-3">
            <div className="relative">
              <input
                type="tel"
                value={phoneSearch}
                onChange={e => setPhoneSearch(e.target.value)}
                placeholder="e.g. 555-234-5678"
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 pl-8 text-stone-900 focus:outline-none focus:border-amber-600"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
            >
              Access Member Perks
            </button>
          </form>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Demo Phone: 555-234-5678</span>
            <span>Instant Sync</span>
          </div>
        </div>
      </div>

      {/* VIRAL INVITE FRIENDS PROGRAM */}
      <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-amber-800" />
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Sweet Friend Referrals
            </span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Give $5.00, Get $5.00 (100 Cone Coins)
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            When friends use your custom invite code, they save $5.00 on their first custom creation. Once their scoops are churned, 100 Cone Coins appear automatically in your member balance!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Link Box */}
          <div className="md:col-span-8 flex items-center gap-2 bg-white p-2 rounded-xl border border-amber-200 shadow-xs">
            <span className="text-xs font-mono font-bold text-amber-900 px-3 py-1 bg-amber-100/60 rounded-lg shrink-0">
              {inviteCode}
            </span>
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 text-xs font-mono text-stone-600 bg-transparent outline-none truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Social Quick Share Buttons */}
          <div className="md:col-span-4 flex items-center gap-2">
            <button
              onClick={shareToWhatsApp}
              className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={shareToTwitter}
              className="flex-1 py-2.5 px-3 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Twitter className="w-4 h-4" />
              <span>X / Post</span>
            </button>
          </div>
        </div>
      </div>

      {/* REDEEMABLE REWARDS CATALOG */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Redeemable Perk Vouchers
            </h2>
            <p className="text-xs text-stone-600">
              Exchange your earned Cone Coins for instant discounts applied directly to your bag.
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500">
            Available: <strong>{loyaltyProfile.points} pts</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REWARD_VOUCHERS.map(voucher => {
            const canAfford = loyaltyProfile.points >= voucher.pointsCost;
            return (
              <div
                key={voucher.id}
                className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                      {voucher.pointsCost} COINS
                    </span>
                    <span className="font-semibold text-emerald-800 text-xs">
                      ${voucher.discountDollars.toFixed(2)} OFF
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    {voucher.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {voucher.description}
                  </p>
                </div>

                <button
                  disabled={!canAfford || redeemingId === voucher.id}
                  onClick={() => handleRedeem(voucher)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    canAfford
                      ? 'bg-stone-900 hover:bg-stone-800 text-white'
                      : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{canAfford ? 'Redeem Voucher' : 'Need More Coins'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
