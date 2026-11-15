import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import {
  RESEARCH_LIBRARY_DOCS,
  ResearchDocument,
} from '../../../data/nasaFireData';
import { SpikyStarburst } from '../ScienceArtwork';
import { FireSafetyCharts } from '../FireSafetyCharts';

interface IntelligencePageProps {
  onSelectDocument: (doc: ResearchDocument) => void;
  onOpenPsiById: (psiId: string) => void;
}

export function IntelligencePage({
  onSelectDocument,
  onOpenPsiById,
}: IntelligencePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [libraryFilter, setLibraryFilter] = useState<string>('All');

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.intel-page-reveal', {
        y: 16,
        opacity: 0,
        duration: 0.42,
        stagger: 0.07,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const filteredDocs = RESEARCH_LIBRARY_DOCS.filter(
    (doc) => libraryFilter === 'All' || doc.category === libraryFilter
  );

  return (
    <div ref={rootRef} className="py-10 sm:py-14 space-y-16">
      {/* Page Header & Charts */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10 intel-page-reveal">
        <div className="pb-8 border-b-2 border-[#111111] mb-10">
          <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#555555]">
            Scientific Analytics &amp; Habitat Protocols
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
              Fire Safety{' '}
              <span className="relative inline-block z-0">
                <span className="relative z-10">Intelligence</span>
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 bottom-1 h-3.5 bg-[#FFE14D] -z-10"
                />
              </span>
            </h1>
            <div className="-rotate-12 hidden sm:block">
              <SpikyStarburst color="#F7B2D9" withFlame className="w-14 h-14" />
            </div>
          </div>
          <p className="mt-2 text-base sm:text-lg text-[#222222] max-w-2xl leading-relaxed">
            Interactive visualizations across oxygen concentration, fuel flammability, low-speed
            airflow, flame spread, fire suppression, and smoke aerosol detection.
          </p>
        </div>

        <FireSafetyCharts onOpenPsiById={onOpenPsiById} />
      </section>

      {/* Research Library */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10 intel-page-reveal">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#555555]">
              Organized NASA PSI Briefs
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111111] mt-1">
              Research Library
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'All',
              'Combustion Physics',
              'Spacecraft Standards',
              'Smoke & Aerosols',
              'Suppression & Habitats',
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setLibraryFilter(cat)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold border-2 border-[#111111] cursor-pointer whitespace-nowrap ${
                  libraryFilter === cat ? 'bg-[#FFE14D] brutal-shadow-sm' : 'bg-white hover:bg-[#FFE14D]/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredDocs.map((doc) => (
            <motion.article
              key={doc.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.14 }}
              onClick={() => onSelectDocument(doc)}
              className="bg-white border-2 border-[#111111] brutal-shadow p-6 flex flex-col justify-between gap-4 cursor-pointer hover:bg-[#FDFBE8]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-mono text-[#555555]">
                  <span className="inline-flex items-center gap-1.5 font-bold text-[#111111]">
                    <BookOpen className="w-4 h-4" />
                    {doc.docCode}
                  </span>
                  <span className="px-2.5 py-0.5 bg-[#B4DCF2] border border-[#111111] text-xs font-bold text-[#111111]">
                    {doc.provenance}
                  </span>
                </div>
                <h3 className="mt-2.5 text-lg sm:text-xl font-extrabold text-[#111111]">
                  {doc.title}
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#222222] leading-relaxed">
                  {doc.summary}
                </p>
              </div>
              <div className="pt-3 border-t-2 border-[#111111]/15 flex items-center justify-between text-xs sm:text-sm font-bold text-[#111111]">
                <span className="font-mono">{doc.psiRef}</span>
                <span>Read Document ↗</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
    </div>
  );
}
