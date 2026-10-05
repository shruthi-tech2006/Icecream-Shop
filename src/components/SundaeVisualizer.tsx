import React from 'react';
import { Vessel, Flavor, Drizzle, Topping } from '../types';

interface SundaeVisualizerProps {
  vessel: Vessel;
  flavors: Flavor[];
  drizzles: Drizzle[];
  toppings: Topping[];
  scoopCount: number;
  customName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SundaeVisualizer: React.FC<SundaeVisualizerProps> = ({
  vessel,
  flavors,
  drizzles,
  toppings,
  scoopCount,
  customName,
  size = 'md',
}) => {
  const heightClass = size === 'sm' ? 'h-48' : size === 'md' ? 'h-80' : 'h-96';

  // Fallback default flavors if user has not picked all scoops yet
  const filledFlavors: (Flavor | null)[] = [];
  for (let i = 0; i < scoopCount; i++) {
    filledFlavors.push(flavors[i] || null);
  }

  return (
    <div className={`relative w-full ${heightClass} flex flex-col items-center justify-end select-none overflow-hidden transition-all duration-300`}>
      {/* Background subtle radial glow */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: flavors[0] 
            ? `radial-gradient(circle at 50% 60%, ${flavors[0].color} 0%, transparent 70%)` 
            : 'radial-gradient(circle at 50% 60%, #E8DCC4 0%, transparent 70%)',
        }}
      />

      {/* Stack Container */}
      <div className="relative flex flex-col items-center z-10 w-full max-w-[280px]">
        {/* Top toppings & drizzles indicator layer */}
        {toppings.length > 0 && (
          <div className="absolute -top-3 z-30 flex items-center justify-center gap-1.5 animate-bounce">
            {toppings.map(t => (
              <span 
                key={t.id} 
                className="text-[11px] font-medium tracking-tight bg-stone-900/80 text-amber-200 px-2 py-0.5 rounded-full shadow-md backdrop-blur-sm"
              >
                ✦ {t.name.split(' ')[0]}
              </span>
            ))}
          </div>
        )}

        {/* Scoops Stack (rendered from top scoop down to bottom scoop) */}
        <div className="relative flex flex-col-reverse items-center z-20 -mb-4">
          {filledFlavors.map((flavor, index) => {
            const isTop = index === filledFlavors.length - 1;
            const scoopSize = 140 - index * 6; // slightly smaller as we go up
            const offsetTranslateY = index * -18;

            if (!flavor) {
              return (
                <div
                  key={`empty-${index}`}
                  className="relative rounded-full border-2 border-dashed border-stone-300/80 bg-white/40 flex items-center justify-center shadow-inner transition-all duration-300 animate-pulse my-[-8px]"
                  style={{
                    width: `${scoopSize}px`,
                    height: `${scoopSize * 0.82}px`,
                    transform: `translateY(${offsetTranslateY}px)`,
                  }}
                >
                  <span className="text-xs font-medium text-stone-600">
                    Scoop #{index + 1}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={`scoop-${flavor.id}-${index}`}
                className="relative rounded-full shadow-lg transition-transform duration-300 transform hover:scale-105 my-[-10px]"
                style={{
                  width: `${scoopSize}px`,
                  height: `${scoopSize * 0.85}px`,
                  backgroundColor: flavor.color,
                  boxShadow: `inset -8px -8px 16px rgba(0,0,0,0.18), inset 8px 8px 16px rgba(255,255,255,0.35), 0 8px 16px rgba(0,0,0,0.12)`,
                  transform: `translateY(${offsetTranslateY}px)`,
                }}
              >
                {/* Texture marbling / organic swirl */}
                <div 
                  className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 35% 30%, #ffffff 0%, transparent 50%), radial-gradient(circle at 75% 70%, ${flavor.accentColor} 0%, transparent 60%)`
                  }}
                />

                {/* Drizzle Overlay on the top scoop */}
                {isTop && drizzles.length > 0 && (
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    {drizzles.map((drizzle, dIdx) => (
                      <svg
                        key={drizzle.id}
                        viewBox="0 0 100 100"
                        className="absolute inset-0 w-full h-full drop-shadow-sm"
                        style={{ transform: `rotate(${dIdx * 45}deg)` }}
                      >
                        <path
                          d="M 15,35 Q 25,60 30,40 Q 40,80 50,45 Q 60,75 70,35 Q 85,60 90,40"
                          fill="none"
                          stroke={drizzle.color}
                          strokeWidth="8"
                          strokeLinecap="round"
                          opacity="0.9"
                        />
                      </svg>
                    ))}
                  </div>
                )}

                {/* Topping Flecks simulation */}
                {toppings.length > 0 && (
                  <div className="absolute inset-2 pointer-events-none overflow-hidden rounded-full opacity-75">
                    {toppings.some(t => t.id === 'gold_flakes') && (
                      <>
                        <div className="absolute top-2 left-6 w-2 h-2 rotate-12 bg-amber-300 shadow-sm" />
                        <div className="absolute top-6 right-8 w-2.5 h-1.5 rotate-45 bg-yellow-400 shadow-sm" />
                      </>
                    )}
                    {toppings.some(t => t.id === 'rainbow_sugar_gems') && (
                      <>
                        <div className="absolute top-4 left-10 w-1.5 h-1.5 rounded-full bg-pink-400" />
                        <div className="absolute top-8 left-16 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <div className="absolute top-5 right-6 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </>
                    )}
                    {toppings.some(t => t.id === 'toasted_hazelnuts') && (
                      <>
                        <div className="absolute top-3 left-8 w-2.5 h-2 rounded bg-amber-800" />
                        <div className="absolute top-7 right-10 w-2 h-2.5 rounded bg-amber-900" />
                      </>
                    )}
                  </div>
                )}

                {/* Flavor label floating pill on hover */}
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 hidden md:group-hover:flex items-center gap-1.5 text-[11px] font-serif text-stone-800 bg-white/90 px-2 py-0.5 rounded shadow-sm border border-stone-200">
                  <span>{flavor.name.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vessel Graphic Representation */}
        <div className="relative z-10 flex flex-col items-center">
          {vessel.id === 'waffle_cone' && (
            <svg viewBox="0 0 100 130" className="w-28 h-36 drop-shadow-md">
              <defs>
                <pattern id="wafflePattern" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <path d="M 0 0 L 10 0 M 0 0 L 0 10" stroke="#B87D3B" strokeWidth="1.2" />
                </pattern>
                <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#DF9F57" />
                  <stop offset="50%" stopColor="#F5BF7F" />
                  <stop offset="100%" stopColor="#C9863E" />
                </linearGradient>
              </defs>
              <polygon points="10,10 90,10 50,125" fill="url(#coneGrad)" />
              <polygon points="10,10 90,10 50,125" fill="url(#wafflePattern)" opacity="0.65" />
              <ellipse cx="50" cy="10" rx="40" ry="7" fill="#DF9F57" stroke="#B87D3B" strokeWidth="1" />
            </svg>
          )}

          {vessel.id === 'chocolate_waffle' && (
            <svg viewBox="0 0 100 130" className="w-28 h-36 drop-shadow-md">
              <defs>
                <pattern id="wafflePatternChoc" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <path d="M 0 0 L 10 0 M 0 0 L 0 10" stroke="#B87D3B" strokeWidth="1.2" />
                </pattern>
                <linearGradient id="coneGradChoc" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#DF9F57" />
                  <stop offset="50%" stopColor="#F5BF7F" />
                  <stop offset="100%" stopColor="#C9863E" />
                </linearGradient>
              </defs>
              <polygon points="10,10 90,10 50,125" fill="url(#coneGradChoc)" />
              <polygon points="10,10 90,10 50,125" fill="url(#wafflePatternChoc)" opacity="0.65" />
              {/* Dipped Chocolate Rim */}
              <path d="M 10,10 Q 30,28 50,18 Q 70,26 90,10 L 90,10 Q 50,16 10,10 Z" fill="#2C1810" />
              <ellipse cx="50" cy="10" rx="40" ry="7" fill="#3B2217" />
            </svg>
          )}

          {vessel.id === 'brioche_bun' && (
            <svg viewBox="0 0 120 70" className="w-36 h-20 drop-shadow-md">
              <defs>
                <radialGradient id="briocheGlow" cx="50%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="#FCE3A1" />
                  <stop offset="70%" stopColor="#D98A36" />
                  <stop offset="100%" stopColor="#965415" />
                </radialGradient>
              </defs>
              {/* Golden bottom bun */}
              <path d="M 10,20 C 10,55 110,55 110,20 C 110,12 10,12 10,20 Z" fill="url(#briocheGlow)" stroke="#965415" strokeWidth="1" />
              {/* Fluffy scored texture */}
              <ellipse cx="60" cy="30" rx="35" ry="8" fill="#FEECC2" opacity="0.4" />
            </svg>
          )}

          {vessel.id === 'eco_cup' && (
            <svg viewBox="0 0 100 80" className="w-32 h-24 drop-shadow-md">
              <defs>
                <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#EFECE6" />
                  <stop offset="50%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#DCD7CE" />
                </linearGradient>
              </defs>
              <polygon points="15,10 85,10 75,75 25,75" fill="url(#cupGrad)" stroke="#C7C1B5" strokeWidth="1" />
              <ellipse cx="50" cy="10" rx="35" ry="6" fill="#FBF9F5" stroke="#C7C1B5" strokeWidth="1" />
              <text x="50" y="45" textAnchor="middle" fill="#8C8275" fontSize="8" fontFamily="Fraunces, serif" fontWeight="600" letterSpacing="1">
                VELUTO
              </text>
            </svg>
          )}

          {vessel.id === 'cookie_sandwich' && (
            <div className="w-36 h-12 rounded-full bg-amber-800 shadow-md flex items-center justify-center border border-amber-900 relative">
              <div className="absolute top-2 left-6 w-2 h-2 rounded-full bg-stone-900" />
              <div className="absolute top-4 right-8 w-2.5 h-2 rounded-full bg-stone-900" />
              <div className="absolute bottom-3 left-14 w-2 h-2 rounded-full bg-stone-900" />
              <span className="text-[10px] text-amber-200/90 font-medium tracking-wider">BROWN BUTTER COOKIE</span>
            </div>
          )}
        </div>
      </div>

      {customName && (
        <div className="mt-2 text-center z-10">
          <p className="font-serif text-sm font-medium text-stone-800 tracking-tight">
            "{customName}"
          </p>
        </div>
      )}
    </div>
  );
};
