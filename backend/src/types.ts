export type UnifiedStatus = 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';

export interface UnifiedOrder {
  orderId: string;
  sourceSystem: 'SystemA' | 'SystemB';
  customerName: string;
  orderDate: string; // ISO YYYY-MM-DD
  totalAmount: number;
  status: UnifiedStatus;
}
