export interface RecentOrder {
  orderId: number;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}
export interface DashboardSummary {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
}