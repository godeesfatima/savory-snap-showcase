import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Package, UtensilsCrossed, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { MenuManager } from "@/components/admin/MenuManager";
import { ReviewsManager } from "@/components/admin/ReviewsManager";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roles) {
        toast({
          title: "غير مصرح",
          description: "ليس لديك صلاحيات الوصول لهذه الصفحة",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/auth");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2 gradient-text glow">
              لوحة التحكم - Admin
            </h1>
            <p className="text-muted-foreground">إدارة المطعم الكاملة</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2 glass">
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : (
          <Tabs defaultValue="orders" className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-3 mb-8 glass">
              <TabsTrigger value="orders" className="gap-2">
                <Package className="w-4 h-4" />
                الطلبات
              </TabsTrigger>
              <TabsTrigger value="menu" className="gap-2">
                <UtensilsCrossed className="w-4 h-4" />
                المنيو
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                التعليقات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <OrdersManager />
            </TabsContent>

            <TabsContent value="menu">
              <MenuManager />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewsManager />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Admin;