'use client';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { identity, projects, roles, skills } from '@/src/content/portfolio';
import { simulations, type SimulationId } from '@/src/content/exploration';
import { Button } from '@/components/ui/button';
import { estimateTokens, retrieve, routeQuery, runEvals, tools, type Chunk } from './logic';

/**
 * AI Lab: five small, deterministic, in-browser experiments. They illustrate
 * ideas Omar is exploring; none calls a model or the network.
 */

function useStepper(length: number, reducedMotion: boolean, interval = 1100) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setStep((s) => (s + 1) % length), reducedMotion ? interval * 1.6 : interval);
    return () => clearInterval(id);
  }, [running, length, reducedMotion, interval]);
  return {
    step,
    running,
    next: () => {
      setRunning(false);
      setStep((s) => (s + 1) % length);
    },
    toggle: () => setRunning((r) => !r),
    reset: () => {
      setRunning(false);
      setStep(0);
    },
  };
}

function Controls({ s, runLabel = 'Run' }: { s: ReturnType<typeof useStepper>; runLabel?: string }) {
  return (
    <div className="sim-controls">
      <Button variant="outline" onClick={s.toggle} aria-pressed={s.running}>
        {s.running ? 'Pause' : runLabel}
      </Button>
      <Button variant="outline" onClick={s.next}>
        Step
      </Button>
      <Button variant="ghost" onClick={s.reset}>
        Reset
      </Button>
    </div>
  );
}

function AgentLoop({ reducedMotion }: { reducedMotion: boolean }) {
  const answer = `${identity.currentRole}, ${identity.shortOrganization}`;
  const steps = [
    { node: 'Agent', log: 'Plan: the question needs a fact about Omar → call a tool.' },
    { node: 'Tool', log: 'search_portfolio({ query: "current role" })' },
    { node: 'Observe', log: `→ "${answer}"` },
    { node: 'Decide', log: 'Enough information. Stop looping and answer.' },
  ];
  const s = useStepper(steps.length, reducedMotion);
  return (
    <div className="sim">
      <p className="sim-task">
        Task: <q>What is Omar’s current role?</q>
      </p>
      <ol className="loop" aria-label="Agent loop">
        {steps.map((st, i) => (
          <li key={st.node} className={i === s.step ? 'is-active' : i < s.step ? 'is-done' : undefined} aria-current={i === s.step ? 'step' : undefined}>
            {st.node}
          </li>
        ))}
      </ol>
      <pre className="sim-log" aria-live="polite">
        {steps.slice(0, s.step + 1).map((st) => `${st.node.padEnd(8)}${st.log}`).join('\n')}
      </pre>
      <Controls s={s} runLabel="Run loop" />
    </div>
  );
}

const presets = [
  'Which projects used Laravel?',
  'What is 12 * 4?',
  'How can I contact Omar?',
  'What is the weather in Cairo?',
];

function ToolChoice() {
  const [query, setQuery] = useState(presets[0]);
  const decision = routeQuery(query);
  return (
    <div className="sim">
      <fieldset className="preset-row">
        <legend className="sr-only">Example questions</legend>
        {presets.map((p) => (
          <button key={p} type="button" className="preset" aria-pressed={p === query} onClick={() => setQuery(p)}>
            {p}
          </button>
        ))}
      </fieldset>
      <ul className="tool-list" aria-label="Available tools">
        {tools.map((t) => (
          <li key={t.name} className={decision.tool === t.name ? 'is-active' : undefined}>
            <code>{t.name}</code>
            <span>{t.description}</span>
          </li>
        ))}
      </ul>
      <pre className="sim-log" aria-live="polite">
        {decision.tool
          ? `→ ${decision.tool}(${JSON.stringify(decision.args ?? {})})\n  why: ${decision.reason}`
          : `→ no tool\n  why: ${decision.reason}`}
      </pre>
    </div>
  );
}

function Retrieval() {
  const corpus: Chunk[] = useMemo(
    () => [
      ...projects.map((p) => ({ id: p.id, title: p.name, text: `${p.summary} ${p.sides.flatMap((x) => x.technologies).join(' ')}` })),
      ...roles.map((r) => ({ id: r.id, title: `${r.title}${r.organization ? ` · ${r.organization}` : ''}`, text: r.summary })),
      ...skills.map((g) => ({ id: g.label, title: `Skills · ${g.label}`, text: g.items.join(' ') })),
    ],
    [],
  );
  const [query, setQuery] = useState('Laravel APIs for real estate');
  const inputId = useId();
  const { terms, results } = retrieve(query, corpus);
  const context = results.map((r) => r.chunk.text).join('\n');
  const tokens = estimateTokens(context);
  return (
    <div className="sim">
      <label htmlFor={inputId} className="sim-label">
        Ask the portfolio
      </label>
      <input id={inputId} className="sim-input" value={query} onChange={(e) => setQuery(e.target.value)} maxLength={80} />
      <p className="muted small">
        Query terms: {terms.length ? terms.map((t) => <code key={t}>{t}</code>) : '—'}
      </p>
      <ol className="retrieved" aria-live="polite" aria-label="Top matching chunks">
        {results.length === 0 && <li className="muted">No chunk shares a term with the query.</li>}
        {results.map((r) => (
          <li key={r.chunk.id}>
            <span className="meter" aria-hidden="true">
              <span style={{ width: `${Math.round(r.relevance * 100)}%` }} />
            </span>
            <strong>{r.chunk.title}</strong>
            <span className="muted small">matched: {r.matched.join(', ')}</span>
          </li>
        ))}
      </ol>
      <p className="small">
        Context window: <strong>{tokens}</strong> / 400 tokens
        <span className="meter wide" aria-hidden="true">
          <span style={{ width: `${Math.min(100, (tokens / 400) * 100)}%` }} />
        </span>
      </p>
      <p className="muted small">Keyword similarity stands in for embeddings here; the real thing compares vectors.</p>
    </div>
  );
}

function Mcp({ reducedMotion }: { reducedMotion: boolean }) {
  const messages = [
    { dir: '→', text: 'initialize { client: "portfolio-lab" }' },
    { dir: '←', text: 'result { server: "portfolio", capabilities: { tools } }' },
    { dir: '→', text: 'tools/list' },
    { dir: '←', text: 'result { tools: [search_portfolio, get_project] }' },
    { dir: '→', text: 'tools/call get_project { id: "tobi" }' },
    { dir: '←', text: `result { name: "${projects[0].name}", context: "${projects[0].context}" }` },
  ];
  const s = useStepper(messages.length, reducedMotion, 1000);
  return (
    <div className="sim">
      <div className="mcp-diagram" aria-hidden="true">
        <span>Client</span>
        <span className={`mcp-wire ${s.step % 2 ? 'is-back' : ''}`} />
        <span>MCP server</span>
      </div>
      <ol className="sim-log mcp-log" aria-live="polite" aria-label="JSON-RPC messages">
        {messages.slice(0, s.step + 1).map((m, i) => (
          <li key={i}>
            <span aria-label={m.dir === '→' ? 'request' : 'response'}>{m.dir}</span> {m.text}
          </li>
        ))}
      </ol>
      <Controls s={s} runLabel="Run handshake" />
    </div>
  );
}

function Evals() {
  const [ran, setRan] = useState(false);
  const report = runEvals();
  return (
    <div className="sim">
      <p className="small">Six synthetic test cases for the tool router in “Tool choice”.</p>
      <Button variant="outline" onClick={() => setRan(true)} disabled={ran}>
        {ran ? 'Evaluated' : 'Run evals'}
      </Button>
      {ran && (
        <>
          <p className="score" aria-live="polite">
            {report.passed}/{report.total} passing
          </p>
          <ul className="eval-list">
            {report.results.map((r) => (
              <li key={r.query} className={r.pass ? 'pass' : 'fail'}>
                <span className="badge">{r.pass ? 'PASS' : 'FAIL'}</span>
                <span>{r.query}</span>
                {!r.pass && (
                  <span className="muted small">
                    expected {r.expected ?? 'no tool'}, got {r.got ?? 'no tool'} — the keyword router mistakes “how long” for arithmetic.
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default function LabSimulations({ reducedMotion }: { reducedMotion: boolean }) {
  const [tab, setTab] = useState<SimulationId>('loop');
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (i + d + simulations.length) % simulations.length;
    setTab(simulations[next].id);
    refs.current[next]?.focus();
  };
  return (
    <section className="lab" aria-label="AI Lab experiments">
      <p className="notice small">
        <strong>Experiments · local simulations.</strong> Deterministic code running in your browser. No AI model is called,
        nothing is sent anywhere, and demo numbers are synthetic.
      </p>
      <div role="tablist" aria-label="Experiments" className="lab-tabs">
        {simulations.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${s.id}`}
            aria-selected={tab === s.id}
            aria-controls={`${base}-panel-${s.id}`}
            tabIndex={tab === s.id ? 0 : -1}
            onClick={() => setTab(s.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-panel-${tab}`} aria-labelledby={`${base}-tab-${tab}`} tabIndex={0} className="lab-panel">
        {tab === 'loop' && <AgentLoop reducedMotion={reducedMotion} />}
        {tab === 'tools' && <ToolChoice />}
        {tab === 'rag' && <Retrieval />}
        {tab === 'mcp' && <Mcp reducedMotion={reducedMotion} />}
        {tab === 'evals' && <Evals />}
      </div>
    </section>
  );
}
