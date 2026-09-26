import { forwardRef, useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import {
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Path,
  Shape,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  type Group,
  type MeshStandardMaterial,
} from 'three';
import { unitSphere } from '../../materials/registry';
import { faceZ, headSpec as H } from '../avatar-look';
import { hairlineAt, hairStrands } from '../avatar-shape';

export type HeadMaterials = Record<
  | 'skin'
  | 'skinShade'
  | 'hair'
  | 'hairHighlight'
  | 'beard'
  | 'frames'
  | 'eyes'
  | 'teeth'
  | 'lip',
  MeshStandardMaterial
>;
type V3 = [number, number, number];

/** Build a smooth selected region of an ellipsoid slightly above the face. */
function shell(
  grow: V3,
  keep: (x: number, y: number, z: number) => boolean,
  w = 48,
  h = 36,
) {
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
      const length = Math.hypot(nx, ny, nz) || 1;
      pos.push(tri[k * 3], tri[k * 3 + 1], tri[k * 3 + 2]);
      nor.push(nx / length, ny / length, nz / length);
    }
  }
  src.dispose();
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(pos, 3));
  geometry.setAttribute('normal', new Float32BufferAttribute(nor, 3));
  return geometry;
}

/** Smooth close-fitting front beard with an exact curved cheek line. */
function beardPatch() {
  const columns = 48;
  const rows = 12;
  const positions: number[] = [];
  const indices: number[] = [];
  for (let ix = 0; ix <= columns; ix++) {
    const u = -0.94 + (1.88 * ix) / columns;
    const x = H.rx * u;
    const jaw = H.center - H.ry * Math.sqrt(Math.max(0, 1 - u * u)) + 0.004;
    const cheek =
      H.beardLine.center +
      (H.beardLine.side - H.beardLine.center) * Math.abs(u) ** 1.65;
    for (let iy = 0; iy <= rows; iy++) {
      const v = iy / rows;
      const y = jaw + (cheek - jaw) * v;
      positions.push(x, y, faceZ(x, y, 1.012) + 0.002);
    }
  }
  for (let ix = 0; ix < columns; ix++) {
    for (let iy = 0; iy < rows; iy++) {
      const a = ix * (rows + 1) + iy;
      const b = (ix + 1) * (rows + 1) + iy;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function beardDetailGeometry() {
  return [-0.15, -0.108, -0.062, 0, 0.062, 0.108, 0.15].map((x, index) => {
    const u = x / H.rx;
    const jaw = H.center - H.ry * Math.sqrt(Math.max(0, 1 - u * u)) + 0.018;
    const cheek =
      H.beardLine.center +
      (H.beardLine.side - H.beardLine.center) * Math.abs(u) ** 1.65 -
      0.012;
    const points = Array.from({ length: 5 }, (_, pointIndex) => {
      const t = pointIndex / 4;
      const y = cheek + (jaw - cheek) * t;
      const px = x + Math.sin(t * Math.PI * 1.4 + index) * 0.004;
      return new Vector3(px, y, faceZ(px, y, 1.016) + 0.004);
    });
    return new TubeGeometry(
      new CatmullRomCurve3(points, false, 'centripetal'),
      8,
      0.0026,
      5,
      false,
    );
  });
}

/** Soft rectangular frame with rounded corners and a modest top rim. */
function frameGeometry() {
  const { w, h, radius, side, top } = H.lens;
  const roundedRect = (
    sx: number,
    sy: number,
    r: number,
    dy: number,
    hole: boolean,
  ) => {
    const path = hole ? new Path() : new Shape();
    const x = -sx / 2;
    const y = -sy / 2 + dy;
    path.moveTo(x + r, y);
    path.lineTo(x + sx - r, y);
    path.quadraticCurveTo(x + sx, y, x + sx, y + r);
    path.lineTo(x + sx, y + sy - r);
    path.quadraticCurveTo(x + sx, y + sy, x + sx - r, y + sy);
    path.lineTo(x + r, y + sy);
    path.quadraticCurveTo(x, y + sy, x, y + sy - r);
    path.lineTo(x, y + r);
    path.quadraticCurveTo(x, y, x + r, y);
    return path;
  };
  const outer = roundedRect(w, h, radius, 0, false) as Shape;
  outer.holes.push(
    roundedRect(
      w - side * 2,
      h - side - top,
      radius * 0.72,
      -(top - side) / 2,
      true,
    ) as Path,
  );
  return new ExtrudeGeometry(outer, {
    depth: 0.01,
    bevelEnabled: true,
    bevelSize: 0.0025,
    bevelThickness: 0.0025,
    bevelSegments: 2,
    curveSegments: 10,
  });
}

const faceYaw = (x: number, y: number) =>
  -Math.atan2(faceZ(x + 0.01, y) - faceZ(x - 0.01, y), 0.02);

const OmarHead = forwardRef<
  Group,
  { mat: HeadMaterials; eyes: React.RefObject<Group | null> }
>(function OmarHead({ mat, eyes }, ref) {
  const art = useMemo(() => {
    const strands = hairStrands().map(
      ({ points, radius }) =>
        new TubeGeometry(
          new CatmullRomCurve3(
            points.map(([x, y, z]) => new Vector3(x, y, z)),
            false,
            'centripetal',
          ),
          12,
          radius,
          6,
          false,
        ),
    );
    return {
      face: new SphereGeometry(1, 48, 36),
      hair: shell(
        [1.018, 1.026, 1.022],
        (x, y, z) => y > hairlineAt(x, z),
        96,
        72,
      ),
      beard: beardPatch(),
      beardDetails: beardDetailGeometry(),
      strands,
      frame: frameGeometry(),
    };
  }, []);
  const {
    eyes: E,
    lens: L,
    brows: B,
    nose: N,
    moustache: M,
    mouth: Mo,
    ears: Ea,
  } = H;
  const faceFront = (y: number) => faceZ(0, y, 1.022);
  const armStart = {
    x: L.x + L.w / 2 - 0.004,
    z: faceZ(L.x + L.w / 2, L.y) + 0.006,
  };
  const armEnd = { x: H.rx + 0.006, z: -0.006 };
  const armLength = Math.hypot(armEnd.x - armStart.x, armEnd.z - armStart.z);
  const armYaw = Math.atan2(armEnd.x - armStart.x, armEnd.z - armStart.z);

  return (
    <group ref={ref}>
      <mesh
        geometry={art.face}
        material={mat.skin}
        position={[0, H.center, 0]}
        scale={[H.rx, H.ry, H.rz]}
        castShadow
      />
      {[1, -1].map((side) => (
        <mesh
          key={side}
          geometry={unitSphere}
          material={mat.skinShade}
          position={[side * Ea.x, Ea.y, -0.008]}
          scale={[0.025, 0.052, 0.04]}
        />
      ))}
      <RoundedBox
        args={[N.w, N.h, 0.044]}
        radius={0.02}
        smoothness={4}
        position={[0, N.y, faceZ(0, N.y) + 0.004]}
        material={mat.skinShade}
      />

      <group ref={eyes} position={[0, E.y, 0]}>
        {[1, -1].map((side) => (
          <mesh
            key={side}
            geometry={unitSphere}
            material={mat.eyes}
            position={[side * E.x, 0, faceZ(E.x, E.y) - 0.003]}
            scale={[E.w / 2, E.h / 2, 0.011]}
          />
        ))}
      </group>
      {[1, -1].map((side) => (
        <RoundedBox
          key={side}
          args={[B.w, B.h, 0.014]}
          radius={0.007}
          smoothness={3}
          material={mat.hair}
          position={[side * B.x, B.y, faceZ(B.x, B.y) + 0.004]}
          rotation={[0, side * faceYaw(B.x, B.y), side * -B.tilt]}
        />
      ))}

      {/* Medium, softly rectangular glasses with subtly reflective lenses. */}
      {[1, -1].map((side) => (
        <group key={side}>
          <RoundedBox
            args={[L.w - L.side * 2.2, L.h - L.side - L.top - 0.004, 0.004]}
            radius={0.012}
            smoothness={4}
            position={[side * L.x, L.y - 0.001, faceZ(L.x, L.y) + 0.01]}
            rotation={[0, side * faceYaw(L.x, L.y) * 0.8, 0]}
          >
            <meshPhysicalMaterial
              color="#dcebea"
              transparent
              opacity={0.09}
              roughness={0.12}
              metalness={0}
            />
          </RoundedBox>
          <mesh
            geometry={art.frame}
            material={mat.frames}
            position={[side * L.x, L.y, faceZ(L.x, L.y) + 0.013]}
            rotation={[0, side * faceYaw(L.x, L.y) * 0.8, 0]}
          />
        </group>
      ))}
      <RoundedBox
        args={[H.bridge.w, 0.012, 0.012]}
        radius={0.005}
        smoothness={3}
        material={mat.frames}
        position={[0, H.bridge.y, faceZ(0, H.bridge.y) + 0.019]}
      />
      {[1, -1].map((side) => (
        <RoundedBox
          key={side}
          args={[0.01, 0.012, armLength]}
          radius={0.004}
          smoothness={3}
          material={mat.frames}
          position={[
            (side * (armStart.x + armEnd.x)) / 2,
            L.y + L.h / 2 - 0.014,
            (armStart.z + armEnd.z) / 2,
          ]}
          rotation={[0, side * armYaw, 0]}
        />
      ))}

      {/* Smooth close-fitting beard surface with slim sideburns. */}
      <mesh geometry={art.beard} material={mat.beard} castShadow />
      {art.beardDetails.map((geometry, index) => (
        <mesh
          key={index}
          geometry={geometry}
          material={mat.hairHighlight}
          castShadow
        />
      ))}
      {[1, -1].map((side) => (
        <RoundedBox
          key={side}
          args={[0.026, 0.12, 0.018]}
          radius={0.009}
          smoothness={4}
          position={[side * 0.198, 0.274, faceZ(0.198, 0.274) + 0.005]}
          rotation={[0, side * faceYaw(0.198, 0.274), side * -0.08]}
          material={mat.beard}
          castShadow
        />
      ))}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={side}
          args={[M.w / 2 + 0.004, M.h, 0.022]}
          radius={0.01}
          smoothness={4}
          position={[side * M.w * 0.23, M.y, faceFront(M.y) + 0.002]}
          rotation={[0, 0, side * 0.09]}
          material={mat.beard}
        />
      ))}
      {[-1, 1].map((side) => (
        <RoundedBox
          key={side}
          args={[0.017, 0.05, 0.018]}
          radius={0.007}
          smoothness={3}
          position={[side * 0.064, 0.17, faceFront(0.17) + 0.001]}
          rotation={[0, 0, side * 0.18]}
          material={mat.beard}
        />
      ))}
      <RoundedBox
        args={[Mo.w, Mo.h, 0.012]}
        radius={0.009}
        smoothness={4}
        position={[0, Mo.y, faceFront(Mo.y) + 0.002]}
        material={mat.teeth}
      />
      <RoundedBox
        args={[Mo.w * 0.76, 0.01, 0.011]}
        radius={0.004}
        smoothness={3}
        position={[0, Mo.y - Mo.h / 2 - 0.007, faceFront(Mo.y) + 0.001]}
        material={mat.lip}
      />

      {/* Compact base plus individually curved locks: no sphere/blob hair. */}
      <mesh geometry={art.hair} material={mat.hair} castShadow />
      {art.strands.map((geometry, index) => (
        <mesh key={index} geometry={geometry} material={mat.hair} castShadow />
      ))}
    </group>
  );
});

export default OmarHead;
