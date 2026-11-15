import { getCopilotHealth } from '../copilotCore';

export async function GET() {
  return Response.json(getCopilotHealth());
}
