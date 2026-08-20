const palettes: Record<string, [string, string, string]> = {
  electronique: ["#9dacb5", "#ff6500", "#101820"], audio: ["#b8abbf", "#ff6500", "#1f1625"],
  maison: ["#d4c3ad", "#ff6500", "#261f18"], cuisine: ["#c7bcae", "#ff6500", "#27211b"], "beaute-bien-etre": ["#d9b9bb", "#ff6500", "#30181a"], accessoires: ["#aab6ba", "#ff6500", "#172126"],
  "sports-loisirs": ["#aebca8", "#ff6500", "#162016"], "trottinettes-electriques": ["#9ba8ac", "#ff6500", "#11191c"], "velos-electriques": ["#a5afa3", "#ff6500", "#152016"], "mobilite-electrique": ["#a7adb1", "#ff6500", "#161a1d"],
  gaming: ["#9d91aa", "#ff6500", "#17101d"], "objets-connectes": ["#9bb4b2", "#ff6500", "#102120"], editorial: ["#282828", "#ff6500", "#050505"],
};

const labels: Record<string, string> = {
  electronique: "ÉLECTRONIQUE / IMAGE ET ÉNERGIE", audio: "AUDIO / UN SON PLUS CLAIR",
  maison: "MAISON / QUOTIDIEN SIMPLIFIÉ", cuisine: "CUISINE / PRÉPAREZ AUTREMENT", "beaute-bien-etre": "BIEN-ÊTRE / VOTRE ROUTINE", accessoires: "ACCESSOIRES / TOUJOURS PRÊT",
  "sports-loisirs": "SPORTS / BOUGEZ PLUS", "trottinettes-electriques": "TROTTINETTES / VILLE ÉLECTRIQUE", "velos-electriques": "VÉLOS / ASSISTANCE ÉLECTRIQUE", "mobilite-electrique": "MOBILITÉ / ROUTE SÛRE",
  gaming: "GAMING / JOUEZ PRÉCIS", "objets-connectes": "OBJETS CONNECTÉS / MAÎTRISEZ VOTRE ESPACE", editorial: "JSHOP / GADGETS DE CHINE",
};

function headphones(accent: string, ink: string) { return `<path d="M250 520V430c0-190 105-310 250-310s250 120 250 310v90" fill="none" stroke="${ink}" stroke-width="70"/><rect x="180" y="450" width="175" height="300" rx="80" fill="${ink}"/><rect x="645" y="450" width="175" height="300" rx="80" fill="${accent}"/><circle cx="730" cy="600" r="38" fill="white" opacity=".8"/>`; }
function scooter(accent: string, ink: string) { return `<circle cx="280" cy="730" r="105" fill="${ink}"/><circle cx="280" cy="730" r="48" fill="${accent}"/><circle cx="735" cy="730" r="105" fill="${ink}"/><circle cx="735" cy="730" r="48" fill="${accent}"/><path d="M280 665h320l-80-415h175l40 415" fill="none" stroke="${ink}" stroke-width="42" stroke-linecap="round" stroke-linejoin="round"/><path d="M480 250h260" stroke="${accent}" stroke-width="34" stroke-linecap="round"/>`; }
function bicycle(accent: string, ink: string) { return `<circle cx="260" cy="680" r="155" fill="none" stroke="${ink}" stroke-width="34"/><circle cx="750" cy="680" r="155" fill="none" stroke="${ink}" stroke-width="34"/><path d="m260 680 185-260 155 260H260Zm185-260 235 25 70 235M400 390h155m70 0 70-65" fill="none" stroke="${accent}" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/><circle cx="600" cy="680" r="58" fill="${ink}"/>`; }
function gamepad(accent: string, ink: string) { return `<path d="M215 420c55-125 190-125 285-65 95-60 230-60 285 65l75 245c25 110-105 165-175 80L590 630H410l-95 115c-70 85-200 30-175-80l75-245Z" fill="${ink}"/><path d="M315 500v130m-65-65h130" stroke="${accent}" stroke-width="34" stroke-linecap="round"/><circle cx="690" cy="525" r="30" fill="${accent}"/><circle cx="755" cy="590" r="30" fill="white"/>`; }
function appliance(accent: string, ink: string) { return `<rect x="260" y="150" width="480" height="650" rx="72" fill="${ink}"/><circle cx="500" cy="480" r="165" fill="${accent}"/><circle cx="500" cy="480" r="92" fill="${ink}" opacity=".7"/><rect x="390" y="210" width="220" height="52" rx="24" fill="white" opacity=".65"/>`; }

function objectArt(category: string, accent: string, ink: string) {
  if (category === "audio") return headphones(accent, ink);
  if (category === "trottinettes-electriques") return scooter(accent, ink);
  if (category === "velos-electriques") return bicycle(accent, ink);
  if (category === "gaming") return gamepad(accent, ink);
  if (["maison", "cuisine", "beaute-bien-etre"].includes(category)) return appliance(accent, ink);
  if (category === "sports-loisirs") return `<circle cx="500" cy="500" r="275" fill="${ink}"/><path d="M500 225c90 75 125 160 125 275s-35 200-125 275M225 500h550M305 315c90 50 300 50 390 0M305 685c90-50 300-50 390 0" fill="none" stroke="${accent}" stroke-width="20"/>`;
  if (category === "objets-connectes") return `<rect x="285" y="180" width="430" height="610" rx="120" fill="${ink}"/><rect x="340" y="265" width="320" height="350" rx="70" fill="${accent}"/><path d="M420 700h160" stroke="white" stroke-width="30" stroke-linecap="round"/><circle cx="500" cy="440" r="70" fill="${ink}"/>`;
  if (category === "mobilite-electrique") return `<path d="M260 530c0-170 105-300 240-300s240 130 240 300v180H260V530Z" fill="${ink}"/><path d="M325 520h350M500 230v480" stroke="${accent}" stroke-width="28"/><rect x="360" y="690" width="280" height="80" rx="30" fill="${accent}"/>`;
  if (category === "editorial") return `${headphones(accent, ink)}<g transform="translate(600 280) scale(.35)">${gamepad("white", accent)}</g>`;
  return `<rect x="240" y="220" width="520" height="500" rx="70" fill="${ink}"/><circle cx="500" cy="470" r="145" fill="${accent}"/><path d="M420 470h160M500 390v160" stroke="white" stroke-width="28" stroke-linecap="round"/>`;
}

export async function GET(_: Request, { params }: { params: Promise<{ category: string; variant: string }> }) {
  const { category: requested, variant } = await params;
  const category = palettes[requested] ? requested : "electronique";
  const [base, primary, dark] = palettes[category];
  const variantNumber = Number.parseInt(variant, 10) || 1;
  const accent = variantNumber % 3 === 0 ? "#ffffff" : primary;
  const ink = variantNumber % 2 === 0 ? dark : "#0a0a0a";
  const hero = category === "editorial";
  const width = hero ? 1800 : 1000;
  const height = hero && variantNumber === 1 ? 960 : hero ? 1300 : 1250;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${base}"/><stop offset="1" stop-color="${dark}"/></linearGradient><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="white" stroke-opacity=".08"/></pattern></defs>
    <rect width="100%" height="100%" fill="url(#bg)"/><rect width="100%" height="100%" fill="url(#grid)"/><circle cx="${hero ? width * .74 : 780}" cy="${hero ? height * .4 : 230}" r="${hero ? 420 : 280}" fill="${primary}" opacity=".18"/>
    <g transform="${hero ? `translate(${width * .38} ${height * .03}) scale(${height / 1100})` : "translate(0 100)"}">${objectArt(category, accent, ink)}</g>
    <path d="M0 ${height - 190}h${width}" stroke="white" stroke-opacity=".2"/><text x="60" y="${height - 120}" fill="white" font-family="Arial, sans-serif" font-weight="900" font-size="${hero ? 44 : 28}" letter-spacing="4">${labels[category]}</text>
    <text x="${width - 60}" y="${height - 120}" text-anchor="end" fill="${primary}" font-family="Arial, sans-serif" font-weight="900" font-size="${hero ? 36 : 24}">0${variantNumber} / 26</text><text x="60" y="${height - 65}" fill="white" fill-opacity=".55" font-family="Arial, sans-serif" font-size="${hero ? 22 : 16}" letter-spacing="3">GADGETS UTILES · IMPORTÉS DE CHINE</text>
  </svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=31536000, immutable", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'" } });
}
