"use client";

interface MobileOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export function MobileOverlay({ visible, onClose }: MobileOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[55] bg-black/50 md:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}
