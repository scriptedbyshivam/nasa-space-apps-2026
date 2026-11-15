import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BookOpen, Flame, ShieldAlert, Sparkles, X } from 'lucide-react';
import {
  MissionEnvironment,
  PsiExperiment,
  ResearchDocument,
} from '../../data/nasaFireData';
import { ExperimentVisualThumbnail } from './ScienceArtwork';

type DetailTab = 'overview' | 'data' | 'parameters' | 'publications' | 'images';

interface ExperimentModalProps {
  experiment: PsiExperiment | null;
  onClose: () => void;
  onAskCopilot: (prompt: string) => void;
}

export function ExperimentDetailModal({
  experiment,
  onClose,
  onAskCopilot,
}: ExperimentModalProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');
  const [modalImgFailed, setModalImgFailed] = useState(false);

  useEffect(() => {
    setActiveTab('overview');
    setModalImgFailed(false);
  }, [experiment?.id]);

  useEffect(() => {
    if (!experiment) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [experiment, onClose]);

  return (
    <AnimatePresence>
      {experiment && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="psi-detail-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FDFBE8] border-2 border-[#111111] shadow-[8px_8px_0_#111111] p-5 sm:p-8"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b-2 border-[#111111]/20">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-[#333333]">
                  <span
                    className="px-2.5 py-0.5 font-mono font-bold text-[#111111] border-2 border-[#111111]"
                    style={{ backgroundColor: experiment.tagColor }}
                  >
                    {experiment.psiId}
                  </span>
                  <span>{experiment.experimentType}</span>
                  <span aria-hidden="true">·</span>
                  <span>{experiment.facility}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{experiment.year}</span>
                </div>
                <h3
                  id="psi-detail-title"
                  className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111111]"
                >
                  {experiment.name} — {experiment.fullName}
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close experiment details"
                className="w-10 h-10 shrink-0 bg-white border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center hover:bg-[#FFE14D] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 5 Detail Tabs */}
            <div className="mt-4 flex flex-wrap gap-2 pb-4 border-b-2 border-[#111111]/15">
              {(
                [
                  { id: 'overview', label: 'Overview' },
                  { id: 'data', label: 'Experimental Data' },
                  { id: 'parameters', label: 'Parameters' },
                  { id: 'publications', label: 'Publications' },
                  { id: 'images', label: 'Images' },
                ] as { id: DetailTab; label: string }[]
              ).map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-xs sm:text-sm font-bold border-2 border-[#111111] transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#FFE14D] shadow-[2px_2px_0_#111111]'
                        : 'bg-white hover:bg-[#FFE14D]/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="mt-5 space-y-5">
              {activeTab === 'overview' && (
                <>
                  <div className="p-4 bg-white border-2 border-[#111111]">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#555555]">
                      Research Objective
                    </div>
                    <p className="mt-1 text-base font-bold text-[#111111]">
                      {experiment.researchObjective}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base text-[#111111] leading-relaxed">
                    {experiment.overviewSummary}
                  </p>

                  <div>
                    <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#444444] mb-2.5">
                      Key Published Findings
                    </div>
                    <ul className="space-y-2.5">
                      {experiment.keyFindings.map((finding) => (
                        <li
                          key={finding}
                          className="flex items-start gap-3 text-sm sm:text-base text-[#111111] bg-white border-2 border-[#111111] p-3.5"
                        >
                          <Flame className="w-5 h-5 shrink-0 mt-0.5 text-[#F26C57]" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {activeTab === 'data' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-white border-2 border-[#111111] p-3.5">
                    <span className="text-sm font-semibold text-[#222222]">
                      {experiment.experimentalData.note}
                    </span>
                    <span className="px-2.5 py-1 bg-[#FFE14D] border-2 border-[#111111] text-xs font-bold text-[#111111]">
                      {experiment.experimentalData.provenance}
                    </span>
                  </div>

                  <div className="divide-y-2 divide-[#111111]/15 border-2 border-[#111111] bg-white">
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
              )}

              {activeTab === 'parameters' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { label: 'Fuel Type', value: experiment.parameters.fuelType },
                    {
                      label: 'Oxygen Concentration',
                      value: experiment.parameters.oxygenConcentration,
                    },
                    { label: 'Pressure', value: experiment.parameters.pressure },
                    { label: 'Airflow', value: experiment.parameters.airflow },
                    { label: 'Temperature', value: experiment.parameters.temperature },
                    {
                      label: 'Experimental Environment',
                      value: experiment.parameters.experimentalEnvironment,
                    },
                    {
                      label: 'Suppression Method',
                      value: experiment.parameters.suppressionMethod,
                    },
                  ].map((param) => (
                    <div
                      key={param.label}
                      className="p-4 bg-white border-2 border-[#111111] sm:last:col-span-2"
                    >
                      <div className="text-xs font-bold uppercase tracking-wider text-[#555555]">
                        {param.label}
                      </div>
                      <div
                        className={`mt-1 text-sm sm:text-base font-bold ${
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
              )}

              {activeTab === 'publications' && (
                <div className="space-y-3">
                  {experiment.publications.map((pub) => (
                    <div key={pub.title} className="p-4 bg-white border-2 border-[#111111]">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#555555]">
                        <span>{pub.venue}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{pub.year}</span>
                      </div>
                      <h4 className="mt-1 text-base sm:text-lg font-extrabold text-[#111111]">
                        {pub.title}
                      </h4>
                      <p className="mt-1 text-sm text-[#333333]">{pub.authors}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'images' && (
                <div className="space-y-4">
                  {!modalImgFailed && (
                    <>
                      <div className="border-2 border-[#111111] bg-[#06090F] overflow-hidden relative">
                        <img
                          src={experiment.imageUrl}
                          alt={experiment.imageCredit}
                          referrerPolicy="no-referrer"
                          onError={() => setModalImgFailed(true)}
                          className={`w-full h-64 sm:h-80 ${
                            experiment.imageFit === 'contain' ? 'object-contain p-2' : 'object-cover'
                          }`}
                        />
                        <div
                          className={`pointer-events-none absolute top-2 left-2 px-2.5 py-1 border text-[10px] font-mono font-bold ${
                            experiment.imageType === 'ai-illustration'
                              ? 'bg-[#F26C57] text-[#111111] border-[#111111]'
                              : 'bg-[#111111]/85 text-[#FFE14D] border-[#FFE14D]/60'
                          }`}
                        >
                          {experiment.imageType === 'ai-illustration'
                            ? 'AI ILLUSTRATION — NOT NASA IMAGERY'
                            : 'NASA PHOTO'}
                        </div>
                      </div>
                      <p className="text-sm sm:text-base text-[#111111] bg-white border-2 border-[#111111] p-4">
                        <span className="font-bold">Image provenance:</span>{' '}
                        {experiment.imageCredit}
                      </p>
                    </>
                  )}

                  <div className="border-2 border-[#111111] overflow-hidden">
                    <ExperimentVisualThumbnail
                      variant={experiment.thumbnailVariant}
                      psiId={experiment.psiId}
                      imageType={experiment.imageType}
                      schematicOnly
                    />
                  </div>
                  <p className="text-sm sm:text-base text-[#222222] bg-white border-2 border-[#111111] p-4">
                    <span className="font-bold">Schematic Diagram:</span> {experiment.visualCaption}{' '}
                    (Illustrative diagram grounded in {experiment.psiId} geometry.)
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t-2 border-[#111111]/20 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-medium text-[#444444]">
                Source: NASA Physical Sciences Informatics ({experiment.psiId})
              </span>
              <button
                type="button"
                onClick={() => {
                  const prompt = `Explain the key findings and space fire safety lessons from NASA ${experiment.psiId} (${experiment.name}).`;
                  onClose();
                  onAskCopilot(prompt);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B4DCF2] border-2 border-[#111111] shadow-[3px_3px_0_#111111] text-sm font-bold text-[#111111] hover:bg-[#9FD3EE] cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Copilot About {experiment.name}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MissionModalProps {
  environment: MissionEnvironment | null;
  onClose: () => void;
  onOpenPsiById: (psiId: string) => void;
}

export function MissionEnvironmentModal({
  environment,
  onClose,
  onOpenPsiById,
}: MissionModalProps) {
  useEffect(() => {
    if (!environment) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [environment, onClose]);

  return (
    <AnimatePresence>
      {environment && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mission-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#FDFBE8] border-2 border-[#111111] shadow-[8px_8px_0_#111111] p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className="inline-block px-3 py-0.5 text-xs sm:text-sm font-bold border-2 border-[#111111] text-[#111111]"
                  style={{ backgroundColor: environment.accentColor }}
                >
                  {environment.gravity}
                </span>
                <h3
                  id="mission-modal-title"
                  className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#111111]"
                >
                  {environment.name} Fire Safety Profile
                </h3>
                <p className="text-xs sm:text-sm font-mono text-[#444444] mt-1">
                  {environment.atmosphere}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close mission profile"
                className="w-10 h-10 shrink-0 bg-white border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center hover:bg-[#FFE14D] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-4 text-sm sm:text-base text-[#111111] leading-relaxed">
              {environment.buoyancySummary}
            </p>

            <div className="mt-5 space-y-4">
              <div className="bg-white border-2 border-[#111111] p-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111] mb-2">
                  <ShieldAlert className="w-4 h-4 text-[#F26C57]" />
                  <span>Primary Fire Hazards</span>
                </div>
                <ul className="space-y-1.5 text-sm sm:text-base text-[#111111] list-disc pl-5">
                  {environment.keyHazards.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border-2 border-[#111111] p-4">
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#111111] mb-2">
                  Engineering &amp; Suppression Controls
                </div>
                <ul className="space-y-1.5 text-sm sm:text-base text-[#111111] list-disc pl-5">
                  {environment.safetyControls.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t-2 border-[#111111]/20 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-[#444444]">Related PSI:</span>
              {environment.linkedPsiIds.map((psiId) => (
                <button
                  key={psiId}
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPsiById(psiId);
                  }}
                  className="px-3 py-1 bg-[#FFE14D] border-2 border-[#111111] text-xs sm:text-sm font-mono font-bold hover:bg-[#B4DCF2] cursor-pointer"
                >
                  {psiId} ↗
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface DocModalProps {
  doc: ResearchDocument | null;
  onClose: () => void;
  onOpenPsiById: (psiId: string) => void;
}

export function ResearchDocumentModal({
  doc,
  onClose,
  onOpenPsiById,
}: DocModalProps) {
  useEffect(() => {
    if (!doc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [doc, onClose]);

  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#FDFBE8] border-2 border-[#111111] shadow-[8px_8px_0_#111111] p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-[#444444]">
                  <BookOpen className="w-4 h-4" />
                  <span>{doc.docCode}</span>
                  <span aria-hidden="true">·</span>
                  <span>{doc.year}</span>
                </div>
                <h3
                  id="doc-modal-title"
                  className="mt-1.5 text-xl sm:text-2xl font-extrabold text-[#111111]"
                >
                  {doc.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close document brief"
                className="w-9 h-9 shrink-0 bg-white border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center hover:bg-[#FFE14D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3">
              <span className="inline-block px-2.5 py-0.5 bg-[#B4DCF2] border-2 border-[#111111] text-xs font-bold">
                {doc.provenance}
              </span>
            </div>

            <p className="mt-4 text-sm sm:text-base text-[#111111] leading-relaxed">
              {doc.summary}
            </p>

            <div className="mt-4 bg-white border-2 border-[#111111] p-4">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#444444] mb-2">
                Research Takeaways
              </div>
              <ul className="space-y-1.5 text-sm sm:text-base text-[#111111] list-disc pl-5">
                {doc.keyTakeaways.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-[#444444]">Inspect Investigation:</span>
              {doc.psiRef.split('·').map((rawId) => {
                const cleanId = rawId.trim();
                return (
                  <button
                    key={cleanId}
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPsiById(cleanId);
                    }}
                    className="px-3 py-1 bg-[#FFE14D] border-2 border-[#111111] text-xs sm:text-sm font-mono font-bold hover:bg-[#F7B2D9] cursor-pointer"
                  >
                    {cleanId} ↗
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
