import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  ArrowUpRight,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { PSI_EXPERIMENTS } from '../../../data/nasaFireData';
import { AskScienceCopilot, CopilotMessage } from '../AskScienceCopilot';

interface AskAIPageProps {
  queuedPrompt: string | null;
  onClearQueuedPrompt: () => void;
  onOpenPsiById: (psiId: string) => void;
}

interface ChatThread {
  id: string;
  title: string;
  messages: CopilotMessage[];
}

interface AiStatus {
  geminiConfigured: boolean;
  model: string | null;
  mode: string;
}

const STORAGE_KEY = 'flame_freefall_chat_threads_v1';
const QUICK_REFERENCE_IDS = ['PSI-69', 'PSI-98', 'PSI-26', 'PSI-102', 'PSI-20', 'PSI-159'];

function createEmptyThread(): ChatThread {
  return {
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: 'New research chat',
    messages: [],
  };
}

function deriveThreadTitle(messages: CopilotMessage[], fallback: string): string {
  const firstUser = messages.find((m) => m.role === 'user');
  if (!firstUser) return fallback;
  const clean = firstUser.content.trim().replace(/\s+/g, ' ');
  return clean.length > 42 ? `${clean.slice(0, 42)}…` : clean;
}

function loadInitialThreads(): ChatThread[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse failures
  }
  return [createEmptyThread()];
}

export function AskAIPage({
  queuedPrompt,
  onClearQueuedPrompt,
  onOpenPsiById,
}: AskAIPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [threads, setThreads] = useState<ChatThread[]>(loadInitialThreads);
  const [activeThreadId, setActiveThreadId] = useState<string>(() => threads[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState<AiStatus | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setAiStatus({
          geminiConfigured: Boolean(data.geminiConfigured),
          model: typeof data.model === 'string' ? data.model : null,
          mode: typeof data.mode === 'string' ? data.mode : 'grounded-knowledge-base',
        });
      })
      .catch(() => {
        if (active) {
          setAiStatus({
            geminiConfigured: false,
            model: null,
            mode: 'grounded-knowledge-base',
          });
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(threads.slice(0, 15)));
    } catch {
      // Ignore storage quota errors
    }
  }, [threads]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.chatgpt-shell-reveal', {
        y: 12,
        opacity: 0,
        duration: 0.36,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Ensure incoming queuedPrompt (from experiment/environment modals) gets a fresh chat if active chat already has replies
  const activeThread =
    threads.find((t) => t.id === activeThreadId) ?? threads[0];

  const handleNewChat = () => {
    const existingEmpty = threads.find((t) => t.messages.length === 0);
    if (existingEmpty) {
      setActiveThreadId(existingEmpty.id);
      setMobileDrawerOpen(false);
      return;
    }
    const fresh = createEmptyThread();
    setThreads((prev) => [fresh, ...prev]);
    setActiveThreadId(fresh.id);
    setMobileDrawerOpen(false);
  };

  useEffect(() => {
    if (queuedPrompt && queuedPrompt.trim() && activeThread.messages.length > 0) {
      const fresh = createEmptyThread();
      setThreads((prev) => [fresh, ...prev]);
      setActiveThreadId(fresh.id);
    }
  }, [queuedPrompt]);

  const handleDeleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (remaining.length === 0) {
        const fresh = createEmptyThread();
        setActiveThreadId(fresh.id);
        return [fresh];
      }
      if (activeThreadId === id) {
        setActiveThreadId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleMessagesChange = (
    updater: (prev: CopilotMessage[]) => CopilotMessage[]
  ) => {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== activeThread.id) return thread;
        const nextMessages = updater(thread.messages);
        return {
          ...thread,
          messages: nextMessages,
          title: deriveThreadTitle(nextMessages, 'New research chat'),
        };
      })
    );
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[#FFFDF2]">
      {/* Top + New Chat Button */}
      <div className="p-3.5 border-b-2 border-[#111111] flex items-center gap-2">
        <button
          type="button"
          onClick={handleNewChat}
          className="flex-1 inline-flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#FFE14D] border-2 border-[#111111] brutal-shadow-sm hover:bg-[#B4DCF2] transition-colors text-sm font-extrabold text-[#111111] cursor-pointer whitespace-nowrap"
        >
          <span>New Chat</span>
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => setMobileDrawerOpen(false)}
          aria-label="Close sidebar"
          className="md:hidden w-10 h-10 border-2 border-[#111111] bg-white flex items-center justify-center cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Conversations & PSI Reference */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-6">
        {/* Chat Threads */}
        <div className="space-y-2">
          <div className="px-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#555555]">
            Conversations
          </div>
          <div className="space-y-1.5">
            {threads.map((thread) => {
              const isSelected = thread.id === activeThread.id;
              return (
                <div
                  key={thread.id}
                  className={`group flex items-center gap-1.5 border-2 transition-colors ${
                    isSelected
                      ? 'bg-[#B4DCF2] border-[#111111] shadow-[2px_2px_0_#111111]'
                      : 'bg-white border-transparent hover:border-[#111111] hover:bg-[#FFE14D]/35'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveThreadId(thread.id);
                      setMobileDrawerOpen(false);
                    }}
                    className="flex-1 min-w-0 flex items-center gap-2 px-2.5 py-2 text-left cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-[#111111]" />
                    <span className="text-xs sm:text-sm font-bold text-[#111111] truncate">
                      {thread.title}
                    </span>
                  </button>
                  {threads.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteThread(thread.id, e)}
                      aria-label={`Delete ${thread.title}`}
                      className="p-1.5 mr-1 text-[#555555] hover:text-[#C81E1E] opacity-70 group-hover:opacity-100 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick PSI Reference */}
        <div className="space-y-2 pt-3 border-t-2 border-[#111111]/15">
          <div className="px-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[#555555]">
            Quick PSI Reference
          </div>
          <div className="space-y-1.5">
            {QUICK_REFERENCE_IDS.map((psiId) => {
              const exp = PSI_EXPERIMENTS.find((e) => e.psiId === psiId);
              if (!exp) return null;
              return (
                <button
                  key={exp.id}
                  type="button"
                  onClick={() => onOpenPsiById(exp.psiId)}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-2 bg-white border-2 border-[#111111] hover:bg-[#F7B2D9]/60 transition-colors text-left cursor-pointer"
                >
                  <span className="text-xs font-bold text-[#111111] truncate">
                    <span className="font-mono">{exp.psiId}</span> · {exp.name}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sidebar Caption */}
      <div className="p-3.5 border-t-2 border-[#111111] bg-white text-xs font-bold text-[#444444]">
        NASA PSI · 14 Microgravity Studies ·{' '}
        {aiStatus?.geminiConfigured ? 'Gemini ready' : 'grounded local fallback'}
      </div>
    </div>
  );

  const readyPrompt = activeThread.messages.length === 0 ? queuedPrompt : null;

  return (
    <div ref={rootRef} className="py-4 sm:py-6">
      <div className="max-w-[1360px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="chatgpt-shell-reveal relative bg-[#FDFBE8] border-2 border-[#111111] brutal-shadow-lg flex overflow-hidden h-[calc(100vh-118px)] min-h-[540px] max-h-[820px]">
          {/* Desktop Left Sidebar */}
          {sidebarOpen && (
            <aside className="hidden md:block w-[270px] lg:w-[290px] shrink-0 border-r-2 border-[#111111]">
              {renderSidebarContent()}
            </aside>
          )}

          {/* Mobile Drawer Sidebar */}
          {mobileDrawerOpen && (
            <div className="md:hidden fixed inset-0 z-40 flex">
              <div
                className="fixed inset-0 bg-[#111111]/45"
                onClick={() => setMobileDrawerOpen(false)}
              />
              <aside className="relative z-10 w-[285px] max-w-[85vw] h-full border-r-2 border-[#111111] bg-[#FFFDF2]">
                {renderSidebarContent()}
              </aside>
            </div>
          )}

          {/* Main ChatGPT Conversation Column */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#FDFBE8]">
            {/* Minimal Chat Workspace Top Bar */}
            <div className="shrink-0 px-4 sm:px-6 py-3 bg-white border-b-2 border-[#111111] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen((v) => !v)}
                  aria-label={sidebarOpen ? 'Hide chat sidebar' : 'Show chat sidebar'}
                  className="hidden md:inline-flex w-9 h-9 border-2 border-[#111111] bg-[#FDFBE8] hover:bg-[#FFE14D] items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  {sidebarOpen ? (
                    <PanelLeftClose className="w-4 h-4" />
                  ) : (
                    <PanelLeftOpen className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(true)}
                  aria-label="Open chat history"
                  className="md:hidden inline-flex w-9 h-9 border-2 border-[#111111] bg-[#FDFBE8] hover:bg-[#FFE14D] items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>

                <div className="min-w-0 flex items-center gap-2">
                  <span className="text-sm sm:text-base font-extrabold text-[#111111] truncate">
                    {activeThread.messages.length > 0
                      ? activeThread.title
                      : 'Ask the Science'}
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#555555] whitespace-nowrap">
                    <span
                      aria-hidden="true"
                      className={`w-2 h-2 rounded-full border border-[#111111] ${
                        aiStatus?.geminiConfigured ? 'bg-[#4ADE80]' : 'bg-[#FFE14D]'
                      }`}
                    />
                    {aiStatus?.geminiConfigured
                      ? `Gemini · ${aiStatus.model ?? 'configured'}`
                      : 'Grounded local mode'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {(!sidebarOpen || activeThread.messages.length > 0) && (
                  <button
                    type="button"
                    onClick={handleNewChat}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFE14D] border-2 border-[#111111] shadow-[2px_2px_0_#111111] hover:bg-[#B4DCF2] transition-colors text-xs sm:text-sm font-bold text-[#111111] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>New Chat</span>
                  </button>
                )}
              </div>
            </div>

            {/* ChatGPT Messages + Bottom Composer */}
            <AskScienceCopilot
              messages={activeThread.messages}
              onMessagesChange={handleMessagesChange}
              queuedPrompt={readyPrompt}
              onClearQueuedPrompt={onClearQueuedPrompt}
              onOpenPsiById={onOpenPsiById}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
