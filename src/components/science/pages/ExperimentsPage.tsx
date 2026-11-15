import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import {
  ExperimentCategory,
  PSI_EXPERIMENTS,
  PsiExperiment,
} from '../../../data/nasaFireData';
import { ExperimentVisualThumbnail, SpikyStarburst } from '../ScienceArtwork';
import { AppPage } from './OverviewPage';

gsap.registerPlugin(ScrollTrigger);

interface ExperimentsPageProps {
  onSelectExperiment: (exp: PsiExperiment) => void;
  onNavigatePage: (page: AppPage) => void;
}

const CATEGORIES: ExperimentCategory[] = [
  'All',
  'Solid Fuels',
  'Droplet & Cool Flame',
  'Large-Scale Fire',
  'Smoke & Detection',
  'Gaseous & ACME',
];

const SORT_OPTIONS = [
  { id: 'priority', label: 'Mission priority' },
  { id: 'verified', label: 'Verified first' },
  { id: 'newest', label: 'Newest first' },
  { id: 'name', label: 'Name A–Z' },
] as const;

type SortMode = (typeof SORT_OPTIONS)[number]['id'];

const PRIORITY_ORDER = [
  'PSI-69',
  'PSI-68',
  'PSI-26',
  'PSI-25',
  'PSI-98',
  'PSI-99',
  'PSI-100',
  'PSI-102',
  'PSI-101',
  'PSI-107',
  'PSI-106',
  'PSI-159',
  'PSI-39',
  'PSI-20',
];

export function ExperimentsPage({ onSelectExperiment, onNavigatePage }: ExperimentsPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [category, setCategory] = useState<ExperimentCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('priority');

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.exp-page-reveal', {
        y: 16,
        opacity: 0,
        duration: 0.42,
        stagger: 0.06,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const filteredExperiments = PSI_EXPERIMENTS.filter((exp) => {
    const matchesCat = category === 'All' || exp.category === category;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      exp.psiId.toLowerCase().includes(q) ||
      exp.name.toLowerCase().includes(q) ||
      exp.fullName.toLowerCase().includes(q) ||
      exp.experimentType.toLowerCase().includes(q) ||
      exp.researchObjective.toLowerCase().includes(q) ||
      exp.shortDescription.toLowerCase().includes(q) ||
      exp.keyFindings.some((finding) => finding.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortMode === 'verified') {
      const aUnverified = a.psiVerification === 'unverified' ? 1 : 0;
      const bUnverified = b.psiVerification === 'unverified' ? 1 : 0;
      return aUnverified - bUnverified || a.name.localeCompare(b.name);
    }
    if (sortMode === 'newest') {
      const aYear = Number(a.year.match(/\d{4}/g)?.at(-1) ?? 0);
      const bYear = Number(b.year.match(/\d{4}/g)?.at(-1) ?? 0);
      return bYear - aYear;
    }
    if (sortMode === 'name') {
      return a.name.localeCompare(b.name);
    }
    const aIndex = PRIORITY_ORDER.indexOf(a.psiId);
    const bIndex = PRIORITY_ORDER.indexOf(b.psiId);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });

  return (
    <div ref={rootRef} className="py-10 sm:py-14 space-y-16">
      {/* Page Header */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10 exp-page-reveal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b-2 border-[#111111]">
          <div className="space-y-2">
            <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-[#555555]">
              NASA Physical Sciences Informatics (PSI)
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
                NASA{' '}
                <span className="relative inline-block z-0">
                  <span className="relative z-10">Experiment Explorer</span>
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-1 h-3.5 bg-[#FFE14D] -z-10"
                  />
                </span>
              </h1>
              <div className="-rotate-12 hidden sm:block">
                <SpikyStarburst color="#A8D8F0" withFlame className="w-14 h-14" />
              </div>
            </div>
            <p className="text-base sm:text-lg text-[#222222] max-w-2xl leading-relaxed">
              Browse all 14 microgravity combustion investigations across BASS, FLEX, SAFFIRE I–III,
              SAME, ACME, SLICE, SPICE, and CFI. Click any card for experimental data and tabs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-center">
            <div className="px-4 py-2.5 bg-white border-2 border-[#111111] brutal-shadow-sm text-sm font-bold whitespace-nowrap">
              Showing {filteredExperiments.length} / {PSI_EXPERIMENTS.length} PSI
            </div>
            <button
              type="button"
              onClick={() => onNavigatePage('compare')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#B4DCF2] border-2 border-[#111111] brutal-shadow-sm text-sm font-bold hover:bg-[#FFE14D] transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Compare Parameters</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Category Controls */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1 max-w-lg">
              <Search className="w-4 h-4 text-[#444444] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PSI-69, SAFFIRE, BASS, cool flames..."
                aria-label="Search NASA PSI investigations"
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#111111] text-sm sm:text-base text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFE14D]"
              />
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-bold text-[#111111] whitespace-nowrap">
              <span>Sort</span>
              <select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value as SortMode)}
                className="px-3 py-3 bg-white border-2 border-[#111111] text-sm font-bold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#FFE14D] cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-bold border-2 border-[#111111] transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#111111] text-[#FFE14D]'
                      : 'bg-white text-[#111111] hover:bg-[#FFE14D]/45'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experiments 2-Column Extended Wireframe Grid */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10 exp-page-reveal">
        {filteredExperiments.length === 0 ? (
          <div className="bg-white border-2 border-[#111111] brutal-shadow p-8 text-center space-y-3">
            <div className="text-xl font-extrabold text-[#111111]">
              No matching NASA PSI investigations
            </div>
            <p className="text-base text-[#333333]">
              Try clearing your search term or selecting &ldquo;All&rdquo; categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('All');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 bg-[#B4DCF2] border-2 border-[#111111] text-sm font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 px-3">
            {filteredExperiments.map((exp) => (
              <motion.article
                key={exp.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.16 }}
                className="relative bg-white p-5 group cursor-pointer flex flex-col justify-between"
                onClick={() => onSelectExperiment(exp)}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-3.5 -right-3.5 top-0 h-[2px] bg-[#111111]"
                />
                <span
                  aria-hidden="true"
                  className="absolute -left-3.5 -right-3.5 bottom-0 h-[2px] bg-[#111111]"
                />
                <span
                  aria-hidden="true"
                  className="absolute left-0 -top-3.5 -bottom-3.5 w-[2px] bg-[#111111]"
                />
                <span
                  aria-hidden="true"
                  className="absolute right-0 -top-3.5 -bottom-3.5 w-[2px] bg-[#111111]"
                />

                <ExperimentVisualThumbnail
                  variant={exp.thumbnailVariant}
                  psiId={exp.psiId}
                  imageUrl={exp.imageUrl}
                  imageCredit={exp.imageCredit}
                  imageType={exp.imageType}
                  imageFit={exp.imageFit}
                  name={exp.name}
                />

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-[#111111]">
                      <span
                        className="px-2 py-0.5 border border-[#111111]"
                        style={{ backgroundColor: exp.tagColor }}
                      >
                        {exp.psiId}
                      </span>
                      <span className="text-[#444444] font-sans">{exp.experimentType}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] group-hover:underline">
                      {exp.name} — {exp.fullName}
                    </h2>
                    <p className="text-sm text-[#222222] line-clamp-2 leading-relaxed">
                      {exp.researchObjective}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectExperiment(exp);
                    }}
                    aria-label={`View details for ${exp.psiId} ${exp.name}`}
                    className="w-10 h-10 shrink-0 bg-[#111111] text-white flex items-center justify-center group-hover:bg-[#FFE14D] group-hover:text-[#111111] border border-[#111111] transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
