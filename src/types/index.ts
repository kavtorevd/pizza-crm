export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  status: 'free' | 'busy';
  currentOrderId?: string;
}

export interface OrderItem {
  pizzaId: string;
  pizzaName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  courierId?: string;
  courierName?: string;
  createdAt: Date;
  updatedAt: Date;
}
