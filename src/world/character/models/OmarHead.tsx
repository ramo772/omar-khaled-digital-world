import { forwardRef, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import {
  BufferGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Path,
  Shape,
  SphereGeometry,
  type Group,
  type MeshStandardMaterial,
} from 'three';
import { unitBox, unitSphere } from '../../materials/registry';
import Instances from '../../environment/Instances';
import { faceZ, headSpec as H } from '../avatar-look';
import { beardCurls, beardlineAt, hairCurls, hairlineAt } from '../avatar-shape';

/**
 * Omar's head, from his photo: an oval face; compact, dense, irregular black
 * curls; a full beard that follows the jaw (bare upper cheeks, joined
 * moustache, slightly fuller chin); smaller softly-rectangular black glasses
 * with thin frames close to the eyes; dark natural brows above them; a
 * friendly smile. Built from headSpec, which the loader portrait also uses.
 *
 * Origin at the chin line, facing +Z.
 */
export type HeadMaterials = Record<
  'skin' | 'skinShade' | 'hair' | 'beard' | 'frames' | 'eyes' | 'teeth' | 'lip',
  MeshStandardMaterial
>;
type V3 = [number, number, number];

/**
 * A smooth piece of an ellipsoid shell slightly larger than the face: keeps
 * the triangles whose centroid passes `keep`. Normals are analytic, so the
 * hair and beard stay smooth rather than faceted.
 */
function shell(grow: V3, keep: (x: number, y: number, z: number) => boolean, w = 44, h = 32) {
  const src = new SphereGeometry(1, w, h).toNonIndexed();
  const p = src.getAttribute('position');
  const pos: number[] = [];
  const nor: number[] = [];
  const rx = H.rx * grow[0];
  const ry = H.ry * grow[1];
  const rz = H.rz * grow[2];
  for (let i = 0; i < p.count; i += 3) {
    const tri: number[] = [];
    let cx = 0;
    let cy = 0;
    let cz = 0;
    for (let k = 0; k < 3; k++) {
      const x = p.getX(i + k) * rx;
      const y = p.getY(i + k) * ry + H.center;
      const z = p.getZ(i + k) * rz;
      tri.push(x, y, z);
      cx += x / 3;
      cy += y / 3;
      cz += z / 3;
    }
    if (!keep(cx, cy, cz)) continue;
    for (let k = 0; k < 3; k++) {
      const x = tri[k * 3];
      const y = tri[k * 3 + 1] - H.center;
      const z = tri[k * 3 + 2];
      const nx = x / (rx * rx);
      const ny = y / (ry * ry);
      const nz = z / (rz * rz);
      const l = Math.hypot(nx, ny, nz) || 1;
      pos.push(tri[k * 3], tri[k * 3 + 1], tri[k * 3 + 2]);
      nor.push(nx / l, ny / l, nz / l);
    }
  }
  src.dispose();
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new Float32BufferAttribute(nor, 3));
  return g;
}

/** Softly rectangular frame ring with a slightly heavier top rim. */
function frameGeometry() {
  const { w, h, radius, side, top } = H.lens;
  const rrect = (sx: number, sy: number, rr: number, dy: number, hole: boolean) => {
    const p = hole ? new Path() : new Shape();
    const x = -sx / 2;
    const y = -sy / 2 + dy;
    p.moveTo(x + rr, y);
    p.lineTo(x + sx - rr, y);
    p.quadraticCurveTo(x + sx, y, x + sx, y + rr);
    p.lineTo(x + sx, y + sy - rr);
    p.quadraticCurveTo(x + sx, y + sy, x + sx - rr, y + sy);
    p.lineTo(x + rr, y + sy);
    p.quadraticCurveTo(x, y + sy, x, y + sy - rr);
    p.lineTo(x, y + rr);
    p.quadraticCurveTo(x, y, x + rr, y);
    return p;
  };
  const outer = rrect(w, h, radius, 0, false) as Shape;
  outer.holes.push(rrect(w - 2 * side, h - side - top, radius * 0.7, -(top - side) / 2, true) as Path);
  return new ExtrudeGeometry(outer, { depth: 0.012, bevelEnabled: false, curveSegments: 6 });
}

/** Rotation that lays a flat feature onto the curved face at x. */
const faceYaw = (x: number, y: number) => -Math.atan2(faceZ(x + 0.01, y) - faceZ(x - 0.01, y), 0.02);

const OmarHead = forwardRef<Group, { mat: HeadMaterials; eyes: React.RefObject<Group | null> }>(function OmarHead({ mat, eyes }, ref) {
  const art = useMemo(
    () => ({
      face: new SphereGeometry(1, 40, 30),
      hair: shell([1.04, 1.06, 1.04], (x, y, z) => y > hairlineAt(x, z)),
      // Beard stays in front of the ears so they remain visible.
      beard: shell([1.035, 1.03, 1.05], (x, y, z) => z > 0.015 && y < beardlineAt(x, z)),
      curls: hairCurls(),
      beardCurls: beardCurls(),
      frame: frameGeometry(),
    }),
    [],
  );
  const { eyes: E, lens: L, brows: B, nose: N, moustache: M, mouth: Mo, chin: C, ears: Ea } = H;
  const beardFront = (y: number) => faceZ(0, y, 1.05);
  // Glasses arms: from the outer edge of each lens back to the ear.
  const armStart = { x: L.x + L.w / 2 - 0.004, z: faceZ(L.x + L.w / 2, L.y) + 0.008 };
  const armEnd = { x: H.rx + 0.008, z: -0.01 };
  const armLen = Math.hypot(armEnd.x - armStart.x, armEnd.z - armStart.z);
  const armYaw = Math.atan2(armEnd.x - armStart.x, armEnd.z - armStart.z);
  return (
    <group ref={ref}>
      {/* Oval face */}
      <mesh geometry={art.face} material={mat.skin} position={[0, H.center, 0]} scale={[H.rx, H.ry, H.rz]} castShadow />
      {[1, -1].map((s) => (
        <mesh key={s} geometry={unitSphere} material={mat.skinShade} position={[s * Ea.x, Ea.y, -0.01]} scale={[0.028, 0.052, 0.042]} />
      ))}
      <RoundedBox args={[N.w, N.h, 0.05]} radius={0.022} position={[0, N.y, faceZ(0, N.y) + 0.005]} material={mat.skinShade} />

      {/* Eyes (blink) and dark, natural brows above the glasses */}
      <group ref={eyes} position={[0, E.y, 0]}>
        {[1, -1].map((s) => (
          <mesh key={s} geometry={unitSphere} material={mat.eyes} position={[s * E.x, 0, faceZ(E.x, E.y) - 0.004]} scale={[E.w / 2, E.h / 2, 0.012]} />
        ))}
      </group>
      {[1, -1].map((s) => (
        <mesh
          key={s}
          geometry={unitBox}
          material={mat.hair}
          position={[s * B.x, B.y, faceZ(B.x, B.y) + 0.004]}
          rotation={[0, s * faceYaw(B.x, B.y), s * -B.tilt]}
          scale={[B.w, B.h, 0.016]}
        />
      ))}

      {/* Glasses: smaller, softly rectangular, thin black frames close to the eyes */}
      {[1, -1].map((s) => (
        <mesh
          key={s}
          geometry={art.frame}
          material={mat.frames}
          position={[s * L.x, L.y, faceZ(L.x, L.y) + 0.012]}
          rotation={[0, s * faceYaw(L.x, L.y) * 0.8, 0]}
        />
      ))}
      <mesh geometry={unitBox} material={mat.frames} position={[0, H.bridge.y, faceZ(0, H.bridge.y) + 0.018]} scale={[H.bridge.w, 0.014, 0.012]} />
      {[1, -1].map((s) => (
        <mesh
          key={s}
          geometry={unitBox}
          material={mat.frames}
          position={[s * (armStart.x + armEnd.x) / 2, L.y + L.h / 2 - 0.012, (armStart.z + armEnd.z) / 2]}
          rotation={[0, s * armYaw, 0]}
          scale={[0.012, 0.014, armLen]}
        />
      ))}

      {/* Beard: follows the jaw, fuller at the chin; moustache joined at the mouth corners */}
      <mesh geometry={art.beard} material={mat.beard} castShadow />
      <mesh geometry={unitSphere} material={mat.beard} position={[0, C.y, C.z]} scale={[C.rx, C.ry, 0.1]} castShadow />
      <Instances geometry={unitSphere} material={mat.beard} items={art.beardCurls} castShadow />
      <RoundedBox args={[M.w, M.h, 0.03]} radius={0.014} position={[0, M.y, beardFront(M.y) + 0.004]} material={mat.beard} />
      {[1, -1].map((s) => (
        <mesh
          key={s}
          geometry={unitBox}
          material={mat.beard}
          position={[s * (Mo.w / 2 + 0.012), (M.y + Mo.y) / 2 - 0.006, beardFront(Mo.y) - 0.002]}
          scale={[0.026, 0.07, 0.02]}
        />
      ))}
      {/* Friendly smile */}
      <RoundedBox args={[Mo.w, Mo.h, 0.014]} radius={0.01} position={[0, Mo.y, beardFront(Mo.y) + 0.004]} material={mat.teeth} />
      <mesh geometry={unitBox} material={mat.lip} position={[0, Mo.y - Mo.h / 2 - 0.008, beardFront(Mo.y) + 0.002]} scale={[Mo.w * 0.8, 0.012, 0.012]} />

      {/* Hair: fitted shell + dense, uneven curls */}
      <mesh geometry={art.hair} material={mat.hair} castShadow />
      <Instances geometry={unitSphere} material={mat.hair} items={art.curls} castShadow />
    </group>
  );
});

export default OmarHead;
