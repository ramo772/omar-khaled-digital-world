import type { ExplorationTopic } from './types';

/**
 * AI Lab — what Omar is exploring. Source: Omar's own brief, NOT the CV.
 * Nothing here is employment experience, a credential, or a shipped system.
 * The only professional AI work (OpenAI + LangChain at Happy Human) lives in
 * portfolio.ts with CV provenance.
 *
 * Omar: adjust `status` per topic as your hands-on work changes.
 */
export const explorationTopics: ExplorationTopic[] = [
  {
    id: 'agents',
    name: 'AI agents & agent loops',
    group: 'Agents',
    status: 'Currently exploring',
    note: 'Plan → act → observe → decide loops, and when to stop.',
  },
  {
    id: 'tool-calling',
    name: 'Tool calling',
    group: 'Agents',
    status: 'Currently exploring',
    note: 'Structured tool schemas, argument validation, and handling tool errors.',
  },
  {
    id: 'mcp',
    name: 'MCP (Model Context Protocol)',
    group: 'Agents',
    status: 'Currently exploring',
    note: 'Exposing tools and resources to models through a standard protocol.',
  },
  {
    id: 'langgraph',
    name: 'LangGraph',
    group: 'Agents',
    status: 'Learning',
    note: 'Stateful, graph-shaped agent workflows.',
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    group: 'Agents',
    status: 'Learning',
    note: 'Open-source personal agent tooling.',
  },
  {
    id: 'rag',
    name: 'RAG',
    group: 'Retrieval & context',
    status: 'Currently exploring',
    note: 'Grounding answers in retrieved documents instead of model memory.',
  },
  {
    id: 'embeddings',
    name: 'Embeddings',
    group: 'Retrieval & context',
    status: 'Learning',
    note: 'Turning text into vectors so “similar” becomes measurable.',
  },
  {
    id: 'context-engineering',
    name: 'Context engineering',
    group: 'Retrieval & context',
    status: 'Currently exploring',
    note: 'Deciding what goes into the context window, and what stays out.',
  },
  {
    id: 'evals',
    name: 'Evals',
    group: 'Evaluation & observability',
    status: 'Learning',
    note: 'Test sets and graders that catch regressions before users do.',
  },
  {
    id: 'langfuse',
    name: 'Langfuse',
    group: 'Evaluation & observability',
    status: 'Learning',
    note: 'Tracing and observing LLM applications.',
  },
  {
    id: 'n8n',
    name: 'n8n',
    group: 'Automation & workflow',
    status: 'Learning',
    note: 'Visual workflow automation with AI steps.',
  },
  {
    id: 'hooks',
    name: 'Agent hooks',
    group: 'Automation & workflow',
    status: 'Learning',
    note: 'Running checks before and after an agent acts.',
  },
  {
    id: 'bmad',
    name: 'BMAD method',
    group: 'Automation & workflow',
    status: 'Learning',
    note: 'A structured, agent-assisted development process.',
  },
  {
    id: 'voice',
    name: 'Voice AI',
    group: 'Voice',
    status: 'Learning',
    note: 'Speech in, speech out — latency is the whole game.',
  },
];

/** Interactive, in-browser simulations. Deterministic; no network, no model. */
export const simulations = [
  { id: 'loop', name: 'Agent loop', status: 'Experiment' },
  { id: 'tools', name: 'Tool choice', status: 'Experiment' },
  { id: 'rag', name: 'Retrieval', status: 'Experiment' },
  { id: 'mcp', name: 'MCP connections', status: 'Experiment' },
  { id: 'evals', name: 'Eval board', status: 'Experiment' },
] as const;

export type SimulationId = (typeof simulations)[number]['id'];
