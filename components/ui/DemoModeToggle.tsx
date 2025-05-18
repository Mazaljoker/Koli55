'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { USE_DEMO_DATA, toggleDemoMode } from '../../lib/supabaseClient';
import dynamic from 'next/dynamic';

// Import dynamique de l'info sur le mode démo
const DemoModeInfo = dynamic(
  () => import('./DemoModeInfo'),
  { ssr: false }
);

export default function DemoModeToggle() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log("[DemoModeToggle] Initializing component, USE_DEMO_DATA:", USE_DEMO_DATA);
    setIsDemoMode(USE_DEMO_DATA);
    setIsMounted(true);
  }, []);

  const handleToggle = () => {
    console.log("[DemoModeToggle] Toggle clicked, current state:", isDemoMode);
    try {
      const newValue = toggleDemoMode();
      console.log("[DemoModeToggle] New value set:", newValue);
      setIsDemoMode(newValue);
    } catch (error) {
      console.error("[DemoModeToggle] Error toggling demo mode:", error);
    }
  };

  if (!isMounted) {
    return null; // Éviter tout rendu pendant le montage du composant
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-2 py-1 bg-amber-50 rounded-lg border border-amber-200">
        <Switch
          checked={isDemoMode}
          onChange={handleToggle}
          className={`${
            isDemoMode ? 'bg-blue-600' : 'bg-gray-300'
          } relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Mode démo</span>
          <span
            aria-hidden="true"
            className={`${
              isDemoMode ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        <span className="text-xs font-medium text-amber-700">
          {isDemoMode ? 'Mode démo actif' : 'Mode production'}
        </span>
      </div>
      <div className="mt-1 flex justify-center">
        <DemoModeInfo />
      </div>
    </div>
  );
} 