// frontend/src/app/components/ClientThemeWrapper.tsx
'use client';
import { ReactNode, useEffect } from 'react';

export default function ClientThemeWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Prevent iOS Safari / WebKit pinch-to-zoom gestures
    const handleGesture = (e: Event) => {
      e.preventDefault();
    };

    // Prevent multi-touch pinch zoom gestures on touchscreens
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent trackpad Ctrl + Wheel zoom
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener('gesturestart', handleGesture);
    document.addEventListener('gesturechange', handleGesture);
    document.addEventListener('gestureend', handleGesture);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      document.removeEventListener('gesturestart', handleGesture);
      document.removeEventListener('gesturechange', handleGesture);
      document.removeEventListener('gestureend', handleGesture);
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return <>{children}</>;
}