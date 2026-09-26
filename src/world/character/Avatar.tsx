import OmarFigure from './models/OmarFigure';
import type { AvatarModelProps } from './avatar-contract';

/**
 * Replacement boundary for the character's LOOK. Swap the model here (for
 * example a GLB loaded with Drei's useGLTF behind Suspense, with OmarFigure
 * as the fallback) without touching the controller, collider or camera.
 * See public/avatar/README.md for the asset contract.
 */
export default function Avatar(props: AvatarModelProps) {
  return <OmarFigure {...props} />;
}
