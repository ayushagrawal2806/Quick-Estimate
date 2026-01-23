
export interface EstimateItem {
  id: string;
  sizeFt: number;
  sizeMeter: number;
  pcs: number;
  rate: number;
  total: number;
}

export interface EstimateData {
  items: EstimateItem[];
  grandTotal: number;
  customerName?: string;
  date?: string;
}
