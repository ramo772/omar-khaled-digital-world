'use client';
import type { ReactNode } from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { XIcon } from 'lucide-react';

/**
 * Side sheet on desktop, bottom sheet on phones. Built on Base UI Dialog:
 * focus trap, Escape to close, inert background, labelled by its title.
 */
export default function Sheet({
  open,
  onClose,
  title,
  eyebrow,
  description,
  wide,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  wide?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="sheet-backdrop" />
        <DialogPrimitive.Popup className={`sheet ${wide ? 'sheet-wide' : ''}`}>
          <header className="sheet-header">
            <div>
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              <DialogPrimitive.Title className="sheet-title">{title}</DialogPrimitive.Title>
              {description && <DialogPrimitive.Description className="sheet-description">{description}</DialogPrimitive.Description>}
            </div>
            <DialogPrimitive.Close className="icon-button sheet-close" aria-label="Close">
              <XIcon size={18} aria-hidden="true" />
            </DialogPrimitive.Close>
          </header>
          <div className="sheet-body">{children}</div>
          {footer && <footer className="sheet-footer">{footer}</footer>}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
