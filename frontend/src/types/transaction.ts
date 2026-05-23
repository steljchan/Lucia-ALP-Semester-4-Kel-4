export type Transaction = {
  id?: string;
  uid: string;
  itemId: string;
  itemName: string;
  coin: number;
  heart: number;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status:
    | "pending"
    | "paid"
    | "failed";
  granted: boolean;
};