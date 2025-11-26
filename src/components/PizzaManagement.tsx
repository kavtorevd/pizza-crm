import { useState } from 'react';
import type { Pizza } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PizzaManagementProps {
  pizzas: Pizza[];
  onAddPizza: (pizza: Omit<Pizza, 'id'>) => void;
  onUpdatePizza: (id: string, pizza: Partial<Pizza>) => void;
  onDeletePizza: (id: string) => void;
}

export function PizzaManagement({ pizzas, onAddPizza, onUpdatePizza, onDeletePizza }: PizzaManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    available: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPizza) {
      onUpdatePizza(editingPizza.id, {
        ...formData,
        price: parseFloat(formData.price)
      });
      setEditingPizza(null);
    } else {
      onAddPizza({
        ...formData,
        price: parseFloat(formData.price)
      });
      setIsAddDialogOpen(false);
    }
    setFormData({ name: '', description: '', price: '', image: '', available: true });
  };

  const handleEdit = (pizza: Pizza) => {
    setEditingPizza(pizza);
    setFormData({
      name: pizza.name,
      description: pizza.description,
      price: pizza.price.toString(),
      image: pizza.image,
      available: pizza.available
    });
  };

  const handleCancel = () => {
    setEditingPizza(null);
    setFormData({ name: '', description: '', price: '', image: '', available: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-orange-600">Управление меню</h2>
          <p className="text-gray-600">Добавляйте, редактируйте и управляйте пиццами в меню</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="size-4 mr-2" />
              Добавить пиццу
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Добавить новую пиццу</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Название</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Цена (₽)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">URL изображения</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, available: checked })}
                />
                <Label htmlFor="available">Доступна для заказа</Label>
              </div>
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Добавить пиццу
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pizzas.map((pizza) => (
          <div key={pizza.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <ImageWithFallback
                src={pizza.image}
                alt={pizza.name}
                className="w-full h-full object-cover"
              />
              {!pizza.available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge variant="secondary">Недоступна</Badge>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-gray-900">{pizza.name}</h3>
                  <p className="text-orange-600 mt-1">{pizza.price} ₽</p>
                </div>
                <Badge variant={pizza.available ? 'default' : 'secondary'} className={pizza.available ? 'bg-green-100 text-green-800' : ''}>
                  {pizza.available ? 'Доступна' : 'Нет в наличии'}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4">{pizza.description}</p>
              <div className="flex gap-2">
                <Dialog open={editingPizza?.id === pizza.id} onOpenChange={(open: boolean) => { if (!open) handleCancel(); }}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => handleEdit(pizza)}
                    >
                      <Pencil className="size-4 mr-2" />
                      Изменить
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Редактировать пиццу</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="edit-name">Название</Label>
                        <Input
                          id="edit-name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-description">Описание</Label>
                        <Textarea
                          id="edit-description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-price">Цена (₽)</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-image">URL изображения</Label>
                        <Input
                          id="edit-image"
                          type="url"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="edit-available"
                          checked={formData.available}
                          onCheckedChange={(checked: boolean) => setFormData({ ...formData, available: checked })}
                        />
                        <Label htmlFor="edit-available">Доступна для заказа</Label>
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
                  onClick={() => onDeletePizza(pizza.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pizzas.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Нет пицц в меню. Добавьте первую пиццу!</p>
        </div>
      )}
    </div>
  );
}
