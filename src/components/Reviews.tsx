import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  name: string;
  rating: number;
  comment: string;
}

const Reviews = () => {
  const reviews: Review[] = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Absolutely exceptional! The salmon was perfectly cooked and the atmosphere was wonderful. Will definitely return.",
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment: "Best dining experience in town. The attention to detail in every dish is remarkable. Highly recommended!",
    },
    {
      name: "Emily Rodriguez",
      rating: 4,
      comment: "Great food and excellent service. The pasta carbonara was divine. A little pricey but worth it for special occasions.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            What Our Guests Say
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            Real experiences from our valued customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review, index) => (
            <Card 
              key={index} 
              className="animate-scale-in shadow-card hover:shadow-hover transition-shadow duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? "fill-primary text-primary"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-body text-foreground mb-4 leading-relaxed">
                  {review.comment}
                </p>
                <p className="font-body font-semibold text-primary">
                  {review.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
