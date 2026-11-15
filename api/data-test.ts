import { PSI_EXPERIMENTS } from '../src/data/nasaFireData';

export function GET() {
  return Response.json({ count: PSI_EXPERIMENTS.length });
}
