interface ImportMetaEnv {
  /** Public origin of the deployment, e.g. https://omar-khaled.pages.dev */
  readonly VITE_SITE_URL?: string;
  /** "true" to allow search-engine indexing (public launch). */
  readonly VITE_SITE_INDEX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
