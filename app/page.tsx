// frontend/src/app/page.tsx

'use client';

import { useCurrency } from './context/CurrencyContext';
import CurrencyLine from './components/CurrencyLine';
import CurrencyAdder from './components/CurrencyAdder';
import { Plus } from 'lucide-react';
import { CurrencyLine as CurrencyLineType } from './utils/types';
import { useState, useRef, useEffect } from 'react';

// DnD Kit Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function Home() {
  const { currencyLines, reorderCurrencies } = useCurrency();
  const [showAdder, setShowAdder] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Configure sensors for Mobile PWA (Touch) and Desktop (Pointer)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), // Prevents accidental drags on click
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }), // Long press for mobile
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = currencyLines.findIndex((item) => item.id === active.id);
      const newIndex = currencyLines.findIndex((item) => item.id === over.id);

      // Safety: Do not allow moving anything to index 0 (EUR position)
      // and do not allow moving index 0 (EUR) itself
      if (oldIndex === 0 || newIndex === 0) return;

      reorderCurrencies(oldIndex, newIndex);
    }
  };

  useEffect(() => {
    if (showAdder && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showAdder]);

  return (
    <main className="min-h-screen p-4 md:p-8 text-gray-900 dark:text-white transition-colors duration-300">
      <div ref={topRef} />

      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 border-b pb-3 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
          Your Currencies
        </h2>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={currencyLines.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {currencyLines.map((currency: CurrencyLineType) => (
              <CurrencyLine
                key={currency.id}
                currency={currency}
                disabled={currency.isBase} // Custom prop to disable drag for EUR
              />
            ))}
          </SortableContext>
        </DndContext>

        <div className="mt-6">
          {!showAdder ? (
            <button
              onClick={() => setShowAdder(true)}
              className="w-full flex items-center justify-center gap-2 py-4 text-lg font-medium text-white bg-blue-600 dark:bg-blue-700 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-800 transition shadow-lg"
            >
              <Plus className="w-6 h-6" />
              Add Currency
            </button>
          ) : (
            <CurrencyAdder onClose={() => setShowAdder(false)} />
          )}
        </div>
      </div>
    </main>
  );
}