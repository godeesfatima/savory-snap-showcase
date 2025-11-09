import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Mail, Phone, LogOut } from "lucide-react";

interface Reservation {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  special_requests: string | null;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
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
      fetchReservations();
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/auth");
    }
  };

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reservations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReservations(data || []);
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
        .from("reservations")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "تم التحديث",
        description: `تم ${status === "accepted" ? "قبول" : "رفض"} الحجز بنجاح`,
      });

      fetchReservations();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
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
            <h1 className="text-4xl font-display font-bold mb-2">لوحة التحكم - Admin</h1>
            <p className="text-muted-foreground">إدارة حجوزات المطعم</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">جاري التحميل...</div>
        ) : reservations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              لا توجد حجوزات حتى الآن
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="overflow-hidden">
                <CardHeader className="bg-secondary/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{reservation.customer_name}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {reservation.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {reservation.phone}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        reservation.status === "accepted"
                          ? "default"
                          : reservation.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {reservation.status === "accepted"
                        ? "مقبول"
                        : reservation.status === "rejected"
                        ? "مرفوض"
                        : "قيد الانتظار"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">التاريخ</p>
                        <p className="font-semibold">{reservation.reservation_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">الوقت</p>
                        <p className="font-semibold">{reservation.reservation_time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">عدد الأشخاص</p>
                        <p className="font-semibold">{reservation.number_of_guests}</p>
                      </div>
                    </div>
                  </div>

                  {reservation.special_requests && (
                    <div className="mb-6 p-4 bg-secondary/20 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">طلبات خاصة:</p>
                      <p className="text-sm">{reservation.special_requests}</p>
                    </div>
                  )}

                  {reservation.status === "pending" && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => updateStatus(reservation.id, "accepted")}
                        className="flex-1"
                      >
                        قبول الحجز
                      </Button>
                      <Button
                        onClick={() => updateStatus(reservation.id, "rejected")}
                        variant="destructive"
                        className="flex-1"
                      >
                        رفض الحجز
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;