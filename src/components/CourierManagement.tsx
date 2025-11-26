import { useState } from 'react';
import type { Courier } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Plus, UserCircle, Phone, Pencil, Trash2 } from 'lucide-react';

interface CourierManagementProps {
  couriers: Courier[];
  onAddCourier: (courier: Omit<Courier, 'id'>) => void;
  onUpdateCourier: (id: string, courier: Partial<Courier>) => void;
  onDeleteCourier: (id: string) => void;
}

export function CourierManagement({ couriers, onAddCourier, onUpdateCourier, onDeleteCourier }: CourierManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourier, setEditingCourier] = useState<Courier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourier) {
      onUpdateCourier(editingCourier.id, formData);
      setEditingCourier(null);
    } else {
      onAddCourier({
        ...formData,
        status: 'free'
      });
      setIsAddDialogOpen(false);
    }
    setFormData({ name: '', phone: '' });
  };

  const handleEdit = (courier: Courier) => {
    setEditingCourier(courier);
    setFormData({
      name: courier.name,
      phone: courier.phone
    });
  };

  const handleCancel = () => {
    setEditingCourier(null);
    setFormData({ name: '', phone: '' });
  };

  const freeCouriers = couriers.filter(c => c.status === 'free');
  const busyCouriers = couriers.filter(c => c.status === 'busy');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-orange-600">Управление курьерами</h2>
          <p className="text-gray-600">Отслеживайте статус курьеров и управляйте командой</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="size-4 mr-2" />
              Добавить курьера
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить нового курьера</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Добавить курьера
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 mb-2">Всего курьеров</p>
          <p className="text-gray-900">{couriers.length}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-700 mb-2">Свободны</p>
          <p className="text-green-900">{freeCouriers.length}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <p className="text-orange-700 mb-2">Заняты</p>
          <p className="text-orange-900">{busyCouriers.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-gray-900">Свободные курьеры</h3>
        {freeCouriers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeCouriers.map((courier) => (
              <div key={courier.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <UserCircle className="size-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-gray-900">{courier.name}</h4>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Phone className="size-3" />
                        {courier.phone}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Свободен</Badge>
                </div>
                <div className="flex gap-2">
                  <Dialog open={editingCourier?.id === courier.id} onOpenChange={(open: boolean) => { if (!open) handleCancel(); }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                        onClick={() => handleEdit(courier)}
                      >
                        <Pencil className="size-4 mr-2" />
                        Изменить
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать курьера</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">Имя</Label>
                          <Input
                            id="edit-name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-phone">Телефон</Label>
                          <Input
                            id="edit-phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
                            Отмена
                          </Button>
                          <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                            Сохранить
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => onDeleteCourier(courier.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Нет свободных курьеров</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-gray-900">Занятые курьеры</h3>
        {busyCouriers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {busyCouriers.map((courier) => (
              <div key={courier.id} className="bg-white border border-orange-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <UserCircle className="size-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="text-gray-900">{courier.name}</h4>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Phone className="size-3" />
                        {courier.phone}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">Занят</Badge>
                </div>
                {courier.currentOrderId && (
                  <div className="text-sm text-gray-600 mb-3">
                    Заказ: #{courier.currentOrderId}
                  </div>
                )}
                <div className="flex gap-2">
                  <Dialog open={editingCourier?.id === courier.id} onOpenChange={(open: boolean) => { if (!open) handleCancel(); }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                        onClick={() => handleEdit(courier)}
                      >
                        <Pencil className="size-4 mr-2" />
                        Изменить
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Редактировать курьера</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name-busy">Имя</Label>
                          <Input
                            id="edit-name-busy"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-phone-busy">Телефон</Label>
                          <Input
                            id="edit-phone-busy"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
                            Отмена
                          </Button>
                          <Button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                            Сохранить
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => onDeleteCourier(courier.id)}
                    disabled={courier.currentOrderId !== undefined}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Нет занятых курьеров</p>
          </div>
        )}
      </div>

      {couriers.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Нет курьеров. Добавьте первого курьера!</p>
        </div>
      )}
    </div>
  );
}
