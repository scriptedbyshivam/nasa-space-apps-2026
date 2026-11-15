import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Flame,
  GitCompare,
  Sparkles,
} from 'lucide-react';
import { PSI_EXPERIMENTS, PsiExperiment } from '../../../data/nasaFireData';
import { ExperimentVisualThumbnail, SpikyStarburst } from '../ScienceArtwork';
import { AppPage } from './OverviewPage';

interface ExperimentDetailPageProps {
  experiment: PsiExperiment;
  backLabel: string;
  onBack: () => void;
  onSelectExperiment: (exp: PsiExperiment) => void;
  onNavigatePage: (page: AppPage) => void;
  onAskCopilot: (prompt: string) => void;
}

export function ExperimentDetailPage({
  experiment,
  backLabel,
  onBack,
  onSelectExperiment,
  onNavigatePage,
  onAskCopilot,
}: ExperimentDetailPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  useEffect(() => {
    setHeroImgFailed(false);
  }, [experiment.id]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.exp-detail-reveal', {
        y: 14,
        opacity: 0,
        duration: 0.38,
        stagger: 0.06,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }, rootRef);

    return () => ctx.revert();
  }, [experiment.id]);

  const currentIndex = PSI_EXPERIMENTS.findIndex((e) => e.id === experiment.id);
  const prevExperiment =
    currentIndex > 0 ? PSI_EXPERIMENTS[currentIndex - 1] : PSI_EXPERIMENTS[PSI_EXPERIMENTS.length - 1];
  const nextExperiment =
    currentIndex >= 0 && currentIndex < PSI_EXPERIMENTS.length - 1
      ? PSI_EXPERIMENTS[currentIndex + 1]
      : PSI_EXPERIMENTS[0];

  const relatedExperiments = PSI_EXPERIMENTS.filter(
    (e) => e.id !== experiment.id && e.category === experiment.category
  ).slice(0, 3);

  const imageType = experiment.imageType ?? 'nasa';
  const imageTypeLabel =
    imageType === 'ai-illustration'
      ? 'AI ILLUSTRATION — NOT A NASA PHOTO'
      : imageType === 'schematic'
        ? 'SCHEMATIC'
        : 'NASA PHOTO';

  const parametersList = [
    { label: 'Fuel Type', value: experiment.parameters.fuelType },
    { label: 'Oxygen Concentration', value: experiment.parameters.oxygenConcentration },
    { label: 'Pressure', value: experiment.parameters.pressure },
    { label: 'Airflow', value: experiment.parameters.airflow },
    { label: 'Temperature', value: experiment.parameters.temperature },
    { label: 'Experimental Environment', value: experiment.parameters.experimentalEnvironment },
    { label: 'Suppression Method', value: experiment.parameters.suppressionMethod },
  ];

  return (
    <div ref={rootRef} className="py-8 sm:py-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10 space-y-10">
        {/* Top Page Breadcrumb & Prev/Next Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b-2 border-[#111111] exp-detail-reveal">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#111111] brutal-shadow-sm hover:bg-[#FFE14D] transition-colors text-sm font-bold text-[#111111] cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{backLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigatePage('experiments')}
              className="px-3.5 py-2 bg-[#FDFBE8] border-2 border-[#111111] hover:bg-[#B4DCF2] transition-colors text-xs sm:text-sm font-bold text-[#111111] cursor-pointer whitespace-nowrap"
            >
              All 14 Experiments
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectExperiment(prevExperiment)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border-2 border-[#111111] hover:bg-[#FFE14D]/60 transition-colors text-xs sm:text-sm font-bold text-[#111111] cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="font-mono">{prevExperiment.psiId}</span>
            </button>
            <button
              type="button"
              onClick={() => onSelectExperiment(nextExperiment)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border-2 border-[#111111] hover:bg-[#FFE14D]/60 transition-colors text-xs sm:text-sm font-bold text-[#111111] cursor-pointer whitespace-nowrap"
            >
              <span className="font-mono">{nextExperiment.psiId}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero Split: Title, Objective, Actions + Provenance-Labeled Visual */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start exp-detail-reveal">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-[#333333]">
              <span
                className="px-3 py-1 font-mono font-extrabold text-[#111111] border-2 border-[#111111]"
                style={{ backgroundColor: experiment.tagColor }}
              >
                {experiment.psiId}
              </span>
              <span>{experiment.category}</span>
              <span aria-hidden="true">·</span>
              <span>{experiment.experimentType}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{experiment.year}</span>
              {experiment.psiVerification === 'unverified' && (
                <span className="px-2 py-1 bg-[#F26C57] border-2 border-[#111111] text-[10px] font-mono font-extrabold uppercase tracking-wide">
                  PSI ID unverified
                </span>
              )}
            </div>

            <div className="flex items-start gap-3">
              <div className="hidden sm:block -rotate-12 shrink-0 mt-1">
                <SpikyStarburst color={experiment.tagColor} withFlame className="w-12 h-12" />
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] leading-tight">
                <span className="relative inline-block z-0">
                  <span className="relative z-10">{experiment.name}</span>
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 bottom-1 h-3.5 bg-[#FFE14D] -z-10"
                  />
                </span>{' '}
                <span className="text-[#222222]">— {experiment.fullName}</span>
              </h1>
            </div>

            <div className="text-sm sm:text-base font-mono font-bold text-[#444444]">
              Facility: {experiment.facility}
            </div>

            {/* Research Objective Callout */}
            <div className="bg-white border-2 border-[#111111] brutal-shadow p-5 space-y-1.5">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                Research Objective
              </div>
              <p className="text-base sm:text-lg font-extrabold text-[#111111] leading-snug">
                {experiment.researchObjective}
              </p>
            </div>

            <p className="text-base sm:text-lg text-[#111111] leading-relaxed">
              {experiment.overviewSummary}
            </p>

            {/* Primary Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() =>
                  onAskCopilot(
                    `Explain the key findings and space fire safety lessons from NASA ${experiment.psiId} (${experiment.name}).`
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#B4DCF2] border-2 border-[#111111] brutal-shadow-sm text-sm sm:text-base font-bold text-[#111111] hover:bg-[#9FD3EE] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Copilot About {experiment.name}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigatePage('compare')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFE14D] border-2 border-[#111111] brutal-shadow-sm text-sm sm:text-base font-bold text-[#111111] hover:bg-[#F7B2D9] transition-colors cursor-pointer whitespace-nowrap"
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare Parameters</span>
              </button>
            </div>
          </div>

          {/* Right: Provenance-Labeled Investigation Visual */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white border-2 border-[#111111] brutal-shadow-lg p-3 sm:p-4 space-y-3">
              {!heroImgFailed ? (
                <div className="border-2 border-[#111111] bg-[#06090F] overflow-hidden relative">
                  <img
                    src={experiment.imageUrl}
                    alt={experiment.imageCredit}
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className={`w-full h-64 sm:h-80 ${
                      experiment.imageFit === 'contain' ? 'object-contain p-2' : 'object-cover'
                    }`}
                  />
                  <div
                    className={`pointer-events-none absolute top-2.5 left-2.5 px-2.5 py-1 border text-xs font-mono font-bold ${
                      imageType === 'ai-illustration'
                        ? 'bg-[#F26C57] text-[#111111] border-[#111111]'
                        : 'bg-[#111111]/85 text-[#FFE14D] border-[#FFE14D]/60'
                    }`}
                  >
                    {experiment.psiId} · {imageTypeLabel}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-[#111111] overflow-hidden">
                  <ExperimentVisualThumbnail
                    variant={experiment.thumbnailVariant}
                    psiId={experiment.psiId}
                    imageType={experiment.imageType}
                    schematicOnly
                  />
                </div>
              )}

              <div className="text-xs sm:text-sm text-[#222222] leading-relaxed">
                <span className="font-bold text-[#111111]">Image provenance:</span>{' '}
                {experiment.imageCredit}
              </div>
            </div>
          </div>
        </section>

        {/* Key Published Findings & Experimental Data */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 exp-detail-reveal">
          {/* Key Findings */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              Key Published Findings
            </h2>
            <ul className="space-y-3">
              {experiment.keyFindings.map((finding) => (
                <li
                  key={finding}
                  className="flex items-start gap-3.5 bg-white border-2 border-[#111111] brutal-shadow-sm p-4 text-sm sm:text-base text-[#111111] leading-relaxed"
                >
                  <Flame className="w-5 h-5 shrink-0 mt-0.5 text-[#F26C57]" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Experimental Data Table */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
                Experimental Data
              </h2>
              <span className="px-3 py-1 bg-[#FFE14D] border-2 border-[#111111] text-xs font-bold text-[#111111]">
                {experiment.experimentalData.provenance}
              </span>
            </div>

            <div className="bg-white border-2 border-[#111111] brutal-shadow overflow-hidden">
              <div className="px-4 py-3 bg-[#FDFBE8] border-b-2 border-[#111111] text-xs sm:text-sm font-semibold text-[#333333]">
                {experiment.experimentalData.note}
              </div>
              <div className="divide-y-2 divide-[#111111]/15">
                {experiment.experimentalData.records.map((rec) => (
                  <div
                    key={rec.metric}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-sm sm:text-base font-bold text-[#111111]">
                        {rec.metric}
                      </div>
                      <div className="text-xs text-[#555555]">{rec.provenance}</div>
                    </div>
                    <div
                      className={`text-sm sm:text-base font-mono font-bold ${
                        rec.value === 'Experimental data not available.'
                          ? 'text-[#666666] italic'
                          : 'text-[#111111]'
                      }`}
                    >
                      {rec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7 Combustion Parameters */}
        <section className="space-y-4 exp-detail-reveal">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
            Combustion &amp; Facility Parameters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {parametersList.map((param, idx) => (
              <div
                key={param.label}
                className={`p-5 bg-white border-2 border-[#111111] brutal-shadow-sm ${
                  idx === parametersList.length - 1 ? 'sm:col-span-2 lg:col-span-3' : ''
                }`}
              >
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                  {param.label}
                </div>
                <div
                  className={`mt-1.5 text-base sm:text-lg font-extrabold ${
                    param.value === 'Experimental data not available.'
                      ? 'text-[#666666] italic'
                      : 'text-[#111111]'
                  }`}
                >
                  {param.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Schematic & Literature Citations */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 exp-detail-reveal">
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              Technical Schematic
            </h2>
            <div className="bg-white border-2 border-[#111111] brutal-shadow p-4 space-y-3">
              <div className="border-2 border-[#111111] overflow-hidden">
                <ExperimentVisualThumbnail
                  variant={experiment.thumbnailVariant}
                  psiId={experiment.psiId}
                  schematicOnly
                />
              </div>
              <p className="text-sm sm:text-base text-[#222222] leading-relaxed">
                <span className="font-bold text-[#111111]">Diagram Note:</span>{' '}
                {experiment.visualCaption} (Illustrative schematic grounded in {experiment.psiId}{' '}
                geometry.)
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              Published Literature
            </h2>
            <div className="space-y-3.5">
              {experiment.publications.map((pub) => (
                <div
                  key={pub.title}
                  className="p-5 bg-white border-2 border-[#111111] brutal-shadow space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#555555]">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>{pub.venue}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{pub.year}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#111111]">
                    {pub.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#333333]">{pub.authors}</p>
                  {(pub.url || pub.doi) && (
                    <a
                      href={pub.url ?? `https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-bold underline text-[#111111] hover:bg-[#FFE14D]"
                    >
                      Read source <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ))}
              {experiment.dataUrl && (
                <a
                  href={experiment.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFE14D] border-2 border-[#111111] brutal-shadow-sm text-sm font-bold text-[#111111] hover:bg-[#B4DCF2] transition-colors"
                >
                  Open NASA PSI data record <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Related Investigations in Same Category */}
        {relatedExperiments.length > 0 && (
          <section className="pt-6 border-t-2 border-[#111111] space-y-5 exp-detail-reveal">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
                Related {experiment.category} Investigations
              </h2>
              <button
                type="button"
                onClick={() => onNavigatePage('experiments')}
                className="text-sm font-bold underline cursor-pointer"
              >
                Browse all 14 PSI →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedExperiments.map((rel) => (
                <motion.article
                  key={rel.id}
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onSelectExperiment(rel)}
                  className="bg-white border-2 border-[#111111] brutal-shadow p-4 cursor-pointer flex flex-col justify-between gap-4 group"
                >
                  <ExperimentVisualThumbnail
                    variant={rel.thumbnailVariant}
                    psiId={rel.psiId}
                    imageUrl={rel.imageUrl}
                    imageCredit={rel.imageCredit}
                    imageType={rel.imageType}
                    imageFit={rel.imageFit}
                    name={rel.name}
                    compact
                  />
                  <div className="flex items-end justify-between gap-2">
                    <div className="min-w-0 space-y-1">
                      <span
                        className="inline-block px-2 py-0.5 text-xs font-mono font-bold border border-[#111111]"
                        style={{ backgroundColor: rel.tagColor }}
                      >
                        {rel.psiId}
                      </span>
                      <h3 className="text-lg font-extrabold text-[#111111] group-hover:underline truncate">
                        {rel.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#333333] line-clamp-2">
                        {rel.researchObjective}
                      </p>
                    </div>
                    <span className="w-9 h-9 shrink-0 bg-[#111111] text-white group-hover:bg-[#FFE14D] group-hover:text-[#111111] border border-[#111111] flex items-center justify-center transition-colors">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
