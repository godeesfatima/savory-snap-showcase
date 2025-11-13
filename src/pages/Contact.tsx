import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Instagram, MessageCircle } from "lucide-react";
import Navigation from "@/components/Navigation";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("contact_requests").insert({
        name,
        email,
        phone: phone || null,
        message,
      });

      if (error) throw error;

      toast({
        title: "تم إرسال رسالتك بنجاح",
        description: "سنتواصل معك قريباً",
      });

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 gradient-text glow">
            تواصل معنا
          </h1>
          <p className="text-xl text-muted-foreground">نحن هنا للإجابة على استفساراتك</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="card-3d glass">
            <CardHeader>
              <CardTitle className="text-2xl">أرسل لنا رسالة</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم الكامل</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    dir="rtl"
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="card-3d glass">
              <CardHeader>
                <CardTitle className="text-2xl">معلومات التواصل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">البريد الإلكتروني</p>
                    <p className="text-muted-foreground">info@savoria.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">الهاتف</p>
                    <p className="text-muted-foreground">+212 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-semibold">العنوان</p>
                    <p className="text-muted-foreground">الدار البيضاء، المغرب</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-3d glass">
              <CardHeader>
                <CardTitle className="text-2xl">تابعنا على</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 glass rounded-lg hover:shadow-glow-purple transition-all hover:scale-105"
                >
                  <Instagram className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">Instagram</p>
                    <p className="text-sm text-muted-foreground">@savoria_restaurant</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/212123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 glass rounded-lg hover:shadow-glow-purple transition-all hover:scale-105"
                >
                  <MessageCircle className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">تواصل مباشر</p>
                  </div>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
