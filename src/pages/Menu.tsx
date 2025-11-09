import Navigation from "@/components/Navigation";
import MenuCard from "@/components/MenuCard";
import salmonImg from "@/assets/salmon.jpg";
import pastaImg from "@/assets/pasta.jpg";
import steakImg from "@/assets/steak.jpg";
import dessertImg from "@/assets/dessert.jpg";
import saladImg from "@/assets/salad.jpg";
import burgerImg from "@/assets/burger.jpg";

const Menu = () => {
  const menuItems = [
    {
      image: salmonImg,
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with roasted vegetables and herb butter",
      price: "$28",
    },
    {
      image: pastaImg,
      name: "Pasta Carbonara",
      description: "Traditional Italian carbonara with pancetta and parmesan",
      price: "$22",
    },
    {
      image: steakImg,
      name: "Prime Beef Steak",
      description: "Premium cut with red wine reduction and roasted potatoes",
      price: "$38",
    },
    {
      image: dessertImg,
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with vanilla ice cream and berry coulis",
      price: "$12",
    },
    {
      image: saladImg,
      name: "Caesar Salad",
      description: "Crisp romaine with grilled chicken, parmesan, and croutons",
      price: "$16",
    },
    {
      image: burgerImg,
      name: "Gourmet Burger",
      description: "Angus beef with aged cheddar, caramelized onions, and truffle aioli",
      price: "$24",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Our Menu
            </h1>
            <p className="font-body text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
              Discover our carefully crafted dishes, each one a celebration of fresh ingredients and culinary expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {menuItems.map((item, index) => (
              <div key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                <MenuCard {...item} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;
