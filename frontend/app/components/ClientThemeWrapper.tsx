// frontend/src/app/components/ClientThemeWrapper.tsx
'use client';
import { ReactNode } from 'react';

export default function ClientThemeWrapper({ children }: { children: ReactNode }) {
  return <>{children}</>;
}