import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Compass,
  Crosshair,
  Flame,
  FlaskConical,
  GitCompare,
  Orbit,
  Radar,
  Rocket,
  Satellite,
  ShieldAlert,
  Sparkles,
  Wind,
} from 'lucide-react';
import {
  CHALLENGE_PILLARS,
  MISSION_ENVIRONMENTS,
  MissionEnvironment,
  PRESSURIZED_ROVER_DETAILS,
  PSI_EXPERIMENTS,
  PsiExperiment,
  SUGGESTED_COPILOT_QUESTIONS,
} from '../../../data/nasaFireData';
import {
  ExperimentVisualThumbnail,
  InlineFlameIcon,
  MotionTicks,
  SpikyStarburst,
} from '../ScienceArtwork';

gsap.registerPlugin(ScrollTrigger);

export type AppPage = 'overview' | 'experiments' | 'compare' | 'intelligence' | 'ask-ai';

interface OverviewPageProps {
  onNavigatePage: (page: AppPage) => void;
  onSelectExperiment: (exp: PsiExperiment) => void;
  onSelectEnvironment: (env: MissionEnvironment) => void;
  onAskCopilot?: (prompt: string) => void;
}

function EnvironmentBadgeIcon({
  type,
  color,
}: {
  type: MissionEnvironment['iconType'];
  color: string;
}) {
  return (
    <div
      className="w-12 h-12 rounded-full border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center shrink-0"
      style={{ backgroundColor: color }}
    >
      {type === 'capsule' && (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#111111" strokeWidth="2">
          <path d="M12 3L17 11V17H7V11L12 3Z" strokeLinejoin="round" />
          <path d="M9 20H15" strokeLinecap="round" />
        </svg>
      )}
      {type === 'iss' && (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#111111" strokeWidth="2">
          <path d="M4 12H20M7 6V18M17 6V18" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2.2" fill="#111111" />
        </svg>
      )}
      {type === 'moon' && (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#111111" strokeWidth="2">
          <path
            d="M15.5 4.5A8 8 0 1 0 19.5 16.5A6.5 6.5 0 0 1 15.5 4.5Z"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {(type === 'mars' || type === 'rover') && (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#111111" strokeWidth="2">
          <circle cx="12" cy="12" r="7" />
          <path d="M7 10.5C9.5 9.5 14.5 14.5 17 13.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

const FEATURED_IDS = [
  'psi-26',
  'psi-25',
  'psi-69',
  'psi-68',
  'psi-98',
  'psi-99',
  'psi-102',
  'psi-20',
  'psi-107',
];

const DEFAULT_HERO_TITLE = 'FLAME IN FREEFALL';
const DEFAULT_HERO_SUBHEADER =
  'UNDERSTANDING FIRE BEYOND EARTH. 14 NASA PSI STUDIES FOR SPACECRAFT, MOON & MARS SAFETY.';

const HERO_HUD_ITEMS: {
  id: string;
  code: string;
  label: string;
  heroTitle: string;
  subheader: string;
  targetPage: AppPage;
}[] = [
  {
    id: 'hud-experiments',
    code: '01',
    label: 'EXPERIMENTS',
    heroTitle: 'PSI RESEARCH',
    subheader: '14 MICROGRAVITY COMBUSTION INVESTIGATIONS ABOARD ISS & CYGNUS.',
    targetPage: 'experiments',
  },
  {
    id: 'hud-compare',
    code: '02',
    label: 'COMPARE',
    heroTitle: 'COMBUSTION MATRIX',
    subheader: 'SIDE-BY-SIDE OXYGEN, AIRFLOW, FLAME SPREAD & SUPPRESSION DATA.',
    targetPage: 'compare',
  },
  {
    id: 'hud-intelligence',
    code: '03',
    label: 'INTELLIGENCE',
    heroTitle: 'FIRE SAFETY',
    subheader: 'INTERACTIVE CHARTS FOR LUNAR 1/6G & MARS 3/8G CREW HABITATS.',
    targetPage: 'intelligence',
  },
  {
    id: 'hud-copilot',
    code: '04',
    label: 'ASK COPILOT',
    heroTitle: 'NASA AI COPILOT',
    subheader: 'GEMINI RESEARCH ASSISTANT GROUNDED IN PUBLISHED NASA PSI STUDIES.',
    targetPage: 'ask-ai',
  },
];

export function OverviewPage({
  onNavigatePage,
  onSelectExperiment,
  onSelectEnvironment,
  onAskCopilot,
}: OverviewPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [subheaderText, setSubheaderText] = useState<string>(DEFAULT_HERO_SUBHEADER);
  const [heroDisplayLabel, setHeroDisplayLabel] = useState<string>(DEFAULT_HERO_TITLE);
  const shuffleTimersRef = useRef<{ intervals: number[]; timeouts: number[] }>({
    intervals: [],
    timeouts: [],
  });

  const clearShuffleTimers = () => {
    shuffleTimersRef.current.intervals.forEach((id) => window.clearInterval(id));
    shuffleTimersRef.current.timeouts.forEach((id) => window.clearTimeout(id));
    shuffleTimersRef.current = { intervals: [], timeouts: [] };
  };

  const runShuffleLetters = (finalText: string) => {
    const container = placeholderRef.current;
    if (!container) return;

    clearShuffleTimers();
    setHeroDisplayLabel(finalText);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    container.innerHTML = '';

    const spans: HTMLSpanElement[] = [...finalText].map((letter) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.filter = prefersReduced ? 'blur(0px)' : 'blur(8px)';
      span.textContent = letter === ' ' ? '\u00A0' : letter;
      container.appendChild(span);
      return span;
    });

    if (prefersReduced) return;

    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const textArray = finalText.split('');

    spans.forEach((span, index) => {
      if (finalText[index] === ' ') return;
      const intervalId = window.setInterval(() => {
        textArray[index] = alphabet[Math.floor(Math.random() * alphabet.length)];
        span.textContent = textArray[index];
      }, 65);
      shuffleTimersRef.current.intervals.push(intervalId);
    });

    const settleTimeout = window.setTimeout(() => {
      shuffleTimersRef.current.intervals.forEach((id) => window.clearInterval(id));
      shuffleTimersRef.current.intervals = [];

      spans.forEach((span, index) => {
        span.textContent = finalText[index] === ' ' ? '\u00A0' : finalText[index];
      });

      // Staggered per-letter blur clearance
      spans.forEach((span, index) => {
        const blurTimeout = window.setTimeout(() => {
          gsap.to(span, {
            filter: 'blur(0px)',
            duration: 0.42,
            ease: 'power2.out',
          });
        }, index * 45);
        shuffleTimersRef.current.timeouts.push(blurTimeout);
      });
    }, 520);

    shuffleTimersRef.current.timeouts.push(settleTimeout);
  };

  const handleHudEnter = (item: (typeof HERO_HUD_ITEMS)[number]) => {
    setSubheaderText(item.subheader);
    runShuffleLetters(item.heroTitle);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (heroSectionRef.current) {
      gsap.to(heroSectionRef.current, {
        backgroundColor: '#0A0A0A',
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    gsap.to('.hero-invert-text', {
      color: '#FFFFFF',
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to('.hero-hud-btn', {
      backgroundColor: '#161616',
      color: '#FFE14D',
      borderColor: '#FFE14D',
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    if (placeholderRef.current) {
      gsap.fromTo(
        placeholderRef.current,
        { scale: 1 },
        { scale: 1.06, duration: 0.45, ease: 'power1.out', overwrite: 'auto' }
      );
    }
  };

  const handleHudLeave = () => {
    setSubheaderText(DEFAULT_HERO_SUBHEADER);
    runShuffleLetters(DEFAULT_HERO_TITLE);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (heroSectionRef.current) {
      gsap.to(heroSectionRef.current, {
        backgroundColor: '#FDFBE8',
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
    gsap.to('.hero-invert-text', {
      color: '#111111',
      duration: 0.45,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    gsap.to('.hero-hud-btn', {
      backgroundColor: '#FFFFFF',
      color: '#111111',
      borderColor: '#111111',
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    if (placeholderRef.current) {
      gsap.fromTo(
        placeholderRef.current,
        { scale: 1.06 },
        { scale: 1, duration: 0.45, ease: 'power1.out', overwrite: 'auto' }
      );
    }
  };

  useEffect(() => {
    runShuffleLetters(DEFAULT_HERO_TITLE);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !rootRef.current) {
      return () => clearShuffleTimers();
    }

    const ctx = gsap.context(() => {
      gsap.from('.brutal-hero-reveal', {
        y: 18,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });

      gsap.utils.toArray<HTMLElement>('.brutal-scroll-section').forEach((section) => {
        gsap.from(section, {
          y: 22,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: section,
            start: 'top 86%',
            once: true,
          },
        });
      });
    }, rootRef);

    return () => {
      clearShuffleTimers();
      ctx.revert();
    };
  }, []);

  const featuredExperiments = FEATURED_IDS.map((id) =>
    PSI_EXPERIMENTS.find((e) => e.id === id)
  ).filter((e): e is PsiExperiment => Boolean(e));

  return (
    <div ref={rootRef}>
      {/* Section 1: Interactive NASA Orbitron Shuffle & Blur Hero */}
      <section
        ref={heroSectionRef}
        className="relative py-8 sm:py-12 overflow-hidden bg-[#FDFBE8]"
      >
        {/* Subtle aerospace dot-grid paper backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.09] bg-[radial-gradient(#111111_1.2px,transparent_1.2px)] [background-size:24px_24px]"
        />

        <div className="hidden sm:block absolute -left-5 bottom-0 pointer-events-none select-none">
          <SpikyStarburst color="#F7B2D9" className="w-14 h-14 rotate-12" />
        </div>

        <div className="relative max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10 space-y-10 sm:space-y-12">
          {/* Top Corner Interactive HUD Triggers (matching attached top nav corners) */}
          <div className="flex items-center justify-between gap-3 brutal-hero-reveal">
            {HERO_HUD_ITEMS.slice(0, 2).map((item) => (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => handleHudEnter(item)}
                onMouseLeave={handleHudLeave}
                onFocus={() => handleHudEnter(item)}
                onBlur={handleHudLeave}
                onClick={() => onNavigatePage(item.targetPage)}
                className="hero-hud-btn px-3.5 sm:px-4 py-2 bg-white border-2 border-[#111111] brutal-shadow-sm text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-[#111111] cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-[#F26C57]">{item.code}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Centerpiece Interactive Shuffle Stage */}
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center space-y-6 py-2 sm:py-4 brutal-hero-reveal">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 bg-[#FFE14D] border-2 border-[#111111] brutal-shadow-sm">
              <InlineFlameIcon className="w-7 h-7 shrink-0" />
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-[#111111]">
                <Rocket className="w-3.5 h-3.5 text-[#111111]" />
                <span>NASA Space Apps Challenge 2026</span>
                <span aria-hidden="true">·</span>
                <span>Hover Corners to Explore</span>
              </div>
            </div>

            <h1 className="sr-only">
              {heroDisplayLabel} — Understanding Fire Beyond Earth
            </h1>
            <div
              ref={placeholderRef}
              aria-hidden="true"
              className="hero-invert-text font-['Orbitron',sans-serif] font-black uppercase tracking-wider text-[#111111] leading-[1.15] text-[clamp(1.85rem,5.4vw,4.75rem)] select-none min-h-[1.2em] flex flex-wrap items-center justify-center"
            />

            <p className="hero-invert-text font-mono text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.14em] text-[#222222] max-w-3xl leading-relaxed">
              {subheaderText}
            </p>

            {/* Primary CTA Strip */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <motion.button
                type="button"
                whileHover={{ x: -1, y: -1 }}
                whileTap={{ x: 2, y: 2 }}
                transition={{ duration: 0.12 }}
                onClick={() => onNavigatePage('experiments')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#B4DCF2] border-2 border-[#111111] brutal-shadow-sm text-base font-bold text-[#111111] hover:bg-[#9FD3EE] transition-colors cursor-pointer whitespace-nowrap"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Explore 14 Experiments</span>
              </motion.button>
              <MotionTicks className="w-7 h-7" />
              <motion.button
                type="button"
                whileHover={{ x: -1, y: -1 }}
                whileTap={{ x: 2, y: 2 }}
                transition={{ duration: 0.12 }}
                onClick={() => onNavigatePage('ask-ai')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFE14D] border-2 border-[#111111] brutal-shadow-sm text-base font-bold text-[#111111] hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Copilot</span>
              </motion.button>
            </div>
          </div>

          {/* Bottom Corner Interactive HUD Triggers (matching attached bottom footer corners) */}
          <div className="flex items-center justify-between gap-3 brutal-hero-reveal">
            {HERO_HUD_ITEMS.slice(2, 4).map((item) => (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => handleHudEnter(item)}
                onMouseLeave={handleHudLeave}
                onFocus={() => handleHudEnter(item)}
                onBlur={handleHudLeave}
                onClick={() => onNavigatePage(item.targetPage)}
                className="hero-hud-btn px-3.5 sm:px-4 py-2 bg-white border-2 border-[#111111] brutal-shadow-sm text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wider text-[#111111] cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-[#F26C57]">{item.code}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Compact NASA Gravity & Campaign Telemetry Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 brutal-hero-reveal">
            <div className="bg-white border-2 border-[#111111] shadow-[4px_4px_0_#111111] px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFE14D] border-2 border-[#111111] flex items-center justify-center shrink-0">
                <Satellite className="w-5 h-5 text-[#111111]" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold text-[#555555]">ISS / CYGNUS</div>
                <div className="text-base font-extrabold tabular-nums text-[#111111]">
                  0g Freefall
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#111111] shadow-[4px_4px_0_#111111] px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F7B2D9] border-2 border-[#111111] flex items-center justify-center shrink-0">
                <Orbit className="w-5 h-5 text-[#111111]" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold text-[#555555]">ARTEMIS BASE</div>
                <div className="text-base font-extrabold tabular-nums text-[#111111]">
                  1/6g · 34% O₂
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#111111] shadow-[4px_4px_0_#111111] px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#B4DCF2] border-2 border-[#111111] flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5 text-[#111111]" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold text-[#555555]">MARS HABITAT</div>
                <div className="text-base font-extrabold tabular-nums text-[#111111]">
                  3/8g · 56.5 kPa
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-[#111111] shadow-[4px_4px_0_#111111] px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFE14D] border-2 border-[#111111] flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5 text-[#111111]" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold text-[#555555]">
                  NASA PSI CAMPAIGN
                </div>
                <div className="text-base font-extrabold tabular-nums text-[#111111]">
                  14 Investigations
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Black Domain Strip (Preserved) */}
      <section className="bg-[#0A0A0A] text-white border-y-2 border-[#111111]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10 py-4 flex flex-wrap items-center justify-between gap-4 sm:gap-6">
          {CHALLENGE_PILLARS.map((pillar) => {
            const isSelected = activePillar === pillar.name;
            return (
              <button
                key={pillar.name}
                type="button"
                onClick={() => setActivePillar(isSelected ? null : pillar.name)}
                className={`text-base sm:text-lg font-bold tracking-tight transition-colors cursor-pointer px-2 py-1 whitespace-nowrap ${
                  isSelected
                    ? 'text-[#FFE14D] underline underline-offset-4'
                    : 'text-white hover:text-[#FFE14D]'
                }`}
              >
                {pillar.name}
              </button>
            );
          })}
        </div>
        {activePillar && (
          <div className="bg-[#181818] border-t border-white/15 py-3 px-4 text-center text-sm text-[#FFE14D] font-medium">
            <span className="font-bold">{activePillar}:</span>{' '}
            {CHALLENGE_PILLARS.find((p) => p.name === activePillar)?.detail}
          </div>
        )}
      </section>

      {/* Section 3: Crew Habitat Fire Safety Standards — Mission Environment Profiles */}
      <section className="relative py-16 sm:py-20 brutal-scroll-section overflow-x-clip">
        <div className="hidden md:block absolute -right-5 top-28 pointer-events-none select-none">
          <SpikyStarburst color="#F7B2D9" className="w-16 h-16" />
        </div>

        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-9">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#555555]">
                <Radar className="w-4 h-4 text-[#111111]" />
                <span>Crew Habitat Fire Safety Standards · Why Microgravity Fire Differs</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] leading-snug">
                Mission Environment{' '}
                <span className="relative inline-block z-0">
                  <span className="relative z-10">Profiles</span>
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-1 h-3.5 bg-[#FFE14D] -z-10"
                  />
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#222222] max-w-2xl leading-relaxed">
                Buoyancy-driven convection vanishes in orbital freefall and weakens up to 6× on
                lunar and Martian surfaces—making cabin airflow, oxygen fraction, and smoke detection
                critical across all five habitat regimes.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
              <button
                type="button"
                onClick={() => onNavigatePage('intelligence')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B4DCF2] border-2 border-[#111111] brutal-shadow-sm text-sm font-bold hover:bg-[#FFE14D] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Activity className="w-4 h-4" />
                <span>Fire Safety Charts</span>
              </button>
              <button
                type="button"
                onClick={() => onSelectEnvironment(PRESSURIZED_ROVER_DETAILS)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFE14D] border-2 border-[#111111] brutal-shadow-sm text-sm font-bold hover:bg-white transition-colors cursor-pointer whitespace-nowrap"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Pressurized Rovers Protocol ↗</span>
              </button>
            </div>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
            <Crosshair
              aria-hidden="true"
              className="hidden sm:block w-4 h-4 text-[#111111] absolute -top-2.5 -left-2.5 bg-[#FDFBE8] z-10"
            />
            <Crosshair
              aria-hidden="true"
              className="hidden sm:block w-4 h-4 text-[#111111] absolute -bottom-2.5 -right-2.5 bg-[#FDFBE8] z-10"
            />

            {MISSION_ENVIRONMENTS.map((env) => (
              <motion.article
                key={env.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.14 }}
                onClick={() => onSelectEnvironment(env)}
                className="bg-white border-2 border-[#111111] brutal-shadow flex flex-col justify-between cursor-pointer hover:bg-[#FFFDF2] transition-colors h-full"
              >
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <EnvironmentBadgeIcon type={env.iconType} color={env.accentColor} />
                      <span
                        className="px-2.5 py-1 text-xs font-mono font-bold border-2 border-[#111111] text-[#111111]"
                        style={{ backgroundColor: env.accentColor }}
                      >
                        {env.tagLabel}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#555555] tabular-nums">
                      {env.gravity.split(' ')[0]}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#111111]">
                      {env.name}
                    </h3>
                    <div className="mt-1 text-xs sm:text-sm font-mono font-semibold text-[#444444]">
                      {env.atmosphere}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base text-[#222222] leading-relaxed">
                    {env.buoyancySummary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {env.linkedPsiIds.map((psiId) => (
                      <span
                        key={psiId}
                        className="px-2.5 py-0.5 bg-[#FDFBE8] border border-[#111111] text-xs font-mono font-bold text-[#111111]"
                      >
                        {psiId}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-6 sm:px-7 py-3.5 border-t-2 border-[#111111] bg-[#FDFBE8]/75 flex items-center justify-between text-sm sm:text-base font-bold text-[#111111] hover:bg-[#FFE14D]/65 transition-colors">
                  <span>Inspect Hazards &amp; Controls</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Featured 3x3 NASA PSI Investigations Grid */}
      <section className="py-12 sm:py-16 brutal-scroll-section">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#555555]">
                <Flame className="w-4 h-4 text-[#F26C57]" />
                <span>ISS MSG · CIR · Cygnus Flight Campaigns</span>
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
                  Featured{' '}
                  <span className="border-b-[3px] border-[#111111] pb-0.5">Experiments</span>
                </h2>
                <div className="-rotate-12 shrink-0">
                  <SpikyStarburst color="#A8D8F0" withFlame className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigatePage('compare')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B4DCF2] border-2 border-[#111111] brutal-shadow-sm text-sm font-bold hover:bg-[#FFE14D] transition-colors cursor-pointer whitespace-nowrap"
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare Matrix</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage('experiments')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFE14D] border-2 border-[#111111] brutal-shadow-sm text-sm sm:text-base font-bold hover:bg-[#B4DCF2] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>All 14 Experiments</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 px-3">
            {featuredExperiments.map((exp) => (
              <motion.article
                key={exp.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.16 }}
                className="relative bg-white p-4 group cursor-pointer flex flex-col justify-between"
                onClick={() => onSelectExperiment(exp)}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-3 -right-3 top-0 h-[2px] bg-[#111111]"
                />
                <span
                  aria-hidden="true"
                  className="absolute -left-3 -right-3 bottom-0 h-[2px] bg-[#111111]"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-0 -top-3 -bottom-3 w-[2px] bg-[#111111]"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-0 -top-3 -bottom-3 w-[2px] bg-[#111111]"
                />

                <ExperimentVisualThumbnail
                  variant={exp.thumbnailVariant}
                  psiId={exp.psiId}
                  imageUrl={exp.imageUrl}
                  imageCredit={exp.imageCredit}
                  imageType={exp.imageType}
                  imageFit={exp.imageFit}
                  name={exp.name}
                  compact
                />

                <div className="mt-4 flex flex-col justify-between flex-1 gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono font-bold text-[#111111]">
                      <span
                        className="px-2 py-0.5 border border-[#111111] shrink-0"
                        style={{ backgroundColor: exp.tagColor }}
                      >
                        {exp.psiId}
                      </span>
                      <span className="text-[#555555] truncate tabular-nums">{exp.year}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#111111] group-hover:underline leading-snug">
                      {exp.name} — {exp.fullName}
                    </h3>
                    <p className="text-sm text-[#222222] line-clamp-2 leading-relaxed">
                      {exp.researchObjective}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[#111111]/15 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-[#444444] truncate">
                      <Wind className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{exp.parameters.airflow}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectExperiment(exp);
                      }}
                      aria-label={`Open dedicated page for ${exp.psiId} ${exp.name}`}
                      className="w-9 h-9 shrink-0 bg-[#111111] text-white flex items-center justify-center group-hover:bg-[#FFE14D] group-hover:text-[#111111] border border-[#111111] transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Bottom NASA AI Research Terminal CTA */}
      <section className="py-12 sm:py-16 brutal-scroll-section">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10">
          <div className="relative bg-white border-2 border-[#111111] brutal-shadow-lg px-6 py-10 sm:px-12 sm:py-12">
            <div className="absolute -top-7 right-6 sm:right-14 pointer-events-none select-none">
              <SpikyStarburst color="#F7B2D9" className="w-14 h-14" />
            </div>

            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFE14D] border-2 border-[#111111] text-xs font-mono font-extrabold text-[#111111]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GEMINI RESEARCH COPILOT · 14 NASA PSI STUDIES</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111]">
                Ask the Science.
              </h2>

              <p className="text-base sm:text-lg text-[#222222] max-w-xl mx-auto leading-relaxed">
                Launch the ChatGPT-style NASA PSI Research Copilot to explore cool flames, material
                flammability, and Moon or Mars fire safety protocols.
              </p>

              {/* Quick Starter Prompts directly inside CTA */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {SUGGESTED_COPILOT_QUESTIONS.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      if (onAskCopilot) {
                        onAskCopilot(q);
                      } else {
                        onNavigatePage('ask-ai');
                      }
                    }}
                    className="px-3.5 py-2 bg-[#FDFBE8] border-2 border-[#111111] hover:bg-[#B4DCF2] transition-colors text-xs sm:text-sm font-bold text-[#111111] cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="pt-3 inline-flex items-center gap-3">
                <motion.button
                  type="button"
                  whileHover={{ x: -1, y: -1 }}
                  whileTap={{ x: 2, y: 2 }}
                  transition={{ duration: 0.12 }}
                  onClick={() => onNavigatePage('ask-ai')}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#B4DCF2] border-2 border-[#111111] brutal-shadow-sm text-base font-bold text-[#111111] hover:bg-[#9FD3EE] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Open AI Copilot Workspace</span>
                </motion.button>
                <MotionTicks className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
