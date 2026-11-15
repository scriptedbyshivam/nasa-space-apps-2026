import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INTELLIGENCE_TOPICS,
  PSI_EXPERIMENTS,
  RESEARCH_LIBRARY_DOCS,
  type PsiExperiment,
} from './src/data/nasaFireData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash';

app.use(express.json({ limit: '32kb' }));

const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
const isGeminiConfigured =
  Boolean(geminiApiKey) && geminiApiKey !== 'MY_GEMINI_API_KEY';

const ai = isGeminiConfigured
  ? new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'flame-in-freefall',
        },
      },
    })
  : null;

const experimentsById = new Map(
  PSI_EXPERIMENTS.map((experiment) => [experiment.psiId, experiment])
);
const knownPsiIds = new Set(experimentsById.keys());
const DEFAULT_EXPERIMENT_IDS = ['PSI-26', 'PSI-69', 'PSI-98', 'PSI-102'];

interface CopilotStructuredResponse {
  answer: string;
  referencedIds: string[];
  dataNotes: string;
}

interface CopilotApiResponse extends CopilotStructuredResponse {
  source: 'gemini-live' | 'grounded-knowledge-base';
  model: string;
  citations: string[];
  fallbackReason?: string;
}

interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'what', 'how', 'why',
  'does', 'did', 'was', 'were', 'are', 'is', 'in', 'on', 'of', 'to', 'a',
  'an', 'about', 'tell', 'me', 'can', 'you', 'please', 'nasa', 'psi',
  'experiment', 'experiments', 'study', 'studies', 'research', 'space',
  'microgravity', 'fire', 'combustion', 'spacecraft',
]);

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function findExplicitPsiIds(question: string): string[] {
  const matches = question.match(/\bPSI[\s-]?(\d{1,3})\b/gi) ?? [];
  return [
    ...new Set(
      matches
        .map((match) => `PSI-${match.replace(/\D/g, '')}`)
        .filter((id) => knownPsiIds.has(id))
    ),
  ];
}

function experimentSearchText(experiment: PsiExperiment): string {
  return [
    experiment.name,
    experiment.fullName,
    experiment.experimentType,
    experiment.category,
    experiment.facility,
    experiment.researchObjective,
    experiment.shortDescription,
    experiment.overviewSummary,
    experiment.keyFindings.join(' '),
    experiment.parameters.fuelType,
    experiment.parameters.oxygenConcentration,
    experiment.parameters.pressure,
    experiment.parameters.airflow,
    experiment.parameters.suppressionMethod,
    experiment.publications.map((publication) => publication.title).join(' '),
  ]
    .join(' ')
    .toLowerCase();
}

function rankExperiments(question: string, limit = 4): PsiExperiment[] {
  const explicitIds = findExplicitPsiIds(question);
  const tokens = [...new Set(tokenize(question))];
  const lowerQuestion = question.toLowerCase();

  const ranked = PSI_EXPERIMENTS.map((experiment) => {
    const searchText = experimentSearchText(experiment);
    let score = explicitIds.includes(experiment.psiId) ? 100 : 0;

    for (const token of tokens) {
      if (searchText.includes(token)) {
        score += 2;
      }
      if (experiment.name.toLowerCase().includes(token)) {
        score += 6;
      }
      if (experiment.fullName.toLowerCase().includes(token)) {
        score += 3;
      }
    }

    if (lowerQuestion.includes('oxygen') || lowerQuestion.includes('pressure')) {
      if (['PSI-25', 'PSI-26', 'PSI-98', 'PSI-99', 'PSI-100'].includes(experiment.psiId)) {
        score += 3;
      }
    }
    if (lowerQuestion.includes('smoke') || lowerQuestion.includes('detector')) {
      if (['PSI-102', 'PSI-101', 'PSI-107'].includes(experiment.psiId)) {
        score += 5;
      }
    }
    if (lowerQuestion.includes('droplet') || lowerQuestion.includes('cool flame')) {
      if (['PSI-69', 'PSI-68', 'PSI-159', 'PSI-39'].includes(experiment.psiId)) {
        score += 5;
      }
    }
    if (lowerQuestion.includes('material') || lowerQuestion.includes('flammable')) {
      if (['PSI-99', 'PSI-26', 'PSI-25'].includes(experiment.psiId)) {
        score += 4;
      }
    }

    return { experiment, score };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const selected = ranked.slice(0, limit).map((entry) => entry.experiment);

  for (const id of explicitIds) {
    const experiment = experimentsById.get(id);
    if (experiment && !selected.some((item) => item.psiId === id)) {
      selected.unshift(experiment);
    }
  }

  if (selected.length === 0) {
    return DEFAULT_EXPERIMENT_IDS
      .map((id) => experimentsById.get(id))
      .filter((experiment): experiment is PsiExperiment => Boolean(experiment))
      .slice(0, limit);
  }

  return selected.slice(0, Math.max(limit, explicitIds.length));
}

function buildPublicationCitation(experiment: PsiExperiment): string[] {
  const citations: string[] = [];

  for (const publication of experiment.publications) {
    const link = publication.url || (publication.doi ? `https://doi.org/${publication.doi}` : '');
    citations.push(
      `${publication.title} — ${publication.authors}, ${publication.venue} (${publication.year})${link ? ` · ${link}` : ''}`
    );
  }

  if (experiment.dataUrl) {
    citations.push(`${experiment.name} NASA PSI data record: ${experiment.dataUrl}`);
  }

  if (citations.length === 0) {
    citations.push(`NASA Physical Sciences Informatics ${experiment.psiId} investigation record`);
  }

  return citations;
}

function buildCitations(experiments: PsiExperiment[]): string[] {
  return [...new Set(experiments.flatMap(buildPublicationCitation))];
}

function buildExperimentContext(experiment: PsiExperiment): string {
  const records = experiment.experimentalData.records
    .map((record) => `- ${record.metric}: ${record.value} [${record.provenance}]`)
    .join('\n');
  const highlights = (experiment.resultHighlights ?? [])
    .map((highlight) => `- ${highlight.label}: ${highlight.value} [${highlight.provenance}]`)
    .join('\n');
  const publications = experiment.publications
    .map(
      (publication) =>
        `- ${publication.title} — ${publication.authors}, ${publication.venue} (${publication.year})${publication.doi ? ` DOI: ${publication.doi}` : ''}`
    )
    .join('\n');

  return `### ${experiment.name} (${experiment.psiId}) — ${experiment.fullName}
Category: ${experiment.category}
Facility: ${experiment.facility}
Years: ${experiment.year}
PSI verification: ${experiment.psiVerification ?? 'verified'}
Objective: ${experiment.researchObjective}
Summary: ${experiment.overviewSummary}
Key findings:
${experiment.keyFindings.map((finding) => `- ${finding}`).join('\n')}
Result highlights:
${highlights || '- No structured result highlights recorded.'}
Parameters:
- Fuel/material: ${experiment.parameters.fuelType}
- Oxygen: ${experiment.parameters.oxygenConcentration}
- Pressure: ${experiment.parameters.pressure}
- Airflow: ${experiment.parameters.airflow}
- Temperature: ${experiment.parameters.temperature}
- Environment: ${experiment.parameters.experimentalEnvironment}
- Suppression: ${experiment.parameters.suppressionMethod}
Experimental data:
${records}
Publications:
${publications || '- No peer-reviewed citation recorded.'}
Image provenance: ${experiment.imageType ?? 'nasa'} — ${experiment.imageCredit}`;
}

function buildGroundingContext(experiments: PsiExperiment[]): string {
  const topicContext = INTELLIGENCE_TOPICS.map(
    (topic) => `- ${topic.label}: ${topic.insight} [${topic.provenance}]`
  ).join('\n');
  const documentContext = RESEARCH_LIBRARY_DOCS.map(
    (document) => `- ${document.docCode}: ${document.summary} [${document.provenance}]`
  ).join('\n');

  return `## Retrieved NASA PSI investigations

${experiments.map(buildExperimentContext).join('\n\n')}

## Cross-investigation topics

${topicContext}

## Research library notes

${documentContext}`;
}

function formatHighlights(experiment: PsiExperiment): string {
  const highlights = experiment.resultHighlights ?? [];
  if (highlights.length === 0) {
    return '';
  }
  return highlights
    .map((highlight) => `- ${highlight.label}: ${highlight.value} (${highlight.provenance})`)
    .join('\n');
}

function formatExperimentAnswer(experiment: PsiExperiment): string {
  const highlights = formatHighlights(experiment);
  return `${experiment.name} (${experiment.psiId}) — ${experiment.fullName}

${experiment.overviewSummary}

Key findings:
${experiment.keyFindings.map((finding) => `- ${finding}`).join('\n')}
${highlights ? `\nMeasured results:\n${highlights}\n` : ''}
Conditions recorded in the NASA PSI record:
- Fuel/material: ${experiment.parameters.fuelType}
- Oxygen: ${experiment.parameters.oxygenConcentration}
- Pressure: ${experiment.parameters.pressure}
- Airflow: ${experiment.parameters.airflow}
- Suppression: ${experiment.parameters.suppressionMethod}

Verification: ${experiment.psiVerification === 'unverified' ? 'The PSI identifier for this investigation is still being verified against NASA source records; treat the ID as provisional.' : 'PSI identifier matched to the local verified dataset.'}`;
}

function formatComparisonAnswer(experiments: PsiExperiment[]): string {
  const rows = experiments.map((experiment) => {
    const highlights = (experiment.resultHighlights ?? [])
      .slice(0, 3)
      .map((highlight) => `${highlight.label}: ${highlight.value}`)
      .join('; ');
    return `- ${experiment.name} (${experiment.psiId}, ${experiment.year}): ${experiment.parameters.fuelType}; ${experiment.parameters.oxygenConcentration}; ${experiment.parameters.pressure}; airflow ${experiment.parameters.airflow}.${highlights ? ` Key result: ${highlights}.` : ''}`;
  });

  return `Comparison grounded in the local NASA PSI records:\n\n${rows.join('\n')}\n\nThese are recorded test conditions and published findings, not a controlled side-by-side reanalysis. Check each investigation’s verification label and publication link before using the numbers in an engineering trade study.`;
}

function formatMaterialsAnswer(experiments: PsiExperiment[]): string {
  const materialExperiments = experiments.filter((experiment) =>
    /material|fuel|flamm|burn|ignit/i.test(experimentSearchText(experiment))
  );
  const selected = materialExperiments.length > 0 ? materialExperiments : experiments;

  return `NASA PSI material-flammability work in this dataset includes:\n\n${selected
    .slice(0, 4)
    .map(
      (experiment) =>
        `- ${experiment.name} (${experiment.psiId}): ${experiment.parameters.fuelType}. ${experiment.shortDescription}`
    )
    .join('\n')}\n\nThe key safety lesson is that 1g upward-burn screening can misrank materials for low-speed microgravity opposed flow. Thin cellulosic fabrics and PMMA can sustain spread near limiting oxygen conditions, while flame-retardant materials may still produce smoke that challenges detectors. Treat the relative rankings as qualitative unless you are using a specific measured test record.`;
}

function formatAtmosphereAnswer(experiments: PsiExperiment[]): string {
  const oxygenTopic = INTELLIGENCE_TOPICS.find((topic) => topic.id === 'oxygen');
  const rows = (oxygenTopic?.data ?? [])
    .map((row) => `- ${row.habitat}: ${row.o2Percent}% O2 at ${row.pressureKpa} kPa`)
    .join('\n');

  return `Elevated oxygen raises ignition sensitivity and flame-spread potential, while lower total pressure changes the mass-transfer environment. The atmosphere targets represented in this project are:\n${rows || '- Atmosphere target data unavailable.'}\n\nFor comparison, BASS (PSI-26) tested solid fuels in low-speed forced flow and SAFFIRE-I/III (PSI-98/PSI-100) used roughly 21–22% O2 at about 101 kPa with 0.20–0.25 m/s ventilation. A 34% O2 / 56.5 kPa exploration atmosphere is therefore not directly interchangeable with ISS cabin air, and material screening must be repeated for the intended pressure and oxygen combination.`;
}

function formatCoolFlameAnswer(experiments: PsiExperiment[]): string {
  const selected = experiments.filter((experiment) =>
    ['PSI-69', 'PSI-68', 'PSI-159', 'PSI-39'].includes(experiment.psiId)
  );
  const rows = (selected.length > 0 ? selected : experiments).slice(0, 4);

  return `The FLEX/FLEX-2 and CFI investigations show that a visible hot flame going out is not the same as combustion ending. In microgravity, droplet flames can transition into a low-temperature cool-flame stage after radiative extinction, and CFI-G extended the study to burner-stabilized gaseous cool flames.\n\n${rows
    .map(
      (experiment) =>
        `- ${experiment.name} (${experiment.psiId}): ${experiment.shortDescription}`
    )
    .join('\n')}\n\nOperational implication: spacecraft fire sensors should not rely only on visible-light cameras. CO, formaldehyde, infrared, and other gas-sensing channels matter for detecting dim or invisible reaction zones.`;
}

function formatSmokeAnswer(experiments: PsiExperiment[]): string {
  const rows = experiments
    .filter((experiment) => ['PSI-102', 'PSI-101', 'PSI-107'].includes(experiment.psiId))
    .slice(0, 3);

  return `In microgravity, smoke does not rise to a ceiling and clear itself the way it does in a 1g room. SAME (PSI-102) and SAME-R (PSI-101) showed that reduced buoyancy gives smoke particles longer residence time, allowing coagulation into larger aggregates that change optical-scattering detector response. SPICE (PSI-107) adds the soot-inception side of the problem: microgravity coflow flames can produce soot earlier than comparable 1g flames.\n\n${rows
    .map(
      (experiment) =>
        `- ${experiment.name} (${experiment.psiId}): ${experiment.shortDescription}`
    )
    .join('\n')}\n\nThe engineering lesson is to place detectors along the actual cabin return-air path and to validate them against microgravity smoke size distributions, not only terrestrial test dust.`;
}

function formatSuppressionAnswer(experiments: PsiExperiment[]): string {
  return `Suppression in microgravity is a coupled airflow, oxygen, and heat-loss problem. BASS/BASS-II (PSI-26/PSI-25) tested solid-fuel extinction under low-speed forced flow and nitrogen dilution; FLEX/FLEX-2 (PSI-69/PSI-68) showed that hot-flame extinction can leave a cool-flame reaction that may re-ignite if oxygen returns. SAFFIRE-I/II/III (PSI-98/PSI-99/PSI-100) provided full-scale evidence of how ventilation and material choice change fire growth in a spacecraft volume.\n\nPractical priorities:\n- Stop or redirect ventilation so the flame does not receive a fresh oxidizer supply.\n- Use inert-gas dilution where compatible with the cabin atmosphere and crew.\n- Verify extinction with chemical and thermal sensors, not only cameras.\n- Re-check the atmosphere and material combination for the target habitat.\n\nRelevant records: ${experiments.slice(0, 4).map((experiment) => `${experiment.name} (${experiment.psiId})`).join(', ')}.`;
}

function formatGeneralAnswer(experiments: PsiExperiment[]): string {
  const primary = experiments[0];
  return `Microgravity fire behavior is shaped by the absence of buoyant convection: flames become more spherical, heat and smoke do not rise, and ventilation becomes a major oxidizer-transport pathway. NASA PSI investigations in this dataset address different parts of that problem:\n\n${experiments
    .slice(0, 4)
    .map(
      (experiment) =>
        `- ${experiment.name} (${experiment.psiId}): ${experiment.shortDescription}`
    )
    .join('\n')}\n\n${primary ? `Start with ${primary.name} (${primary.psiId}) for the most relevant record, then compare its measured conditions with the habitat atmosphere and airflow you are assessing.` : ''}`;
}

function buildDeterministicResponse(
  question: string,
  fallbackReason?: string
): CopilotApiResponse {
  const lowerQuestion = question.toLowerCase();
  const explicitIds = findExplicitPsiIds(question);
  const ranked = rankExperiments(question);
  const explicitExperiments = explicitIds
    .map((id) => experimentsById.get(id))
    .filter((experiment): experiment is PsiExperiment => Boolean(experiment));
  const selected =
    explicitExperiments.length > 0 ? explicitExperiments : ranked;

  let answer: string;

  if (
    explicitExperiments.length >= 2 &&
    /compare|versus|vs\.?|difference|contrast/.test(lowerQuestion)
  ) {
    answer = formatComparisonAnswer(selected);
  } else if (explicitExperiments.length === 1) {
    answer = formatExperimentAnswer(selected[0]);
  } else if (/material|flamm|fuel|ignit|burn/.test(lowerQuestion)) {
    answer = formatMaterialsAnswer(selected);
  } else if (/oxygen|pressure|atmosphere|moon|mars|eva|suit/.test(lowerQuestion)) {
    answer = formatAtmosphereAnswer(selected);
  } else if (/droplet|cool flame|flex|invisible/.test(lowerQuestion)) {
    answer = formatCoolFlameAnswer(selected);
  } else if (/smoke|detector|aerosol|soot/.test(lowerQuestion)) {
    answer = formatSmokeAnswer(selected);
  } else if (/suppress|extinguish|put out|inert|nitrogen/.test(lowerQuestion)) {
    answer = formatSuppressionAnswer(selected);
  } else {
    answer = formatGeneralAnswer(selected);
  }

  const citations = buildCitations(selected);

  return {
    source: 'grounded-knowledge-base',
    model: 'local-retrieval',
    answer,
    referencedIds: selected.map((experiment) => experiment.psiId),
    citations,
    dataNotes:
      'Generated from the local NASA PSI dataset bundled with Flame in Freefall. No live generative model was used for this response. Verify unverified PSI identifiers and publication links before citing them externally.',
    fallbackReason,
  };
}

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 30;

function copilotRateLimit(req: Request, res: Response, next: NextFunction): void {
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    next();
    return;
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    res.status(429).json({
      error: 'Too many copilot requests. Please wait a minute and try again.',
    });
    return;
  }

  bucket.count += 1;
  next();
}

const rateLimitCleanup = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS);
rateLimitCleanup.unref();

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    geminiConfigured: Boolean(ai),
    model: ai ? GEMINI_MODEL : null,
    mode: ai ? 'gemini-live-with-grounded-fallback' : 'grounded-knowledge-base',
    knowledgeBase: {
      experiments: PSI_EXPERIMENTS.length,
      topics: INTELLIGENCE_TOPICS.length,
      documents: RESEARCH_LIBRARY_DOCS.length,
    },
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/copilot', copilotRateLimit, async (req, res) => {
  const question =
    typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  const history: ChatHistoryMessage[] = Array.isArray(req.body?.history)
    ? req.body.history
        .slice(-8)
        .map((item: unknown) => {
          const message = item as { role?: unknown; content?: unknown };
          return {
            role: message.role === 'user' ? 'user' as const : 'assistant' as const,
            content: String(message.content ?? '').slice(0, 800),
          };
        })
        .filter((message: ChatHistoryMessage) => message.content.length > 0)
    : [];

  if (!question) {
    res.status(400).json({ error: 'Please enter a scientific question to analyze.' });
    return;
  }

  if (question.length > 2000) {
    res.status(400).json({
      error: 'Question is too long. Please keep it under 2,000 characters.',
    });
    return;
  }

  const ranked = rankExperiments(question);

  if (!ai) {
    res.json(buildDeterministicResponse(question));
    return;
  }

  try {
    const historyTranscript = history
      .map(
        (message) =>
          `${message.role === 'user' ? 'Researcher' : 'Copilot'}: ${message.content}`
      )
      .join('\n');

    const prompt = `Use only the grounded NASA PSI context below. Do not invent measurements, authors, paper titles, oxygen percentages, pressures, or airflow values.

${buildGroundingContext(ranked)}

Recent conversation:
${historyTranscript || 'None'}

Current researcher question:
${question}

Instructions:
1. Answer for an aerospace / space fire-safety audience.
2. Prefer the retrieved investigation records and explicitly state when a measurement is unavailable.
3. Refer to investigations by their PSI IDs from the context.
4. Do not include a citation list; the server generates citations from the retrieved records.
5. Distinguish published findings from illustrative or AI-generated material.
6. Keep the answer concise but technically specific.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction:
          'You are the Flame in Freefall AI Research Copilot for NASA Space Apps Challenge 2026. Ground every claim in the supplied NASA PSI records. Never fabricate citations, numeric telemetry, author lists, or publication titles. If the records are insufficient, say so.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: {
              type: Type.STRING,
              description: 'Scientific answer grounded strictly in the supplied NASA PSI context.',
            },
            referencedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'NASA PSI IDs actually used, for example ["PSI-26", "PSI-98"].',
            },
            dataNotes: {
              type: Type.STRING,
              description:
                'Short provenance note distinguishing published findings, illustrative data, and any missing measurements.',
            },
          },
          required: ['answer', 'referencedIds', 'dataNotes'],
        },
      },
    });

    const rawText = (response.text ?? '').trim();
    const parsed = JSON.parse(rawText) as CopilotStructuredResponse;
    const referencedIds = (Array.isArray(parsed.referencedIds) ? parsed.referencedIds : [])
      .filter((id): id is string => typeof id === 'string' && knownPsiIds.has(id));
    const usedIds = referencedIds.length > 0
      ? referencedIds
      : ranked.map((experiment) => experiment.psiId);
    const usedExperiments = usedIds
      .map((id) => experimentsById.get(id))
      .filter((experiment): experiment is PsiExperiment => Boolean(experiment));

    if (!parsed.answer || parsed.answer.trim().length < 20) {
      res.json(
        buildDeterministicResponse(
          question,
          'Gemini returned an empty or unusable answer; grounded local knowledge base used.'
        )
      );
      return;
    }

    res.json({
      source: 'gemini-live',
      model: GEMINI_MODEL,
      answer: parsed.answer.trim(),
      referencedIds: usedIds,
      citations: buildCitations(usedExperiments),
      dataNotes:
        parsed.dataNotes ||
        'Gemini answer constrained to the local NASA PSI dataset; citations generated server-side.',
    } satisfies CopilotApiResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Gemini error';
    console.error('Gemini Copilot error:', message);
    res.json(
      buildDeterministicResponse(
        question,
        `Gemini request failed (${GEMINI_MODEL}); grounded local knowledge base used.`
      )
    );
  }
});

const isProduction =
  process.env.NODE_ENV === 'production' || process.argv.includes('--production');

export { app };

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Flame in Freefall server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}
