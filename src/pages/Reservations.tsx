import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

const Reservations = () => {
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    reservation_date: "",
    reservation_time: "",
    number_of_guests: 2,
    special_requests: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("reservations").insert([formData]);

      if (error) throw error;

      toast({
        title: "✅ تم إرسال الحجز بنجاح",
        description: "سنقوم بالرد عليك في أقرب وقت ممكن",
      });

      // Reset form
      setFormData({
        customer_name: "",
        email: "",
        phone: "",
        reservation_date: "",
        reservation_time: "",
        number_of_guests: 2,
        special_requests: "",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في الإرسال",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "number_of_guests" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-display mb-2">احجز طاولتك</CardTitle>
              <CardDescription>
                املأ النموذج أدناه وسنتواصل معك لتأكيد حجزك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">الاسم الكامل *</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                      dir="rtl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الهاتف *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+212 6XX XXX XXX"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reservation_date">التاريخ *</Label>
                    <Input
                      id="reservation_date"
                      name="reservation_date"
                      type="date"
                      value={formData.reservation_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reservation_time">الوقت *</Label>
                    <Input
                      id="reservation_time"
                      name="reservation_time"
                      type="time"
                      value={formData.reservation_time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number_of_guests">عدد الأشخاص *</Label>
                  <Input
                    id="number_of_guests"
                    name="number_of_guests"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.number_of_guests}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="special_requests">طلبات خاصة (اختياري)</Label>
                  <Textarea
                    id="special_requests"
                    name="special_requests"
                    placeholder="أي طلبات خاصة؟ (حساسية طعام، مناسبة خاصة...)"
                    value={formData.special_requests}
                    onChange={handleChange}
                    rows={4}
                    dir="rtl"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "جاري الإرسال..." : "إرسال الحجز"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reservations;