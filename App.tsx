import React, { useState, useMemo } from "react";
import { RowData, CalculatedRow } from "./types";
import {
  Calculator,
  Hash,
  Ruler,
  Trash2,
  IndianRupee,
  MoveRight,
} from "lucide-react";

// CSS to hide number input spinners
const hideSpinnerStyles = `
  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const INITIAL_ROWS: RowData[] = [
  { id: 1, sizeFt: 6, sizeM: 1.75, pcs: 0, rate: 0 },
  { id: 2, sizeFt: 6.5, sizeM: 2, pcs: 0, rate: 0 },
  { id: 3, sizeFt: 8, sizeM: 2.5, pcs: 0, rate: 0 },
  { id: 4, sizeFt: 10, sizeM: 3, pcs: 0, rate: 0 },
  { id: 5, sizeFt: 12, sizeM: 3.6, pcs: 0, rate: 0 },
];

const App: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>(INITIAL_ROWS);

  const calculatedRows = useMemo<CalculatedRow[]>(() => {
    return rows.map((row) => {
      const totalRunningMeter = Number((row.sizeM * row.pcs).toFixed(2));
      const totalAmount = Number((totalRunningMeter * row.rate).toFixed(2));
      return {
        ...row,
        totalRunningMeter,
        totalAmount,
      };
    });
  }, [rows]);

  const grandTotal = useMemo(() => {
    return calculatedRows.reduce((sum, row) => sum + row.totalAmount, 0);
  }, [calculatedRows]);

  const totalMetersExcept36 = useMemo(() => {
    return calculatedRows
      .filter((row) => row.sizeM !== 3.6)
      .reduce((sum, row) => sum + row.totalRunningMeter, 0);
  }, [calculatedRows]);

  const totalMeters36 = useMemo(() => {
    return calculatedRows
      .filter((row) => row.sizeM === 3.6)
      .reduce((sum, row) => sum + row.totalRunningMeter, 0);
  }, [calculatedRows]);

  const handleInputChange = (
    id: number,
    field: "pcs" | "rate",
    val: string,
  ) => {
    // Treat empty string as 0, but allow decimal input
    const num = val === "" ? 0 : parseFloat(val);
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: isNaN(num) ? 0 : num } : row,
      ),
    );
  };

  const resetAll = () => {
    setRows(INITIAL_ROWS);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-32">
      <style>{hideSpinnerStyles}</style>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <Calculator className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-slate-800">
                Meter Calc
              </h1>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Professional Estimator
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">
              Grand Total
            </p>
            <p className="text-2xl font-black text-indigo-600 flex items-center justify-end">
              <span className="text-lg mr-0.5">₹</span>
              {grandTotal.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-8">
        {/* Unified Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculatedRows.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                    <Ruler className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {row.sizeFt}{" "}
                      <span className="text-sm font-normal text-slate-400">
                        ft
                      </span>
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-tighter">
                      {row.sizeM}m Constant
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Subtotal
                  </p>
                  <p className="font-bold text-indigo-600 text-lg">
                    ₹
                    {row.totalAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Pieces Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase font-bold text-slate-500 flex items-center gap-1.5 ml-1">
                      <Hash className="w-3 h-3 text-indigo-400" /> Pieces
                    </label>
                    <input
                      type="number"
                      value={row.pcs === 0 ? "" : row.pcs}
                      onChange={(e) =>
                        handleInputChange(row.id, "pcs", e.target.value)
                      }
                      placeholder="0"
                      className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-base font-bold text-slate-800 placeholder:text-slate-300"
                    />
                  </div>

                  {/* Rate Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase font-bold text-slate-500 flex items-center gap-1.5 ml-1">
                      <IndianRupee className="w-3 h-3 text-emerald-500" /> Rate
                    </label>
                    <input
                      type="number"
                      value={row.rate === 0 ? "" : row.rate}
                      onChange={(e) =>
                        handleInputChange(row.id, "rate", e.target.value)
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-3 border-2 border-slate-100 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-base font-bold text-slate-800 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {/* Expanded Rate Summary with all details */}
                <div className="space-y-2 py-3 px-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                      Full Calculation Breakdown
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 mt-1">
                    {/* Step 1: Running Meter Calculation */}
                    <div className="flex justify-between items-center text-xs font-medium">
                      <div className="flex items-center gap-1 text-slate-500">
                        <span>{row.sizeM}m</span>
                        <span className="text-[10px]">×</span>
                        <span>{row.pcs || 0} pcs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MoveRight size={10} className="text-indigo-300" />
                        <span className="font-mono text-indigo-700 font-bold">
                          {row.totalRunningMeter.toFixed(2)}m
                        </span>
                      </div>
                    </div>

                    {/* Step 2: Amount Calculation */}
                    <div className="flex justify-between items-center text-xs font-medium border-t border-indigo-100/50 pt-1 mt-1">
                      <div className="flex items-center gap-1 text-slate-500">
                        <span>{row.totalRunningMeter.toFixed(2)}m</span>
                        <span className="text-[10px]">×</span>
                        <span>₹{row.rate || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MoveRight size={10} className="text-indigo-300" />
                        <span className="font-bold text-emerald-600">
                          ₹
                          {row.totalAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Footer */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-2xl w-full flex gap-4">
            <div className="shrink-0">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                i
              </div>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">
                How it works
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The calculator takes the{" "}
                <span className="font-bold text-slate-700">Size (meters)</span>{" "}
                and multiplies it by the{" "}
                <span className="font-bold text-slate-700">Pieces</span> to find
                the total{" "}
                <span className="font-bold text-slate-700">Running Meters</span>
                . This is then multiplied by your{" "}
                <span className="font-bold text-slate-700">
                  Rate (per meter)
                </span>{" "}
                to give the total for that row.
              </p>
            </div>
          </div>

          <button
            onClick={resetAll}
            className="flex items-center gap-2 px-8 py-3 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-600 hover:text-rose-600 rounded-xl font-bold transition-all shadow-sm active:scale-95 group"
          >
            <Trash2 size={18} className="group-hover:animate-pulse" />
            Reset All Fields
          </button>
        </div>
      </main>

      {/* Persistent Grand Total Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-6 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-30">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between gap-6 mb-4">
            <div className="hidden sm:block">
              <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                Estimation Summary
              </h5>
              <p className="text-slate-500 text-xs">
                Dynamic Calculation • All items are autosaved
              </p>
            </div>
            <div className="flex-1 sm:flex-initial text-center sm:text-right">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block mb-0.5">
                Grand Total Amount
              </span>
              <span className="text-3xl font-black text-indigo-600 tracking-tight">
                ₹
                {grandTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Total Meters Breakdown */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="text-center sm:text-left">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">
                Total Meters
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {totalMetersExcept36.toFixed(2)}m
              </p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">
                Total 3.6 Meters
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {totalMeters36.toFixed(2)}m
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
