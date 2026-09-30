export interface MyOrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface MyOrder {
  id: number;
  userId: string;
  orderDate: string;
  status: number | string;   // ASP.NET sends enums as numbers unless configured otherwise
  totalAmount: number;
  shippingAddress: string;
  items: MyOrderItem[];
}


export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items?: OrderItem[];   // present when fetching a single order or "my orders"; admin's list view may omit it
}

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
  shippingAddress: string;
}