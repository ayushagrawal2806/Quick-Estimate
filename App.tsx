
import React, { useState, useCallback } from 'react';
import { EstimateItem } from './types';
import EstimateTable from './components/EstimateTable';

export const SIZE_OPTIONS = [
  { ft: 6, meter: 1.75 },
  { ft: 6.5, meter: 2 },
  { ft: 8, meter: 2.5 },
  { ft: 10, meter: 3 },
  { ft: 12, meter: 3.6 },
];

const App: React.FC = () => {
  // Start with an empty list as requested
  const [items, setItems] = useState<EstimateItem[]>([]);
  
  const calculateGrandTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.total, 0);
  }, [items]);

  const updateItem = (id: string, updates: Partial<EstimateItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const merged = { ...item, ...updates };
        // Formula: sizeMeter * pcs * rate
        merged.total = merged.sizeMeter * (merged.pcs || 0) * (merged.rate || 0);
        return merged;
      }
      return item;
    }));
  };

  const addRow = () => {
    const defaultSize = SIZE_OPTIONS[0];
    const newItem: EstimateItem = {
      id: Math.random().toString(36).substr(2, 9),
      sizeFt: defaultSize.ft,
      sizeMeter: defaultSize.meter,
      pcs: 0,
      rate: 0,
      total: 0
    };
    setItems(prev => [...prev, newItem]);
  };

  const removeRow = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 no-print">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">Q</div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">QuickEstimate</h1>
          </div>
          {/* Print and Clear buttons removed as requested */}
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div className="p-10 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Billing Calculator</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Personal Calculation Sheet</p>
            <p className="text-slate-400 text-xs mt-4">Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="p-0 sm:p-6">
            {items.length > 0 ? (
              <EstimateTable 
                items={items} 
                onUpdate={updateItem}
                onAddRow={addRow}
                onRemoveRow={removeRow}
              />
            ) : (
              <div className="py-20 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4 text-slate-300">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-700">No items added</h3>
                <p className="text-slate-500 mb-6">Click the button below to start adding rows</p>
                <button 
                  onClick={addRow}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95"
                >
                  Add First Row
                </button>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-12 bg-slate-900 text-white">
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-12">
                  <span className="text-2xl font-black uppercase tracking-tighter text-indigo-400">Total Amount</span>
                  <span className="text-6xl font-black mono tracking-tighter">₹{calculateGrandTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <button 
        onClick={addRow}
        className="fixed bottom-10 right-10 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 no-print z-30"
        title="Add Row"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default App;
