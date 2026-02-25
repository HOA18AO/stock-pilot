import { ReactNode } from 'react';

interface OverlayBackdropProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function OverlayBackdrop({ children, className = '', onClick }: OverlayBackdropProps) {
  return (
    <div
      className={`overlay-blur ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
