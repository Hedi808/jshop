import type { Locale } from "@/lib/i18n-config";

export type InformationPageKey = "contact" | "delivery" | "returns" | "about" | "terms" | "privacy";

type InformationPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Array<{ title: string; copy: string }>;
};

export const informationPages: Record<InformationPageKey, Record<Locale, InformationPageContent>> = {
  contact: {
    fr: {
      eyebrow: "Assistance JoShop",
      title: "Contact",
      intro: "Notre équipe vous accompagne pour les questions sur un produit, une commande ou une livraison.",
      sections: [
        { title: "Une commande en cours", copy: "Gardez votre numéro de commande à portée de main. Vous le trouverez sur la page de confirmation et dans votre historique de commandes." },
        { title: "Une question produit", copy: "Indiquez le nom exact du gadget et la caractéristique concernée afin que l’équipe puisse vous répondre précisément." },
      ],
    },
    en: {
      eyebrow: "JoShop support",
      title: "Contact",
      intro: "Our team can help with questions about a product, an order, or delivery.",
      sections: [
        { title: "An active order", copy: "Keep your order number handy. It appears on the confirmation page and in your order history." },
        { title: "A product question", copy: "Include the exact gadget name and the specification you need help with so the team can answer precisely." },
      ],
    },
    ar: {
      eyebrow: "دعم JoShop",
      title: "اتصل بنا",
      intro: "فريقنا يساعدك في الأسئلة المتعلقة بالمنتج أو الطلب أو التوصيل.",
      sections: [
        { title: "طلب قيد التنفيذ", copy: "احتفظ برقم الطلب. ستجده في صفحة التأكيد وفي سجل طلباتك." },
        { title: "سؤال عن منتج", copy: "اذكر اسم الأداة بدقة والمواصفة التي تريد الاستفسار عنها حتى تحصل على إجابة واضحة." },
      ],
    },
  },
  delivery: {
    fr: {
      eyebrow: "Aide à la commande",
      title: "Livraison",
      intro: "JoShop livre les commandes en Tunisie avec des tarifs affichés avant la confirmation du paiement.",
      sections: [
        { title: "Livraison standard", copy: "Le tarif standard est de 7 TND. Le délai indicatif est de 2 à 4 jours ouvrés." },
        { title: "Livraison express", copy: "Lorsque l’option est disponible, la livraison express coûte 15 TND pour un délai indicatif de 1 à 2 jours ouvrés." },
      ],
    },
    en: {
      eyebrow: "Order help",
      title: "Delivery",
      intro: "JoShop delivers orders in Tunisia, with shipping charges shown before payment is confirmed.",
      sections: [
        { title: "Standard delivery", copy: "Standard delivery costs 7 TND. The estimated timeframe is 2–4 business days." },
        { title: "Express delivery", copy: "When available, express delivery costs 15 TND with an estimated timeframe of 1–2 business days." },
      ],
    },
    ar: {
      eyebrow: "مساعدة الطلب",
      title: "التوصيل",
      intro: "توصّل JoShop الطلبات داخل تونس، وتظهر تكلفة التوصيل قبل تأكيد الدفع.",
      sections: [
        { title: "التوصيل العادي", copy: "تكلفة التوصيل العادي 7 د.ت والمدة التقديرية من يومي عمل إلى أربعة أيام." },
        { title: "التوصيل السريع", copy: "عند توفره، تبلغ كلفته 15 د.ت والمدة التقديرية من يوم عمل إلى يومين." },
      ],
    },
  },
  returns: {
    fr: {
      eyebrow: "Aide après achat",
      title: "Retours",
      intro: "Une demande de retour peut être effectuée dans les 14 jours suivant la réception de la commande.",
      sections: [
        { title: "État du produit", copy: "Le gadget doit être complet, dans son état d’origine, avec ses accessoires et son emballage." },
        { title: "Préparer la demande", copy: "Munissez-vous du numéro de commande, du nom du produit et d’une description claire du motif du retour." },
      ],
    },
    en: {
      eyebrow: "After-purchase help",
      title: "Returns",
      intro: "You can request a return within 14 days after receiving your order.",
      sections: [
        { title: "Product condition", copy: "The gadget must be complete and in its original condition, with all accessories and packaging." },
        { title: "Prepare your request", copy: "Have the order number, product name, and a clear description of the return reason ready." },
      ],
    },
    ar: {
      eyebrow: "مساعدة ما بعد الشراء",
      title: "الإرجاع",
      intro: "يمكنك طلب إرجاع المنتج خلال 14 يوماً من استلام الطلب.",
      sections: [
        { title: "حالة المنتج", copy: "يجب أن تكون الأداة كاملة وفي حالتها الأصلية مع كل الملحقات والتغليف." },
        { title: "تجهيز الطلب", copy: "حضّر رقم الطلب واسم المنتج ووصفاً واضحاً لسبب الإرجاع." },
      ],
    },
  },
  about: {
    fr: {
      eyebrow: "Notre sélection",
      title: "À propos de JoShop",
      intro: "JoShop est une boutique tunisienne dédiée aux gadgets utiles importés de Chine et choisis pour le quotidien.",
      sections: [
        { title: "Des gadgets, simplement", copy: "Nous privilégions les objets pratiques pour la maison, l’audio, les loisirs, la mobilité et les usages de tous les jours." },
        { title: "Une information lisible", copy: "Chaque fiche met en avant le prix en dinars tunisiens, les caractéristiques, le stock et les options disponibles." },
      ],
    },
    en: {
      eyebrow: "Our selection",
      title: "About JoShop",
      intro: "JoShop is a Tunisian store for useful gadgets imported from China and selected for everyday life.",
      sections: [
        { title: "Gadgets made simple", copy: "We focus on practical items for home, audio, leisure, mobility, and day-to-day use." },
        { title: "Clear information", copy: "Every product page highlights the price in Tunisian dinars, specifications, stock, and available options." },
      ],
    },
    ar: {
      eyebrow: "اختياراتنا",
      title: "عن JoShop",
      intro: "JoShop متجر تونسي للأدوات المفيدة المستوردة من الصين والمختارة للحياة اليومية.",
      sections: [
        { title: "أدوات بلا تعقيد", copy: "نختار منتجات عملية للمنزل والصوتيات والترفيه والتنقل والاستعمال اليومي." },
        { title: "معلومات واضحة", copy: "تعرض كل صفحة السعر بالدينار التونسي والمواصفات والمخزون والخيارات المتوفرة." },
      ],
    },
  },
  terms: {
    fr: {
      eyebrow: "Informations légales",
      title: "Conditions",
      intro: "Ces conditions résument les règles appliquées aux commandes passées sur JoShop.",
      sections: [
        { title: "Prix et disponibilité", copy: "Les prix sont affichés en TND. Une commande reste soumise à la disponibilité du stock au moment de sa confirmation." },
        { title: "Commande et paiement", copy: "Le récapitulatif présente les articles, la livraison et le total avant validation. Le paiement à la livraison est proposé au paiement." },
      ],
    },
    en: {
      eyebrow: "Legal information",
      title: "Terms",
      intro: "These terms summarize the rules that apply to orders placed on JoShop.",
      sections: [
        { title: "Prices and availability", copy: "Prices are shown in TND. Orders remain subject to stock availability when they are confirmed." },
        { title: "Order and payment", copy: "The summary shows the items, delivery charge, and total before confirmation. Cash on delivery is offered at checkout." },
      ],
    },
    ar: {
      eyebrow: "معلومات قانونية",
      title: "الشروط",
      intro: "تلخّص هذه الشروط القواعد المطبقة على الطلبات المسجلة عبر JoShop.",
      sections: [
        { title: "الأسعار والتوفر", copy: "تُعرض الأسعار بالدينار التونسي ويبقى الطلب مرتبطاً بتوفر المخزون عند التأكيد." },
        { title: "الطلب والدفع", copy: "يعرض الملخص المنتجات والتوصيل والمجموع قبل التأكيد، ويتوفر الدفع عند الاستلام." },
      ],
    },
  },
  privacy: {
    fr: {
      eyebrow: "Informations légales",
      title: "Confidentialité",
      intro: "JoShop utilise uniquement les informations nécessaires au compte client, au panier et au traitement des commandes.",
      sections: [
        { title: "Données de commande", copy: "Le nom, l’adresse e-mail, le téléphone et l’adresse de livraison servent à enregistrer et à livrer la commande." },
        { title: "Panier et favoris", copy: "Le panier, les favoris et les produits récemment consultés sont enregistrés localement dans votre navigateur." },
      ],
    },
    en: {
      eyebrow: "Legal information",
      title: "Privacy",
      intro: "JoShop uses only the information required for customer accounts, carts, and order processing.",
      sections: [
        { title: "Order data", copy: "Your name, email address, phone number, and delivery address are used to record and deliver the order." },
        { title: "Cart and wishlist", copy: "Your cart, wishlist, and recently viewed products are stored locally in your browser." },
      ],
    },
    ar: {
      eyebrow: "معلومات قانونية",
      title: "الخصوصية",
      intro: "تستخدم JoShop المعلومات الضرورية فقط لحساب العميل والسلة ومعالجة الطلبات.",
      sections: [
        { title: "بيانات الطلب", copy: "يُستخدم الاسم والبريد الإلكتروني والهاتف وعنوان التوصيل لتسجيل الطلب وتوصيله." },
        { title: "السلة والمفضلة", copy: "تُحفظ السلة والمفضلة والمنتجات التي شاهدتها مؤخراً داخل متصفحك." },
      ],
    },
  },
};
