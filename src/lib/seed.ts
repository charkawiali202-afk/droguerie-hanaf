export type Category = { id: string; name: string };
export type Product = {
  id: string; name: string; price: number; categoryId: string;
  image: string; description: string; stock: number; featured?: boolean;
};
export type Data = { categories: Category[]; products: Product[] };

const p = (id: string, name: string, price: number, categoryId: string, stock: number, description: string, featured = false): Product =>
  ({ id, name, price, categoryId, stock, description, image: "", featured });

export const SEED: Data = {
  categories: [
    { id: "peinture", name: "Peinture" },
    { id: "outillage", name: "Outillage" },
    { id: "plomberie", name: "Plomberie & sanitaire" },
    { id: "electricite", name: "Électricité" },
    { id: "quincaillerie", name: "Quincaillerie" },
    { id: "jardinage", name: "Jardinage" },
    { id: "entretien", name: "Produits d'entretien" },
  ],
  products: [
    p("p1", "Peinture acrylique blanc mat 15 L", 420, "peinture", 24, "Peinture murale intérieure, lessivable, séchage rapide. Rendement environ 10 m²/L.", true),
    p("p2", "Rouleau anti-goutte 230 mm", 45, "peinture", 60, "Manchon microfibre pour murs et plafonds, avec monture."),
    p("p3", "Pinceau plat 50 mm", 18, "peinture", 120, "Soies mélangées, idéal pour boiseries et finitions."),
    p("p4", "Diluant cellulosique 1 L", 35, "peinture", 40, "Pour dilution et nettoyage des outils. Usage en milieu ventilé."),
    p("p5", "Perceuse à percussion 750 W", 590, "outillage", 8, "Mandrin 13 mm, variateur de vitesse, livrée avec poignée latérale.", true),
    p("p6", "Coffret tournevis 12 pièces", 120, "outillage", 25, "Plats, cruciformes et Torx, embouts magnétiques."),
    p("p7", "Mètre ruban 5 m", 30, "outillage", 80, "Ruban acier avec blocage et clip ceinture."),
    p("p8", "Marteau de coffreur 600 g", 65, "outillage", 30, "Manche fibre antivibration."),
    p("p9", "Mitigeur lavabo chromé", 280, "plomberie", 12, "Cartouche céramique, flexibles inclus.", true),
    p("p10", "Tube PPR Ø20 (barre 4 m)", 28, "plomberie", 150, "Pour réseaux d'eau chaude et froide."),
    p("p11", "Ruban téflon 12 mm", 5, "plomberie", 300, "Étanchéité des raccords filetés."),
    p("p12", "Siphon évier PVC", 40, "plomberie", 35, "Ø40 mm, avec bonde."),
    p("p13", "Câble électrique 2,5 mm² (couronne 100 m)", 650, "electricite", 10, "Fil rigide pour prises de courant.", true),
    p("p14", "Interrupteur va-et-vient blanc", 25, "electricite", 90, "Encastrable, avec plaque."),
    p("p15", "Ampoule LED E27 12 W", 22, "electricite", 200, "Blanc chaud, équivalent 100 W."),
    p("p16", "Rallonge multiprise 4 prises 3 m", 85, "electricite", 40, "Avec interrupteur et terre."),
    p("p17", "Cadenas laiton 40 mm", 55, "quincaillerie", 45, "Livré avec 3 clés.", true),
    p("p18", "Chevilles nylon Ø8 (boîte de 100)", 30, "quincaillerie", 70, "Pour murs pleins et briques."),
    p("p19", "Charnière inox 100 mm (lot de 2)", 38, "quincaillerie", 55, "Pour portes intérieures."),
    p("p20", "Vis à bois 4×40 (boîte de 200)", 35, "quincaillerie", 65, "Tête fraisée, zinguée."),
    p("p21", "Tuyau d'arrosage 25 m", 160, "jardinage", 15, "Anti-torsion, Ø15 mm, avec raccords.", true),
    p("p22", "Sécateur de jardin", 75, "jardinage", 20, "Lames acier, poignées ergonomiques."),
    p("p23", "Arrosoir 10 L", 50, "jardinage", 18, "Plastique résistant avec pomme."),
    p("p24", "Eau de Javel 5 L", 30, "entretien", 50, "Désinfectant ménager."),
  ],
};

