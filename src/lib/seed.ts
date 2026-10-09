export type Category = { id: string; name: string; image?: string; blurb?: string };
export type Product = {
  id: string; name: string; price: number; categoryId: string;
  image: string; description: string; stock: number; featured?: boolean;
};
export type Data = { categories: Category[]; products: Product[] };
export type OrderStatus = "nouvelle" | "confirmée" | "livrée" | "annulée";
export type Order = {
  id: string; createdAt: string; status: OrderStatus; total: number;
  customer: { name: string; phone: string; city: string; address: string; notes: string };
  items: { id: string; name: string; price: number; qty: number }[];
};

// Royalty-free photos from Unsplash (Unsplash License).
export const photo = (id: string, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

const p = (id: string, name: string, price: number, categoryId: string, stock: number, img: string, description: string, featured = false): Product =>
  ({ id, name, price, categoryId, stock, description, image: photo(img), featured });

export const HERO_IMAGE = "photo-1581783898377-1c85bf937427";

export const SEED: Data = {
  categories: [
    { id: "peinture", name: "Peinture", image: photo("photo-1562259949-e8e7689d7828", 600), blurb: "Peintures, rouleaux, pinceaux, diluants" },
    { id: "outillage", name: "Outillage", image: photo("photo-1504148455328-c376907d081c", 600), blurb: "Électroportatif et outils à main" },
    { id: "plomberie", name: "Plomberie & sanitaire", image: photo("photo-1595428774862-a79ab68dbabb", 600), blurb: "Robinetterie, tubes, raccords" },
    { id: "electricite", name: "Électricité", image: photo("photo-1518181835702-6eef8b4b2113", 600), blurb: "Câbles, appareillage, éclairage" },
    { id: "quincaillerie", name: "Quincaillerie", image: photo("photo-1613945831677-383c19ad7721", 600), blurb: "Visserie, fixations, serrures" },
    { id: "jardinage", name: "Jardinage", image: photo("photo-1416879595882-3373a0480b5b", 600), blurb: "Arrosage et outils de jardin" },
    { id: "entretien", name: "Produits d'entretien", image: photo("photo-1563453392212-326f5e854473", 600), blurb: "Nettoyage et désinfection" },
  ],
  products: [
    p("p1", "Peinture acrylique blanc mat 15 L", 420, "peinture", 24, "photo-1671538131768-15af1e3de10b", "Peinture murale intérieure en phase aqueuse, finition mate et lessivable. Faible odeur, séchage en 1 h, recouvrable après 4 h. Rendement d'environ 10 m² par litre et par couche.", true),
    p("p2", "Rouleau anti-goutte 230 mm", 45, "peinture", 60, "photo-1562259949-e8e7689d7828", "Manchon microfibre 12 mm pour murs et plafonds, monté sur monture acier. Charge bien, ne goutte pas, laisse un fini régulier."),
    p("p3", "Pinceau plat 50 mm", 18, "peinture", 120, "photo-1513364776144-60967b0f800f", "Soies mélangées et virole inox. Pour les boiseries, les angles et les finitions sur toutes peintures."),
    p("p4", "Diluant cellulosique 1 L", 35, "peinture", 40, "photo-1585676737728-432f58d5fdba", "Dilution des peintures et vernis cellulosiques, nettoyage des outils. À utiliser dans un local bien aéré."),
    p("p5", "Perceuse à percussion 750 W", 590, "outillage", 8, "photo-1504148455328-c376907d081c", "Mandrin automatique 13 mm, variateur de vitesse et inverseur. Perce le béton, le bois et le métal. Livrée avec poignée latérale et butée de profondeur.", true),
    p("p6", "Coffret tournevis 12 pièces", 120, "outillage", 25, "photo-1524224313114-ebd9c49dde82", "Tournevis plats, cruciformes et Torx en acier chrome-vanadium. Pointes magnétiques, manches bi-matière."),
    p("p7", "Mètre ruban 5 m", 30, "outillage", 80, "photo-1523901839036-a3030662f220", "Ruban acier 19 mm avec blocage, crochet renforcé et clip ceinture."),
    p("p8", "Marteau de coffreur 600 g", 65, "outillage", 30, "photo-1607870411590-d5e9e06da09a", "Tête acier forgé, arrache-clou, manche fibre antivibration."),
    p("p9", "Mitigeur lavabo chromé", 280, "plomberie", 12, "photo-1595428774862-a79ab68dbabb", "Cartouche céramique 35 mm, aérateur anti-calcaire. Flexibles et fixation fournis.", true),
    p("p10", "Tube PPR Ø20 (barre 4 m)", 28, "plomberie", 150, "photo-1545193329-4a052e14eb8f", "Polypropylène PN20 pour réseaux d'eau chaude et froide, à souder."),
    p("p11", "Clé à molette 250 mm", 85, "plomberie", 35, "photo-1503789146722-cf137a3c0fea", "Ouverture jusqu'à 30 mm, acier chrome-vanadium. Indispensable pour les raccords."),
    p("p12", "Bonde et siphon évier Ø40", 40, "plomberie", 35, "photo-1654440122140-f1fc995ddb34", "Ensemble PVC avec bonde à grille inox, joints fournis."),
    p("p13", "Câble électrique 2,5 mm² (couronne 100 m)", 650, "electricite", 10, "photo-1518181835702-6eef8b4b2113", "Fil rigide cuivre pour circuits de prises de courant. Gaine isolante PVC.", true),
    p("p14", "Interrupteur va-et-vient blanc", 25, "electricite", 90, "photo-1556217994-22de7face210", "Mécanisme encastrable 10 A avec plaque de finition. Fixation par vis ou griffes."),
    p("p15", "Ampoule LED E27 12 W", 22, "electricite", 200, "photo-1532007271951-c487760934ae", "Blanc chaud 2700 K, 1055 lumens, équivalent 100 W. Durée de vie 15 000 h."),
    p("p16", "Multiprise 4 prises avec interrupteur, 3 m", 85, "electricite", 40, "photo-1781331534854-c75885f01c01", "Prises avec terre, interrupteur lumineux, câble 3 m."),
    p("p17", "Cadenas laiton 40 mm", 55, "quincaillerie", 45, "photo-1555529902-5261145633bf", "Corps laiton massif, anse acier trempé. Livré avec 3 clés.", true),
    p("p18", "Chevilles et vis Ø8 (boîte de 100)", 30, "quincaillerie", 70, "photo-1641937725629-2adda0f55251", "Chevilles nylon avec vis, pour murs pleins, béton et brique."),
    p("p19", "Charnière inox 100 mm (lot de 2)", 38, "quincaillerie", 55, "photo-1744329630135-06bb9d5e02a0", "Inox brossé, pour portes intérieures et placards. Vis fournies."),
    p("p20", "Vis à bois 4×40 (boîte de 200)", 35, "quincaillerie", 65, "photo-1613945831677-383c19ad7721", "Tête fraisée Pozidriv, acier zingué, pointe auto-perceuse."),
    p("p21", "Tuyau d'arrosage 25 m", 160, "jardinage", 15, "photo-1715407157720-aff745f27568", "Tuyau anti-torsion Ø15 mm, quatre couches, livré avec raccords et lance.", true),
    p("p22", "Sécateur de jardin", 75, "jardinage", 20, "photo-1617576683096-00fc8eecb3af", "Lames acier traité, coupe jusqu'à 20 mm, poignées ergonomiques avec verrou."),
    p("p23", "Arrosoir 10 L", 50, "jardinage", 18, "photo-1667992714862-df8713baf8c6", "Plastique résistant aux UV, pomme amovible."),
    p("p24", "Eau de Javel 5 L", 30, "entretien", 50, "photo-1563453392212-326f5e854473", "Nettoie et désinfecte sols, sanitaires et surfaces. Bien diluer avant usage."),
  ],
};
