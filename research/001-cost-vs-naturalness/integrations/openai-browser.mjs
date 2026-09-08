// Browser module for a bundler; install @openai/agents in the host application.
// Call from an explicit user action. The host must implement the authenticated route.
// https://developers.openai.com/api/docs/guides/voice-agents
export async function startVoice() {
  const { RealtimeAgent, RealtimeSession } = await import('@openai/agents/realtime');
  const response = await fetch('/api/voice-token', { method: 'POST' });
  if (!response.ok) throw new Error('Unable to obtain a session credential');
  const { value, model } = await response.json();
  if (typeof value !== 'string' || !['gpt-realtime-2.1-mini', 'gpt-realtime-2.1'].includes(model)) {
    throw new Error('Unexpected credential response');
  }
  const agent = new RealtimeAgent({ name: 'Research assistant', instructions: 'Use concise, clear language and answer the current question.' });
  const session = new RealtimeSession(agent, { model });
  try { await session.connect({ apiKey: value }); }
  catch (error) { session.close(); throw error; }
  return { session, stop: () => session.close() };
}
