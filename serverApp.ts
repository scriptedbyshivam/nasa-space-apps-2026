import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import {
  answerCopilot,
  getCopilotHealth,
  parseCopilotHistory,
  type ChatHistoryMessage,
} from './copilotCore';

const app = express();
app.use(express.json({ limit: '32kb' }));

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
  res.json(getCopilotHealth());
});

app.post('/api/copilot', copilotRateLimit, async (req, res) => {
  const question =
    typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  const history: ChatHistoryMessage[] = parseCopilotHistory(req.body?.history);

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

  try {
    res.json(await answerCopilot(question, history));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected server error';
    console.error('API error:', message);
    res.status(500).json({
      error: 'The research copilot hit a server error. Please try again.',
    });
  }
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message =
    error instanceof Error ? error.message : 'Unexpected server error';
  console.error('API error:', message);
  if (!res.headersSent) {
    res.status(500).json({
      error: 'The research copilot hit a server error. Please try again.',
    });
  }
});

export { app };
