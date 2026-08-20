import type { Category, Product } from "@/types";

export const excludedCategorySlugs = ["smartphones", "informatique"] as const;
const excludedCategorySlugSet = new Set<string>(excludedCategorySlugs);

export function isExcludedCategorySlug(slug: string | null | undefined) {
  return Boolean(slug && excludedCategorySlugSet.has(slug));
}

const categoryCopy: Array<[string, string, string]> = [
  ["electronique", "Électronique", "Équipements fiables pour le travail, les loisirs et le quotidien."],
  ["smartphones", "Smartphones", "Des téléphones 4G et 5G pour tous les usages et tous les budgets."],
  ["informatique", "Informatique", "Ordinateurs, écrans et périphériques pour rester productif."],
  ["audio", "Audio", "Casques, écouteurs et enceintes pour un son clair partout."],
  ["maison", "Maison", "Des équipements intelligents pour une maison plus pratique."],
  ["cuisine", "Cuisine", "Petit électroménager utile et simple à utiliser."],
  ["beaute-bien-etre", "Beauté & Bien-être", "Soins électriques et appareils dédiés au bien-être quotidien."],
  ["accessoires", "Accessoires", "Charge, protection et connectique pour tous vos appareils."],
  ["sports-loisirs", "Sports & Loisirs", "Équipements connectés et pratiques pour bouger davantage."],
  ["trottinettes-electriques", "Trottinettes électriques", "Une mobilité urbaine compacte, efficace et documentée."],
  ["velos-electriques", "Vélos électriques", "Des vélos assistés pour la ville, la route et les loisirs."],
  ["mobilite-electrique", "Mobilité électrique", "Accessoires, sécurité et énergie pour vos déplacements électriques."],
  ["gaming", "Gaming", "Périphériques réactifs et confortables pour jouer dans les meilleures conditions."],
  ["objets-connectes", "Objets connectés", "Des appareils intelligents pour suivre, sécuriser et automatiser votre quotidien."],
];

const imageSets = Object.fromEntries(categoryCopy.map(([slug]) => [slug, [1, 2, 3].map((variant) => `/art/${slug}/${variant}.svg`)])) as Record<string, string[]>;

const allCatalogCategories: Category[] = categoryCopy.map(([slug, name, description], index) => ({
  id: `category-${String(index + 1).padStart(2, "0")}`,
  name,
  slug,
  description,
  image: imageSets[slug][0],
}));

export const catalogCategories = allCatalogCategories.filter((category) => !isExcludedCategorySlug(category.slug));

type ProductSeed = {
  category: string;
  name: string;
  brand: string;
  price: number;
  descriptor: string;
  specifications: Record<string, string>;
  optionName?: string;
  options?: string[];
  colors?: string[];
};

const seeds: ProductSeed[] = [
  { category: "electronique", name: "Téléviseur QLED Vision 55", brand: "Lumio", price: 2199, descriptor: "Téléviseur 4K connecté avec couleurs QLED, HDR et applications intégrées.", specifications: { Écran: "55 pouces QLED 4K", HDR: "HDR10+", Connectivité: "Wi-Fi, Bluetooth 5.2", Ports: "3 × HDMI, 2 × USB", Audio: "2 × 12 W", Garantie: "24 mois" }, optionName: "Diagonale", options: ["55 pouces", "65 pouces"] },
  { category: "electronique", name: "Vidéoprojecteur Mini Beam FHD", brand: "Lumio", price: 649, descriptor: "Projecteur compact Full HD pour les films, présentations et soirées jeux.", specifications: { Résolution: "1920 × 1080 px", Luminosité: "450 ANSI lumens", Projection: "40 à 150 pouces", Connectivité: "HDMI, USB, Wi-Fi", Haut_parleur: "5 W", Garantie: "12 mois" }, colors: ["Noir", "Blanc"] },
  { category: "electronique", name: "Batterie externe PowerCore 20000", brand: "Voltix", price: 149, descriptor: "Batterie haute capacité avec charge rapide USB-C pour trois appareils.", specifications: { Capacité: "20 000 mAh", Puissance: "65 W USB-C PD", Sorties: "2 × USB-C, 1 × USB-A", Affichage: "Niveau numérique", Poids: "410 g", Garantie: "12 mois" }, optionName: "Capacité", options: ["10 000 mAh", "20 000 mAh"] },
  { category: "electronique", name: "Imprimante Wi-Fi EcoPrint", brand: "Printa", price: 579, descriptor: "Imprimante multifonction à réservoir pour des documents nets et économiques.", specifications: { Fonctions: "Impression, copie, numérisation", Technologie: "Jet d’encre à réservoir", Vitesse: "15 pages/min", Connectivité: "Wi-Fi, USB", Format: "A4", Garantie: "12 mois" } },

  { category: "smartphones", name: "Smartphone Nexa X5 128 Go", brand: "Nexatek", price: 999, descriptor: "Smartphone 5G équilibré avec écran AMOLED fluide et appareil photo stabilisé.", specifications: { Écran: "6,5 pouces AMOLED 120 Hz", Processeur: "Octa-core 2,6 GHz", Mémoire: "8 Go RAM", Stockage: "128 Go", Appareil_photo: "50 Mpx OIS", Batterie: "5000 mAh, charge 45 W", Réseau: "5G, double SIM", Garantie: "12 mois" }, optionName: "Stockage", options: ["128 Go", "256 Go"], colors: ["Noir volcan", "Bleu minéral", "Orange"] },
  { category: "smartphones", name: "Smartphone Pro Max 256 Go", brand: "Orion", price: 1899, descriptor: "Grand écran OLED, triple caméra et autonomie renforcée pour les usages intensifs.", specifications: { Écran: "6,8 pouces OLED 120 Hz", Processeur: "Orion X2", Mémoire: "12 Go RAM", Stockage: "256 Go", Appareil_photo: "108 + 12 + 10 Mpx", Batterie: "5200 mAh, charge 80 W", Protection: "IP68", Garantie: "24 mois" }, optionName: "Stockage", options: ["256 Go", "512 Go"], colors: ["Graphite", "Titane clair"] },
  { category: "smartphones", name: "Smartphone Lite 5G 128 Go", brand: "Nexatek", price: 699, descriptor: "Un smartphone 5G accessible avec bonne autonomie et écran lumineux.", specifications: { Écran: "6,6 pouces IPS 90 Hz", Processeur: "Octa-core 2,2 GHz", Mémoire: "6 Go RAM", Stockage: "128 Go extensible", Appareil_photo: "48 Mpx", Batterie: "5000 mAh", Réseau: "5G", Garantie: "12 mois" }, optionName: "Stockage", options: ["128 Go", "256 Go"], colors: ["Noir", "Vert sauge"] },
  { category: "smartphones", name: "Smartphone View 6.7", brand: "Aster Mobile", price: 1249, descriptor: "Téléphone fin doté d’un grand écran AMOLED et d’un zoom optique polyvalent.", specifications: { Écran: "6,7 pouces AMOLED", Processeur: "Aster A9", Mémoire: "8 Go RAM", Stockage: "256 Go", Appareil_photo: "64 Mpx, zoom optique 3×", Batterie: "4800 mAh", Réseau: "5G, eSIM", Garantie: "12 mois" }, optionName: "Stockage", options: ["128 Go", "256 Go"], colors: ["Noir", "Argent"] },

  { category: "informatique", name: "Ordinateur portable WorkBook 14", brand: "Nexio", price: 2299, descriptor: "Portable léger pour la bureautique, les études et le travail hybride.", specifications: { Écran: "14 pouces IPS Full HD", Processeur: "Intel Core i5", Mémoire: "16 Go RAM", Stockage: "SSD 512 Go", Autonomie: "Jusqu’à 11 h", Poids: "1,35 kg", Garantie: "24 mois" }, optionName: "Configuration", options: ["16 Go / 512 Go", "16 Go / 1 To"], colors: ["Gris"] },
  { category: "informatique", name: "Ordinateur portable Creator 16", brand: "Nexio", price: 3999, descriptor: "Machine puissante avec écran précis et carte graphique dédiée pour la création.", specifications: { Écran: "16 pouces 2.5K, 100 % sRGB", Processeur: "Intel Core i7", Mémoire: "32 Go RAM", Stockage: "SSD 1 To", Graphique: "GPU dédié 8 Go", Connectivité: "Wi-Fi 6E, Thunderbolt", Garantie: "24 mois" }, optionName: "Mémoire", options: ["16 Go", "32 Go"] },
  { category: "informatique", name: "Écran UltraView 27 QHD", brand: "PixelOne", price: 899, descriptor: "Moniteur QHD confortable avec pied réglable et connectique USB-C.", specifications: { Dalle: "27 pouces IPS", Résolution: "2560 × 1440 px", Fréquence: "100 Hz", Couleurs: "99 % sRGB", Connexions: "USB-C 65 W, HDMI, DisplayPort", Réglage: "Hauteur, inclinaison, pivot" }, optionName: "Diagonale", options: ["27 pouces", "32 pouces"] },
  { category: "informatique", name: "Mini PC OfficeBox i5", brand: "Nexio", price: 1549, descriptor: "Mini ordinateur silencieux et évolutif pour les espaces de travail compacts.", specifications: { Processeur: "Intel Core i5", Mémoire: "16 Go DDR5", Stockage: "SSD 512 Go", Réseau: "Wi-Fi 6, Ethernet 2.5G", Ports: "USB-C, 4 × USB-A, 2 × HDMI", Système: "Sans système préinstallé" }, optionName: "Stockage", options: ["512 Go", "1 To"] },

  { category: "audio", name: "Écouteurs Bluetooth ANC Pro", brand: "Sonicore", price: 279, descriptor: "Écouteurs intra-auriculaires avec réduction de bruit et appels très clairs.", specifications: { Réduction_de_bruit: "Active, adaptative", Autonomie: "8 h + 24 h avec boîtier", Codecs: "AAC, LDAC", Microphones: "6 microphones", Protection: "IP54", Charge: "USB-C et sans fil" }, colors: ["Noir", "Blanc"] },
  { category: "audio", name: "Casque sans fil Noise Canceling", brand: "Sonicore", price: 449, descriptor: "Casque circum-aural confortable avec son équilibré et longue autonomie.", specifications: { Transducteurs: "40 mm", Réduction_de_bruit: "ANC hybride", Autonomie: "45 heures", Connexion: "Bluetooth 5.3, jack 3,5 mm", Charge_rapide: "10 min pour 5 h", Poids: "265 g" }, colors: ["Noir", "Sable"] },
  { category: "audio", name: "Enceinte Bluetooth Portable 30 W", brand: "WaveLab", price: 239, descriptor: "Enceinte robuste avec basses profondes pour l’intérieur et l’extérieur.", specifications: { Puissance: "30 W RMS", Autonomie: "16 heures", Protection: "IP67", Connexion: "Bluetooth 5.3", Fonctions: "Appairage stéréo, kit mains libres", Poids: "780 g" }, colors: ["Noir", "Orange", "Bleu"] },
  { category: "audio", name: "Barre de son compacte 2.1", brand: "WaveLab", price: 599, descriptor: "Barre de son fine avec caisson sans fil pour renforcer les dialogues et les basses.", specifications: { Puissance: "180 W", Canaux: "2.1", Caisson: "Sans fil", Connexions: "HDMI ARC, optique, Bluetooth", Modes: "Cinéma, voix, musique", Largeur: "78 cm" } },

  { category: "maison", name: "Aspirateur robot Laser Clean", brand: "Domia", price: 1199, descriptor: "Robot aspirateur et laveur avec cartographie laser et contrôle mobile.", specifications: { Aspiration: "5000 Pa", Navigation: "LiDAR", Autonomie: "150 minutes", Réservoir: "Poussière 400 ml, eau 250 ml", Contrôle: "Application et assistants vocaux", Seuil: "Jusqu’à 20 mm" } },
  { category: "maison", name: "Purificateur d’air PureSense", brand: "Domia", price: 749, descriptor: "Purificateur silencieux pour chambres et espaces de vie jusqu’à 45 m².", specifications: { Surface: "Jusqu’à 45 m²", Filtration: "Préfiltre, HEPA H13, charbon", Débit: "380 m³/h", Bruit_minimal: "22 dB", Capteurs: "PM2.5 et odeurs", Contrôle: "Écran et application" } },
  { category: "maison", name: "Ventilateur colonne SmartBreeze", brand: "Clima", price: 349, descriptor: "Ventilateur oscillant silencieux avec programmation et télécommande.", specifications: { Puissance: "45 W", Vitesses: "6", Oscillation: "80°", Minuterie: "12 heures", Bruit_minimal: "28 dB", Hauteur: "105 cm" }, colors: ["Blanc", "Noir"] },
  { category: "maison", name: "Station météo intérieure AirCheck", brand: "Sensea", price: 189, descriptor: "Écran lisible pour suivre température, humidité et qualité de l’air.", specifications: { Mesures: "Température, humidité, CO₂", Écran: "LCD couleur 4,3 pouces", Alertes: "Seuils personnalisables", Alimentation: "USB-C", Historique: "24 heures", Capteur: "Rechargeable sans fil" } },

  { category: "cuisine", name: "Air Fryer Duo 8 L", brand: "Cookly", price: 499, descriptor: "Friteuse à air double compartiment pour préparer deux plats simultanément.", specifications: { Capacité: "8 L, deux cuves", Puissance: "2400 W", Programmes: "8", Température: "40 à 200 °C", Minuterie: "60 minutes", Entretien: "Cuves compatibles lave-vaisselle" }, optionName: "Capacité", options: ["6 L", "8 L"] },
  { category: "cuisine", name: "Machine à café Barista 15 bars", brand: "Caffeo", price: 899, descriptor: "Machine espresso avec buse vapeur pour café moulu et dosettes.", specifications: { Pression: "15 bars", Réservoir: "1,5 L", Chauffe: "Thermoblock", Boissons: "Espresso, lungo, vapeur", Porte_filtre: "Simple et double", Puissance: "1350 W" }, colors: ["Noir", "Inox"] },
  { category: "cuisine", name: "Blender haute vitesse 1200 W", brand: "Cookly", price: 299, descriptor: "Blender puissant avec bol en verre pour smoothies, sauces et glace pilée.", specifications: { Puissance: "1200 W", Capacité: "1,5 L", Vitesses: "5 + impulsion", Lames: "6 lames inox", Programmes: "Smoothie, glace, nettoyage", Sécurité: "Verrouillage du bol" } },
  { category: "cuisine", name: "Balance de cuisine connectée", brand: "Sensea", price: 99, descriptor: "Balance précise avec application nutritionnelle et conversion automatique.", specifications: { Capacité: "5 kg", Précision: "1 g", Unités: "g, ml, oz, lb", Connexion: "Bluetooth", Alimentation: "3 piles AAA", Surface: "Verre trempé" }, colors: ["Noir", "Blanc"] },

  { category: "beaute-bien-etre", name: "Brosse nettoyante visage Sonic", brand: "Serein", price: 159, descriptor: "Nettoyage sonique doux avec intensités réglables pour la routine quotidienne.", specifications: { Pulsations: "8000 par minute", Intensités: "5", Autonomie: "30 jours", Protection: "IPX7", Charge: "USB-C", Matière: "Silicone médical" }, colors: ["Rose", "Bleu"] },
  { category: "beaute-bien-etre", name: "Sèche-cheveux Ion Pro 2200 W", brand: "Velora", price: 279, descriptor: "Séchage rapide avec contrôle de température et technologie ionique.", specifications: { Puissance: "2200 W", Vitesses: "2", Températures: "3 + air froid", Technologie: "Ionique", Accessoires: "Concentrateur et diffuseur", Cordon: "2,5 m" }, colors: ["Noir", "Cuivre"] },
  { category: "beaute-bien-etre", name: "Tondeuse multifonction Precision 9", brand: "Velora", price: 219, descriptor: "Tondeuse étanche avec neuf accessoires et réglages précis.", specifications: { Hauteurs: "0,5 à 20 mm", Accessoires: "9", Autonomie: "120 minutes", Charge: "USB-C, 90 minutes", Étanchéité: "IPX7", Lames: "Acier auto-affûté" } },
  { category: "beaute-bien-etre", name: "Pèse-personne Body Metrics", brand: "Sensea", price: 139, descriptor: "Balance connectée pour suivre poids et indicateurs corporels dans l’application.", specifications: { Capacité: "180 kg", Précision: "100 g", Indicateurs: "12 mesures", Connexion: "Bluetooth", Profils: "8 utilisateurs", Écran: "LED" }, colors: ["Noir", "Blanc"] },

  { category: "accessoires", name: "Chargeur GaN 100 W", brand: "Voltix", price: 169, descriptor: "Chargeur compact à quatre ports pour ordinateur, tablette et téléphone.", specifications: { Puissance: "100 W", Ports: "3 × USB-C, 1 × USB-A", Technologie: "GaN", Protocoles: "PD 3.0, PPS, QC", Protection: "Surchauffe et surtension", Poids: "210 g" }, optionName: "Puissance", options: ["65 W", "100 W"] },
  { category: "accessoires", name: "Hub USB-C 8-en-1", brand: "Linka", price: 199, descriptor: "Hub aluminium avec vidéo 4K, réseau et lecteur de cartes.", specifications: { Ports: "HDMI, Ethernet, USB-C, 3 × USB-A, SD, microSD", Vidéo: "4K à 60 Hz", Alimentation: "Pass-through 100 W", Réseau: "Gigabit", Câble: "18 cm", Compatibilité: "Windows, macOS, Android" } },
  { category: "accessoires", name: "Support téléphone magnétique voiture", brand: "RoadLink", price: 79, descriptor: "Support stable orientable à fixation grille avec anneau magnétique fourni.", specifications: { Fixation: "Grille d’aération", Rotation: "360°", Aimants: "N52", Compatibilité: "Téléphones 4,7 à 7 pouces", Installation: "Sans outil", Contenu: "Support et anneau adhésif" } },
  { category: "accessoires", name: "Câble USB-C renforcé 2 m", brand: "Voltix", price: 39, descriptor: "Câble tressé longue durée pour charge rapide et transfert de données.", specifications: { Longueur: "2 m", Puissance: "100 W", Débit: "480 Mbit/s", Connecteurs: "USB-C vers USB-C", Résistance: "30 000 flexions", Garantie: "24 mois" }, optionName: "Longueur", options: ["1 m", "2 m", "3 m"], colors: ["Noir", "Orange"] },

  { category: "sports-loisirs", name: "Tapis de course pliable RunCompact", brand: "PaceLab", price: 2399, descriptor: "Tapis compact avec programmes guidés et rangement vertical.", specifications: { Moteur: "2,5 CV", Vitesse: "1 à 16 km/h", Surface: "125 × 45 cm", Inclinaison: "3 niveaux", Poids_maximal: "120 kg", Pliable: "Oui" } },
  { category: "sports-loisirs", name: "Montre GPS Outdoor Trail", brand: "Altitude", price: 649, descriptor: "Montre sportive robuste avec GPS double fréquence et cartes d’itinéraires.", specifications: { Écran: "1,4 pouce transflectif", GPS: "Double fréquence", Autonomie: "18 jours, 42 h GPS", Étanchéité: "10 ATM", Capteurs: "Cardio, SpO₂, altimètre", Sports: "Plus de 100 profils" }, colors: ["Noir", "Vert"] },
  { category: "sports-loisirs", name: "Pistolet de massage Active Mini", brand: "PaceLab", price: 259, descriptor: "Appareil de récupération compact avec cinq vitesses et embouts ciblés.", specifications: { Vitesses: "5", Amplitude: "8 mm", Force: "12 kg", Autonomie: "5 heures", Embouts: "4", Bruit: "Moins de 45 dB" }, colors: ["Noir", "Orange"] },
  { category: "sports-loisirs", name: "Compteur vélo GPS RideTrack", brand: "Altitude", price: 349, descriptor: "Compteur lisible avec navigation, capteurs externes et synchronisation mobile.", specifications: { Écran: "2,6 pouces antireflet", GPS: "GPS, Galileo, GLONASS", Autonomie: "28 heures", Connexion: "Bluetooth, ANT+", Navigation: "Virage par virage", Protection: "IPX7" } },

  { category: "trottinettes-electriques", name: "Trottinette électrique UrbanRide S8", brand: "UrbanRide", price: 1699, descriptor: "Trottinette urbaine pliable et rassurante pour les trajets quotidiens.", specifications: { Puissance_moteur: "350 W nominal, 700 W crête", Vitesse_maximale: "25 km/h", Autonomie_estimée: "Jusqu’à 35 km", Batterie: "36 V, 10 Ah", Temps_de_charge: "5 à 6 h", Poids_maximal_supporté: "120 kg", Taille_des_roues: "10 pouces", Poids: "17,5 kg", Pliable: "Oui", Suspension: "Avant", Type_de_frein: "Disque arrière + frein électrique" }, optionName: "Autonomie", options: ["35 km", "45 km"], colors: ["Noir", "Gris"] },
  { category: "trottinettes-electriques", name: "Trottinette électrique CityFlow Pro", brand: "CityFlow", price: 2299, descriptor: "Modèle confortable à double suspension pour les routes urbaines irrégulières.", specifications: { Puissance_moteur: "500 W nominal, 900 W crête", Vitesse_maximale: "25 km/h", Autonomie_estimée: "Jusqu’à 50 km", Batterie: "48 V, 12,5 Ah", Temps_de_charge: "6 à 7 h", Poids_maximal_supporté: "130 kg", Taille_des_roues: "10 pouces tubeless", Poids: "22 kg", Pliable: "Oui", Suspension: "Avant et arrière", Type_de_frein: "Double disque + récupération" }, colors: ["Noir"] },
  { category: "trottinettes-electriques", name: "Trottinette électrique Commuter Lite", brand: "UrbanRide", price: 1299, descriptor: "Une solution légère et simple à transporter pour les courts déplacements.", specifications: { Puissance_moteur: "300 W", Vitesse_maximale: "25 km/h", Autonomie_estimée: "Jusqu’à 25 km", Batterie: "36 V, 7,5 Ah", Temps_de_charge: "4 h", Poids_maximal_supporté: "100 kg", Taille_des_roues: "8,5 pouces", Poids: "13,8 kg", Pliable: "Oui", Suspension: "Non", Type_de_frein: "Tambour avant + frein électrique" }, colors: ["Noir", "Blanc"] },
  { category: "trottinettes-electriques", name: "Trottinette électrique Explorer X2", brand: "VoltMotion", price: 3199, descriptor: "Trottinette puissante à grande autonomie pour les longs trajets et reliefs variés.", specifications: { Puissance_moteur: "2 × 600 W", Vitesse_maximale: "Limité à 25 km/h", Autonomie_estimée: "Jusqu’à 70 km", Batterie: "48 V, 20 Ah", Temps_de_charge: "8 à 10 h", Poids_maximal_supporté: "140 kg", Taille_des_roues: "11 pouces", Poids: "29 kg", Pliable: "Oui", Suspension: "Hydraulique avant et arrière", Type_de_frein: "Double disque hydraulique" }, optionName: "Batterie", options: ["15 Ah", "20 Ah"], colors: ["Noir", "Orange"] },

  { category: "velos-electriques", name: "Vélo électrique City E200", brand: "E-Ride", price: 3799, descriptor: "Vélo de ville confortable avec cadre bas, porte-bagages et éclairage intégré.", specifications: { Moteur: "Moyeu arrière 250 W", Couple: "45 Nm", Vitesse_assistée: "25 km/h", Autonomie_estimée: "50 à 80 km", Batterie: "36 V, 13 Ah amovible", Temps_de_charge: "5 à 6 h", Transmission: "7 vitesses", Freins: "Disques hydrauliques", Roues: "28 pouces", Poids: "24,5 kg" }, optionName: "Batterie", options: ["13 Ah", "17 Ah"], colors: ["Noir", "Bleu nuit"] },
  { category: "velos-electriques", name: "Vélo électrique Trekking T4", brand: "E-Ride", price: 4999, descriptor: "Vélo polyvalent à moteur central pour la ville, la route et les pistes faciles.", specifications: { Moteur: "Central 250 W", Couple: "70 Nm", Vitesse_assistée: "25 km/h", Autonomie_estimée: "60 à 110 km", Batterie: "48 V, 15 Ah intégrée", Temps_de_charge: "6 h", Transmission: "9 vitesses", Freins: "Disques hydrauliques", Suspension: "Fourche 80 mm", Poids: "25,8 kg" }, optionName: "Cadre", options: ["M", "L"], colors: ["Gris", "Vert forêt"] },
  { category: "velos-electriques", name: "Vélo électrique Pliant Fold E16", brand: "VoltMotion", price: 3299, descriptor: "Vélo compact à roues de 20 pouces, facile à plier et à ranger.", specifications: { Moteur: "Moyeu arrière 250 W", Couple: "40 Nm", Vitesse_assistée: "25 km/h", Autonomie_estimée: "Jusqu’à 55 km", Batterie: "36 V, 10 Ah amovible", Temps_de_charge: "4 à 5 h", Transmission: "7 vitesses", Freins: "Disques mécaniques", Pliable: "Cadre et potence", Poids: "21 kg" }, colors: ["Noir", "Orange"] },
  { category: "velos-electriques", name: "VTT électrique Trail E500", brand: "Altitude", price: 6499, descriptor: "VTT électrique robuste avec moteur central et suspension pour les sorties engagées.", specifications: { Moteur: "Central 250 W", Couple: "85 Nm", Vitesse_assistée: "25 km/h", Autonomie_estimée: "50 à 95 km", Batterie: "48 V, 17,5 Ah", Temps_de_charge: "6 à 7 h", Transmission: "10 vitesses", Freins: "Disques hydrauliques 4 pistons", Suspension: "Fourche 120 mm", Roues: "29 pouces" }, optionName: "Cadre", options: ["M", "L", "XL"], colors: ["Noir", "Sable"] },

  { category: "mobilite-electrique", name: "Casque urbain LED Signal", brand: "RoadLink", price: 189, descriptor: "Casque léger avec feu arrière, clignotants et ventilation réglable.", specifications: { Certification: "EN 1078", Éclairage: "LED arrière et clignotants", Autonomie: "12 heures", Recharge: "USB-C", Ventilation: "12 ouvertures", Poids: "360 g" }, optionName: "Tour de tête", options: ["54–58 cm", "58–62 cm"], colors: ["Noir", "Blanc"] },
  { category: "mobilite-electrique", name: "Antivol pliant SecureLock 90", brand: "RoadLink", price: 149, descriptor: "Antivol articulé résistant avec support de cadre compact.", specifications: { Longueur: "90 cm", Matériau: "Acier trempé", Niveau_de_sécurité: "8/10", Fermeture: "Clé sécurisée", Poids: "1,25 kg", Contenu: "Support et 2 clés" } },
  { category: "mobilite-electrique", name: "Pompe électrique AirGo", brand: "VoltMotion", price: 159, descriptor: "Compresseur portable avec arrêt automatique pour pneus et équipements de loisir.", specifications: { Pression_maximale: "150 PSI", Débit: "20 L/min", Batterie: "2500 mAh", Écran: "LCD", Préréglages: "4", Charge: "USB-C" } },
  { category: "mobilite-electrique", name: "Chargeur universel e-Mobility 48 V", brand: "VoltMotion", price: 249, descriptor: "Chargeur ventilé avec protections électriques et connecteurs interchangeables.", specifications: { Tension: "48 V", Courant: "3 A", Puissance: "168 W", Connecteurs: "GX16, DC 5.5, XLR", Protection: "Surtension, surchauffe, court-circuit", Ventilation: "Active" }, optionName: "Tension", options: ["36 V", "48 V"] },

  { category: "gaming", name: "Souris gaming RGB Pulse", brand: "NexPlay", price: 139, descriptor: "Souris légère et précise avec capteur réglable et boutons programmables.", specifications: { Capteur: "Optique 16 000 DPI", Poids: "69 g", Boutons: "6 programmables", Fréquence: "1000 Hz", Connexion: "USB filaire", Éclairage: "RGB configurable" }, colors: ["Noir", "Blanc"] },
  { category: "gaming", name: "Clavier mécanique compact K68", brand: "NexPlay", price: 249, descriptor: "Clavier 68 touches échangeables à chaud avec connexion triple.", specifications: { Format: "65 %", Switches: "Mécaniques linéaires", Connexion: "2,4 GHz, Bluetooth, USB-C", Autonomie: "70 heures", Touches: "PBT", Éclairage: "RGB" }, optionName: "Switches", options: ["Linéaires", "Tactiles"], colors: ["Noir", "Blanc"] },
  { category: "gaming", name: "Manette sans fil ProControl", brand: "NexPlay", price: 219, descriptor: "Manette multiplateforme avec gâchettes réglables et profils personnalisés.", specifications: { Connexion: "Bluetooth, 2,4 GHz, USB-C", Autonomie: "25 heures", Gâchettes: "Course réglable", Vibration: "Double moteur", Compatibilité: "PC, Android, iOS", Profils: "3" }, colors: ["Noir", "Orange"] },
  { category: "gaming", name: "Casque gaming Surround 7.1", brand: "Sonicore", price: 299, descriptor: "Casque confortable avec spatialisation précise et microphone détachable.", specifications: { Transducteurs: "50 mm", Son: "Surround virtuel 7.1", Microphone: "Cardioïde détachable", Connexion: "USB-C, USB-A", Poids: "285 g", Compatibilité: "PC et consoles" }, colors: ["Noir"] },

  { category: "objets-connectes", name: "Montre connectée AMOLED Active", brand: "Sensea", price: 399, descriptor: "Montre fine avec suivi santé, GPS et écran AMOLED toujours lisible.", specifications: { Écran: "1,43 pouce AMOLED", Autonomie: "10 jours", GPS: "Intégré", Santé: "Cardio, SpO₂, sommeil", Étanchéité: "5 ATM", Connexion: "Bluetooth 5.3" }, colors: ["Noir", "Or rose"] },
  { category: "objets-connectes", name: "Caméra Wi-Fi intelligente 2K", brand: "SafeHome", price: 179, descriptor: "Caméra intérieure motorisée avec détection de mouvement et vision nocturne.", specifications: { Résolution: "2K", Rotation: "360° horizontal", Vision_nocturne: "Infrarouge 10 m", Détection: "Personnes et mouvement", Stockage: "microSD et cloud", Audio: "Bidirectionnel" } },
  { category: "objets-connectes", name: "Ampoule LED connectée Couleur", brand: "Domia", price: 49, descriptor: "Ampoule Wi-Fi à intensité variable avec scènes et commande vocale.", specifications: { Culot: "E27", Puissance: "9 W", Luminosité: "806 lm", Couleurs: "16 millions", Connexion: "Wi-Fi 2,4 GHz", Compatibilité: "Google Assistant, Alexa" }, optionName: "Lot", options: ["1 ampoule", "Lot de 2", "Lot de 4"] },
  { category: "objets-connectes", name: "Capteur qualité d’air Smart Air", brand: "Sensea", price: 249, descriptor: "Capteur connecté compact pour surveiller l’air de chaque pièce.", specifications: { Mesures: "CO₂, COV, PM2.5, température, humidité", Écran: "E-ink", Connexion: "Wi-Fi", Alertes: "Application et couleur", Alimentation: "USB-C", Historique: "12 mois" } },
];

const reviewerNames = ["Meriem B.", "Youssef K.", "Lina S.", "Aziz M.", "Amira H.", "Malek J."];
const defaultColors = ["Noir", "Gris"];

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const allCatalogProducts: Product[] = seeds.map((seed, index) => {
  const category = allCatalogCategories.find((item) => item.slug === seed.category)!;
  const imageGroup = imageSets[seed.category];
  const id = `product-${String(index + 1).padStart(3, "0")}`;
  const productNumber = String(index + 1).padStart(4, "0");
  const stock = 8 + ((index * 17) % 74);
  const rating = Number((4.2 + (index % 7) * 0.1).toFixed(1));
  const optionValues: Array<string | null> = seed.options?.length ? seed.options : [null];
  const colors = seed.colors?.length ? seed.colors : defaultColors;
  const createdAt = new Date(Date.UTC(2026, 7, Math.max(1, 18 - (index % 18)))).toISOString();

  return {
    id,
    name: seed.name,
    slug: slugify(seed.name),
    description: `${seed.descriptor} Les caractéristiques sont présentées clairement pour vous aider à choisir le modèle adapté à vos besoins. Gadget importé de Chine et sélectionné pour sa fiabilité, sa facilité d’utilisation et son rapport qualité-prix.`,
    shortDescription: seed.descriptor,
    sku: `JSH-${productNumber}`,
    price: seed.price,
    compareAtPrice: index % 3 === 0 ? null : Math.round(seed.price * (index % 4 === 0 ? 1.18 : 1.12)),
    costPrice: Math.round(seed.price * 0.64),
    stock,
    brand: seed.brand,
    categoryId: category.id,
    category: { id: category.id, name: category.name, slug: category.slug },
    featured: index % 8 === 0 || [4, 36, 37, 40, 41].includes(index),
    isNew: index % 5 === 0,
    isFlashDeal: index % 7 === 1,
    rating,
    reviewCount: 18 + ((index * 29) % 240),
    soldCount: 35 + ((index * 41) % 730),
    tags: [seed.category, seed.brand.toLowerCase(), "gadget", "import-chine", index % 2 ? "quotidien" : "tendance"],
    specifications: seed.specifications,
    images: [0, 1, 2].map((offset) => ({ id: `${id}-image-${offset + 1}`, url: imageGroup[(index + offset) % imageGroup.length], alt: `${seed.name} — vue ${offset + 1}`, sortOrder: offset })),
    variants: optionValues.flatMap((optionValue, optionIndex) => colors.map((color, colorIndex) => ({
      id: `${id}-variant-${optionIndex}-${colorIndex}`,
      sku: `JSH-${productNumber}-${optionIndex + 1}-${colorIndex + 1}`,
      optionName: seed.optionName ?? null,
      optionValue,
      color,
      stock: Math.max(1, Math.floor(stock / Math.max(2, optionValues.length * colors.length))),
    }))),
    reviews: [0, 1, 2].map((reviewIndex) => ({
      id: `${id}-review-${reviewIndex + 1}`,
      userName: reviewerNames[(index + reviewIndex) % reviewerNames.length],
      rating: Math.max(3, Math.round(rating - (reviewIndex === 2 ? 0.7 : 0))),
      title: reviewIndex === 0 ? "Conforme et bien expliqué" : reviewIndex === 1 ? "Très bon choix" : "Bon rapport qualité-prix",
      comment: reviewIndex === 0 ? "Le produit correspond aux caractéristiques annoncées. La mise en route est simple et l’emballage protège bien l’appareil." : reviewIndex === 1 ? "Utilisé régulièrement depuis la réception, il répond à mes attentes. Les informations de la fiche m’ont aidé à choisir." : "Finition sérieuse et fonctionnement fiable. Je suis satisfait de mon achat et de la livraison.",
      verified: reviewIndex !== 2,
      createdAt: new Date(Date.UTC(2026, 6, 28 - reviewIndex * 6 - (index % 8))).toISOString(),
    })),
    createdAt,
    updatedAt: createdAt,
  };
});

export const catalogProducts = allCatalogProducts.filter((product) => !isExcludedCategorySlug(product.category.slug));

for (const category of catalogCategories) {
  category.productCount = catalogProducts.filter((product) => product.category.slug === category.slug).length;
}
