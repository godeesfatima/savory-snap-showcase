import { Card, CardContent } from "@/components/ui/card";

interface MenuCardProps {
  image: string;
  name: string;
  description: string;
  price: string;
}

const MenuCard = ({ image, name, description, price }: MenuCardProps) => {
  return (
    <Card className="group overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 animate-scale-in">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-display text-xl font-semibold text-foreground">
            {name}
          </h3>
          <span className="font-body text-primary font-bold text-lg">
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
