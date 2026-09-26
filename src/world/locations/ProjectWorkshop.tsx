import { useMemo } from 'react';
import { TorusGeometry } from 'three';
import { projects, workshopDisplays as wd } from '@/src/content/portfolio';
import type { StationId } from '@/src/content/types';
import { landmarks } from '@/src/data/world-map';
import { ink } from '../materials/canvas';
import { material } from '../materials/registry';
import {
  adminScreen,
  chatScreen,
  flowBoard,
  jobsBoard,
  phoneScreen,
  plaque,
  streamScreen,
  tag,
  terminal,
} from '../materials/painters';
import { Blink, Bob, Spin } from '../environment/Animated';
import { Box, Cylinder, Led, Monitor, Panel, type V3 } from '../environment/Primitives';
import Landmark from '../interaction/Landmark';

const SLAB = 0.16;
const HX = landmarks.workshop.halfX;
const HZ = landmarks.workshop.halfZ;
const ROOF = 3.3;
const BENCH_Z = 0.45;
const bays: { station: StationId; x: number }[] = [
  { station: 'tobi', x: -2.7 },
  { station: 'real-estate', x: -0.9 },
  { station: 'mansour', x: 0.9 },
  { station: 'happy-human', x: 2.7 },
];

function Tag({ label, position, width = 0.5, color = ink.amber }: { label: string; position: V3; width?: number; color?: string }) {
  return <Panel id={`tag:${label}:${color}`} paint={tag(label, color)} size={[width, width * 0.22]} px={[360, 80]} position={position} />;
}

/** A bench with the project's miniature system model on top. */
function Bench({ children, name, context }: { children: React.ReactNode; name: string; context: string }) {
  return (
    <group>
      <Box position={[0, 0.8, 0]} size={[1.6, 0.07, 0.82]} m="timber" />
      <Box position={[0, 0.42, -0.05]} size={[1.5, 0.7, 0.66]} m="graphite" />
      <Panel
        id={`bench:${name}`}
        paint={plaque(name, context)}
        size={[1.44, 0.34]}
        px={[576, 136]}
        position={[0, 0.5, 0.285]}
        glow="sign"
      />
      <group position={[0, 0.835, 0]}>{children}</group>
    </group>
  );
}

function Tobi({ animate }: { animate: boolean }) {
  const [ui, node, services] = wd.tobi.nodes;
  return (
    <>
      <Monitor id="ws-tobi-chat" paint={chatScreen(`TOBi · ${ui.label}`)} position={[-0.38, 0.5, -0.12]} width={0.68} height={0.56} px={[272, 224]} />
      <Box position={[0.25, 0.14, 0.05]} size={[0.34, 0.26, 0.3]} m="graphite" />
      <Tag label={node.label.split(' ')[0].toUpperCase()} position={[0.25, 0.16, 0.205]} width={0.3} color={ink.green} />
      <Blink animate={animate} period={0.7}>
        <Led position={[0.36, 0.24, 0.205]} m="ledGreen" size={0.04} />
      </Blink>
      <Bob animate={animate} amplitude={0.035} position={[0.25, 0.46, 0.05]}>
        <Tag label={wd.tobi.badge} position={[0, 0, 0]} width={0.42} color={ink.butter} />
      </Bob>
      {/* message pipe: UI ⇄ Node.js ⇄ Vodafone services */}
      <Cylinder position={[-0.02, 0.12, 0.05]} radius={0.025} height={0.24} m="pipe" rotation={[0, 0, Math.PI / 2]} />
      <Cylinder position={[0.5, 0.12, 0.05]} radius={0.025} height={0.16} m="pipe" rotation={[0, 0, Math.PI / 2]} />
      {[0, 1, 2].map((i) => (
        <Box key={i} position={[0.66, 0.06 + i * 0.12, -0.05]} size={[0.2, 0.1, 0.34]} m="steel" />
      ))}
      <Tag label={services.label.toUpperCase()} position={[0.62, 0.43, 0.13]} width={0.5} color={ink.seafoam} />
    </>
  );
}

function RealEstate() {
  const towers: [number, number, number, 'cream' | 'seafoam' | 'timber' | 'glass'][] = [
    [-0.62, -0.05, 0.42, 'cream'],
    [-0.42, 0.08, 0.28, 'seafoam'],
    [-0.22, -0.08, 0.5, 'glass'],
    [-0.46, -0.2, 0.2, 'timber'],
    [-0.12, 0.12, 0.24, 'cream'],
  ];
  return (
    <>
      <Box position={[-0.38, 0.02, 0.02]} size={[0.74, 0.04, 0.56]} m="paper" />
      {towers.map(([x, z, h, m], i) => (
        <Box key={i} position={[x, 0.04 + h / 2, z]} size={[0.14, h, 0.14]} m={m} />
      ))}
      <Monitor id="ws-realestate" paint={adminScreen(wd.realEstate.screen, wd.realEstate.toggle)} position={[0.36, 0.5, -0.16]} width={0.7} height={0.5} px={[288, 206]} />
      <Box position={[0.5, 0.08, 0.2]} size={[0.3, 0.16, 0.2]} m="graphite" />
      <Tag label={wd.realEstate.api} position={[0.5, 0.08, 0.305]} width={0.28} color={ink.coral} />
      {[0, 1].map((i) => (
        <Cylinder key={i} position={[0.18, 0.04 + i * 0.07, 0.22]} radius={0.07} height={0.06} m="seafoam" />
      ))}
    </>
  );
}

function Mansour({ animate }: { animate: boolean }) {
  return (
    <>
      <Cylinder position={[-0.38, 0.02, 0.04]} radius={0.34} height={0.04} m="steel" />
      <Spin animate={animate} speed={0.5} position={[-0.38, 0.04, 0.04]}>
        <Box position={[0, 0.09, 0]} size={[0.5, 0.12, 0.26]} m="signal" />
        <Box position={[-0.03, 0.2, 0]} size={[0.26, 0.1, 0.23]} m="glass" />
        {[-0.16, 0.16].flatMap((x) =>
          [-0.13, 0.13].map((z) => (
            <Cylinder key={`${x}${z}`} position={[x, 0.05, z]} radius={0.055} height={0.04} m="ink" rotation={[Math.PI / 2, 0, 0]} />
          )),
        )}
      </Spin>
      <group position={[0.18, 0.3, -0.12]} rotation={[-0.12, -0.25, 0]}>
        <Box size={[0.3, 0.56, 0.035]} m="ink" />
        <Panel id="ws-mansour-phone" paint={phoneScreen} size={[0.26, 0.5]} px={[180, 340]} position={[0, 0, 0.019]} />
      </group>
      <Monitor id="ws-mansour-jobs" paint={jobsBoard(wd.mansour.screen, wd.mansour.jobs)} position={[0.55, 0.42, -0.2]} width={0.42} height={0.36} px={[300, 170]} />
      <Tag label={wd.mansour.sync} position={[0.55, 0.05, 0.25]} width={0.3} color={ink.seafoam} />
    </>
  );
}

function HappyHuman({ animate }: { animate: boolean }) {
  const link = useMemo(() => new TorusGeometry(0.08, 0.022, 8, 20), []);
  return (
    <>
      <Monitor id="ws-happyhuman" paint={streamScreen(wd.happyHuman.screen, wd.happyHuman.badges)} position={[-0.3, 0.5, -0.12]} width={0.72} height={0.54} px={[288, 216]} />
      <Spin animate={animate} speed={0.7} position={[0.45, 0.22, 0.05]}>
        {[-0.12, 0, 0.12].map((x, i) => (
          <mesh key={x} geometry={link} material={material('steel')} position={[x, 0, 0]} rotation={[i % 2 ? Math.PI / 2 : 0, 0, 0]} castShadow />
        ))}
      </Spin>
      <Tag label={wd.happyHuman.chain} position={[0.45, 0.42, 0.05]} width={0.4} color={ink.green} />
      <Box position={[0.42, 0.02, 0.24]} size={[0.24, 0.035, 0.16]} m="butter" />
      <Tag label={wd.happyHuman.badges[0]} position={[0.42, 0.08, 0.33]} width={0.26} color={ink.butter} />
    </>
  );
}

function Rack({ x, animate, phase }: { x: number; animate: boolean; phase: number }) {
  return (
    <group position={[x, SLAB, -1.72]}>
      <Box position={[0, 1.0, 0]} size={[0.62, 2.0, 0.56]} m="graphite" />
      {Array.from({ length: 7 }, (_, i) => (
        <group key={i}>
          <Box position={[0, 0.3 + i * 0.24, 0.285]} size={[0.52, 0.17, 0.02]} m="steel" />
          <Blink animate={animate} period={0.6 + ((i * 7) % 5) * 0.23} phase={phase + i * 0.17} duty={0.7}>
            <Led position={[0.19, 0.3 + i * 0.24, 0.3]} m={i % 3 ? 'ledGreen' : 'ledCyan'} size={0.045} />
          </Blink>
        </group>
      ))}
    </group>
  );
}

/** 03 · The Project Workshop — the centerpiece. Each bench is one CV project. */
export default function ProjectWorkshop({
  animate,
  onOpen,
  onProject,
}: {
  animate: boolean;
  onOpen: () => void;
  onProject: (id: string) => void;
}) {
  const { x, z } = landmarks.workshop;
  const byStation = Object.fromEntries(projects.filter((p) => p.station).map((p) => [p.station, p]));
  return (
    <Landmark onActivate={onOpen} position={[x, 0, z]} lift={0}>
      {/* Slab + safety edge */}
      <Box position={[0, SLAB / 2, 0]} size={[HX * 2, SLAB, HZ * 2]} m="stone" />
      <Box position={[0, SLAB + 0.005, HZ - 0.12]} size={[HX * 2 - 0.3, 0.01, 0.08]} m="butter" shadow={false} />
      <Box position={[0, SLAB + 0.005, -0.62]} size={[HX * 2 - 0.9, 0.01, 0.03]} m="butter" shadow={false} />
      {/* Steel frame */}
      {[-HX + 0.13, HX - 0.13].flatMap((cx) =>
        [-HZ + 0.1, HZ - 0.1].map((cz) => <Box key={`${cx}${cz}`} position={[cx, ROOF / 2, cz]} size={[0.14, ROOF, 0.14]} m="graphite" />),
      )}
      {[-1.24, 1.24].map((cx) => (
        <Box key={cx} position={[cx, ROOF / 2, -HZ + 0.1]} size={[0.12, ROOF, 0.12]} m="graphite" />
      ))}
      {[-HZ + 0.1, HZ - 0.1].map((cz) => (
        <Box key={cz} position={[0, ROOF, cz]} size={[HX * 2, 0.16, 0.16]} m="graphite" />
      ))}
      {[-HX + 0.13, HX - 0.13].map((cx) => (
        <Box key={cx} position={[cx, ROOF, 0]} size={[0.16, 0.16, HZ * 2]} m="graphite" />
      ))}
      {/* Sawtooth roof trusses: skeletal, so the camera sees inside */}
      {[-2.47, 0, 2.47].map((tx) => (
        <group key={tx} position={[tx, ROOF, 0]}>
          {[-HZ + 0.1, HZ - 0.1].map((cz) => (
            <Box key={cz} position={[-0.05, 0.36, cz]} size={[2.5, 0.07, 0.07]} m="graphite" rotation={[0, 0, 0.29]} />
          ))}
          <Box position={[1.18, 0.36, 0]} size={[0.05, 0.72, HZ * 2 - 0.2]} m="glass" />
          <Box position={[-0.05, 0.36, 0]} size={[0.05, 0.05, HZ * 2 - 0.2]} m="steel" rotation={[0, 0, 0.29]} />
        </group>
      ))}
      {/* Rooftop sign */}
      <Panel
        id="ws-sign"
        paint={plaque('PROJECT WORKSHOP', 'CV-BACKED WORK · CLICK A BENCH')}
        size={[3.3, 0.62]}
        px={[1056, 198]}
        position={[-0.9, ROOF + 0.48, HZ - 0.02]}
        glow="sign"
      />
      <Box position={[-0.9, ROOF + 0.13, HZ - 0.06]} size={[0.06, 0.2, 0.06]} m="graphite" />
      {/* Back wall with the TOBi architecture board */}
      <Box position={[0, SLAB + 1.4, -HZ + 0.02]} size={[HX * 2 - 0.3, 2.8, 0.1]} m="cream" />
      <Panel
        id="ws-board"
        paint={flowBoard(wd.tobi.title, wd.tobi.nodes, wd.tobi.badge, wd.tobi.footnote)}
        size={[3.7, 1.75]}
        px={[1024, 484]}
        position={[-1.15, SLAB + 1.72, -HZ + 0.08]}
        glow="sign"
      />
      {/* Cable tray with drops to every bench */}
      <Box position={[0, 2.95, -1.7]} size={[HX * 2 - 0.5, 0.07, 0.3]} m="graphite" />
      {bays.map(({ x: bx }) => (
        <group key={bx} position={[bx, 0, 0]}>
          <Box position={[0.55, 2.94, -0.7]} size={[0.035, 0.035, 2.0]} m="wire" shadow={false} />
          <Box position={[0.55, 2.0, 0.28]} size={[0.035, 1.9, 0.035]} m="wire" shadow={false} />
        </group>
      ))}
      <Rack x={2.55} animate={animate} phase={0} />
      <Rack x={3.25} animate={animate} phase={0.4} />
      {/* Stations */}
      {bays.map(({ station, x: bx }) => {
        const p = byStation[station];
        if (!p) return null;
        return (
          <Landmark key={station} onActivate={() => onProject(p.id)} position={[bx, SLAB, BENCH_Z]}>
            <Bench name={p.name.split(' · ')[0]} context={p.context}>
              {station === 'tobi' && <Tobi animate={animate} />}
              {station === 'real-estate' && <RealEstate />}
              {station === 'mansour' && <Mansour animate={animate} />}
              {station === 'happy-human' && <HappyHuman animate={animate} />}
            </Bench>
          </Landmark>
        );
      })}
      {/* Terminal kiosk (decorative) and the deploy signal */}
      <group position={[-HX + 0.4, SLAB, HZ - 0.55]} rotation={[0, 0.5, 0]}>
        <Box position={[0, 0.45, 0]} size={[0.36, 0.9, 0.3]} m="graphite" />
        <Monitor
          id="ws-terminal"
          paint={terminal([
            ['$ npm test', ink.text],
            ['✓ all passing', ink.green],
            ['$ git push origin main', ink.text],
            ['✓ build · deploy', ink.green],
          ])}
          position={[0, 1.2, 0]}
          rotation={[-0.2, 0, 0]}
          width={0.62}
          height={0.44}
          px={[300, 190]}
          stand={false}
        />
      </group>
      <group position={[HX - 0.35, SLAB, HZ - 0.4]}>
        <Box position={[0, 0.75, 0]} size={[0.05, 1.5, 0.05]} m="graphite" />
        <Box position={[0, 1.62, 0]} size={[0.2, 0.52, 0.16]} m="graphite" />
        <Led position={[0, 1.8, 0.085]} m="ledRed" size={0.1} />
        <Led position={[0, 1.64, 0.085]} m="ledAmber" size={0.1} />
        <Blink animate={animate} period={1.4} duty={0.75}>
          <Led position={[0, 1.48, 0.085]} m="ledGreen" size={0.1} />
        </Blink>
      </group>
    </Landmark>
  );
}
