import React, { useState } from 'react';
import { PSI_EXPERIMENTS, PsiExperiment } from '../../data/nasaFireData';

interface ExperimentComparisonPanelProps {
  onSelectExperiment: (exp: PsiExperiment) => void;
  selectedIds?: string[];
  onChangeSelectedIds?: (ids: string[]) => void;
}

const BADGE_COLORS = [
  { bg: '#FFE14D', border: '#111111' },
  { bg: '#B4DCF2', border: '#111111' },
  { bg: '#F7B2D9', border: '#111111' },
];

export function ExperimentComparisonPanel({
  onSelectExperiment,
  selectedIds: controlledIds,
  onChangeSelectedIds,
}: ExperimentComparisonPanelProps) {
  const [internalIds, setInternalIds] = useState<string[]>([
    'psi-69',
    'psi-98',
    'psi-26',
  ]);

  const selectedIds = controlledIds ?? internalIds;
  const setSelectedIds = onChangeSelectedIds ?? setInternalIds;

  const toggleExperiment = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else if (selectedIds.length >= 3) {
      setSelectedIds([...selectedIds.slice(1), id]);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const compared = selectedIds
    .map((id) => PSI_EXPERIMENTS.find((e) => e.id === id))
    .filter((e): e is PsiExperiment => Boolean(e));

  const rows: { label: string; getValue: (e: PsiExperiment) => string }[] = [
    {
      label: 'Key measured result',
      getValue: (e) =>
        (e.resultHighlights ?? [])
          .map((highlight) => `${highlight.label}: ${highlight.value}`)
          .join('; ') || 'No structured result recorded.',
    },
    { label: 'Fuel type', getValue: (e) => e.parameters.fuelType },
    { label: 'Oxygen concentration', getValue: (e) => e.parameters.oxygenConcentration },
    { label: 'Pressure', getValue: (e) => e.parameters.pressure },
    { label: 'Airflow', getValue: (e) => e.parameters.airflow },
    { label: 'Temperature', getValue: (e) => e.parameters.temperature },
    {
      label: 'Experimental environment',
      getValue: (e) => e.parameters.experimentalEnvironment,
    },
    { label: 'Suppression method', getValue: (e) => e.parameters.suppressionMethod },
    {
      label: 'PSI verification',
      getValue: (e) =>
        e.psiVerification === 'unverified'
          ? 'Unverified PSI identifier — treat as provisional'
          : 'Verified against local dataset',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Selector Chips */}
      <div>
        <div className="text-sm sm:text-base font-bold text-[#222222] mb-3">
          Pick 2–3 NASA PSI Investigations to Compare Side-by-Side:
        </div>
        <div className="flex flex-wrap gap-2">
          {PSI_EXPERIMENTS.map((exp) => {
            const active = selectedIds.includes(exp.id);
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => toggleExperiment(exp.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-bold border-2 border-[#111111] transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#FFE14D] brutal-shadow-sm'
                    : 'bg-white hover:bg-[#FFE14D]/40'
                }`}
              >
                <span className="font-mono">{exp.psiId}</span>: {exp.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Wireframe Comparison Box */}
      <div className="px-2 sm:px-3">
        <div className="relative bg-white border-2 border-[#111111] brutal-shadow p-5 sm:p-8 space-y-6">
          {/* Investigation Timeline Header Rows (1, 2, 3) */}
          <div className="space-y-4">
            {compared.map((exp, idx) => {
              const badge = BADGE_COLORS[idx % BADGE_COLORS.length];
              return (
                <div
                  key={exp.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#111111]/15 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 shrink-0 border-2 border-[#111111] flex items-center justify-center text-lg font-extrabold text-[#111111] tabular-nums"
                      style={{ backgroundColor: badge.bg }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-extrabold text-[#111111]">
                        <span className="font-mono">{exp.psiId}</span> · {exp.name}{' '}
                        <span className="font-semibold text-[#444444]">
                          — {exp.experimentType}
                        </span>
                      </div>
                      <p className="text-sm text-[#333333] mt-1 leading-relaxed">
                        {exp.researchObjective}
                      </p>
                      <div className="text-xs sm:text-sm font-mono text-[#555555] mt-1 tabular-nums">
                        {exp.facility} · {exp.year}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectExperiment(exp)}
                    className="self-start sm:self-center px-4 py-2 bg-[#B4DCF2] border-2 border-[#111111] brutal-shadow-sm text-xs sm:text-sm font-bold text-[#111111] hover:bg-[#FFE14D] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Inspect ↗
                  </button>
                </div>
              );
            })}
          </div>

          {/* 7-Parameter Comparison Table */}
          <div className="overflow-x-auto border-2 border-[#111111]">
            <table className="w-full text-left border-collapse text-sm sm:text-base">
              <thead>
                <tr className="bg-[#FDFBE8] border-b-2 border-[#111111]">
                  <th className="p-3.5 font-extrabold text-[#111111] w-52">Parameter</th>
                  {compared.map((exp) => (
                    <th
                      key={exp.id}
                      className="p-3.5 font-extrabold text-[#111111] border-l-2 border-[#111111]/25"
                    >
                      <span className="font-mono">{exp.psiId}</span> · {exp.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#111111]/20">
                {rows.map((row) => (
                  <tr key={row.label} className="hover:bg-[#FDFBE8]/70">
                    <td className="p-3.5 font-bold text-[#111111] bg-[#FAFAFA]">
                      {row.label}
                    </td>
                    {compared.map((exp) => {
                      const val = row.getValue(exp);
                      const isMissing = val === 'Experimental data not available.';
                      return (
                        <td
                          key={exp.id}
                          className={`p-3.5 border-l-2 border-[#111111]/15 leading-snug ${
                            isMissing ? 'italic text-[#555555]' : 'text-[#111111]'
                          }`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
            Values are recorded test conditions and published findings, not a controlled
            side-by-side reanalysis. “Key measured result” is omitted where the local NASA PSI
            record has no structured number.
          </p>
        </div>
      </div>
    </div>
  );
}
