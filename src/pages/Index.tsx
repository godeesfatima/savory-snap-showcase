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
          className="absolute inset-0 z-0 animate-float"
          style={{
            backgroundImage: `url(${heroDish})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
          <div className="absolute inset-0 bg-gradient-hero opacity-50" />
        </div>
        
        <div className="relative z-10 text-center px-4 animate-fade-in">
          <h1 className="font-display text-6xl md:text-7xl lg:text-8xl font-bold mb-6 gradient-text animate-glow">
            Savoria
          </h1>
          <p className="font-body text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed text-foreground">
            Where exceptional cuisine meets unforgettable moments. Experience the art of fine dining in every dish.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/menu">
              <Button size="lg" className="font-body text-lg card-3d shadow-glow-purple hover:shadow-glow-pink">
                View Menu
              </Button>
            </Link>
            <Link to="/reservations">
              <Button size="lg" variant="outline" className="font-body text-lg glass hover:bg-primary/10 border-primary/30 card-3d">
                Reserve Table
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in glass p-12 rounded-2xl shadow-3d border border-border/30">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 gradient-text">
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
      <footer className="glass border-t border-border/30 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-display text-2xl font-bold gradient-text mb-4">
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
