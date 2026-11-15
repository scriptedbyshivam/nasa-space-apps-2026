import React, { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import {
  Activity,
  FlaskConical,
  GitCompare,
  Orbit,
  Rocket,
  Sparkles,
} from 'lucide-react';
import {
  MissionEnvironment,
  PSI_EXPERIMENTS,
  PsiExperiment,
  ResearchDocument,
} from './data/nasaFireData';
import { FourPointStar } from './components/science/ScienceArtwork';
import {
  MissionEnvironmentModal,
  ResearchDocumentModal,
} from './components/science/ScienceModals';
import { AppPage, OverviewPage } from './components/science/pages/OverviewPage';
import { FloatingDock, FloatingDockItem } from './components/ui/FloatingDock';

const ExperimentsPage = lazy(() =>
  import('./components/science/pages/ExperimentsPage').then((module) => ({
    default: module.ExperimentsPage,
  }))
);
const ComparePage = lazy(() =>
  import('./components/science/pages/ComparePage').then((module) => ({
    default: module.ComparePage,
  }))
);
const IntelligencePage = lazy(() =>
  import('./components/science/pages/IntelligencePage').then((module) => ({
    default: module.IntelligencePage,
  }))
);
const AskAIPage = lazy(() =>
  import('./components/science/pages/AskAIPage').then((module) => ({
    default: module.AskAIPage,
  }))
);
const ExperimentDetailPage = lazy(() =>
  import('./components/science/pages/ExperimentDetailPage').then((module) => ({
    default: module.ExperimentDetailPage,
  }))
);

const NAV_ITEMS: {
  id: AppPage;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'experiments', label: 'Experiments', Icon: FlaskConical },
  { id: 'compare', label: 'Compare', Icon: GitCompare },
  { id: 'intelligence', label: 'Intelligence', Icon: Activity },
  { id: 'ask-ai', label: 'Ask AI', Icon: Sparkles },
];

const PAGE_LABELS: Record<AppPage, string> = {
  overview: 'Back to Overview',
  experiments: 'Back to Experiments',
  compare: 'Back to Compare',
  intelligence: 'Back to Intelligence',
  'ask-ai': 'Back to Ask AI',
};

function parseHashState(hash: string): { page: AppPage; experiment: PsiExperiment | null } {
  const clean = hash.replace(/^#\/?/, '').trim().toLowerCase();
  if (clean.startsWith('experiment/')) {
    const slug = decodeURIComponent(clean.split('/')[1] || '');
    const exp =
      PSI_EXPERIMENTS.find(
        (e) => e.id.toLowerCase() === slug || e.psiId.toLowerCase() === slug
      ) ?? null;
    return { page: 'experiments', experiment: exp };
  }
  if (
    clean === 'experiments' ||
    clean === 'compare' ||
    clean === 'intelligence' ||
    clean === 'ask-ai' ||
    clean === 'overview'
  ) {
    return { page: clean as AppPage, experiment: null };
  }
  return { page: 'overview', experiment: null };
}

export default function App() {
  const initialHashState = parseHashState(window.location.hash);
  const [activePage, setActivePage] = useState<AppPage>(initialHashState.page);
  const [returnPage, setReturnPage] = useState<AppPage>('experiments');
  const [activeExperiment, setActiveExperiment] = useState<PsiExperiment | null>(
    initialHashState.experiment
  );
  const [selectedEnvironment, setSelectedEnvironment] = useState<MissionEnvironment | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ResearchDocument | null>(null);
  const [queuedCopilotPrompt, setQueuedCopilotPrompt] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.backgroundColor = '#FDFBE8';
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const state = parseHashState(window.location.hash);
      setActivePage(state.page);
      setActiveExperiment(state.experiment);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (page: AppPage) => {
    setActiveExperiment(null);
    setActivePage(page);
    window.location.hash = page === 'overview' ? '' : `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openExperimentPage = (exp: PsiExperiment) => {
    if (!activeExperiment) {
      setReturnPage(activePage);
    }
    setActiveExperiment(exp);
    window.location.hash = `#/experiment/${exp.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPsiById = (psiId: string) => {
    const normalized = psiId.trim().toUpperCase();
    const match = PSI_EXPERIMENTS.find(
      (exp) => exp.psiId.toUpperCase() === normalized || exp.id.toUpperCase() === normalized
    );
    if (match) {
      openExperimentPage(match);
    }
  };

  const handleAskCopilotAndNavigate = (prompt: string) => {
    setQueuedCopilotPrompt(prompt);
    navigateTo('ask-ai');
  };

  const viewKey = activeExperiment ? `experiment-${activeExperiment.id}` : activePage;

  const navDockItems: FloatingDockItem[] = NAV_ITEMS.map(({ id, label, Icon }) => {
    const isActive = activeExperiment ? id === 'experiments' : activePage === id;
    const isAskAi = id === 'ask-ai';
    return {
      id,
      title: label,
      icon: <Icon className="w-5 h-5" />,
      active: isActive,
      accentBg: isAskAi ? '#B4DCF2' : id === 'intelligence' ? '#F7B2D9' : '#FFE14D',
      onClick: () => navigateTo(id),
    };
  });

  const dockItems: FloatingDockItem[] = [
    ...navDockItems.slice(0, 2),
    {
      id: 'brand-home',
      title: 'Flame in Freefall · Home',
      icon: <Rocket className="w-5 h-5" />,
      isBrand: true,
      active: activePage === 'overview' && !activeExperiment,
      onClick: () => navigateTo('overview'),
    },
    ...navDockItems.slice(2),
  ];

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#FDFBE8] text-[#111111] flex flex-col overflow-x-clip">
        {/* Active Page Content */}
        <main className="flex-1">
          <Suspense
            fallback={
              <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10 py-24 text-center">
                <div className="inline-block px-6 py-4 bg-white border-2 border-[#111111] brutal-shadow-sm text-sm sm:text-base font-bold">
                  Loading NASA PSI view…
                </div>
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={viewKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
              {activeExperiment ? (
                <ExperimentDetailPage
                  experiment={activeExperiment}
                  backLabel={PAGE_LABELS[returnPage]}
                  onBack={() => navigateTo(returnPage)}
                  onSelectExperiment={openExperimentPage}
                  onNavigatePage={navigateTo}
                  onAskCopilot={handleAskCopilotAndNavigate}
                />
              ) : (
                <>
                  {activePage === 'overview' && (
                    <OverviewPage
                      onNavigatePage={navigateTo}
                      onSelectExperiment={openExperimentPage}
                      onSelectEnvironment={(env) => setSelectedEnvironment(env)}
                      onAskCopilot={handleAskCopilotAndNavigate}
                    />
                  )}

                  {activePage === 'experiments' && (
                    <ExperimentsPage
                      onSelectExperiment={openExperimentPage}
                      onNavigatePage={navigateTo}
                    />
                  )}

                  {activePage === 'compare' && (
                    <ComparePage onSelectExperiment={openExperimentPage} />
                  )}

                  {activePage === 'intelligence' && (
                    <IntelligencePage
                      onSelectDocument={(doc) => setSelectedDocument(doc)}
                      onOpenPsiById={handleOpenPsiById}
                    />
                  )}

                  {activePage === 'ask-ai' && (
                    <AskAIPage
                      queuedPrompt={queuedCopilotPrompt}
                      onClearQueuedPrompt={() => setQueuedCopilotPrompt(null)}
                      onOpenPsiById={handleOpenPsiById}
                    />
                  )}
                </>
              )}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>

        {/* NASA-Tech Neu-Brutalism Footer */}
        <footer className="border-t-2 border-[#111111] bg-[#FDFBE8] mt-10">
          <div className="max-w-[1360px] mx-auto px-4 sm:px-8 lg:px-10 pt-8 pb-24 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo('overview')}
                className="inline-flex items-center gap-2.5 text-base font-extrabold text-[#111111] cursor-pointer"
              >
                <span className="w-8 h-8 bg-[#FFE14D] border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center shrink-0">
                  <FourPointStar className="w-4 h-4" />
                </span>
                <span>FLAME IN FREEFALL</span>
              </button>
              <span className="hidden sm:inline text-xs font-mono font-bold text-[#555555]">
                · NASA Space Apps Challenge 2026
              </span>
            </div>

            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-[#222222] text-center">
              <Orbit className="w-4 h-4 shrink-0" />
              <span>Spacecraft · ISS · Lunar 1/6g · Mars 3/8g · 14 NASA PSI Studies</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-bold">
              <button
                type="button"
                onClick={() => navigateTo('experiments')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border-2 border-[#111111] bg-white hover:bg-[#FFE14D] transition-colors cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>14 PSI</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('compare')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border-2 border-[#111111] bg-white hover:bg-[#FFE14D] transition-colors cursor-pointer"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('intelligence')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border-2 border-[#111111] bg-white hover:bg-[#F7B2D9] transition-colors cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Intelligence</span>
              </button>
              <button
                type="button"
                onClick={() => navigateTo('ask-ai')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border-2 border-[#111111] bg-[#B4DCF2] hover:bg-[#FFE14D] transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        </footer>

        {/* Bottom Fixed Floating Dock Navigation */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <FloatingDock items={dockItems} />
        </div>

        <MissionEnvironmentModal
          environment={selectedEnvironment}
          onClose={() => setSelectedEnvironment(null)}
          onOpenPsiById={handleOpenPsiById}
        />

        <ResearchDocumentModal
          doc={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onOpenPsiById={handleOpenPsiById}
        />
      </div>
    </MotionConfig>
  );
}
