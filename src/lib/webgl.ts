/**
 * Can this browser run the 3D world? Three.js needs WebGL 2. Creating a real
 * context (then releasing it) catches blocklisted GPUs and disabled WebGL,
 * which merely checking for the constructor does not.
 *
 * `?webgl=off` forces the fallback, for testing and for anyone who wants it.
 */
export function detectWebGL(): { ok: boolean; reason?: 'forced' | 'unsupported' } {
  try {
    if (new URLSearchParams(window.location.search).get('webgl') === 'off') return { ok: false, reason: 'forced' };
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return { ok: false, reason: 'unsupported' };
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return { ok: true };
  } catch {
    return { ok: false, reason: 'unsupported' };
  }
}
