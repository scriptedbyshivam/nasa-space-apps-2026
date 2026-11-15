import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { INTELLIGENCE_TOPICS } from '../../data/nasaFireData';

interface FireSafetyChartsProps {
  onOpenPsiById: (psiId: string) => void;
}

export function FireSafetyCharts({ onOpenPsiById }: FireSafetyChartsProps) {
  const [selectedId, setSelectedId] = useState<string>(INTELLIGENCE_TOPICS[0].id);
  const topic =
    INTELLIGENCE_TOPICS.find((t) => t.id === selectedId) ?? INTELLIGENCE_TOPICS[0];
  const provenanceLabel =
    topic.provenance === 'Illustrative Demonstration Data'
      ? 'Illustrative — not measured telemetry'
      : topic.provenance;
  const provenanceClass =
    topic.provenance === 'NASA Measured Data'
      ? 'bg-[#4ADE80]'
      : topic.provenance === 'Published Research Finding'
        ? 'bg-[#B4DCF2]'
        : topic.provenance === 'AI-Generated Interpretation'
          ? 'bg-[#F26C57]'
          : 'bg-[#F7B2D9]';

  return (
    <div className="space-y-6">
      {/* 6 Interactive Intelligence Tabs */}
      <div className="flex flex-wrap gap-2.5">
        {INTELLIGENCE_TOPICS.map((item) => {
          const active = item.id === topic.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={`px-4 py-2.5 text-sm sm:text-base font-bold border-2 border-[#111111] transition-colors cursor-pointer whitespace-nowrap ${
                active
                  ? 'bg-[#FFE14D] brutal-shadow-sm'
                  : 'bg-white hover:bg-[#FFE14D]/45'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Chart Card */}
      <div className="bg-white border-2 border-[#111111] brutal-shadow p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b-2 border-[#111111]/15">
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#111111]">
              {topic.title}
            </h3>
            <p className="text-sm sm:text-base text-[#222222] max-w-2xl leading-relaxed">
              {topic.insight}
            </p>
          </div>
          <span
            className={`px-3 py-1 text-xs sm:text-sm font-bold border-2 border-[#111111] whitespace-nowrap ${provenanceClass}`}
          >
            {provenanceLabel}
          </span>
        </div>

        <div className="mt-6 h-[300px] sm:h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {topic.chartType === 'area' ? (
              <AreaChart data={topic.data} margin={{ top: 12, right: 18, left: -4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey={topic.xKey} tick={{ fontSize: 13, fill: '#111111' }} />
                <YAxis tick={{ fontSize: 13, fill: '#111111' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #111111',
                    borderRadius: '0px',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 600 }} />
                {topic.series.map((s) => (
                  <Area
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    name={s.label}
                    stroke="#111111"
                    strokeWidth={2.2}
                    fill={s.color}
                    fillOpacity={0.7}
                  />
                ))}
              </AreaChart>
            ) : (
              <BarChart data={topic.data} margin={{ top: 12, right: 18, left: -4, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey={topic.xKey} tick={{ fontSize: 13, fill: '#111111' }} />
                <YAxis tick={{ fontSize: 13, fill: '#111111' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #111111',
                    borderRadius: '0px',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '13px', fontWeight: 600 }} />
                {topic.series.map((s) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={s.label}
                    fill={s.color}
                    stroke="#111111"
                    strokeWidth={1.6}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {topic.provenance === 'Illustrative Demonstration Data' && (
          <p className="mt-4 px-3 py-2 bg-[#F7B2D9]/45 border-2 border-[#111111] text-xs sm:text-sm font-bold text-[#111111]">
            This chart is an illustrative trend built from published qualitative findings. It is
            not a raw NASA PSI telemetry series.
          </p>
        )}

        <div className="mt-5 pt-4 border-t-2 border-[#111111]/15 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs sm:text-sm font-mono text-[#444444]">{topic.unitNote}</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-[#333333]">Evidence:</span>
            {topic.relatedPsiIds.map((psiId) => (
              <button
                key={psiId}
                type="button"
                onClick={() => onOpenPsiById(psiId)}
                className="px-3 py-1 bg-[#FFE14D] border-2 border-[#111111] text-xs sm:text-sm font-mono font-bold hover:bg-[#B4DCF2] transition-colors cursor-pointer"
              >
                {psiId} ↗
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
