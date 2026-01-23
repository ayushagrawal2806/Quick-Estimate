
import React from 'react';
import { EstimateItem } from '../types';
import { SIZE_OPTIONS } from '../App';

interface EstimateTableProps {
  items: EstimateItem[];
  onUpdate: (id: string, updates: Partial<EstimateItem>) => void;
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
}

const EstimateTable: React.FC<EstimateTableProps> = ({ items, onUpdate, onAddRow, onRemoveRow }) => {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-200 bg-slate-50/50">
              <th className="px-6 py-5 text-left text-xs font-black text-slate-400 uppercase tracking-[0.2em] w-16">#</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Size in Feet</th>
              <th className="px-6 py-5 text-left text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Size in Meter</th>
              <th className="px-6 py-5 text-left text-xs font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50/50">PCS</th>
              <th className="px-6 py-5 text-left text-xs font-black text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50/50">RATE</th>
              <th className="px-6 py-5 text-right text-xs font-black text-slate-900 uppercase tracking-[0.2em]">TOTAL</th>
              <th className="px-6 py-5 w-10 no-print"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => (
              <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-6 py-5 text-sm font-mono text-slate-300">{(index + 1).toString().padStart(2, '0')}</td>
                
                {/* Size Selection Column (Dropdown) */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 min-w-[140px]">
                    <select 
                      className="bg-transparent border-none p-0 text-xl font-black text-slate-800 focus:ring-0 cursor-pointer hover:text-indigo-600 transition-colors"
                      value={item.sizeFt}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        const match = SIZE_OPTIONS.find(s => s.ft === val);
                        if (match) {
                          onUpdate(item.id, { sizeFt: match.ft, sizeMeter: match.meter });
                        }
                      }}
                    >
                      {SIZE_OPTIONS.map(opt => (
                        <option key={opt.ft} value={opt.ft}>{opt.ft} FT</option>
                      ))}
                    </select>
                  </div>
                </td>
                
                {/* Linked Meter Size Column (Read-only display) */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-1.5 min-w-[140px]">
                    <span className="text-xl font-black text-slate-400">{item.sizeMeter}</span>
                    <span className="text-slate-300 font-bold text-sm">METER</span>
                  </div>
                </td>

                {/* Editable User Columns */}
                <td className="px-6 py-5 bg-indigo-50/20 group-hover:bg-indigo-50/40 transition-colors">
                  <input 
                    type="number"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xl font-bold text-indigo-700 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                    value={item.pcs || ''}
                    placeholder="0"
                    onChange={(e) => onUpdate(item.id, { pcs: parseInt(e.target.value) || 0 })}
                  />
                </td>
                <td className="px-6 py-5 bg-indigo-50/20 group-hover:bg-indigo-50/40 transition-colors">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300 font-bold">₹</span>
                    <input 
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-2 text-xl font-bold text-indigo-700 shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
                      value={item.rate || ''}
                      placeholder="0.00"
                      onChange={(e) => onUpdate(item.id, { rate: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </td>

                <td className="px-6 py-5 text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-slate-900 mono tracking-tighter">
                      ₹{item.total.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Calculated</span>
                  </div>
                </td>

                <td className="px-6 py-5 no-print text-center">
                  <button 
                    onClick={() => onRemoveRow(item.id)}
                    className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    title="Remove Row"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 p-4 no-print">
        <button 
          onClick={onAddRow}
          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black uppercase tracking-widest text-xs hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Custom Size Row
        </button>
      </div>
    </div>
  );
};

export default EstimateTable;
