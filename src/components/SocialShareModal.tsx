import React, { useState, useRef } from 'react';
import { Vessel, Flavor, Drizzle, Topping } from '../types';
import { SundaeVisualizer } from './SundaeVisualizer';
import { X, Copy, Check, Download, Share2, MessageCircle, Twitter } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface SocialShareModalProps {
  vessel: Vessel;
  flavors: Flavor[];
  drizzles: Drizzle[];
  toppings: Topping[];
  customName: string;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  vessel,
  flavors,
  drizzles,
  toppings,
  customName,
  onClose,
}) => {
  const { loyaltyProfile, triggerNotification } = useShop();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const inviteCode = loyaltyProfile.referralCode || 'VELUTO-SWEET5';
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}?ref=${inviteCode}`
    : `https://veluto.creamery?ref=${inviteCode}`;

  const shareText = `I just designed "${customName}" at Veluto Artisanal Creamery! 🍨 Get $5 off your first custom scoop with my link:`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${shareUrl}`);
      setCopied(true);
      triggerNotification('Invite Link Copied!', 'Share it with your friends for $5 off');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Veluto Creamery - ${customName}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-800">
            Share Your Recipe Card
          </p>
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Invite Friends & Earn Free Scoops
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Friends get $5.00 off their first order. You earn 100 Cone Coins ($5.00 value) when they order!
          </p>
        </div>

        {/* The Digital Sundae Card */}
        <div 
          ref={cardRef}
          className="p-5 bg-[#FBF9F5] border border-amber-900/10 rounded-2xl shadow-inner relative overflow-hidden text-center"
        >
          <div className="flex items-center justify-between text-[11px] text-stone-600 pb-2 border-b border-stone-200/80">
            <span className="font-serif font-semibold tracking-wider text-stone-900">VELUTO ARTISANAL</span>
            <span>CREATION NO. {Math.floor(1000 + Math.random() * 9000)}</span>
          </div>

          <div className="py-2">
            <SundaeVisualizer
              vessel={vessel}
              flavors={flavors}
              drizzles={drizzles}
              toppings={toppings}
              scoopCount={flavors.length}
              size="sm"
            />
          </div>

          <h3 className="text-lg font-serif font-bold text-stone-900 mt-2">
            "{customName}"
          </h3>

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-stone-600 mt-1">
            {flavors.map(f => (
              <span key={f.id} className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                <span>{f.name.split(' ')[0]}</span>
              </span>
            ))}
          </div>

          {/* Promo code sticker */}
          <div className="mt-4 pt-3 border-t border-dashed border-stone-300 flex items-center justify-between bg-white/70 p-2.5 rounded-xl">
            <div className="text-left">
              <span className="text-[10px] text-stone-600 block uppercase font-medium">Friend Discount Code</span>
              <span className="font-mono text-xs font-bold text-amber-900">{inviteCode}</span>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              $5.00 OFF
            </span>
          </div>
        </div>

        {/* Sharing Options */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-mono text-stone-700 truncate">
              {shareUrl}
            </div>
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={shareToWhatsApp}
              className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
            <button
              onClick={shareToTwitter}
              className="py-2.5 px-3 bg-stone-800 hover:bg-black text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              <Twitter className="w-4 h-4" />
              <span>X / Post</span>
            </button>
            <button
              onClick={handleNativeShare}
              className="py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>More</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
