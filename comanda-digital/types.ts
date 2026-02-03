
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  category: string;
  status: 'PENDING' | 'DONE';
  timestamp: number;
}

export interface Table {
  id: number;
  orders: OrderItem[];
  customerName?: string;
  isClosed?: boolean;
}

export interface DailyStats {
  totalRevenue: number;
  completedOrdersCount: number;
  history: {
    tableId: number;
    amount: number;
    timestamp: number;
    withService: boolean;
  }[];
}
