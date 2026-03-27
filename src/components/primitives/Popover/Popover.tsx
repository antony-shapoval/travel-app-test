import React from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  size,
  FloatingPortal,
} from '@floating-ui/react';
import styles from './Popover.module.css';

interface PopoverProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  children: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({ open, anchorRef, children }) => {
  const { refs, floatingStyles } = useFloating({
    open,
    elements: { reference: anchorRef.current },
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip(),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
  });

  if (!open) return null;

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        style={floatingStyles}
        className={styles.popover}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};
