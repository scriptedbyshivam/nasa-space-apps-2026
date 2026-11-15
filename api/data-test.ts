import { PSI_EXPERIMENTS } from '../src/data/nasaFireData.js';

export function GET() {
  return Response.json({ count: PSI_EXPERIMENTS.length });
}
