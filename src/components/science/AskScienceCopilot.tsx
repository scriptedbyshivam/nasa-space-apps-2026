import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  Check,
  Copy,
  Flame,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { SUGGESTED_COPILOT_QUESTIONS } from '../../data/nasaFireData';
import { SpikyStarburst } from './ScienceArtwork';

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  referencedIds?: string[];
  citations?: string[];
  dataNotes?: string;
  source?: 'gemini-live' | 'grounded-knowledge-base';
  model?: string;
  fallbackReason?: string;
}

interface AskScienceCopilotProps {
  messages: CopilotMessage[];
  onMessagesChange: (updater: (prev: CopilotMessage[]) => CopilotMessage[]) => void;
  queuedPrompt?: string | null;
  onClearQueuedPrompt?: () => void;
  onOpenPsiById: (psiId: string) => void;
}

export function AskScienceCopilot({
  messages,
  onMessagesChange,
  queuedPrompt,
  onClearQueuedPrompt,
  onOpenPsiById,
}: AskScienceCopilotProps) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPromptDrawer, setShowPromptDrawer] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const sendQuestion = async (rawQuestion: string) => {
    const question = rawQuestion.trim();
    if (!question || loading) return;

    setError('');
    setShowPromptDrawer(false);

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
    };

    const nextHistory = [...messages, userMsg];
    onMessagesChange(() => nextHistory);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          history: nextHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const rawBody = await response.text();
      let data: Record<string, unknown> = {};
      try {
        data = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        if (!response.ok) {
          throw new Error(
            rawBody.trim() ||
              `The copilot server returned ${response.status}. Please try again.`
          );
        }
        throw new Error('The copilot server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(
          typeof data.error === 'string'
            ? data.error
            : `The copilot server returned ${response.status}. Please try again.`
        );
      }

      const aiMsg: CopilotMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content:
          typeof data.answer === 'string' && data.answer.trim()
            ? data.answer
            : 'The copilot returned an empty answer. Please try again.',
        referencedIds: Array.isArray(data.referencedIds) ? data.referencedIds : [],
        citations: Array.isArray(data.citations) ? data.citations : [],
        dataNotes: typeof data.dataNotes === 'string' ? data.dataNotes : undefined,
        source: data.source === 'gemini-live' ? 'gemini-live' : 'grounded-knowledge-base',
        model: typeof data.model === 'string' ? data.model : undefined,
        fallbackReason:
          typeof data.fallbackReason === 'string' ? data.fallbackReason : undefined,
      };
      onMessagesChange((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not reach the research copilot endpoint.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queuedPrompt && queuedPrompt.trim()) {
      const promptToRun = queuedPrompt;
      onClearQueuedPrompt?.();
      void sendQuestion(promptToRun);
    }
  }, [queuedPrompt]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendQuestion(input);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendQuestion(input);
  };

  const handleCopy = async (msg: CopilotMessage) => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId((curr) => (curr === msg.id ? null : curr)), 1800);
    } catch {
      // Clipboard unavailable in restricted context
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Scrollable Chat Viewport */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-8"
      >
        <div
          className={`max-w-3xl mx-auto w-full ${
            isEmpty
              ? 'min-h-full flex flex-col items-center justify-center py-8 sm:py-10'
              : 'py-6 sm:py-8 space-y-7'
          }`}
        >
          {/* Classic ChatGPT Welcome Screen when chat is empty */}
          {isEmpty ? (
            <div className="w-full space-y-7 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="-rotate-6">
                  <SpikyStarburst
                    color="#F7B2D9"
                    withFlame
                    className="w-16 h-16 sm:w-20 sm:h-20"
                  />
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111]">
                  <span className="relative inline-block z-0">
                    <span className="relative z-10">Ask the Science.</span>
                    <span
                      aria-hidden="true"
                      className="absolute left-0 right-0 bottom-1 h-3.5 bg-[#FFE14D] -z-10"
                    />
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-[#333333] max-w-xl leading-relaxed">
                  Explore microgravity flames, material flammability, oxygen and airflow
                  effects, and Artemis lunar or Mars habitat fire safety grounded in 14 NASA
                  PSI investigations.
                </p>
              </div>

              {/* 2x2 ChatGPT-style Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {SUGGESTED_COPILOT_QUESTIONS.slice(0, 4).map((q, idx) => {
                  const accents = [
                    'hover:bg-[#FFE14D]',
                    'hover:bg-[#B4DCF2]',
                    'hover:bg-[#F7B2D9]',
                    'hover:bg-[#FFE14D]',
                  ];
                  return (
                    <button
                      key={q}
                      type="button"
                      disabled={loading}
                      onClick={() => void sendQuestion(q)}
                      className={`group p-4 bg-white border-2 border-[#111111] brutal-shadow-sm ${
                        accents[idx % accents.length]
                      } transition-colors cursor-pointer flex flex-col justify-between gap-2 disabled:opacity-60`}
                    >
                      <span className="text-sm sm:text-[15px] font-bold text-[#111111] leading-snug">
                        {q}
                      </span>
                      <span className="text-xs font-bold text-[#555555] group-hover:text-[#111111]">
                        Ask Copilot →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Active Conversation Thread */
            <>
              {messages.map((msg) => {
                const isUser = msg.role === 'user';

                if (isUser) {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[85%] sm:max-w-[78%] bg-[#B4DCF2] border-2 border-[#111111] shadow-[3px_3px_0_#111111] rounded-2xl rounded-tr-xs px-4 py-3 text-sm sm:text-base font-bold text-[#111111] leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex items-start gap-3 sm:gap-4">
                    {/* Assistant Avatar */}
                    <div
                      aria-hidden="true"
                      className="w-9 h-9 shrink-0 bg-[#FFE14D] border-2 border-[#111111] shadow-[2px_2px_0_#111111] rounded-xl flex items-center justify-center mt-0.5"
                    >
                      <Flame className="w-4 h-4 text-[#111111]" />
                    </div>

                    {/* Clean ChatGPT-style Editorial Response Body */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold text-[#555555]">
                          <span className="text-[#111111] font-extrabold">
                            AI Research Copilot
                          </span>
                          <span aria-hidden="true">·</span>
                          {msg.source === 'gemini-live' ? (
                            <span className="px-2 py-0.5 bg-[#4ADE80] border border-[#111111] text-[10px] font-mono uppercase tracking-wide text-[#111111]">
                              Live Gemini{msg.model ? ` · ${msg.model}` : ''}
                            </span>
                          ) : msg.source === 'grounded-knowledge-base' ? (
                            <span className="px-2 py-0.5 bg-[#FFE14D] border border-[#111111] text-[10px] font-mono uppercase tracking-wide text-[#111111]">
                              Grounded local mode
                            </span>
                          ) : (
                            <span>AI-Generated Interpretation</span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => void handleCopy(msg)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-[#333333] hover:text-[#111111] hover:bg-white border border-transparent hover:border-[#111111] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                          title="Copy answer"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#111111]" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[15px] sm:text-base leading-relaxed text-[#111111] whitespace-pre-line">
                        {msg.content}
                      </div>

                      {msg.referencedIds && msg.referencedIds.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <span className="text-xs font-bold uppercase tracking-wide text-[#555555]">
                            Sources:
                          </span>
                          {msg.referencedIds.map((id) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => onOpenPsiById(id)}
                              className="px-2.5 py-1 bg-[#FFE14D] border-2 border-[#111111] shadow-[2px_2px_0_#111111] text-xs font-mono font-bold hover:bg-[#B4DCF2] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                            >
                              {id} ↗
                            </button>
                          ))}
                        </div>
                      )}

                      {((msg.citations && msg.citations.length > 0) || msg.dataNotes) && (
                        <div className="pt-2.5 border-t border-[#111111]/20 text-xs sm:text-sm text-[#444444] space-y-1">
                          {msg.citations?.map((cite) => (
                            <div key={cite}>• {cite}</div>
                          ))}
                          {msg.fallbackReason && (
                            <div className="font-bold text-[#8A4B00]">
                              {msg.fallbackReason}
                            </div>
                          )}
                          {msg.dataNotes && (
                            <div className="italic text-[#555555]">{msg.dataNotes}</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    aria-hidden="true"
                    className="w-9 h-9 shrink-0 bg-[#FFE14D] border-2 border-[#111111] shadow-[2px_2px_0_#111111] rounded-xl flex items-center justify-center"
                  >
                    <Flame className="w-4 h-4 text-[#111111]" />
                  </div>
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white border-2 border-[#111111] shadow-[2px_2px_0_#111111] text-sm font-bold text-[#111111]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Synthesizing NASA PSI findings...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Sticky ChatGPT Composer */}
      <div className="shrink-0 px-4 sm:px-8 pb-3 sm:pb-4 pt-2 bg-[#FDFBE8]">
        <div className="max-w-3xl mx-auto w-full space-y-2">
          {error && (
            <p className="text-xs sm:text-sm font-bold text-[#C81E1E]" role="alert">
              {error}
            </p>
          )}

          {showPromptDrawer && (
            <div className="p-3 bg-white border-2 border-[#111111] brutal-shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#555555]">
                  Suggested Research Questions
                </span>
                <button
                  type="button"
                  onClick={() => setShowPromptDrawer(false)}
                  className="text-xs font-bold underline cursor-pointer"
                >
                  Close
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_COPILOT_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={loading}
                    onClick={() => void sendQuestion(q)}
                    className="px-3 py-1.5 text-xs sm:text-sm font-bold bg-[#FDFBE8] border-2 border-[#111111] hover:bg-[#FFE14D] transition-colors cursor-pointer text-left"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-[#111111] brutal-shadow rounded-2xl p-2.5 sm:p-3 focus-within:ring-2 focus-within:ring-[#FFE14D]"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Message NASA PSI Copilot (e.g., How do cool flames in FLEX differ from SAFFIRE?)"
              className="w-full resize-none bg-transparent px-2 py-1 text-sm sm:text-base text-[#111111] placeholder:text-[#666666] focus:outline-none max-h-36 leading-relaxed"
            />

            <div className="flex items-center justify-between gap-2 pt-2 mt-1 border-t border-[#111111]/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPromptDrawer((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 border-[#111111] rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    showPromptDrawer
                      ? 'bg-[#FFE14D]'
                      : 'bg-[#FDFBE8] hover:bg-[#F7B2D9]/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F26C57]" />
                  <span>Prompts</span>
                </button>
                <span className="hidden sm:inline text-xs text-[#666666] font-medium">
                  Enter to send · Shift + Enter for new line
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl bg-[#FFE14D] border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center text-[#111111] hover:bg-[#B4DCF2] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                )}
              </button>
            </div>
          </form>

          <p className="text-[11px] sm:text-xs text-center text-[#555555]">
            Answers are grounded in 14 NASA PSI combustion studies. Live Gemini replies are
            constrained to the local dataset and labelled; fallback replies use deterministic
            retrieval. Open any PSI tag to verify measured parameters.
          </p>
        </div>
      </div>
    </div>
  );
}
