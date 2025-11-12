import { Card, CardContent } from "@/components/ui/card";

interface MenuCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
}

const MenuCard = ({ image, name, description, price }: MenuCardProps) => {
  return (
    <Card className="group overflow-hidden card-3d shadow-card hover:shadow-hover transition-all duration-500 animate-scale-in glass border-border/50">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-display text-xl font-semibold gradient-text">
            {name}
          </h3>
          <span className="font-body text-primary font-bold text-lg glow">
            {price}
          </span>
        </div>
        <p className="font-body text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default MenuCard;
