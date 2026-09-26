import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';

export type Painter = (g: CanvasRenderingContext2D, w: number, h: number) => void;

const cache = new Map<string, CanvasTexture>();

/**
 * Procedural textures drawn once on a 2D canvas: screens, signs and boards.
 * No image downloads; text uses local system fonts. Cached by id.
 */
export function canvasTexture(id: string, w: number, h: number, paint: Painter, repeat?: number) {
  const cached = cache.get(id);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const g = canvas.getContext('2d');
  if (g) paint(g, w, h);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  if (repeat) {
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeat, repeat);
  }
  cache.set(id, texture);
  return texture;
}

export function disposeCanvasTextures() {
  cache.forEach((t) => t.dispose());
  cache.clear();
}

export const fonts = {
  mono: (px: number, weight = 500) => `${weight} ${px}px ui-monospace, "Cascadia Mono", "SF Mono", Consolas, monospace`,
  sans: (px: number, weight = 600) => `${weight} ${px}px "Segoe UI", system-ui, -apple-system, Roboto, sans-serif`,
};

/** Screen colours are the same in both themes: screens are light sources. */
export const ink = {
  screen: '#15232a',
  screenSoft: '#1e3139',
  line: '#2c434b',
  text: '#dbe8e3',
  dim: '#7e9c96',
  amber: '#f2a65c',
  green: '#8fd6a0',
  seafoam: '#7fc4b8',
  coral: '#ef8a66',
  butter: '#f0cf7a',
  cream: '#f4eee0',
  paperInk: '#2a3437',
};

export function roundRect(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fill?: string,
  stroke?: string,
  lineWidth = 2,
) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  if (fill) {
    g.fillStyle = fill;
    g.fill();
  }
  if (stroke) {
    g.strokeStyle = stroke;
    g.lineWidth = lineWidth;
    g.stroke();
  }
}

export function text(
  g: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  font: string,
  color: string,
  align: CanvasTextAlign = 'left',
) {
  g.font = font;
  g.fillStyle = color;
  g.textAlign = align;
  g.textBaseline = 'middle';
  g.fillText(value, x, y);
}

/** Skeleton "text" bars — used where real words would imply invented content. */
export function bars(
  g: CanvasRenderingContext2D,
  x: number,
  y: number,
  widths: number[],
  color: string,
  height = 8,
  gap = 16,
) {
  g.fillStyle = color;
  widths.forEach((w, i) => {
    g.beginPath();
    g.roundRect(x, y + i * gap, w, height, height / 2);
    g.fill();
  });
}

export function arrow(
  g: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  width = 3,
  dashed = false,
) {
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineWidth = width;
  g.setLineDash(dashed ? [8, 7] : []);
  g.beginPath();
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.stroke();
  g.setLineDash([]);
  const a = Math.atan2(y2 - y1, x2 - x1);
  g.beginPath();
  g.moveTo(x2, y2);
  g.lineTo(x2 - 12 * Math.cos(a - 0.45), y2 - 12 * Math.sin(a - 0.45));
  g.lineTo(x2 - 12 * Math.cos(a + 0.45), y2 - 12 * Math.sin(a + 0.45));
  g.closePath();
  g.fill();
}
