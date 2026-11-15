import React, { useState } from 'react';
import { Camera, Crosshair, Flame, Orbit, Satellite } from 'lucide-react';
import { PsiExperiment } from '../../data/nasaFireData';

export function FourPointStar({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 1.5C12.6 7.5 16.5 11.4 22.5 12C16.5 12.6 12.6 16.5 12 22.5C11.4 16.5 7.5 12.6 1.5 12C7.5 11.4 11.4 7.5 12 1.5Z" />
    </svg>
  );
}

export function SpikyStarburst({
  color = '#F7B2D9',
  withFlame = false,
  className = 'w-14 h-14',
}: {
  color?: string;
  withFlame?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
      <path
        d="M40 4L47 22L64 10L57 29L76 28L61 42L75 56L56 54L60 73L44 60L37 77L32 59L14 70L23 51L5 48L21 37L9 20L28 26L25 7L40 21V4Z"
        fill={color}
        stroke="#111111"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {withFlame && (
        <g>
          <circle cx="40" cy="41" r="10.5" fill="#42D9FF" stroke="#111111" strokeWidth="2" />
          <circle cx="40" cy="41" r="5.5" fill="#FFE14D" stroke="#111111" strokeWidth="1.5" />
        </g>
      )}
    </svg>
  );
}

export function MotionTicks({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M6 10L16 5" stroke="#111111" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M8 17L22 15" stroke="#111111" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 23L17 26" stroke="#111111" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function InlineFlameIcon({ className = 'w-9 h-9 inline-block' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* Spherical microgravity flame emblem */}
      <circle cx="24" cy="24" r="18" fill="#B4DCF2" stroke="#111111" strokeWidth="2.4" />
      <circle cx="24" cy="24" r="11" fill="#FFE14D" stroke="#111111" strokeWidth="2" />
      <circle cx="24" cy="24" r="5" fill="#F26C57" stroke="#111111" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="1.8" fill="#111111" />
    </svg>
  );
}

export function CurvedArrow({
  variant = 'down-right',
  className = 'w-10 h-10',
}: {
  variant?: 'down-right' | 'loop-down' | 'left-tag';
  className?: string;
}) {
  if (variant === 'left-tag') {
    return (
      <svg viewBox="0 0 54 28" fill="none" className={className} aria-hidden="true">
        <path
          d="M5 17C14 8 24 8 27 14C29 18 23 20 22 15C21 10 31 8 46 13"
          stroke="#111111"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M10 11L4.5 17.5L12.5 18.5"
          stroke="#111111"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === 'loop-down') {
    return (
      <svg viewBox="0 0 42 42" fill="none" className={className} aria-hidden="true">
        <path
          d="M10 6C24 6 28 18 20 22C14 25 11 19 16 17C22 15 30 22 28 34"
          stroke="#111111"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M23 30L28 35.5L33 29.5"
          stroke="#111111"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 56 44" fill="none" className={className} aria-hidden="true">
      <path
        d="M6 12C18 4 36 8 40 24C41 28 38 33 36 37"
        stroke="#111111"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M30 31L36 38.5L43 32"
        stroke="#111111"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HERO_CAMERA_FEEDS = [
  {
    id: 'flex' as const,
    tabLabel: 'CAM 01 · FLEX',
    psiCode: 'PSI-69',
    title: 'Spherical 0g Droplet & Cool Flame',
    regimeTag: 'NO BUOYANCY · DIFFUSION',
    facility: 'ISS CIR / MDCA',
    gravity: '10⁻⁶g Freefall',
    fuelRegime: 'Heptane / Octane',
    imageUrl: '/assets/assests/image_11f039d4.png',
    imageType: 'ai-illustration' as const,
    credit: 'AI-generated illustration — not a NASA photograph',
  },
  {
    id: 'bass' as const,
    tabLabel: 'CAM 02 · BASS',
    psiCode: 'PSI-26',
    title: 'Low-Flow Solid Fuel Flame Spread',
    regimeTag: 'FORCED FLOW · 0–0.40 m/s',
    facility: 'ISS MSG Glovebox',
    gravity: '10⁻⁶g Freefall',
    fuelRegime: 'PMMA / Sibal Cloth',
    imageUrl: '/assets/assests/image_8c38fee5.png',
    imageType: 'ai-illustration' as const,
    credit: 'AI-generated illustration — not a NASA photograph',
  },
];

/**
 * NASA CIR / MSG Flight Optical Feed & Combustion Telemetry Console
 */
export function MicrogravityHeroVisual() {
  const [activeCam, setActiveCam] = useState<'flex' | 'bass'>('flex');
  const feed = HERO_CAMERA_FEEDS.find((item) => item.id === activeCam) ?? HERO_CAMERA_FEEDS[0];

  return (
    <div className="w-full max-w-[520px] mx-auto lg:ml-auto">
      <div className="bg-white border-2 border-[#111111] brutal-shadow-lg overflow-hidden">
        {/* Top Mission Control Console Bar */}
        <div className="bg-[#0A0A0A] text-white border-b-2 border-[#111111] px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase">
            <Satellite className="w-4 h-4 text-[#FFE14D] shrink-0" />
            <span>ISS OPTICAL COMBUSTION FEED</span>
          </div>
          <span className="px-2 py-0.5 bg-[#FFE14D] text-[#111111] text-[11px] font-mono font-extrabold border border-[#111111] tabular-nums shrink-0">
            {feed.psiCode}
          </span>
        </div>

        {/* Real NASA Optical Chamber Viewport */}
        <div className="relative aspect-[16/10] bg-[#06090F] border-b-2 border-[#111111] overflow-hidden">
          <img
            src={feed.imageUrl}
            alt={`${feed.psiCode} — ${feed.title}`}
            className="w-full h-full object-cover"
          />

          {/* Subtle Optical Calibration Overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/75 via-transparent to-black/35"
          />

          {/* Corner Framing Reticles */}
          <Crosshair
            aria-hidden="true"
            className="microgravity-flame-pulse absolute top-3 right-3 w-5 h-5 text-[#42D9FF] opacity-80 pointer-events-none"
          />

          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0A0A0A]/85 border border-white/30 text-[11px] font-mono font-bold text-[#42D9FF]">
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span>{feed.regimeTag}</span>
          </div>

          {feed.imageType === 'ai-illustration' && (
            <div className="absolute top-12 left-3 px-2.5 py-1 bg-[#F26C57] border border-[#111111] text-[10px] font-mono font-extrabold uppercase tracking-wide text-[#111111]">
              AI illustration — not NASA imagery
            </div>
          )}

          <div className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#FFE14D]">
                {feed.credit}
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white leading-snug">
                {feed.title}
              </div>
            </div>
            <Flame className="w-5 h-5 text-[#FFE14D] shrink-0" />
          </div>
        </div>

        {/* Optical Camera Feed Switcher */}
        <div className="grid grid-cols-2 border-b-2 border-[#111111] divide-x-2 divide-[#111111] bg-[#FDFBE8]">
          {HERO_CAMERA_FEEDS.map((item) => {
            const isSelected = item.id === activeCam;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCam(item.id)}
                className={`px-3 py-2.5 text-xs font-mono font-extrabold tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FFE14D] text-[#111111]'
                    : 'bg-[#FDFBE8] text-[#444444] hover:bg-[#B4DCF2]/45 hover:text-[#111111]'
                }`}
              >
                <Orbit className="w-3.5 h-3.5 shrink-0" />
                <span>{item.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Flight Telemetry Readout */}
        <div className="grid grid-cols-3 divide-x-2 divide-[#111111] bg-white">
          <div className="p-3">
            <div className="text-[10px] font-mono font-bold uppercase text-[#555555]">
              FACILITY
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-[#111111] mt-0.5 truncate">
              {feed.facility}
            </div>
          </div>
          <div className="p-3">
            <div className="text-[10px] font-mono font-bold uppercase text-[#555555]">
              GRAVITY
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-[#111111] mt-0.5 tabular-nums truncate">
              {feed.gravity}
            </div>
          </div>
          <div className="p-3 bg-[#B4DCF2]/35">
            <div className="text-[10px] font-mono font-bold uppercase text-[#555555]">
              FUEL REGIME
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-[#111111] mt-0.5 truncate">
              {feed.fuelRegime}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Replaces the personal Minimal avatar sketch with a crisp hand-drawn microgravity flame badge.
 */
export function MinimalFlameBadgeSketch({ className = 'w-12 h-12' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="22" fill="#E0F2FE" stroke="#111111" strokeWidth="2" />
      <circle cx="32" cy="32" r="14" fill="#9BE2FF" stroke="#111111" strokeWidth="1.8" />
      <circle cx="32" cy="32" r="8" fill="#FCE883" stroke="#111111" strokeWidth="1.8" />
      <circle cx="32" cy="32" r="3" fill="#111111" />
      <line x1="12" y1="32" x2="52" y2="32" stroke="#111111" strokeOpacity="0.35" strokeDasharray="2 2" />
    </svg>
  );
}

export function CursorPointerIcon({ color = '#F472B6' }: { color?: string }) {
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" aria-hidden="true">
      <path
        d="M3 2L17 8.5L10.5 11L8 17.5L3 2Z"
        fill={color}
        stroke="#111111"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExperimentVisualThumbnail({
  variant,
  psiId,
  imageUrl,
  imageCredit,
  imageType = 'nasa',
  imageFit = 'cover',
  name,
  compact = false,
  schematicOnly = false,
}: {
  variant: PsiExperiment['thumbnailVariant'];
  psiId?: string;
  imageUrl?: string;
  imageCredit?: string;
  imageType?: PsiExperiment['imageType'];
  imageFit?: 'cover' | 'contain';
  name?: string;
  compact?: boolean;
  schematicOnly?: boolean;
}) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const heightClass = compact ? 'h-44' : 'h-48 sm:h-52';
  const imageLabel =
    imageType === 'ai-illustration'
      ? 'AI ILLUSTRATION'
      : imageType === 'schematic'
        ? 'SCHEMATIC'
        : 'NASA PHOTO';

  if (imageUrl && !imgFailed && !schematicOnly) {
    return (
      <div
        className={`w-full ${heightClass} bg-[#06090F] border-2 border-[#111111] relative overflow-hidden`}
      >
        <img
          src={imageUrl}
          alt={imageCredit || `${psiId ?? ''} ${name ?? 'NASA PSI'} microgravity combustion image`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
          className={`w-full h-full ${
            imageFit === 'contain' ? 'object-contain p-1' : 'object-cover'
          } transition-transform duration-300 group-hover:scale-[1.03]`}
        />
        <div className="pointer-events-none absolute top-2 left-2 px-2 py-0.5 bg-[#111111]/85 text-[#FFE14D] border border-[#FFE14D]/60 text-[10px] font-mono font-bold tracking-wider">
          {psiId ?? 'NASA PSI'}
        </div>
        <div
          className={`pointer-events-none absolute bottom-2 right-2 px-2 py-0.5 border text-[10px] font-mono font-bold ${
            imageType === 'ai-illustration'
              ? 'bg-[#F26C57] text-[#111111] border-[#111111]'
              : 'bg-[#111111]/80 text-white border-[#111111]/40'
          }`}
        >
          {imageLabel}
        </div>
      </div>
    );
  }

  switch (variant) {
    case 'droplet-cool-flame':
      return (
        <div
          className={`w-full ${heightClass} bg-[#0F172A] border border-[#111]/20 p-3 relative overflow-hidden flex flex-col justify-between text-white`}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-[#94A3B8]">
            <span>CIR · 0g DROPLET</span>
            <span className="text-[#42D9FF]">{psiId ?? 'COOL FLAME'}</span>
          </div>
          <div className="my-auto flex items-center justify-center relative">
            <svg viewBox="0 0 180 90" className="w-44 h-22" fill="none">
              <circle cx="52" cy="45" r="30" fill="#38BDF8" fillOpacity="0.22" stroke="#42D9FF" strokeWidth="1.8" />
              <circle cx="52" cy="45" r="18" fill="#FFE14D" fillOpacity="0.32" stroke="#FFE14D" strokeWidth="1.4" />
              <circle cx="52" cy="45" r="7" fill="#FF7838" />
              <line x1="18" y1="45" x2="86" y2="45" stroke="#CBD5E1" strokeOpacity="0.45" />
              {/* Transition arrow */}
              <path d="M90 45H110" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 2" />
              {/* Cool flame stage */}
              <circle cx="136" cy="45" r="24" fill="#60A5FA" fillOpacity="0.16" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="136" cy="45" r="4" fill="#E2E8F0" />
            </svg>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-[#CBD5E1]">
            <span>Stage 1: Hot Flame</span>
            <span>Stage 2: ~500–800K Cool Flame</span>
          </div>
        </div>
      );

    case 'solid-airflow':
      return (
        <div
          className={`w-full ${heightClass} bg-[#F8F5E6] border border-[#111]/20 p-3 relative overflow-hidden flex flex-col justify-between text-[#111111]`}
        >
          <div className="flex items-center justify-between text-[9px] font-mono font-semibold text-[#444]">
            <span>MSG FLOW DUCT</span>
            <span>{psiId ?? 'SOLID FUEL'}</span>
          </div>
          <div className="my-auto flex items-center justify-center">
            <svg viewBox="0 0 190 90" className="w-48 h-22" fill="none">
              <rect x="10" y="14" width="170" height="62" fill="#FFFFFF" stroke="#111111" strokeWidth="1.6" />
              {/* Airflow streamlines */}
              <path d="M18 30H54" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 45H62" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 60H54" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
              {/* Flame over solid slab */}
              <path
                d="M72 48C86 24 128 24 148 48C130 56 90 56 72 48Z"
                fill="#FFE14D"
                stroke="#111111"
                strokeWidth="1.6"
              />
              <path
                d="M78 48C90 34 114 34 128 48Z"
                fill="#F26C57"
              />
              {/* Solid PMMA / Sibal fuel bar */}
              <rect x="70" y="48" width="84" height="10" fill="#1E293B" />
              <text x="18" y="24" fill="#0284C7" fontSize="8" fontFamily="JetBrains Mono, monospace">
                v = 0.01–0.55 m/s
              </text>
            </svg>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-[#333]">
            <span>Opposed / Concurrent Flow</span>
            <span>N2 Extinction Mapping</span>
          </div>
        </div>
      );

    case 'saffire-cygnus':
      return (
        <div
          className={`w-full ${heightClass} bg-[#18181B] border border-[#111] p-3 relative overflow-hidden flex flex-col justify-between text-white`}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-[#A1A1AA]">
            <span>CYGNUS CARGO VEHICLE</span>
            <span className="text-[#FFE14D]">{psiId ?? 'SAFFIRE'}</span>
          </div>
          <div className="my-auto flex items-center justify-center">
            <svg viewBox="0 0 190 90" className="w-48 h-22" fill="none">
              {/* Cygnus module hull silhouette */}
              <rect x="14" y="16" width="162" height="58" rx="10" fill="#27272A" stroke="#52525B" strokeWidth="1.6" />
              {/* Large fabric sample */}
              <rect x="44" y="34" width="102" height="22" fill="#E4E4E7" stroke="#18181B" strokeWidth="1.2" />
              {/* Advancing flame front */}
              <path
                d="M96 34C108 22 128 24 142 45C128 64 108 66 96 56Z"
                fill="#FF7838"
                fillOpacity="0.88"
              />
              <path
                d="M104 38C114 31 124 33 130 45C124 57 114 59 104 52Z"
                fill="#FFE14D"
              />
              <path d="M22 45H40" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-[#D4D4D8]">
            <span>Large-Scale Cabin Burn</span>
            <span>~21% O2 · Forced Flow</span>
          </div>
        </div>
      );

    case 'smoke-aerosol':
      return (
        <div
          className={`w-full ${heightClass} bg-[#EEF2FF] border border-[#111]/20 p-3 relative overflow-hidden flex flex-col justify-between text-[#111111]`}
        >
          <div className="flex items-center justify-between text-[9px] font-mono font-semibold text-[#334155]">
            <span>OPTICAL SCATTER DUCT</span>
            <span>{psiId ?? 'SAME'}</span>
          </div>
          <div className="my-auto flex items-center justify-center">
            <svg viewBox="0 0 190 90" className="w-48 h-22" fill="none">
              <rect x="12" y="14" width="166" height="62" fill="#FFFFFF" stroke="#111111" strokeWidth="1.5" />
              {/* Dual laser beam */}
              <line x1="20" y1="45" x2="170" y2="45" stroke="#EC4899" strokeWidth="1.5" strokeDasharray="4 2" />
              {/* Larger coagulated 0g smoke agglomerates */}
              <circle cx="52" cy="40" r="6" fill="#64748B" fillOpacity="0.6" stroke="#111" strokeWidth="1" />
              <circle cx="76" cy="52" r="8" fill="#475569" fillOpacity="0.65" stroke="#111" strokeWidth="1" />
              <circle cx="108" cy="38" r="9.5" fill="#334155" fillOpacity="0.7" stroke="#111" strokeWidth="1" />
              <circle cx="142" cy="48" r="11" fill="#1E293B" fillOpacity="0.75" stroke="#111" strokeWidth="1" />
              <text x="22" y="26" fill="#BE185D" fontSize="8" fontFamily="JetBrains Mono, monospace">
                0g Aerosol Coagulation
              </text>
            </svg>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-[#334155]">
            <span>Larger 0g Mean Diameter</span>
            <span>Photoelectric Calibration</span>
          </div>
        </div>
      );

    case 'acme-gaseous':
      return (
        <div
          className={`w-full ${heightClass} bg-[#ECFEFF] border border-[#111]/20 p-3 relative overflow-hidden flex flex-col justify-between text-[#111111]`}
        >
          <div className="flex items-center justify-between text-[9px] font-mono font-semibold text-[#0F172A]">
            <span>CIR / ACME POROUS BURNER</span>
            <span>{psiId ?? 'ACME'}</span>
          </div>
          <div className="my-auto flex items-center justify-center">
            <svg viewBox="0 0 190 90" className="w-48 h-22" fill="none">
              <rect x="42" y="54" width="106" height="16" fill="#334155" stroke="#111111" strokeWidth="1.5" />
              <path
                d="M48 54C56 26 134 26 142 54Z"
                fill="#38BDF8"
                fillOpacity="0.35"
                stroke="#0284C7"
                strokeWidth="2"
              />
              <path d="M66 54C74 38 116 38 124 54Z" fill="#FFE14D" fillOpacity="0.55" />
              <text x="58" y="65" fill="#FFFFFF" fontSize="8" fontFamily="JetBrains Mono, monospace">
                POROUS GAS PLATE
              </text>
            </svg>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-[#0F172A]">
            <span>Gaseous Heat Feedback</span>
            <span>Steady 0g Reaction Zone</span>
          </div>
        </div>
      );

    case 'jet-soot':
      return (
        <div
          className={`w-full ${heightClass} bg-[#111827] border border-[#111] p-3 relative overflow-hidden flex flex-col justify-between text-white`}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-[#9CA3AF]">
            <span>LAMINAR COFLOW JET</span>
            <span className="text-[#F26C57]">{psiId ?? 'JET'}</span>
          </div>
          <div className="my-auto flex items-center justify-center">
            <svg viewBox="0 0 190 90" className="w-48 h-22" fill="none">
              <rect x="22" y="40" width="28" height="10" fill="#94A3B8" />
              <path
                d="M54 45C78 24 128 24 160 45C128 66 78 66 54 45Z"
                fill="#F97316"
                fillOpacity="0.38"
                stroke="#FB923C"
                strokeWidth="1.8"
              />
              <path
                d="M56 45C72 34 102 34 118 45C102 56 72 56 56 45Z"
                fill="#38BDF8"
                fillOpacity="0.65"
              />
              <text x="64" y="20" fill="#FDBA74" fontSize="8" fontFamily="JetBrains Mono, monospace">
                SOOT INCEPTION ZONE
              </text>
            </svg>
          </div>
          <div className="flex justify-between text-[8px] font-mono text-[#D1D5DB]">
            <span>No Buoyancy Flicker</span>
            <span>Longer Residence Time</span>
          </div>
        </div>
      );
  }
}
