import { arrow, bars, fonts, ink, roundRect, text, type Painter } from './canvas';

/**
 * Every painter that shows words takes them as arguments, so on-screen text
 * comes from src/content (never invented here). Painters that only suggest a
 * UI use skeleton bars instead of fake copy.
 */

function screenFrame(g: CanvasRenderingContext2D, w: number, h: number, title?: string, accent = ink.seafoam) {
  g.fillStyle = ink.screen;
  g.fillRect(0, 0, w, h);
  g.fillStyle = ink.screenSoft;
  g.fillRect(0, 0, w, 30);
  ['#ef8a66', '#f0cf7a', '#8fd6a0'].forEach((c, i) => {
    g.fillStyle = c;
    g.beginPath();
    g.arc(18 + i * 16, 15, 5, 0, Math.PI * 2);
    g.fill();
  });
  if (title) text(g, title, w - 14, 15, fonts.mono(13, 600), accent, 'right');
}

export const plaque =
  (title: string, subtitle?: string, accent = '#df7950'): Painter =>
  (g, w, h) => {
    roundRect(g, 3, 3, w - 6, h - 6, 14, '#f7f1e3', '#2a3437', 5);
    g.fillStyle = accent;
    g.fillRect(22, h / 2 - (subtitle ? 26 : 12), 8, subtitle ? 52 : 24);
    const size = Math.min(h * (subtitle ? 0.3 : 0.42), (w - 70) / (title.length * 0.62));
    text(g, title, 44, subtitle ? h * 0.38 : h / 2 + 1, fonts.sans(size, 700), ink.paperInk);
    if (subtitle) text(g, subtitle, 44, h * 0.7, fonts.mono(Math.min(h * 0.17, (w - 70) / (subtitle.length * 0.62)), 500), '#5d6b66');
  };

export const tag =
  (label: string, color = ink.amber): Painter =>
  (g, w, h) => {
    roundRect(g, 2, 2, w - 4, h - 4, h / 2 - 2, ink.screen, color, 3);
    text(g, label, w / 2, h / 2 + 1, fonts.mono(Math.min(h * 0.46, (w - 24) / (label.length * 0.62)), 700), color, 'center');
  };

export const codeCard =
  (lines: [string, string][], title: string): Painter =>
  (g, w, h) => {
    screenFrame(g, w, h, title);
    lines.forEach(([t, c], i) => {
      text(g, String(i + 1).padStart(2, ' '), 14, 52 + i * 26, fonts.mono(14), '#4d6a66');
      text(g, t, 46, 52 + i * 26, fonts.mono(17), c);
    });
  };

export const chatScreen =
  (title: string): Painter =>
  (g, w, h) => {
    screenFrame(g, w, h, title, ink.coral);
    const rows = [
      { bot: true, widths: [150, 110] },
      { bot: false, widths: [120] },
      { bot: true, widths: [170, 140, 90] },
      { bot: false, widths: [96] },
    ];
    let y = 46;
    for (const row of rows) {
      const bw = Math.max(...row.widths) + 28;
      const bh = row.widths.length * 16 + 14;
      const x = row.bot ? 14 : w - bw - 14;
      roundRect(g, x, y, bw, bh, 12, row.bot ? '#2b4a4f' : '#e07d56');
      bars(g, x + 14, y + 11, row.widths, row.bot ? '#b9d8d0' : '#fde6d8', 7, 16);
      y += bh + 10;
    }
    roundRect(g, 14, h - 34, w - 28, 22, 11, '#233a41');
    [0, 1, 2].forEach((i) => {
      g.fillStyle = ink.dim;
      g.beginPath();
      g.arc(34 + i * 12, h - 23, 3, 0, Math.PI * 2);
      g.fill();
    });
  };

export interface FlowNode {
  label: string;
  sub: string;
}

/** Architecture board: a left-to-right flow with an optional badge. */
export const flowBoard =
  (title: string, nodes: FlowNode[], badge: string, footnote: string): Painter =>
  (g, w, h) => {
    g.fillStyle = '#f6f1e4';
    g.fillRect(0, 0, w, h);
    g.strokeStyle = '#e3dccb';
    g.lineWidth = 1;
    for (let x = 0; x < w; x += 24) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, h);
      g.stroke();
    }
    for (let y = 0; y < h; y += 24) {
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y);
      g.stroke();
    }
    text(g, title, 28, 36, fonts.sans(26, 700), ink.paperInk);
    const colors = ['#e07d56', '#3f7d74', '#2f4f5a'];
    const boxW = (w - 56 - (nodes.length - 1) * 56) / nodes.length;
    const y = h * 0.34;
    const boxH = h * 0.36;
    nodes.forEach((n, i) => {
      const x = 28 + i * (boxW + 56);
      roundRect(g, x, y, boxW, boxH, 14, colors[i % colors.length]);
      text(g, n.label, x + boxW / 2, y + boxH * 0.42, fonts.sans(Math.min(24, (boxW - 20) / (n.label.length * 0.56)), 700), '#fff8ec', 'center');
      text(g, n.sub, x + boxW / 2, y + boxH * 0.7, fonts.mono(15), '#fde9d7', 'center');
      if (i < nodes.length - 1) {
        arrow(g, x + boxW + 8, y + boxH * 0.38, x + boxW + 48, y + boxH * 0.38, '#2a3437', 4);
        arrow(g, x + boxW + 48, y + boxH * 0.66, x + boxW + 8, y + boxH * 0.66, '#9a8f79', 3, true);
      }
      if (i === 1) {
        roundRect(g, x + boxW / 2 - 70, y + boxH + 18, 140, 34, 17, '#f0cf7a', '#2a3437', 2);
        text(g, badge, x + boxW / 2, y + boxH + 36, fonts.mono(16, 700), ink.paperInk, 'center');
      }
    });
    text(g, footnote, 28, h - 24, fonts.mono(14), '#7c7564');
  };

export const adminScreen =
  (title: string, toggle: string): Painter =>
  (g, w, h) => {
    screenFrame(g, w, h, title, ink.butter);
    g.fillStyle = '#1b2d34';
    g.fillRect(0, 30, 64, h - 30);
    [0, 1, 2, 3].forEach((i) => roundRect(g, 14, 50 + i * 30, 36, 14, 7, i === 1 ? ink.butter : '#34525a'));
    roundRect(g, w - 76, 40, 62, 22, 11, '#2b4a4f');
    text(g, toggle, w - 45, 51, fonts.mono(12, 700), ink.text, 'center');
    for (let r = 0; r < 5; r++) {
      const y = 76 + r * 26;
      g.fillStyle = r % 2 ? '#1a2b32' : '#203640';
      g.fillRect(76, y, w - 90, 22);
      bars(g, 86, y + 7, [60 + ((r * 37) % 50)], '#a9c6bf', 8);
      bars(g, 190, y + 7, [44], '#6f8f8a', 8);
      roundRect(g, w - 64, y + 5, 14, 12, 3, '#8fd6a0');
      roundRect(g, w - 44, y + 5, 14, 12, 3, '#ef8a66');
    }
    g.setLineDash([6, 5]);
    roundRect(g, 76, h - 44, w - 90, 32, 8, undefined, ink.dim, 2);
    g.setLineDash([]);
    bars(g, w / 2 - 20, h - 32, [80], ink.dim, 8);
  };

export const phoneScreen: Painter = (g, w, h) => {
  g.fillStyle = '#f5f1e8';
  g.fillRect(0, 0, w, h);
  g.fillStyle = '#2f4f5a';
  g.fillRect(0, 0, w, 44);
  bars(g, 14, 18, [70], '#e9f1ee', 9);
  [0, 1].forEach((i) => {
    roundRect(g, 12, 58 + i * 46, w - 24, 38, 8, '#ffffff', '#d8d1c0', 2);
    roundRect(g, 20, 66 + i * 46, 22, 22, 5, i ? '#e07d56' : '#3f7d74');
    bars(g, 50, 70 + i * 46, [60, 38], '#8a8577', 6, 12);
  });
  const qx = w / 2 - 44;
  const qy = 158;
  g.fillStyle = '#ffffff';
  g.fillRect(qx - 6, qy - 6, 100, 100);
  let seed = 7;
  const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let y = 0; y < 11; y++)
    for (let x = 0; x < 11; x++) {
      const finder = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
      if (finder || rand() > 0.52) {
        g.fillStyle = '#1d2a2e';
        g.fillRect(qx + x * 8, qy + y * 8, 8, 8);
      }
    }
  roundRect(g, 18, h - 46, w - 36, 32, 16, '#e07d56');
  bars(g, w / 2 - 26, h - 34, [52], '#fff3ea', 8);
};

export const jobsBoard =
  (title: string, jobs: string[]): Painter =>
  (g, w, h) => {
    screenFrame(g, w, h, title, ink.green);
    jobs.forEach((job, i) => {
      const y = 56 + i * 34;
      text(g, '●', 16, y, fonts.mono(14), ink.green);
      text(g, job, 34, y, fonts.mono(16), ink.text);
      text(g, '✓', w - 18, y, fonts.mono(16, 700), ink.green, 'right');
    });
  };

export const streamScreen =
  (title: string, badges: string[]): Painter =>
  (g, w, h) => {
    screenFrame(g, w, h, title, ink.butter);
    roundRect(g, 14, 44, w * 0.55, 34, 10, '#e07d56');
    bars(g, 26, 56, [w * 0.4], '#fde6d8', 8);
    roundRect(g, 14, 90, w - 28, 78, 10, '#2b4a4f');
    bars(g, 26, 104, [w - 90, w - 120, w * 0.4], '#b9d8d0', 8, 18);
    g.fillStyle = ink.butter;
    g.fillRect(26 + w * 0.4 + 6, 138, 10, 14);
    badges.forEach((b, i) => {
      const x = 14 + i * ((w - 28) / badges.length);
      roundRect(g, x, h - 38, (w - 28) / badges.length - 8, 26, 13, undefined, ink.seafoam, 2);
      text(g, b, x + ((w - 28) / badges.length - 8) / 2, h - 25, fonts.mono(13, 700), ink.seafoam, 'center');
    });
  };

export const terminal =
  (lines: [string, string][]): Painter =>
  (g, w, h) => {
    screenFrame(g, w, h, 'terminal', ink.green);
    lines.forEach(([t, c], i) => text(g, t, 16, 54 + i * 26, fonts.mono(16), c));
    g.fillStyle = ink.green;
    g.fillRect(16, 54 + lines.length * 26 - 8, 10, 16);
  };

export const scoreBoard =
  (title: string, rows: [string, number][], footnote: string): Painter =>
  (g, w, h) => {
    screenFrame(g, w, h, title, ink.butter);
    rows.forEach(([label, v], i) => {
      const y = 56 + i * 34;
      text(g, label, 16, y, fonts.mono(15), ink.text);
      roundRect(g, 150, y - 8, w - 170, 16, 8, '#233a41');
      roundRect(g, 150, y - 8, (w - 170) * v, 16, 8, [ink.green, ink.seafoam, ink.amber][i % 3]);
    });
    text(g, footnote, 16, h - 18, fonts.mono(12), ink.dim);
  };

export const drawers =
  (title: string, items: string[]): Painter =>
  (g, w, h) => {
    g.fillStyle = '#e9e0cc';
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#d3c7ad';
    for (let y = 14; y < h; y += 22) for (let x = 14; x < w; x += 22) g.fillRect(x, y, 4, 4);
    text(g, title, 18, 26, fonts.mono(18, 700), ink.paperInk);
    const cols = 3;
    const cw = (w - 36 - (cols - 1) * 10) / cols;
    items.forEach((item, i) => {
      const x = 18 + (i % cols) * (cw + 10);
      const y = 50 + Math.floor(i / cols) * 46;
      roundRect(g, x, y, cw, 38, 6, '#f8f3e7', '#2a3437', 2);
      text(g, item, x + cw / 2, y + 20, fonts.sans(Math.min(17, (cw - 12) / (item.length * 0.58)), 700), ink.paperInk, 'center');
    });
  };

export const flag =
  (top: string, bottom: string, color: string): Painter =>
  (g, w, h) => {
    roundRect(g, 2, 2, w - 4, h - 4, 10, '#f7f1e3', '#2a3437', 3);
    g.fillStyle = color;
    g.fillRect(2, 2, 12, h - 4);
    text(g, top, 24, h * 0.36, fonts.sans(Math.min(h * 0.36, (w - 30) / (top.length * 0.6)), 800), ink.paperInk);
    text(g, bottom, 24, h * 0.72, fonts.mono(Math.min(h * 0.22, (w - 30) / (bottom.length * 0.62)), 600), '#5d6b66');
  };

export const deckGrid: Painter = (g, w, h) => {
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(40, 50, 60, 0.07)';
  g.lineWidth = 2;
  g.strokeRect(0, 0, w, h);
  g.strokeStyle = 'rgba(40, 50, 60, 0.035)';
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(w / 2, 0);
  g.lineTo(w / 2, h);
  g.moveTo(0, h / 2);
  g.lineTo(w, h / 2);
  g.stroke();
};

export const tshirt: Painter = (g, w, h) => {
  // Off-white knit with thin dark stripes, inspired by the reference photo.
  g.fillStyle = '#ece7de';
  g.fillRect(0, 0, w, h);
  for (let y = 3; y < h; y += 10) {
    g.fillStyle = (y / 10) % 3 < 1 ? '#6a3440' : '#2d3553';
    g.fillRect(0, y, w, 3);
  }
};
