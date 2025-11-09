import Navigation from "@/components/Navigation";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import heroDish from "@/assets/hero-dish.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroDish})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/60" />
        </div>
        
        <div className="relative z-10 text-center text-primary-foreground px-4 animate-fade-in">
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6">
            Savoria
          </h1>
          <p className="font-body text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Where exceptional cuisine meets unforgettable moments. Experience the art of fine dining in every dish.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/menu">
              <Button size="lg" className="font-body text-lg">
                View Menu
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="font-body text-lg bg-background/10 backdrop-blur-sm hover:bg-background/20 text-primary-foreground border-primary-foreground/30">
              Reserve Table
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-foreground">
              A Culinary Journey
            </h2>
            <p className="font-body text-muted-foreground text-lg leading-relaxed mb-6">
              At Savoria, we believe that dining is more than just a meal—it's an experience. Our passionate chefs combine traditional techniques with innovative flavors to create dishes that delight the senses and warm the soul.
            </p>
            <p className="font-body text-muted-foreground text-lg leading-relaxed">
              Every ingredient is carefully selected, every plate thoughtfully composed, and every guest warmly welcomed. Join us for an unforgettable dining experience where quality, flavor, and hospitality come together.
            </p>
          </div>
        </div>
      </section>

      <Gallery />
      <Reviews />

      {/* Footer */}
      <footer className="bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display text-2xl font-bold text-primary mb-4">
            Savoria
          </p>
          <p className="font-body text-muted-foreground mb-2">
            123 Culinary Street, Food District
          </p>
          <p className="font-body text-muted-foreground mb-2">
            Phone: (555) 123-4567
          </p>
          <p className="font-body text-muted-foreground">
            Open Daily: 11:00 AM - 10:00 PM
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
