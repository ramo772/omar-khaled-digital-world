import { Focus, Leaf, Maximize2, Minus, Plus, RotateCcw, Type } from 'lucide-react';

/** Small, labelled world controls. All are optional conveniences. */
export default function WorldSettings({
  zoom,
  follow,
  lowQuality,
  textOnly,
  entered,
  onZoom,
  onFollow,
  onReset,
  onQuality,
  onTextOnly,
}: {
  zoom: number;
  follow: boolean;
  lowQuality: boolean;
  textOnly: boolean;
  entered: boolean;
  onZoom: (z: number) => void;
  onFollow: (f: boolean) => void;
  onReset: () => void;
  onQuality: (low: boolean) => void;
  onTextOnly: (t: boolean) => void;
}) {
  return (
    <div className="world-settings" role="toolbar" aria-label="World settings">
      {!textOnly && (
        <>
          <button type="button" className="icon-button optional" aria-label="Zoom in" disabled={zoom >= 1.3} onClick={() => onZoom(Math.min(1.3, zoom + 0.15))}>
            <Plus aria-hidden="true" size={16} />
          </button>
          <button type="button" className="icon-button optional" aria-label="Zoom out" disabled={zoom <= 0.75} onClick={() => onZoom(Math.max(0.75, zoom - 0.15))}>
            <Minus aria-hidden="true" size={16} />
          </button>
          {entered && (
            <button
              type="button"
              className="icon-button"
              aria-label={follow ? 'Show the whole world' : 'Follow Omar'}
              aria-pressed={!follow}
              onClick={() => onFollow(!follow)}
            >
              {follow ? <Maximize2 aria-hidden="true" size={16} /> : <Focus aria-hidden="true" size={16} />}
            </button>
          )}
          <button type="button" className="icon-button" aria-label="Reset view and position" onClick={onReset}>
            <RotateCcw aria-hidden="true" size={16} />
          </button>
          <span className="divider optional" aria-hidden="true" />
          <button
            type="button"
            className="icon-button optional"
            aria-label="Low graphics mode"
            aria-pressed={lowQuality}
            onClick={() => onQuality(!lowQuality)}
          >
            <Leaf aria-hidden="true" size={16} />
          </button>
        </>
      )}
      <button
        type="button"
        className="icon-button"
        aria-label={textOnly ? 'Return to the 3D world' : 'Text-only mode'}
        aria-pressed={textOnly}
        onClick={() => onTextOnly(!textOnly)}
      >
        <Type aria-hidden="true" size={16} />
      </button>
    </div>
  );
}
