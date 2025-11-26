import { useState } from 'react';
import type { Order, Pizza, Courier } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, ShoppingBag, User, Phone, MapPin, Trash2 } from 'lucide-react';

interface OrderManagementProps {
  orders: Order[];
  pizzas: Pizza[];
  couriers: Courier[];
  onAddOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateOrder: (id: string, order: Partial<Order>) => void;
  onDeleteOrder: (id: string) => void;
  onAssignCourier: (orderId: string, courierId: string) => void;
}

const statusConfig = {
  pending: { label: 'Ожидает', color: 'bg-gray-100 text-gray-800' },
  preparing: { label: 'Готовится', color: 'bg-blue-100 text-blue-800' },
  ready: { label: 'Готов', color: 'bg-green-100 text-green-800' },
  delivering: { label: 'Доставляется', color: 'bg-orange-100 text-orange-800' },
  completed: { label: 'Завершен', color: 'bg-emerald-100 text-emerald-800' },
  cancelled: { label: 'Отменен', color: 'bg-red-100 text-red-800' }
};

export function OrderManagement({ orders, pizzas, couriers, onAddOrder, onUpdateOrder, onDeleteOrder, onAssignCourier }: OrderManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    items: [] as { pizzaId: string; quantity: number }[]
  });

  const availablePizzas = pizzas.filter(p => p.available);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const orderItems = formData.items.map(item => {
      const pizza = pizzas.find(p => p.id === item.pizzaId);
      return {
        pizzaId: item.pizzaId,
        pizzaName: pizza?.name || '',
        quantity: item.quantity,
        price: pizza?.price || 0
      };
    });

    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    onAddOrder({
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      items: orderItems,
      total,
      status: 'pending'
    });

    setIsAddDialogOpen(false);
    setFormData({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      items: []
    });
  };

  const addPizzaToOrder = () => {
    if (availablePizzas.length > 0) {
      setFormData({
        ...formData,
        items: [...formData.items, { pizzaId: availablePizzas[0].id, quantity: 1 }]
      });
    }
  };

  const removePizzaFromOrder = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const updatePizzaInOrder = (index: number, pizzaId: string, quantity: number) => {
    const newItems = [...formData.items];
    newItems[index] = { pizzaId, quantity };
    setFormData({ ...formData, items: newItems });
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    onUpdateOrder(orderId, { status: newStatus });
  };

  const handleAssignCourier = (orderId: string, courierId: string) => {
    onAssignCourier(orderId, courierId);
  };

  const activeOrders = orders.filter(o => !['completed', 'cancelled'].includes(o.status));
  const completedOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-outline text-[18px]">Управление заказами</h2>
          <p className="text-gray-600">Отслеживайте и управляйте заказами пиццы</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="size-4 mr-2" />
              Создать заказ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Создать новый заказ</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="customerName">Имя клиента</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Телефон клиента</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="customerAddress">Адрес доставки</Label>
                <Input
                  id="customerAddress"
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Пиццы в заказе</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPizzaToOrder}
                    disabled={availablePizzas.length === 0}
                  >
                    <Plus className="size-4 mr-2" />
                    Добавить пиццу
                  </Button>
                </div>
                
                {formData.items.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 text-sm">Добавьте пиццы в заказ</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg">
                        <Select
                          value={item.pizzaId}
                          onValueChange={(value: string) => updatePizzaInOrder(index, value, item.quantity)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availablePizzas.map((pizza) => (
                              <SelectItem key={pizza.id} value={pizza.id}>
                                {pizza.name} - {pizza.price} ₽
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updatePizzaInOrder(index, item.pizzaId, parseInt(e.target.value))}
                          className="w-20"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removePizzaFromOrder(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={formData.items.length === 0}>
                Создать заказ
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 mb-2">Всего заказов</p>
          <p className="text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-blue-700 mb-2">Активные</p>
          <p className="text-blue-900">{activeOrders.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-700 mb-2">Завершено</p>
          <p className="text-green-900">{completedOrders.filter(o => o.status === 'completed').length}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <p className="text-orange-700 mb-2">Доход (₽)</p>
          <p className="text-orange-900">
            {completedOrders
              .filter(o => o.status === 'completed')
              .reduce((sum, o) => sum + o.total, 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-gray-900">Активные заказы</h3>
        {activeOrders.length > 0 ? (
          <div className="space-y-4">
            {activeOrders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-gray-900">Заказ #{order.id}</h4>
                      <Badge className={statusConfig[order.status].color}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="size-4" />
                        {order.customerName}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="size-4" />
                        {order.customerPhone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        {order.customerAddress}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-600">{order.total} ₽</p>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="size-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Состав заказа:</span>
                  </div>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-700 pl-6">
                        {item.pizzaName} × {item.quantity} = {(item.price * item.quantity).toFixed(2)} ₽
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm mb-2 block">Статус заказа</Label>
                    <Select
                      value={order.status}
                      onValueChange={(value: Order['status']) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Ожидает</SelectItem>
                        <SelectItem value="preparing">Готовится</SelectItem>
                        <SelectItem value="ready">Готов</SelectItem>
                        <SelectItem value="delivering">Доставляется</SelectItem>
                        <SelectItem value="completed">Завершен</SelectItem>
                        <SelectItem value="cancelled">Отменен</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm mb-2 block">Курьер</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={order.courierId || ''} 
                        onValueChange={(value: string) => handleAssignCourier(order.id, value)}
                        disabled={order.status === 'completed' || order.status === 'cancelled'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Назначить курьера" />
                        </SelectTrigger>
                        <SelectContent>
                          {couriers
                            .filter(c => c.status === 'free' || c.id === order.courierId)
                            .map((courier) => (
                              <SelectItem key={courier.id} value={courier.id}>
                                {courier.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => onDeleteOrder(order.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Нет активных заказов</p>
          </div>
        )}
      </div>

      {completedOrders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-gray-900">Завершенные заказы</h3>
          <div className="space-y-4">
            {completedOrders.map((order) => (
              <div key={order.id} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-gray-900">Заказ #{order.id}</h4>
                      <Badge className={statusConfig[order.status].color}>
                        {statusConfig[order.status].label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="size-4" />
                        {order.customerName}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="size-4" />
                        {order.customerPhone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        {order.customerAddress}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-600">{order.total} ₽</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-700">
                      {item.pizzaName} × {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
