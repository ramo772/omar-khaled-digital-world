# Replaceable human avatar

The current character is an original, generic stylized HUMAN developer, not a likeness of Omar. The small robot belongs only to the AI Lab.

The replacement boundary is `src/world/character/Avatar.tsx`. Keep its forwarded `Group` ref and `moving` / `reducedMotion` inputs intact. `Controller.tsx` owns position and heading; it must not be rewritten for a new model.

For a future approved cartoon based on Omar's real photo:

1. Put the licensed/owned binary glTF file at `public/avatar/developer.glb`.
2. Normalize the model to approximately 1.7 world units tall, feet at Y=0, Y-up, facing +Z. Apply any model-specific correction inside Avatar, never on the controller root.
3. Keep the existing horizontal collider radius of 0.28. Camera and interaction distances use this human scale independently of visual geometry.
4. Load the model inside Avatar with Drei `useGLTF`, behind Suspense and an asset error boundary. Keep the procedural human as the loading/error fallback.
5. Optional animation clips should be called `Idle` and `Walk`. Cross-fade based on `moving.current`; reduced motion uses a still pose. Animations must not contain root motion.
6. Aim for under 20,000 triangles, no more than four materials, one 1024px texture atlas, and under 2 MB compressed total. Introduce Meshopt/Draco only if the asset benefits enough to justify the decoder cost.

There is no automatic likeness generator, photo upload, or remote asset fetch. No model is required for the current procedural avatar.
