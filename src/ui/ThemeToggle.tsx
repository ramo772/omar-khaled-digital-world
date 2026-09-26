'use client';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useId } from 'react';
import { useTheme } from '@/src/theme/ThemeProvider';
import type { ThemePreference } from '@/src/theme/theme';

const options: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

/** Light / Dark / System as a native radio group (arrow keys work for free). */
export default function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const name = useId();
  return (
    <fieldset className="theme-toggle">
      <legend className="sr-only">Colour theme</legend>
      {options.map(({ value, label, Icon }) => (
        <label key={value} className="theme-option" title={`${label} theme`}>
          <input
            type="radio"
            name={name}
            value={value}
            checked={preference === value}
            onChange={() => setPreference(value)}
            className="sr-only"
          />
          <Icon aria-hidden="true" size={16} strokeWidth={1.8} />
          <span className="sr-only">{label}</span>
        </label>
      ))}
    </fieldset>
  );
}
