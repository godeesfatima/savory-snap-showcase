import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Mail, Trash2 } from "lucide-react";

interface Review {
  id: string;
  customer_name: string;
  email: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
}

export const ReviewsManager = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
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
        .from("reviews")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast({ title: `تم ${status === "approved" ? "قبول" : "رفض"} التعليق` });
      fetchReviews();
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;

    try {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({ title: "تم الحذف بنجاح" });
      fetchReviews();
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
      <h2 className="text-2xl font-bold gradient-text">إدارة التعليقات</h2>

      {loading ? (
        <div className="text-center py-12">جاري التحميل...</div>
      ) : reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            لا توجد تعليقات حتى الآن
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="card-3d">
              <CardHeader className="glass">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{review.customer_name}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {review.email}
                      </span>
                      <span className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? "fill-primary text-primary" : "text-muted"
                            }`}
                          />
                        ))}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      review.status === "approved"
                        ? "default"
                        : review.status === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {review.status === "approved"
                      ? "مقبول"
                      : review.status === "rejected"
                      ? "مرفوض"
                      : "قيد الانتظار"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-6 p-4 glass rounded-lg">
                  <p className="text-sm">{review.comment}</p>
                </div>

                <div className="flex gap-3">
                  {review.status === "pending" && (
                    <>
                      <Button
                        onClick={() => updateStatus(review.id, "approved")}
                        className="flex-1"
                      >
                        قبول التعليق
                      </Button>
                      <Button
                        onClick={() => updateStatus(review.id, "rejected")}
                        variant="outline"
                        className="flex-1"
                      >
                        رفض التعليق
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => handleDelete(review.id)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
