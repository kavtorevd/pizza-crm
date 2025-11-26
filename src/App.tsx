import { useState } from 'react';
import type { Pizza, Courier, Order } from './types';
import { PizzaManagement } from './components/PizzaManagement';
import { CourierManagement } from './components/CourierManagement';
import { OrderManagement } from './components/OrderManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Pizza as PizzaIcon, Users, ShoppingCart } from 'lucide-react';

function App() {
  // Начальные данные для пицц
  const [pizzas, setPizzas] = useState<Pizza[]>([
    {
      id: '1',
      name: 'Маргарита',
      description: 'Томатный соус, моцарелла, базилик',
      price: 450,
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMG1hcmdoZXJpdGF8ZW58MXx8fHwxNzYzNTYwMzE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '2',
      name: 'Пепперони',
      description: 'Томатный соус, моцарелла, пепперони, орегано',
      price: 550,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXBwZXJvbmklMjBwaXp6YXxlbnwxfHx8fDE3NjM2NTE2OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '3',
      name: 'Вегетарианская',
      description: 'Томатный соус, моцарелла, грибы, перец, оливки, помидоры',
      price: 500,
      image: 'https://images.unsplash.com/photo-1617343251257-b5d709934ddd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFyaWFuJTIwcGl6emF8ZW58MXx8fHwxNzYzNjA5NTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: true
    },
    {
      id: '4',
      name: 'Гавайская',
      description: 'Томатный соус, моцарелла, ветчина, ананасы',
      price: 520,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXdhaWlhbiUyMHBpenphfGVufDF8fHx8MTc2MzU1MjI5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      available: false
    }
  ]);

  // Начальные данные для курьеров
  const [couriers, setCouriers] = useState<Courier[]>([
    {
      id: '1',
      name: 'Иван Петров',
      phone: '+7 (999) 123-45-67',
      status: 'free'
    },
    {
      id: '2',
      name: 'Мария Сидорова',
      phone: '+7 (999) 234-56-78',
      status: 'free'
    },
    {
      id: '3',
      name: 'Алексей Козлов',
      phone: '+7 (999) 345-67-89',
      status: 'busy',
      currentOrderId: '1'
    }
  ]);

  // Начальные данные для заказов
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      customerName: 'Анна Иванова',
      customerPhone: '+7 (999) 111-22-33',
      customerAddress: 'ул. Пушкина, д. 10, кв. 5',
      items: [
        { pizzaId: '1', pizzaName: 'Маргарита', quantity: 2, price: 450 },
        { pizzaId: '2', pizzaName: 'Пепперони', quantity: 1, price: 550 }
      ],
      total: 1450,
      status: 'delivering',
      courierId: '3',
      courierName: 'Алексей Козлов',
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-15T11:00:00')
    },
    {
      id: '2',
      customerName: 'Петр Смирнов',
      customerPhone: '+7 (999) 222-33-44',
      customerAddress: 'пр. Ленина, д. 45, кв. 12',
      items: [
        { pizzaId: '3', pizzaName: 'Вегетарианская', quantity: 3, price: 500 }
      ],
      total: 1500,
      status: 'preparing',
      createdAt: new Date('2024-01-15T11:00:00'),
      updatedAt: new Date('2024-01-15T11:00:00')
    }
  ]);

  // Функции управления пиццами
  const handleAddPizza = (pizza: Omit<Pizza, 'id'>) => {
    const newPizza: Pizza = {
      ...pizza,
      id: Date.now().toString()
    };
    setPizzas([...pizzas, newPizza]);
  };

  const handleUpdatePizza = (id: string, updates: Partial<Pizza>) => {
    setPizzas(pizzas.map(pizza => pizza.id === id ? { ...pizza, ...updates } : pizza));
  };

  const handleDeletePizza = (id: string) => {
    setPizzas(pizzas.filter(pizza => pizza.id !== id));
  };

  // Функции управления курьерами
  const handleAddCourier = (courier: Omit<Courier, 'id'>) => {
    const newCourier: Courier = {
      ...courier,
      id: Date.now().toString()
    };
    setCouriers([...couriers, newCourier]);
  };

  const handleUpdateCourier = (id: string, updates: Partial<Courier>) => {
    setCouriers(couriers.map(courier => courier.id === id ? { ...courier, ...updates } : courier));
  };

  const handleDeleteCourier = (id: string) => {
    // Проверяем, есть ли у курьера активные заказы
    const courier = couriers.find(c => c.id === id);
    if (courier?.currentOrderId) {
      alert('Нельзя удалить курьера с активным заказом');
      return;
    }
    setCouriers(couriers.filter(courier => courier.id !== id));
  };

  // Функции управления заказами
  const handleAddOrder = (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setOrders([...orders, newOrder]);
  };

  const handleUpdateOrder = (id: string, updates: Partial<Order>) => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        const updatedOrder = { ...order, ...updates, updatedAt: new Date() };
        
        // Если заказ завершен или отменен, освобождаем курьера
        if ((updates.status === 'completed' || updates.status === 'cancelled') && order.courierId) {
          setCouriers(couriers.map(courier => 
            courier.id === order.courierId 
              ? { ...courier, status: 'free', currentOrderId: undefined }
              : courier
          ));
        }
        
        return updatedOrder;
      }
      return order;
    }));
  };

  const handleDeleteOrder = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (order?.courierId) {
      // Освобождаем курьера
      setCouriers(couriers.map(courier => 
        courier.id === order.courierId 
          ? { ...courier, status: 'free', currentOrderId: undefined }
          : courier
      ));
    }
    setOrders(orders.filter(order => order.id !== id));
  };

  const handleAssignCourier = (orderId: string, courierId: string) => {
    const order = orders.find(o => o.id === orderId);
    const courier = couriers.find(c => c.id === courierId);
    
    if (!order || !courier) return;

    // Освобождаем предыдущего курьера, если он был назначен
    if (order.courierId) {
      setCouriers(couriers.map(c => 
        c.id === order.courierId 
          ? { ...c, status: 'free', currentOrderId: undefined }
          : c
      ));
    }

    // Назначаем нового курьера
    setOrders(orders.map(o => 
      o.id === orderId 
        ? { ...o, courierId, courierName: courier.name, status: 'delivering', updatedAt: new Date() }
        : o
    ));

    setCouriers(couriers.map(c => 
      c.id === courierId 
        ? { ...c, status: 'busy', currentOrderId: orderId }
        : c
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <PizzaIcon className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-orange-600">Pizza CRM</h1>
              <p className="text-gray-600 text-sm">Система управления заказами</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <ShoppingCart className="size-4 mr-2" />
              Заказы
            </TabsTrigger>
            <TabsTrigger value="pizzas" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <PizzaIcon className="size-4 mr-2" />
              Меню
            </TabsTrigger>
            <TabsTrigger value="couriers" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Users className="size-4 mr-2" />
              Курьеры
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderManagement
              orders={orders}
              pizzas={pizzas}
              couriers={couriers}
              onAddOrder={handleAddOrder}
              onUpdateOrder={handleUpdateOrder}
              onDeleteOrder={handleDeleteOrder}
              onAssignCourier={handleAssignCourier}
            />
          </TabsContent>

          <TabsContent value="pizzas">
            <PizzaManagement
              pizzas={pizzas}
              onAddPizza={handleAddPizza}
              onUpdatePizza={handleUpdatePizza}
              onDeletePizza={handleDeletePizza}
            />
          </TabsContent>

          <TabsContent value="couriers">
            <CourierManagement
              couriers={couriers}
              onAddCourier={handleAddCourier}
              onUpdateCourier={handleUpdateCourier}
              onDeleteCourier={handleDeleteCourier}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
