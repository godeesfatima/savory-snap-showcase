import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import Navigation from "@/components/Navigation";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const Order = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("available", true)
        .order("category");

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

  const addToCart = (item: MenuItem) => {
    const existing = cart.find((i) => i.id === item.id);
    if (existing) {
      setCart(cart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast({ title: "تمت الإضافة للسلة" });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast({
        title: "السلة فارغة",
        description: "يرجى إضافة عناصر للسلة قبل إرسال الطلب",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error } = await supabase.from("orders").insert({
        customer_name: customerName,
        email,
        phone,
        items: orderItems,
        total_price: getTotalPrice(),
        special_requests: specialRequests || null,
      });

      if (error) throw error;

      toast({
        title: "تم إرسال الطلب بنجاح",
        description: "سيتم التواصل معك قريباً",
      });

      setCart([]);
      setCustomerName("");
      setEmail("");
      setPhone("");
      setSpecialRequests("");
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const categories = [...new Set(menuItems.map((item) => item.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 gradient-text glow">
            اطلب الآن - الدفع عند الاستلام
          </h1>
          <p className="text-xl text-muted-foreground">اختر أطباقك المفضلة واستمتع بوجبة شهية</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-3xl font-bold mb-4 gradient-text">{category}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {menuItems
                    .filter((item) => item.category === category)
                    .map((item) => (
                      <Card key={item.id} className="card-3d overflow-hidden">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>{item.name}</span>
                            <Badge className="text-lg">{item.price} DH</Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">{item.description}</p>
                          <Button onClick={() => addToCart(item)} className="w-full gap-2">
                            <Plus className="w-4 h-4" />
                            إضافة للسلة
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-4 h-fit">
            <Card className="card-3d glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <ShoppingCart className="w-6 h-6" />
                  سلة الطلبات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">السلة فارغة</p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 glass rounded-lg">
                          <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.price} DH</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-2xl font-bold mb-6">
                        <span>المجموع:</span>
                        <span className="gradient-text">{getTotalPrice()} DH</span>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">الاسم الكامل</Label>
                          <Input
                            id="name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            required
                            dir="rtl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">البريد الإلكتروني</Label>
                          <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">رقم الهاتف</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="requests">طلبات خاصة (اختياري)</Label>
                          <Textarea
                            id="requests"
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                            dir="rtl"
                          />
                        </div>
                        <Button type="submit" className="w-full text-lg">
                          إرسال الطلب
                        </Button>
                        <p className="text-sm text-center text-muted-foreground">
                          💵 الدفع عند الاستلام
                        </p>
                      </form>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
