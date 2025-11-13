import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
}

export const MenuManager = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "main",
    image_url: "",
    available: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        const { error } = await supabase
          .from("menu_items")
          .update(formData)
          .eq("id", editingItem.id);

        if (error) throw error;
        toast({ title: "تم التحديث بنجاح" });
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert([formData]);

        if (error) throw error;
        toast({ title: "تمت الإضافة بنجاح" });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "main",
        image_url: "",
        available: true,
      });
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url,
      available: item.available,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;

    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "تم الحذف بنجاح" });
      fetchMenuItems();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">إدارة المنيو</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              إضافة عنصر جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "تعديل العنصر" : "إضافة عنصر جديد"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">السعر (DH)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">الوصف</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">الفئة</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">رابط الصورة</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="available">متوفر</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingItem ? "تحديث" : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-12">جاري التحميل...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {menuItems.map((item) => (
            <Card key={item.id} className="card-3d">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.name}</span>
                  <span className="text-primary">{item.price} DH</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {item.available ? "متوفر" : "غير متوفر"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
