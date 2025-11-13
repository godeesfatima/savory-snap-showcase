import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Package } from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  items: any;
  total_price: number;
  special_requests: string | null;
  status: string;
  created_at: string;
}

export const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
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

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast({ title: `تم ${status === "accepted" ? "قبول" : "رفض"} الطلب` });
      fetchOrders();
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
      <h2 className="text-2xl font-bold gradient-text">إدارة الطلبات</h2>

      {loading ? (
        <div className="text-center py-12">جاري التحميل...</div>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            لا توجد طلبات حتى الآن
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="card-3d">
              <CardHeader className="glass">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{order.customer_name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {order.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {order.phone}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      order.status === "accepted"
                        ? "default"
                        : order.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {order.status === "accepted"
                      ? "مقبول"
                      : order.status === "rejected"
                      ? "مرفوض"
                      : "قيد الانتظار"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-primary" />
                    <span className="font-semibold">المطلوبات:</span>
                  </div>
                  <div className="space-y-2 bg-secondary/20 p-4 rounded-lg">
                    {Array.isArray(order.items) ? (
                      order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.name} × {item.quantity}</span>
                          <span>{item.price} DH</span>
                        </div>
                      ))
                    ) : (
                      <div>البيانات غير صحيحة</div>
                    )}
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>المجموع:</span>
                      <span className="text-primary">{order.total_price} DH</span>
                    </div>
                  </div>
                </div>

                {order.special_requests && (
                  <div className="mb-6 p-4 glass rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">طلبات خاصة:</p>
                    <p className="text-sm">{order.special_requests}</p>
                  </div>
                )}

                {order.status === "pending" && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => updateStatus(order.id, "accepted")}
                      className="flex-1"
                    >
                      قبول الطلب
                    </Button>
                    <Button
                      onClick={() => updateStatus(order.id, "rejected")}
                      variant="destructive"
                      className="flex-1"
                    >
                      رفض الطلب
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
