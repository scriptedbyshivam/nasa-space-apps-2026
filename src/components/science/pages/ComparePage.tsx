import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { PsiExperiment } from '../../../data/nasaFireData';
import { CurvedArrow, SpikyStarburst } from '../ScienceArtwork';
import { ExperimentComparisonPanel } from '../ExperimentComparisonPanel';

interface ComparePageProps {
  onSelectExperiment: (exp: PsiExperiment) => void;
}

const COMPARISON_PRESETS: { label: string; ids: string[] }[] = [
  { label: 'Droplet vs Large Fire vs Solid', ids: ['psi-69', 'psi-98', 'psi-26'] },
  { label: 'Cygnus SAFFIRE I–III', ids: ['psi-98', 'psi-99', 'psi-100'] },
  { label: 'Cool Flames (FLEX & CFI)', ids: ['psi-69', 'psi-159', 'psi-39'] },
  { label: 'Smoke & Soot (SAME & SPICE)', ids: ['psi-102', 'psi-101', 'psi-107'] },
];

export function ComparePage({ onSelectExperiment }: ComparePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([
    'psi-69',
    'psi-98',
    'psi-26',
  ]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.compare-page-reveal', {
        y: 16,
        opacity: 0,
        duration: 0.44,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="py-10 sm:py-14">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10 space-y-10">
        {/* Page Header */}
        <section className="pb-8 border-b-2 border-[#111111] compare-page-reveal">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="-rotate-12 shrink-0">
                  <SpikyStarburst color="#A8D8F0" withFlame className="w-12 h-12 sm:w-14 sm:h-14" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#555555]">
                    Scientific Investigation Timeline &amp; Matrix
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
                    Compare{' '}
                    <span className="relative inline-block z-0">
                      <span className="relative z-10">NASA PSI Combustion Parameters</span>
                      <span
                        aria-hidden="true"
                        className="absolute left-0 right-0 bottom-1 h-3.5 bg-[#FFE14D] -z-10"
                      />
                    </span>
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#222222] max-w-3xl leading-relaxed">
                Evaluate fuel type, oxygen concentration, pressure, airflow, temperature,
                experimental environment, and suppression methods side-by-side across NASA&apos;s 14
                microgravity investigations.
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <span className="px-3.5 py-1.5 bg-[#F7B2D9] border-2 border-[#111111] brutal-shadow-sm text-sm font-bold -rotate-2">
                7 Parameters
              </span>
              <CurvedArrow variant="down-right" className="w-10 h-9" />
            </div>
          </div>

          {/* Quick Comparison Presets */}
          <div className="mt-7 space-y-2.5">
            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#555555]">
              Quick Scientific Presets:
            </div>
            <div className="flex flex-wrap gap-2.5">
              {COMPARISON_PRESETS.map((preset) => {
                const isActive =
                  preset.ids.length === selectedIds.length &&
                  preset.ids.every((id, i) => selectedIds[i] === id);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setSelectedIds(preset.ids)}
                    className={`px-4 py-2 text-xs sm:text-sm font-bold border-2 border-[#111111] transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#B4DCF2] brutal-shadow-sm'
                        : 'bg-white hover:bg-[#FFE14D]/50'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Interactive Comparison Workspace */}
        <section className="compare-page-reveal">
          <ExperimentComparisonPanel
            selectedIds={selectedIds}
            onChangeSelectedIds={setSelectedIds}
            onSelectExperiment={onSelectExperiment}
          />
        </section>
      </div>
    </div>
  );
}
