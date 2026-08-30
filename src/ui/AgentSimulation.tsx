import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
const steps = ['Agent', 'Tool', 'Observation', 'Next step'];
export default function AgentSimulation() {
  const [step, setStep] = useState(0),
    [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 950);
    return () => clearInterval(id);
  }, [running]);
  return (
    <section className="simulation" aria-label="Illustrative agent loop">
      <p className="eyebrow">LOCAL SIMULATION · NO AI CALLS</p>
      <div className="simulation-flow">
        {steps.map((text, i) => (
          <span key={text} className={i === step ? 'active' : ''}>
            {text}
            {i < 3 && <b>→</b>}
          </span>
        ))}
      </div>
      <p aria-live="polite">
        {
          [
            'Choose the next action.',
            'Call a tool with structured input.',
            'Read the result into context.',
            'Decide whether to continue or finish.',
          ][step]
        }
      </p>
      <div className="simulation-controls">
        <Button variant="outline" onClick={() => setRunning(!running)}>
          {running ? 'Pause' : 'Run loop'}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setRunning(false);
            setStep((step + 1) % 4);
          }}
        >
          Step
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setRunning(false);
            setStep(0);
          }}
        >
          Reset
        </Button>
      </div>
    </section>
  );
}
