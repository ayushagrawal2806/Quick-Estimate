
export interface RowData {
  id: number;
  sizeFt: number; // Column A
  sizeM: number;  // Column B
  pcs: number;    // Column C
  rate: number;   // Column E
}

export interface CalculatedRow extends RowData {
  totalRunningMeter: number; // Column D (B * C)
  totalAmount: number;       // Column F (D * E)
}
