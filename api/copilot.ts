import {
  answerCopilot,
  parseCopilotHistory,
} from '../copilotCore';

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let payload: { question?: unknown; history?: unknown };

  try {
    payload = (await request.json()) as {
      question?: unknown;
      history?: unknown;
    };
  } catch {
    return errorResponse('Invalid JSON request body.', 400);
  }

  const question =
    typeof payload.question === 'string' ? payload.question.trim() : '';

  if (!question) {
    return errorResponse('Please enter a scientific question to analyze.', 400);
  }

  if (question.length > 2000) {
    return errorResponse(
      'Question is too long. Please keep it under 2,000 characters.',
      400
    );
  }

  try {
    const result = await answerCopilot(
      question,
      parseCopilotHistory(payload.history)
    );
    return Response.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unexpected server error';
    console.error('Copilot API error:', message);
    return errorResponse(
      'The research copilot hit a server error. Please try again.',
      500
    );
  }
}
