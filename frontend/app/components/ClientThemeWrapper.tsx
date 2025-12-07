// frontend/src/app/components/ClientThemeWrapper.tsx
'use client';

import React, { useEffect, ReactNode } from 'react';
import { useCurrency } from '../context/CurrencyContext'; // This hook uses useContext

interface AppWrapperProps {
    children: ReactNode;
}

// Component to apply the 'dark' class at the document element level
export default function ClientThemeWrapper({ children }: AppWrapperProps) {
  const { isDarkMode } = useCurrency(); // Now safe to use useContext/useCurrency

  useEffect(() => {
    // Now safe to use useEffect
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return children;
}