import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold text-primary">
            Savoria
          </Link>
          
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className={`font-body transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/menu" 
              className={`font-body transition-colors hover:text-primary ${
                isActive('/menu') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Menu
            </Link>
            <Link to="/reservations">
              <Button size="sm" className="font-body">
                Book a Table
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
