/**
 * Fragrance catalog search
 *
 * Priority: RapidAPI (if key set) → local seed → AI fallback (handled in route)
 */

export interface FragranceCatalogResult {
  id: string
  name: string
  brand: string
  family: string
  topNotes: string[]
  middleNotes: string[]
  baseNotes: string[]
  imageUrl: string | null
  description: string | null
  gender: string | null
  year: number | null
}

export async function searchFragrances(query: string): Promise<FragranceCatalogResult[]> {
  if (!query.trim()) return []

  const rapidApiKey = process.env.RAPIDAPI_KEY
  if (rapidApiKey) {
    return searchViaRapidApi(query, rapidApiKey)
  }

  return searchLocalSeed(query)
}

async function searchViaRapidApi(query: string, apiKey: string): Promise<FragranceCatalogResult[]> {
  try {
    const res = await fetch(
      `https://fragrances.p.rapidapi.com/search?q=${encodeURIComponent(query)}&limit=20`,
      {
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "fragrances.p.rapidapi.com",
        },
      }
    )
    if (!res.ok) return searchLocalSeed(query)

    const data = await res.json()
    return (data.results ?? []).map((item: Record<string, unknown>) => ({
      id: String(item.id ?? ""),
      name: String(item.name ?? ""),
      brand: String(item.brand ?? ""),
      family: String(item.family ?? "woody"),
      topNotes: Array.isArray(item.topNotes) ? (item.topNotes as string[]) : [],
      middleNotes: Array.isArray(item.middleNotes) ? (item.middleNotes as string[]) : [],
      baseNotes: Array.isArray(item.baseNotes) ? (item.baseNotes as string[]) : [],
      imageUrl: item.imageUrl ? String(item.imageUrl) : null,
      description: item.description ? String(item.description) : null,
      gender: item.gender ? String(item.gender) : null,
      year: item.year ? Number(item.year) : null,
    }))
  } catch {
    return searchLocalSeed(query)
  }
}

// ─── Search algorithm ────────────────────────────────────────────────────────

function normalizeStr(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function scoreMatch(f: FragranceCatalogResult, normQ: string): number {
  const normName = normalizeStr(f.name)
  const normBrand = normalizeStr(f.brand)
  const fullEntry = `${normBrand} ${normName}`
  const qWords = normQ.split(" ").filter(Boolean)

  // Exact match
  if (normName === normQ || fullEntry === normQ) return 100
  if (`${normName} ${normBrand}` === normQ) return 100

  // Starts with
  if (normName.startsWith(normQ) || fullEntry.startsWith(normQ)) return 85

  // Contains full query
  if (normName.includes(normQ)) return 70
  if (normBrand.includes(normQ)) return 65
  if (fullEntry.includes(normQ)) return 60

  // All query words match somewhere in name+brand
  const allWords = [...normName.split(" "), ...normBrand.split(" ")]
  const matchedAll = qWords.every((qw) => allWords.some((fw) => fw.includes(qw) || qw.includes(fw)))
  if (matchedAll && qWords.length > 1) return 45

  // Partial word matches
  const matchCount = qWords.filter((qw) =>
    allWords.some((fw) => fw.includes(qw) || qw.includes(fw))
  ).length
  if (matchCount > 0) return 10 + matchCount * 10

  // Notes fallback (low priority)
  const allNotes = [...f.topNotes, ...f.middleNotes, ...f.baseNotes].map(normalizeStr)
  if (allNotes.some((n) => n.includes(normQ))) return 5

  return 0
}

function searchLocalSeed(query: string): FragranceCatalogResult[] {
  const normQ = normalizeStr(query)
  if (!normQ) return []

  const scored = SEED_FRAGRANCES.map((f) => ({ f, score: scoreMatch(f, normQ) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, 20).map(({ f }) => f)
}

// ─── Seed catalog (~230 fragrances, 14 families) ────────────────────────────

const SEED_FRAGRANCES: FragranceCatalogResult[] = [

  // ── FRESH ─────────────────────────────────────────────────────────────────
  { id: "fresh-01", name: "Bleu de Chanel", brand: "Chanel", family: "fresh", year: 2010, gender: "masculine", topNotes: ["Limón", "Naranja", "Menta"], middleNotes: ["Jengibre", "Nuez moscada", "Jazmín"], baseNotes: ["Cedro", "Sándalo", "Incienso"], description: "Un masculino fresco y sofisticado con carácter parisino.", imageUrl: null },
  { id: "fresh-02", name: "Sauvage", brand: "Dior", family: "fresh", year: 2015, gender: "masculine", topNotes: ["Bergamota", "Pimienta"], middleNotes: ["Geranio", "Lavanda"], baseNotes: ["Ambroxan", "Cedro"], description: "Fresco, salvaje y sin domesticar. Un icono moderno.", imageUrl: null },
  { id: "fresh-03", name: "Acqua di Gio", brand: "Giorgio Armani", family: "fresh", year: 1996, gender: "masculine", topNotes: ["Bergamota", "Neroli", "Lima"], middleNotes: ["Romero", "Jacinto", "Jazmín"], baseNotes: ["Cedro", "Musgo", "Ámbar"], description: "La esencia del Mediterráneo. Fresco marino clásico.", imageUrl: null },
  { id: "fresh-04", name: "Cool Water", brand: "Davidoff", family: "fresh", year: 1988, gender: "masculine", topNotes: ["Menta", "Naranja", "Lavanda"], middleNotes: ["Neroli", "Geranio", "Romero"], baseNotes: ["Cedro", "Musgo", "Ámbar"], description: "El acuático que definió una generación.", imageUrl: null },
  { id: "fresh-05", name: "Light Blue", brand: "Dolce & Gabbana", family: "fresh", year: 2001, gender: "feminine", topNotes: ["Limón de Sicilia", "Manzana", "Cedro"], middleNotes: ["Bambú", "Jazmín", "Rosa blanca"], baseNotes: ["Cedro", "Ámbar", "Almizcle"], description: "El verano mediterráneo en una botella.", imageUrl: null },
  { id: "fresh-06", name: "CK One", brand: "Calvin Klein", family: "fresh", year: 1994, gender: "unisex", topNotes: ["Bergamota", "Limón", "Piña", "Cardamomo"], middleNotes: ["Nuez moscada", "Jazmín", "Rosa"], baseNotes: ["Sándalo", "Ámbar", "Almizcle"], description: "El unisex que cambió la perfumería. Limpio y compartido.", imageUrl: null },
  { id: "fresh-07", name: "Chrome", brand: "Azzaro", family: "fresh", year: 1996, gender: "masculine", topNotes: ["Bergamota", "Neroli", "Limón"], middleNotes: ["Anís", "Cardamomo", "Rosa"], baseNotes: ["Sándalo", "Cedro", "Tonka"], description: "Fresco, limpio y con un toque acuático metálico.", imageUrl: null },
  { id: "fresh-08", name: "L'Eau d'Issey", brand: "Issey Miyake", family: "fresh", year: 1992, gender: "feminine", topNotes: ["Nélumbio acuático", "Bergamota", "Mandarina"], middleNotes: ["Rosa", "Lys", "Cyclamen"], baseNotes: ["Sándalo", "Almizcle", "Cedro"], description: "El agua convertida en perfume. Icono japonés de minimalismo.", imageUrl: null },
  { id: "fresh-09", name: "Colonia", brand: "Acqua di Parma", family: "fresh", year: 1916, gender: "unisex", topNotes: ["Bergamota de Calabria", "Lavanda", "Verbena"], middleNotes: ["Rosa", "Jazmín", "Neroli"], baseNotes: ["Vetiver", "Sándalo", "Musgo de Roble"], description: "La colonia italiana por excelencia. Elegancia clásica atemporal.", imageUrl: null },
  { id: "fresh-10", name: "Invictus", brand: "Paco Rabanne", family: "fresh", year: 2013, gender: "masculine", topNotes: ["Pomelo", "Laurel marino"], middleNotes: ["Jazmín", "Acacia seca"], baseNotes: ["Musgo de Roble", "Guayaco", "Ámbar"], description: "Para el guerrero moderno. Fresco, magnético e invicto.", imageUrl: null },
  { id: "fresh-11", name: "Versace Pour Homme", brand: "Versace", family: "fresh", year: 2008, gender: "masculine", topNotes: ["Limón", "Bergamota", "Neroli"], middleNotes: ["Hiacinto", "Ciclamen", "Cedro"], baseNotes: ["Fondo marino", "Almizcle"], description: "Fresco mediterráneo con carácter italiano.", imageUrl: null },
  { id: "fresh-12", name: "Eternity for Men", brand: "Calvin Klein", family: "fresh", year: 1989, gender: "masculine", topNotes: ["Lavanda", "Mandarina", "Limón"], middleNotes: ["Musgo", "Sándalo", "Neroli"], baseNotes: ["Ámbar", "Musgo de Roble", "Cedro"], description: "Un clásico de los 90 que definió el fougère americano.", imageUrl: null },
  { id: "fresh-13", name: "Eau Sauvage", brand: "Dior", family: "fresh", year: 1966, gender: "masculine", topNotes: ["Limón", "Rosalina", "Albahaca"], middleNotes: ["Jazmín", "Orris", "Rosa"], baseNotes: ["Vetiver", "Musgo de Roble", "Ámbar"], description: "La cologne que cambió la historia. El original Sauvage.", imageUrl: null },
  { id: "fresh-14", name: "Acqua di Gio Profumo", brand: "Giorgio Armani", family: "fresh", year: 2015, gender: "masculine", topNotes: ["Bergamota", "Pimienta"], middleNotes: ["Romero marino", "Notas marinas"], baseNotes: ["Incienso", "Patchouli", "Sándalo"], description: "La versión más oscura y profunda del clásico marino.", imageUrl: null },
  { id: "fresh-15", name: "L'Eau d'Issey Pour Homme", brand: "Issey Miyake", family: "fresh", year: 1994, gender: "masculine", topNotes: ["Mandarina", "Limón", "Coriandro"], middleNotes: ["Cilantro", "Salvia", "Cedro"], baseNotes: ["Ámbar", "Almizcle", "Vetiver"], description: "El agua masculina de Issey. Minimalismo zen.", imageUrl: null },
  { id: "fresh-16", name: "Acqua di Gio Profondo", brand: "Giorgio Armani", family: "fresh", year: 2021, gender: "masculine", topNotes: ["Bergamota", "Limón", "Mandarina"], middleNotes: ["Notas marinas", "Rosmarino", "Ciprés"], baseNotes: ["Patchouli", "Vetiver", "Labdanum"], description: "Las profundidades del Mediterráneo revisitadas.", imageUrl: null },
  { id: "fresh-17", name: "Man in Black Fluid", brand: "Bvlgari", family: "fresh", year: 2020, gender: "masculine", topNotes: ["Vodka", "Limón", "Bergamota"], middleNotes: ["Iris", "Vetiver", "Cardamomo"], baseNotes: ["Cedro", "Ámbar", "Almizcle"], description: "El lado fresco del hombre de negro.", imageUrl: null },
  { id: "fresh-18", name: "Allure Homme Edition Blanche", brand: "Chanel", family: "fresh", year: 2004, gender: "masculine", topNotes: ["Limón", "Bergamota", "Neroli"], middleNotes: ["Vetiver", "Sándalo", "Iris"], baseNotes: ["Cedro", "Almizcle blanco"], description: "La versión más luminosa y fría del Allure.", imageUrl: null },
  { id: "fresh-19", name: "Davidoff Adventure", brand: "Davidoff", family: "fresh", year: 2008, gender: "masculine", topNotes: ["Bergamota", "Mandarina", "Menta"], middleNotes: ["Cardamomo", "Artemisia", "Orégano"], baseNotes: ["Cedro del Atlas", "Resina", "Ámbar"], description: "Para el explorador moderno. Fresco y aventurero.", imageUrl: null },
  { id: "fresh-20", name: "Voyage d'Hermès", brand: "Hermès", family: "fresh", year: 2010, gender: "masculine", topNotes: ["Pepita", "Romero", "Ciclamen"], middleNotes: ["Incienso", "Árbol de madera", "Sándalo"], baseNotes: ["Vetiver", "Cedro", "Musgo de Roble"], description: "El viaje olfativo de Hermès. Seco y elegante.", imageUrl: null },
  { id: "fresh-21", name: "4711 Eau de Cologne", brand: "4711", family: "fresh", year: 1792, gender: "unisex", topNotes: ["Limón", "Naranja", "Bergamota"], middleNotes: ["Neroli", "Lavanda"], baseNotes: ["Romero", "Timol"], description: "La cologne más antigua del mundo. Un clásico eterno de Colonia.", imageUrl: null },
  { id: "fresh-22", name: "Givenchy Gentleman Cologne", brand: "Givenchy", family: "fresh", year: 2019, gender: "masculine", topNotes: ["Bergamota", "Pomelo"], middleNotes: ["Iris florentino", "Lavanda"], baseNotes: ["Patchouli", "Vainilla"], description: "La versión fresca y aireada del Gentleman.", imageUrl: null },
  { id: "fresh-23", name: "Polo Blue", brand: "Ralph Lauren", family: "fresh", year: 2003, gender: "masculine", topNotes: ["Melón", "Pepino", "Mandarina"], middleNotes: ["Salvia", "Geranio", "Suede"], baseNotes: ["Musk", "Cedro", "Vetiver"], description: "El azul atlántico de Ralph Lauren.", imageUrl: null },

  // ── FLORAL ────────────────────────────────────────────────────────────────
  { id: "floral-01", name: "La Vie Est Belle", brand: "Lancôme", family: "floral", year: 2012, gender: "feminine", topNotes: ["Grosella negra", "Pera"], middleNotes: ["Iris", "Peonía", "Jazmín"], baseNotes: ["Praliné", "Vainilla", "Patchouli"], description: "La vida es bella. Un floral gourmand delicadamente feliz.", imageUrl: null },
  { id: "floral-02", name: "Coco Mademoiselle", brand: "Chanel", family: "floral", year: 2001, gender: "feminine", topNotes: ["Naranja", "Bergamota"], middleNotes: ["Rosa", "Jazmín", "Iris"], baseNotes: ["Patchouli", "Vainilla", "Musgo blanco"], description: "La Mademoiselle moderna de Chanel. Elegante y libre.", imageUrl: null },
  { id: "floral-03", name: "Miss Dior", brand: "Dior", family: "floral", year: 2021, gender: "feminine", topNotes: ["Bergamota", "Rosa fresca"], middleNotes: ["Rosa centifolia", "Iris"], baseNotes: ["Patchouli"], description: "Una declaración de amor en forma de flor.", imageUrl: null },
  { id: "floral-04", name: "Flowerbomb", brand: "Viktor & Rolf", family: "floral", year: 2005, gender: "feminine", topNotes: ["Té verde", "Bergamota", "Osmanthus"], middleNotes: ["Freesia", "Jazmín", "Orquídea"], baseNotes: ["Musgo", "Almizcle", "Patchouli"], description: "Una explosión floral. Inmenso y envolvente.", imageUrl: null },
  { id: "floral-05", name: "J'adore", brand: "Dior", family: "floral", year: 1999, gender: "feminine", topNotes: ["Pera", "Melón"], middleNotes: ["Rosa damascena", "Jazmín", "Ylang-ylang"], baseNotes: ["Cedro", "Almizcle", "Vainilla"], description: "El floral dorado de Dior. Sensual y luminoso.", imageUrl: null },
  { id: "floral-06", name: "Chance", brand: "Chanel", family: "floral", year: 2002, gender: "feminine", topNotes: ["Piña", "Jacinto", "Rosa"], middleNotes: ["Iris", "Jazmín"], baseNotes: ["Patchouli", "Vetiver", "Musgo blanco"], description: "La fragrancia para quienes crean su propia suerte.", imageUrl: null },
  { id: "floral-07", name: "Good Girl", brand: "Carolina Herrera", family: "floral", year: 2016, gender: "feminine", topNotes: ["Almendra", "Café"], middleNotes: ["Jazmín", "Tuberosa"], baseNotes: ["Cacao", "Vainilla", "Tonka"], description: "El lado bueno y el lado oscuro. Dualidad femenina.", imageUrl: null },
  { id: "floral-08", name: "Daisy", brand: "Marc Jacobs", family: "floral", year: 2007, gender: "feminine", topNotes: ["Fresa", "Violeta", "Pomelo"], middleNotes: ["Jazmín", "Gardenia", "Violeta"], baseNotes: ["Almizcle blanco", "Vainilla", "Cedro"], description: "Joven, alegre y despreocupada como una margarita.", imageUrl: null },
  { id: "floral-09", name: "Si", brand: "Giorgio Armani", family: "floral", year: 2013, gender: "feminine", topNotes: ["Néctar de cassis"], middleNotes: ["Rosa", "Freesia"], baseNotes: ["Patchouli", "Vainilla", "Almizcle"], description: "Sí a la vida. Moderna, femenina y confiada.", imageUrl: null },
  { id: "floral-10", name: "Mon Paris", brand: "Yves Saint Laurent", family: "floral", year: 2016, gender: "feminine", topNotes: ["Fresas", "Pera", "Frambuesa"], middleNotes: ["Peonía", "Rosa", "Ylang-ylang"], baseNotes: ["Patchouli", "Almizcle blanco", "Ámbar"], description: "Un amor parisino en cada spray. Romántico y frutal.", imageUrl: null },
  { id: "floral-11", name: "Bloom", brand: "Gucci", family: "floral", year: 2017, gender: "feminine", topNotes: ["Ranúnculo", "Neroli"], middleNotes: ["Jazmín", "Tuberosa", "Rangoon Creeper"], baseNotes: ["Sándalo", "Musgo de Roble"], description: "Un jardín florido capturado en una botella de Gucci.", imageUrl: null },
  { id: "floral-12", name: "My Way", brand: "Giorgio Armani", family: "floral", year: 2020, gender: "feminine", topNotes: ["Bergamota", "Naranja de Egipto"], middleNotes: ["Tuberosa india", "Rosa Guntur"], baseNotes: ["Cedro de Virginia", "Almizcle de Vainilla"], description: "Para las mujeres que encuentran su propio camino.", imageUrl: null },
  { id: "floral-13", name: "Chloe Eau de Parfum", brand: "Chloé", family: "floral", year: 2008, gender: "feminine", topNotes: ["Peonía", "Litchi", "Magnolia"], middleNotes: ["Rosa de mayo", "Freesia", "Rosa"], baseNotes: ["Cedro", "Ámbar", "Almizcle"], description: "Elegancia romántica y femenina atemporal.", imageUrl: null },
  { id: "floral-14", name: "Valentino Donna", brand: "Valentino", family: "floral", year: 2015, gender: "feminine", topNotes: ["Bergamota", "Limón", "Neroli"], middleNotes: ["Rosa italiana", "Iris florentino"], baseNotes: ["Cuero", "Vainilla", "Almizcle"], description: "Alta costura italiana en forma de fragancia.", imageUrl: null },
  { id: "floral-15", name: "Idole", brand: "Lancôme", family: "floral", year: 2019, gender: "feminine", topNotes: ["Pera", "Bergamota"], middleNotes: ["Rosa de mayo", "Jazmín"], baseNotes: ["Almizcle", "Cedro", "Musgo de Roble"], description: "Para la mujer que traza su propio camino.", imageUrl: null },
  { id: "floral-16", name: "Libre", brand: "Yves Saint Laurent", family: "floral", year: 2019, gender: "feminine", topNotes: ["Mandarina", "Petitgrain"], middleNotes: ["Lavanda de Grasse", "Jazmín marroquí"], baseNotes: ["Almizcle de vainilla", "Cedro", "Ámbar"], description: "Libertad y poder femenino. Floral amaderado.", imageUrl: null },
  { id: "floral-17", name: "Bright Crystal", brand: "Versace", family: "floral", year: 2006, gender: "feminine", topNotes: ["Granada", "Yuzu", "Magnolia"], middleNotes: ["Loto", "Peonía", "Magnolia"], baseNotes: ["Almizcle", "Ámbar", "Sándalo"], description: "Cristalina, fresca y femenina. Una gema de Versace.", imageUrl: null },
  { id: "floral-18", name: "Flora by Gucci", brand: "Gucci", family: "floral", year: 2009, gender: "feminine", topNotes: ["Citrus", "Peonía", "Rosa rosada"], middleNotes: ["Rosa centifolia", "Osmanthus"], baseNotes: ["Sandalo", "Almizcle"], description: "Un jardín floreciente lleno de luz.", imageUrl: null },
  { id: "floral-19", name: "Chance Eau Tendre", brand: "Chanel", family: "floral", year: 2010, gender: "feminine", topNotes: ["Pomelo", "Cidra"], middleNotes: ["Jacinto", "Jazmín", "Rosa"], baseNotes: ["Almizcle blanco", "Cédrambre", "Iris"], description: "La versión más suave y tierna del Chance.", imageUrl: null },
  { id: "floral-20", name: "Un Jardin sur la Lagune", brand: "Hermès", family: "floral", year: 2019, gender: "unisex", topNotes: ["Magnolia", "Gardenia blanca"], middleNotes: ["Flores blancas de Italia"], baseNotes: ["Madera blanca", "Heno"], description: "Una laguna veneciana de flores blancas.", imageUrl: null },
  { id: "floral-21", name: "Narciso Rodriguez for Her", brand: "Narciso Rodriguez", family: "floral", year: 2003, gender: "feminine", topNotes: ["Osmanthus", "Gardenia"], middleNotes: ["Rosa", "Flor de naranjo"], baseNotes: ["Almizcle", "Ámbar"], description: "El almizcle floral más sensual.", imageUrl: null },
  { id: "floral-22", name: "Pleasures", brand: "Estée Lauder", family: "floral", year: 1995, gender: "feminine", topNotes: ["Bergamota", "Rosa", "Violeta"], middleNotes: ["Jazmín", "Nardo", "Peonía"], baseNotes: ["Sándalo", "Almizcle", "Vetiver"], description: "Los pequeños placeres de la vida. Floral fresco atemporal.", imageUrl: null },

  // ── ORIENTAL ──────────────────────────────────────────────────────────────
  { id: "oriental-01", name: "Black Opium", brand: "Yves Saint Laurent", family: "oriental", year: 2014, gender: "feminine", topNotes: ["Pera", "Rosa", "Flor de naranja"], middleNotes: ["Café", "Jazmín"], baseNotes: ["Vainilla", "Patchouli", "Cedro"], description: "Adictivo, oscuro y envolvente. Café y flores de noche.", imageUrl: null },
  { id: "oriental-02", name: "Shalimar", brand: "Guerlain", family: "oriental", year: 1925, gender: "feminine", topNotes: ["Limón", "Bergamota"], middleNotes: ["Rosa", "Iris", "Jazmín"], baseNotes: ["Vainilla", "Incienso", "Ámbar", "Almizcle"], description: "La reina de los orientales. Un siglo de historia y sensualidad.", imageUrl: null },
  { id: "oriental-03", name: "Angel", brand: "Thierry Mugler", family: "oriental", year: 1992, gender: "feminine", topNotes: ["Melón", "Frambuesa", "Caramelo"], middleNotes: ["Miel", "Patchouli", "Chocolate"], baseNotes: ["Vainilla", "Caramelo", "Patchouli"], description: "El gourmand que lo inventó todo. Goloso e hipnótico.", imageUrl: null },
  { id: "oriental-04", name: "Spicebomb", brand: "Viktor & Rolf", family: "oriental", year: 2012, gender: "masculine", topNotes: ["Pomelo", "Bergamota", "Pimienta roja"], middleNotes: ["Canela", "Pimienta de Cayena", "Safrán"], baseNotes: ["Vetiver", "Cuero", "Tabaco"], description: "Una bomba de especias. Explosivo, masculino y seductor.", imageUrl: null },
  { id: "oriental-05", name: "Black Orchid", brand: "Tom Ford", family: "oriental", year: 2006, gender: "unisex", topNotes: ["Trufa negra", "Frutas negras", "Pomelo"], middleNotes: ["Orquídea negra", "Ylang-ylang", "Especias negras"], baseNotes: ["Patchouli", "Vainilla", "Sándalo", "Vetiver"], description: "Oscuro, lujoso y magnético. La joya oscura de Tom Ford.", imageUrl: null },
  { id: "oriental-06", name: "Alien", brand: "Thierry Mugler", family: "oriental", year: 2005, gender: "feminine", topNotes: ["Jazmín"], middleNotes: ["Heliotropo", "Flor de sol blanco"], baseNotes: ["Madera de cachemir", "Ámbar"], description: "Extraterrestre y único. Una firma imposible de imitar.", imageUrl: null },
  { id: "oriental-07", name: "1 Million", brand: "Paco Rabanne", family: "oriental", year: 2008, gender: "masculine", topNotes: ["Pomelo", "Mandarina", "Menta"], middleNotes: ["Canela", "Especias", "Rosa"], baseNotes: ["Cuero", "Ámbar", "Madera"], description: "Vale un millón. Magnético, especiado y seductor.", imageUrl: null },
  { id: "oriental-08", name: "Oud Wood", brand: "Tom Ford", family: "oriental", year: 2007, gender: "unisex", topNotes: ["Cardamomo", "Pimienta china"], middleNotes: ["Oud", "Sándalo", "Vetiver"], baseNotes: ["Tonka", "Ámbar"], description: "El oud occidental por excelencia. Oscuro y lujoso.", imageUrl: null },
  { id: "oriental-09", name: "Narciso", brand: "Narciso Rodriguez", family: "oriental", year: 2014, gender: "feminine", topNotes: ["Almizcle"], middleNotes: ["Rosa centifolia", "Magnolia"], baseNotes: ["Cedro de Virginia", "Vetiver"], description: "Minimalista y sensual. El almizcle como arte.", imageUrl: null },
  { id: "oriental-10", name: "Boss Bottled", brand: "Hugo Boss", family: "oriental", year: 1998, gender: "masculine", topNotes: ["Manzana", "Limón", "Ciruela"], middleNotes: ["Geranio", "Violeta", "Canela"], baseNotes: ["Sándalo", "Vainilla", "Cedro"], description: "El caballero moderno de Hugo Boss. Clásico e infalible.", imageUrl: null },
  { id: "oriental-11", name: "Opium pour Homme", brand: "Yves Saint Laurent", family: "oriental", year: 1995, gender: "masculine", topNotes: ["Bergamota", "Menta", "Pomelo"], middleNotes: ["Pimienta", "Nuez moscada", "Canela"], baseNotes: ["Vetiver", "Sándalo", "Ámbar"], description: "El oriental masculino de YSL. Especiado y seductor.", imageUrl: null },
  { id: "oriental-12", name: "Hypnôse", brand: "Lancôme", family: "oriental", year: 2005, gender: "feminine", topNotes: ["Bergamota", "Mandarina"], middleNotes: ["Jazmín", "Ylang-ylang", "Iris"], baseNotes: ["Vainilla", "Sándalo", "Vetiver"], description: "Hipnótica y elegante. Oriental suave y femenino.", imageUrl: null },
  { id: "oriental-13", name: "Habit Rouge", brand: "Guerlain", family: "oriental", year: 1965, gender: "masculine", topNotes: ["Bergamota", "Limón", "Petitgrain"], middleNotes: ["Rosa", "Jazmín", "Geranio"], baseNotes: ["Vetiver", "Ámbar", "Vainilla", "Cuero"], description: "El cuero oriental de Guerlain. Clásico refinado.", imageUrl: null },
  { id: "oriental-14", name: "Rose Oud", brand: "Kilian", family: "oriental", year: 2011, gender: "unisex", topNotes: ["Rosa", "Canela"], middleNotes: ["Oud", "Vetiver"], baseNotes: ["Vainilla", "Almizcle", "Madera"], description: "La rosa y el oud en perfecta armonía.", imageUrl: null },
  { id: "oriental-15", name: "Midnight in Paris", brand: "Van Cleef & Arpels", family: "oriental", year: 2010, gender: "masculine", topNotes: ["Mandarina", "Bergamota"], middleNotes: ["Violeta", "Cedro", "Sándalo"], baseNotes: ["Vetiver", "Oud", "Ámbar"], description: "París de noche. Oscuro, elegante y misterioso.", imageUrl: null },

  // ── WOODY ─────────────────────────────────────────────────────────────────
  { id: "woody-01", name: "Terre d'Hermès", brand: "Hermès", family: "woody", year: 2006, gender: "masculine", topNotes: ["Pomelo", "Pimienta naranja"], middleNotes: ["Pimienta", "Geranio"], baseNotes: ["Vetiver", "Cedro", "Benzoe"], description: "Terroso, mineral y profundamente masculino.", imageUrl: null },
  { id: "woody-02", name: "Aventus", brand: "Creed", family: "woody", year: 2010, gender: "masculine", topNotes: ["Piña", "Bergamota", "Grosella negra"], middleNotes: ["Abedul", "Patchouli", "Jazmín"], baseNotes: ["Musgo de Roble", "Almizcle", "Ámbar"], description: "El perfume del poder. Ambición destilada en fragancia.", imageUrl: null },
  { id: "woody-03", name: "Encre Noire", brand: "Lalique", family: "woody", year: 2006, gender: "masculine", topNotes: ["Ciprés", "Violeta"], middleNotes: ["Vetiver de Madagascar"], baseNotes: ["Cedro", "Almizcle"], description: "El vetiver más crudo y oscuro. Profundidad sin límites.", imageUrl: null },
  { id: "woody-04", name: "Legend", brand: "Mont Blanc", family: "woody", year: 2006, gender: "masculine", topNotes: ["Bergamota", "Lavanda", "Piña"], middleNotes: ["Romero", "Geranio", "Musgo"], baseNotes: ["Cedro", "Sándalo", "Tonka", "Almizcle"], description: "La leyenda accesible. Limpio, fresco y elegante.", imageUrl: null },
  { id: "woody-05", name: "Dior Homme", brand: "Dior", family: "woody", year: 2011, gender: "masculine", topNotes: ["Lavanda", "Bergamota", "Cacao"], middleNotes: ["Iris", "Cacao"], baseNotes: ["Vetiver", "Cedro", "Almizcle"], description: "El iris como jamás lo habías olido. Minimalismo chic.", imageUrl: null },
  { id: "woody-06", name: "Sauvage EDP", brand: "Dior", family: "woody", year: 2018, gender: "masculine", topNotes: ["Bergamota", "Lavanda"], middleNotes: ["Pimienta Sichuan", "Vetiver"], baseNotes: ["Ambroxan", "Cedro", "Labdanum"], description: "La versión más oscura y amaderada del Sauvage original.", imageUrl: null },
  { id: "woody-07", name: "Fahrenheit", brand: "Dior", family: "woody", year: 1988, gender: "masculine", topNotes: ["Lavanda", "Bergamota", "Mandarina"], middleNotes: ["Violeta", "Cedro", "Geranio"], baseNotes: ["Cuero", "Musgo", "Madera", "Ámbar"], description: "El rock madera de los 80. Cuero, gasolina y elegancia.", imageUrl: null },
  { id: "woody-08", name: "Bleu de Chanel EDP", brand: "Chanel", family: "woody", year: 2011, gender: "masculine", topNotes: ["Limón", "Menta", "Pomelo"], middleNotes: ["Nuez moscada", "Incienso", "Jazmín"], baseNotes: ["Cedro", "Sándalo", "Patchouli"], description: "Más profundo que el EDT. Amaderado y misterioso.", imageUrl: null },
  { id: "woody-09", name: "Allure Homme Sport", brand: "Chanel", family: "woody", year: 2004, gender: "masculine", topNotes: ["Mandarina", "Citron", "Bergamota"], middleNotes: ["Notas marinas", "Cedro"], baseNotes: ["Vetiver", "Madera del Pacífico", "Almizcle"], description: "El deporte con elegancia Chanel. Dinámico y sofisticado.", imageUrl: null },
  { id: "woody-10", name: "Dior Homme Intense", brand: "Dior", family: "woody", year: 2011, gender: "masculine", topNotes: ["Lavanda", "Cacao"], middleNotes: ["Iris root", "Orris"], baseNotes: ["Vetiver", "Ámbar", "Cedro"], description: "El Dior Homme llevado al extremo. Iris denso y envolvente.", imageUrl: null },
  { id: "woody-11", name: "Bvlgari Man Wood Essence", brand: "Bvlgari", family: "woody", year: 2018, gender: "masculine", topNotes: ["Cardamomo", "Bergamota"], middleNotes: ["Cedro del Atlas", "Guayaco"], baseNotes: ["Musgo de Roble", "Ámbar", "Vetiver"], description: "La esencia pura del bosque en un traje de Bvlgari.", imageUrl: null },
  { id: "woody-12", name: "Green Irish Tweed", brand: "Creed", family: "woody", year: 1985, gender: "masculine", topNotes: ["Verbena de limón", "Iris", "Menta verde"], middleNotes: ["Violeta", "Iris"], baseNotes: ["Sándalo de Mysore", "Ámbar"], description: "El fougère verde de Creed. El ADN de Sauvage.", imageUrl: null },
  { id: "woody-13", name: "Tobacco Vanille", brand: "Tom Ford", family: "woody", year: 2007, gender: "unisex", topNotes: ["Tabaco", "Especias"], middleNotes: ["Vainilla", "Cacao", "Madera"], baseNotes: ["Tonka", "Almizcle", "Roble"], description: "Tabaco y vainilla en la más suntuosa combinación.", imageUrl: null },
  { id: "woody-14", name: "Sycomore", brand: "Chanel", family: "woody", year: 2008, gender: "unisex", topNotes: ["Vetiver", "Ciprés", "Almendras"], middleNotes: ["Sándalo", "Notas de ahumado"], baseNotes: ["Vetiver", "Cedro"], description: "El sicomoro: madera profunda y ahumada de Chanel.", imageUrl: null },
  { id: "woody-15", name: "Santal 33", brand: "Le Labo", family: "woody", year: 2011, gender: "unisex", topNotes: ["Cardamomo", "Iris", "Violeta"], middleNotes: ["Ámbar", "Papiro", "Cedro"], baseNotes: ["Sándalo", "Almizcle", "Cuero"], description: "El sándalo artesanal que conquistó el mundo.", imageUrl: null },

  // ── GREEN ─────────────────────────────────────────────────────────────────
  { id: "green-01", name: "Chanel No. 19", brand: "Chanel", family: "green", year: 1970, gender: "feminine", topNotes: ["Aldeídos", "Neroli", "Bergamota", "Galbanum"], middleNotes: ["Lirio", "Jazmín", "Iris"], baseNotes: ["Vetiver", "Cedro", "Musgo de Roble"], description: "El verde intemporal de Chanel. Hierba y flores en equilibrio.", imageUrl: null },
  { id: "green-02", name: "Un Jardin sur le Nil", brand: "Hermès", family: "green", year: 2005, gender: "unisex", topNotes: ["Tomate verde", "Loto", "Pomelo", "Mangostán"], middleNotes: ["Galbanum", "Flor de árbol"], baseNotes: ["Madera seca", "Incienso"], description: "Un jardín a orillas del Nilo. Verde, fresco y sereno.", imageUrl: null },
  { id: "green-03", name: "Polo Green", brand: "Ralph Lauren", family: "green", year: 1978, gender: "masculine", topNotes: ["Pino", "Albahaca", "Tabaco verde"], middleNotes: ["Artemisa", "Tomillo", "Cuero"], baseNotes: ["Cedro", "Patchouli", "Musgo de Roble"], description: "El chypre verde americano. El campo y el lujo combinados.", imageUrl: null },
  { id: "green-04", name: "Vent Vert", brand: "Balmain", family: "green", year: 1947, gender: "feminine", topNotes: ["Galbanum", "Bergamota", "Neroli"], middleNotes: ["Iris", "Jazmín", "Ylang-ylang"], baseNotes: ["Musgo de Roble", "Cedro", "Vetiver"], description: "El verde más puro de la historia. Hierba y campo.", imageUrl: null },
  { id: "green-05", name: "Erolfa", brand: "Creed", family: "green", year: 1992, gender: "masculine", topNotes: ["Bergamota", "Pomelo", "Petitgrain"], middleNotes: ["Geranio", "Lavanda", "Artemisa"], baseNotes: ["Cedro", "Vetiver", "Ámbar"], description: "Fresco marino y verde. El Mediterráneo silvestre de Creed.", imageUrl: null },
  { id: "green-06", name: "Parfum de Therese", brand: "Frédéric Malle", family: "green", year: 2000, gender: "unisex", topNotes: ["Sandía", "Bergamota"], middleNotes: ["Rosa", "Jazmín", "Vetiver"], baseNotes: ["Cedro", "Sándalo", "Almizcle"], description: "Verde y floral unisex, refrescante y elegante.", imageUrl: null },
  { id: "green-07", name: "Amazonia Wild", brand: "Azzaro", family: "green", year: 2015, gender: "masculine", topNotes: ["Bergamota", "Menta", "Vetiver verde"], middleNotes: ["Cedro", "Bambú"], baseNotes: ["Musgo", "Madera seca", "Almizcle"], description: "La jungla en estado puro. Verde y salvaje.", imageUrl: null },
  { id: "green-08", name: "Niki de Saint Phalle", brand: "Niki de Saint Phalle", family: "green", year: 1982, gender: "feminine", topNotes: ["Bergamota", "Neroli", "Galbanum"], middleNotes: ["Violeta", "Muguet", "Rosa"], baseNotes: ["Musgo de Roble", "Vetiver", "Sándalo"], description: "Verde clásico de los 80. Elegante y natural.", imageUrl: null },
  { id: "green-09", name: "Calèche", brand: "Hermès", family: "green", year: 1961, gender: "feminine", topNotes: ["Bergamota", "Aldeídos", "Galbanum"], middleNotes: ["Rosa", "Jazmín", "Iris"], baseNotes: ["Vetiver", "Sándalo", "Musgo de Roble"], description: "El verde clásico de Hermès. Refinado y ecuestre.", imageUrl: null },

  // ── AMBER ─────────────────────────────────────────────────────────────────
  { id: "amber-01", name: "Ambre Sultan", brand: "Serge Lutens", family: "amber", year: 2000, gender: "unisex", topNotes: ["Hojas de laurel", "Orégano", "Plantas aromáticas"], middleNotes: ["Ámbar", "Resinas orientales"], baseNotes: ["Vainilla", "Sándalo", "Musgo"], description: "El ámbar más puro de Serge Lutens. Cálido, resinoso y hechizante.", imageUrl: null },
  { id: "amber-02", name: "L'Ambre des Merveilles", brand: "Hermès", family: "amber", year: 2006, gender: "feminine", topNotes: ["Bergamota", "Ámbar"], middleNotes: ["Incienso"], baseNotes: ["Ámbar", "Benjuí", "Musgo de Roble", "Almizcle"], description: "El ámbar llevado a la excelencia por Hermès. Suave y radiante.", imageUrl: null },
  { id: "amber-03", name: "Opium", brand: "Yves Saint Laurent", family: "amber", year: 1977, gender: "feminine", topNotes: ["Mandarina", "Bergamota", "Enebro"], middleNotes: ["Rosa", "Jazmín", "Clavo"], baseNotes: ["Ámbar", "Sándalo", "Mirra", "Incienso"], description: "El oriental escandaloso que redefinió la provocación en perfumería.", imageUrl: null },
  { id: "amber-04", name: "Musc Ravageur", brand: "Frédéric Malle", family: "amber", year: 2000, gender: "unisex", topNotes: ["Mandarina", "Lavanda", "Bergamota"], middleNotes: ["Canela", "Clavo"], baseNotes: ["Almizcle", "Sándalo", "Vainilla", "Ámbar"], description: "El almizcle salvaje y animal. Carnal e irresistible.", imageUrl: null },
  { id: "amber-05", name: "Ambre Nuit", brand: "Dior", family: "amber", year: 2009, gender: "unisex", topNotes: ["Rosa turca", "Bergamota"], middleNotes: ["Ámbar", "Cardamomo"], baseNotes: ["Labdanum", "Cedro", "Almizcle"], description: "La noche de ámbar de Dior. Profundo, sensual y misterioso.", imageUrl: null },
  { id: "amber-06", name: "Amber Pour Homme", brand: "Paco Rabanne", family: "amber", year: 1996, gender: "masculine", topNotes: ["Bergamota", "Galbanum", "Mandarina"], middleNotes: ["Rosa", "Iris", "Geranio"], baseNotes: ["Ámbar", "Vetiver", "Sándalo"], description: "El ámbar masculino accesible y siempre elegante.", imageUrl: null },
  { id: "amber-07", name: "Rochas Man", brand: "Rochas", family: "amber", year: 1999, gender: "masculine", topNotes: ["Bergamota", "Limón", "Clementina"], middleNotes: ["Nuez moscada", "Cardamomo", "Canela"], baseNotes: ["Ámbar", "Vainilla", "Almizcle"], description: "Especiado y ambarado. Un masculino cálido y accesible.", imageUrl: null },
  { id: "amber-08", name: "Lolita Lempicka au Masculin", brand: "Lolita Lempicka", family: "amber", year: 2000, gender: "masculine", topNotes: ["Anís", "Enebro"], middleNotes: ["Iris", "Lirio", "Musgo de Roble"], baseNotes: ["Vetiver", "Almizcle", "Tonka"], description: "El lado masculino del mundo de Lolita. Anisado y profundo.", imageUrl: null },

  // ── CÍTRICA ────────────────────────────────────────────────────────────────
  { id: "citrica-01", name: "Neroli Portofino", brand: "Tom Ford", family: "citrica", year: 2011, gender: "unisex", topNotes: ["Bergamota", "Limón", "Naranja amarga"], middleNotes: ["Neroli", "Pitosporo", "Jazmín"], baseNotes: ["Ámbar", "Almizcle", "Vetiver"], description: "La Riviera italiana en una botella. Neroli puro y brillante.", imageUrl: null },
  { id: "citrica-02", name: "Eau d'Orange Verte", brand: "Hermès", family: "citrica", year: 1979, gender: "unisex", topNotes: ["Mandarina verde", "Naranja", "Menta"], middleNotes: ["Petitgrain", "Geranio"], baseNotes: ["Musgo de Roble", "Patchouli", "Almizcle"], description: "El verde naranja de Hermès. Fresco, cítrico y atemporal.", imageUrl: null },
  { id: "citrica-03", name: "Lime Basil & Mandarin", brand: "Jo Malone", family: "citrica", year: 1999, gender: "unisex", topNotes: ["Lima", "Mandarina", "Albahaca"], middleNotes: ["Pimiento verde", "Tomillo"], baseNotes: ["Almizcle blanco", "Ambergris"], description: "La firma de Jo Malone. Lima y albahaca en perfecta armonía.", imageUrl: null },
  { id: "citrica-04", name: "Cologne Cédrat", brand: "Hermès", family: "citrica", year: 1996, gender: "unisex", topNotes: ["Cedrat", "Lima", "Bergamota"], middleNotes: ["Petitgrain bigarade"], baseNotes: ["Almizcle", "Cedro"], description: "La cologne de cedrat de Hermès. Luminosa y precisa.", imageUrl: null },
  { id: "citrica-05", name: "Orange Sanguine", brand: "Atelier Cologne", family: "citrica", year: 2010, gender: "unisex", topNotes: ["Naranja sanguina", "Mandarina"], middleNotes: ["Jazmín", "Heliotropo"], baseNotes: ["Vetiver", "Almizcle", "Cedro"], description: "La naranja roja italiana más vivaz y solar.", imageUrl: null },
  { id: "citrica-06", name: "Bergamot 22", brand: "Aesop", family: "citrica", year: 2020, gender: "unisex", topNotes: ["Bergamota", "Lima", "Cedro"], middleNotes: ["Neroli", "Vetiver"], baseNotes: ["Musgo de Roble", "Cedro", "Almizcle"], description: "Bergamota pura y contemporánea de Aesop.", imageUrl: null },
  { id: "citrica-07", name: "Eau de Rochas", brand: "Rochas", family: "citrica", year: 1970, gender: "feminine", topNotes: ["Limón", "Bergamota", "Petitgrain"], middleNotes: ["Rosa", "Jazmín", "Geranio"], baseNotes: ["Cedro", "Musgo de Roble", "Vetiver"], description: "Una de las primeras colognes femeninas. Clásico luminoso.", imageUrl: null },
  { id: "citrica-08", name: "Cologne du Magnolia", brand: "Hermès", family: "citrica", year: 2022, gender: "unisex", topNotes: ["Petitgrain", "Bergamota"], middleNotes: ["Magnolia", "Neroli"], baseNotes: ["Almizcle blanco", "Cedro"], description: "Fresco y floral cítrico. La magdalena de los cítricos.", imageUrl: null },
  { id: "citrica-09", name: "Mandarin Oriental", brand: "Penhaligon's", family: "citrica", year: 2018, gender: "unisex", topNotes: ["Mandarina", "Bergamota"], middleNotes: ["Gardenia", "Jazmín"], baseNotes: ["Almizcle", "Cedro"], description: "Mandarina tropical y floral. Lujosa y luminosa.", imageUrl: null },
  { id: "citrica-10", name: "Citrus Paradisi", brand: "Czech & Speake", family: "citrica", year: 2008, gender: "unisex", topNotes: ["Pomelo", "Lima", "Bergamota"], middleNotes: ["Petitgrain", "Menta"], baseNotes: ["Almizcle", "Musgo"], description: "Pomelo limpio y brillante. Simple y efectivo.", imageUrl: null },
  { id: "citrica-11", name: "Mandarine Mandarin", brand: "Serge Lutens", family: "citrica", year: 2012, gender: "unisex", topNotes: ["Mandarina", "Naranja"], middleNotes: ["Petitgrain", "Semilla de apio"], baseNotes: ["Cedro", "Almizcle", "Madera"], description: "El homenaje de Serge Lutens a la mandarina pura.", imageUrl: null },
  { id: "citrica-12", name: "Acqua Colonia Lime & Nutmeg", brand: "4711", family: "citrica", year: 2014, gender: "unisex", topNotes: ["Lima", "Nuez moscada"], middleNotes: ["Vetiver", "Aloe vera"], baseNotes: ["Cedro", "Almizcle"], description: "Lima especiada y fresca de la Acqua Colonia.", imageUrl: null },
  { id: "citrica-13", name: "Lemon Ale", brand: "Maison Margiela", family: "citrica", year: 2019, gender: "unisex", topNotes: ["Limón siciliano", "Bergamota", "Menta"], middleNotes: ["Lavanda", "Lúpulo"], baseNotes: ["Vetiver", "Almizcle"], description: "Fresco y efervescente como una limonada artesanal.", imageUrl: null },
  { id: "citrica-14", name: "Colonia Assoluta", brand: "Acqua di Parma", family: "citrica", year: 2003, gender: "unisex", topNotes: ["Bergamota", "Limón", "Mandarina"], middleNotes: ["Rosa búlgara", "Jazmín", "Ylang-ylang"], baseNotes: ["Cedro", "Vetiver", "Incienso"], description: "La cologne italiana más intensa y cálida.", imageUrl: null },
  { id: "citrica-15", name: "Odyssey Mandarin Sky", brand: "Armaf", family: "citrica", year: 2023, gender: "masculine", topNotes: ["Mandarina", "Bergamota", "Naranja"], middleNotes: ["Jazmín", "Limón", "Cedro"], baseNotes: ["Almizcle", "Ámbar", "Madera de sándalo"], description: "Cítrico, dulce y amaderado. Fresco y accesible.", imageUrl: null },

  // ── FOUGÈRE ───────────────────────────────────────────────────────────────
  { id: "fougere-01", name: "Azzaro Pour Homme", brand: "Azzaro", family: "fougere", year: 1978, gender: "masculine", topNotes: ["Anís", "Albahaca", "Bergamota"], middleNotes: ["Geranio", "Artemisa", "Musgo de Roble"], baseNotes: ["Vetiver", "Cedro", "Cuero", "Tonka"], description: "El fougère masculino más icónico de los 70. Anisado y profundo.", imageUrl: null },
  { id: "fougere-02", name: "Polo", brand: "Ralph Lauren", family: "fougere", year: 1978, gender: "masculine", topNotes: ["Albahaca", "Tomillo", "Artemisa"], middleNotes: ["Orris", "Tabaco", "Musgo de Roble"], baseNotes: ["Almizcle", "Cuero", "Cedro"], description: "El fougère americano. Musculoso, verde y legendario.", imageUrl: null },
  { id: "fougere-03", name: "Brut Classic", brand: "Fabergé", family: "fougere", year: 1964, gender: "masculine", topNotes: ["Neroli", "Lavanda", "Anís"], middleNotes: ["Geranio", "Iris", "Rosa"], baseNotes: ["Vetiver", "Tonka", "Musgo de Roble"], description: "El fougère clásico definitivo. Barbería vintage en estado puro.", imageUrl: null },
  { id: "fougere-04", name: "Kouros", brand: "Yves Saint Laurent", family: "fougere", year: 1981, gender: "masculine", topNotes: ["Aldeídos", "Bergamota", "Coriandro", "Artemisa"], middleNotes: ["Ámbar", "Clavel", "Vetiver"], baseNotes: ["Civet", "Cuero", "Musgo de Roble", "Almizcle"], description: "Griego, animal e imponente. El fougère más extremo.", imageUrl: null },
  { id: "fougere-05", name: "Fahrenheit Cologne", brand: "Dior", family: "fougere", year: 2015, gender: "masculine", topNotes: ["Lavanda", "Bergamota"], middleNotes: ["Heliotropo", "Cedro"], baseNotes: ["Almizcle", "Vetiver"], description: "Fougère moderno y luminoso de Dior.", imageUrl: null },
  { id: "fougere-06", name: "Halston Z-14", brand: "Halston", family: "fougere", year: 1974, gender: "masculine", topNotes: ["Lavanda", "Bergamota", "Artemisa"], middleNotes: ["Patchouli", "Sándalo", "Musgo de Roble"], baseNotes: ["Cedro", "Cuero", "Almizcle"], description: "El fougère orientalizado de los 70. Clásico y profundo.", imageUrl: null },
  { id: "fougere-07", name: "Nuit d'Issey", brand: "Issey Miyake", family: "fougere", year: 2014, gender: "masculine", topNotes: ["Pomelo", "Bergamota"], middleNotes: ["Notas de madera secas", "Cedro", "Patchouli"], baseNotes: ["Vetiver", "Almizcle"], description: "La noche de Issey. Fougère moderno y oscuro.", imageUrl: null },
  { id: "fougere-08", name: "Pi", brand: "Givenchy", family: "fougere", year: 1998, gender: "masculine", topNotes: ["Naranja", "Neroli", "Mandarina"], middleNotes: ["Romero", "Menta", "Nuez moscada"], baseNotes: ["Vainilla", "Tonka", "Benjuí"], description: "Matemáticamente perfecto. Fougère con vainilla y especias.", imageUrl: null },
  { id: "fougere-09", name: "Allure Homme", brand: "Chanel", family: "fougere", year: 1999, gender: "masculine", topNotes: ["Aldehído", "Limón", "Mandarina"], middleNotes: ["Vetiver", "Vanilla", "Pimienta de Sichuan"], baseNotes: ["Tonka", "Almizcle blanco", "Cedro"], description: "El caballero con personalidad. Fougère limpio y moderno.", imageUrl: null },
  { id: "fougere-10", name: "Hugo Man", brand: "Hugo Boss", family: "fougere", year: 1995, gender: "masculine", topNotes: ["Menta", "Geranio", "Pino"], middleNotes: ["Lavanda", "Romero", "Enebro"], baseNotes: ["Cedro", "Sándalo", "Musgo de Roble"], description: "El fougère verde que refrescó los 90. Rebelde y limpio.", imageUrl: null },
  { id: "fougere-11", name: "Drakkar Noir", brand: "Guy Laroche", family: "fougere", year: 1982, gender: "masculine", topNotes: ["Lavanda", "Bergamota", "Pino"], middleNotes: ["Tomillo", "Albahaca", "Romero"], baseNotes: ["Cedro", "Musgo de Roble", "Almizcle"], description: "El fougère icónico que marcó los años 80.", imageUrl: null },
  { id: "fougere-12", name: "Le Male", brand: "Jean Paul Gaultier", family: "fougere", year: 1995, gender: "masculine", topNotes: ["Lavanda", "Menta", "Bergamota"], middleNotes: ["Cardamomo", "Canela", "Flor de naranjo"], baseNotes: ["Vainilla", "Sándalo", "Cedro", "Almizcle"], description: "El marinero tatuado de Gaultier. Fougère gourmand icónico.", imageUrl: null },
  { id: "fougere-13", name: "Cacharel Pour Homme", brand: "Cacharel", family: "fougere", year: 1981, gender: "masculine", topNotes: ["Lavanda", "Anís", "Tomillo"], middleNotes: ["Geranio", "Romero", "Albahaca"], baseNotes: ["Musgo de Roble", "Vetiver", "Almizcle"], description: "Fougère herbal y clásico. Jardín provenzal.", imageUrl: null },
  { id: "fougere-14", name: "Azzaro Chrome United", brand: "Azzaro", family: "fougere", year: 2020, gender: "masculine", topNotes: ["Limón", "Pomelo", "Menta"], middleNotes: ["Lavanda", "Madera de cedro"], baseNotes: ["Almizcle", "Ámbar"], description: "Fougère fresco y urbano para el hombre moderno.", imageUrl: null },

  // ── CHIPRE ────────────────────────────────────────────────────────────────
  { id: "chipre-01", name: "Mitsouko", brand: "Guerlain", family: "chipre", year: 1919, gender: "feminine", topNotes: ["Bergamota", "Limón", "Neroli"], middleNotes: ["Rosa", "Jazmín", "Lilas"], baseNotes: ["Musgo de Roble", "Labdanum", "Vetiver"], description: "La obra maestra de los chipres. Un siglo de perfección.", imageUrl: null },
  { id: "chipre-02", name: "Miss Dior Originale", brand: "Dior", family: "chipre", year: 1947, gender: "feminine", topNotes: ["Galbanum", "Aldehídos", "Bergamota"], middleNotes: ["Patchouli", "Trufa", "Jazmín"], baseNotes: ["Musgo de Roble", "Labdanum", "Ámbar"], description: "El chipre de Dior original. Sofisticado y audaz.", imageUrl: null },
  { id: "chipre-03", name: "Aromatics Elixir", brand: "Clinique", family: "chipre", year: 1971, gender: "feminine", topNotes: ["Rosa", "Aldehídos", "Bergamota"], middleNotes: ["Patchouli", "Geranio", "Ylang-ylang"], baseNotes: ["Musgo de Roble", "Vetiver", "Labdanum"], description: "El chipre herbal más audaz. Para la mujer que no se disculpa.", imageUrl: null },
  { id: "chipre-04", name: "Knowing", brand: "Estée Lauder", family: "chipre", year: 1988, gender: "feminine", topNotes: ["Aldehídos", "Rosa", "Mandarina"], middleNotes: ["Jazmín", "Patchouli", "Iris"], baseNotes: ["Musgo de Roble", "Vetiver", "Madera"], description: "Chipre poderoso de los 80. Para mujeres que saben.", imageUrl: null },
  { id: "chipre-05", name: "Pour Monsieur", brand: "Chanel", family: "chipre", year: 1955, gender: "masculine", topNotes: ["Bergamota", "Neroli", "Limón"], middleNotes: ["Nuez moscada", "Patchouli", "Cedro"], baseNotes: ["Musgo de Roble", "Civet", "Ámbar"], description: "El chipre masculino clásico de Chanel. Elegante y discreto.", imageUrl: null },
  { id: "chipre-06", name: "First", brand: "Van Cleef & Arpels", family: "chipre", year: 1976, gender: "feminine", topNotes: ["Aldeídos", "Naranja", "Bergamota"], middleNotes: ["Rosa", "Jazmín", "Lirio"], baseNotes: ["Musgo de Roble", "Vetiver", "Sándalo"], description: "El primer perfume de Van Cleef. Chipre floral magnífico.", imageUrl: null },
  { id: "chipre-07", name: "Bel Ami", brand: "Hermès", family: "chipre", year: 1986, gender: "masculine", topNotes: ["Bergamota", "Limón"], middleNotes: ["Patchouli", "Tabaco", "Cuero"], baseNotes: ["Musgo de Roble", "Ámbar", "Almizcle"], description: "El chipre de cuero de Hermès. Elegante y ligeramente animal.", imageUrl: null },
  { id: "chipre-08", name: "Heritage", brand: "Guerlain", family: "chipre", year: 1992, gender: "masculine", topNotes: ["Bergamota", "Pino", "Verbena"], middleNotes: ["Salvia", "Enebro", "Geranio"], baseNotes: ["Musgo de Roble", "Vetiver", "Cedro"], description: "El patrimonio verde y leñoso de Guerlain.", imageUrl: null },
  { id: "chipre-09", name: "Lyric Man", brand: "Amouage", family: "chipre", year: 2008, gender: "masculine", topNotes: ["Bergamota", "Jazmín", "Rosa"], middleNotes: ["Patchouli", "Musgo de Roble", "Incienso"], baseNotes: ["Cedro", "Vetiver", "Ámbar"], description: "El chipre de Amouage. Poético y majestuoso.", imageUrl: null },
  { id: "chipre-10", name: "Ma Griffe", brand: "Carven", family: "chipre", year: 1946, gender: "feminine", topNotes: ["Galbanum", "Bergamota", "Aldehídos"], middleNotes: ["Geranio", "Rosa", "Muguet"], baseNotes: ["Musgo de Roble", "Vetiver", "Sándalo"], description: "El chipre verde histórico de Carven.", imageUrl: null },
  { id: "chipre-11", name: "Femme", brand: "Rochas", family: "chipre", year: 1943, gender: "feminine", topNotes: ["Bergamota", "Limón", "Ciruelas"], middleNotes: ["Rosa", "Jazmín", "Ylang-ylang"], baseNotes: ["Musgo de Roble", "Vetiver", "Almizcle animal"], description: "El chipre frutal original. Sensual y suntuoso.", imageUrl: null },
  { id: "chipre-12", name: "Antilope", brand: "Weil", family: "chipre", year: 1945, gender: "feminine", topNotes: ["Bergamota", "Aldehídos"], middleNotes: ["Rosa", "Jazmín", "Lirio del Valle"], baseNotes: ["Musgo de Roble", "Vetiver", "Almizcle"], description: "Chipre aldehídico clásico. Elegante y vintage.", imageUrl: null },

  // ── GOURMAND ──────────────────────────────────────────────────────────────
  { id: "gourmand-01", name: "Candy", brand: "Prada", family: "gourmand", year: 2011, gender: "feminine", topNotes: ["Almizcle"], middleNotes: ["Caramelo", "Benjuí"], baseNotes: ["Vainilla", "Musgo de Roble"], description: "Dulce, adictivo y provocador. El candy chic de Prada.", imageUrl: null },
  { id: "gourmand-02", name: "Lolita Lempicka", brand: "Lolita Lempicka", family: "gourmand", year: 1997, gender: "feminine", topNotes: ["Anís", "Hiedra", "Violeta"], middleNotes: ["Iris", "Amarena"], baseNotes: ["Vainilla", "Almizcle", "Pralinés"], description: "Anisado y dulce. El gourmand mágico de los 90.", imageUrl: null },
  { id: "gourmand-03", name: "A*Men", brand: "Thierry Mugler", family: "gourmand", year: 1996, gender: "masculine", topNotes: ["Café", "Miel", "Caramelo"], middleNotes: ["Patchouli", "Alquitrán", "Menta"], baseNotes: ["Vainilla", "Almizcle", "Tonka"], description: "El gourmand masculino original. Café, miel y patchouli.", imageUrl: null },
  { id: "gourmand-04", name: "Lost Cherry", brand: "Tom Ford", family: "gourmand", year: 2018, gender: "unisex", topNotes: ["Cereza negra", "Amarga almendra", "Licor de cereza"], middleNotes: ["Turco de rosa", "Jazmín"], baseNotes: ["Sándalo", "Vetiver", "Tonka", "Almizcle"], description: "La cereza más irresistible. Oscuro y seductor.", imageUrl: null },
  { id: "gourmand-05", name: "Bon Bon", brand: "Viktor & Rolf", family: "gourmand", year: 2014, gender: "feminine", topNotes: ["Mandarina", "Fruta de la pasión"], middleNotes: ["Melocotón", "Caramelo", "Iris"], baseNotes: ["Madera de cachemira", "Almizcle", "Vainilla"], description: "Un caramelo sofisticado. Dulce con carácter.", imageUrl: null },
  { id: "gourmand-06", name: "Pure Malt", brand: "Thierry Mugler", family: "gourmand", year: 2009, gender: "masculine", topNotes: ["Mandarina", "Limón"], middleNotes: ["Madera de cerezo", "Whisky"], baseNotes: ["Cedro", "Vainilla", "Madera ahumada"], description: "Whisky y madera. Gourmand masculino y sofisticado.", imageUrl: null },
  { id: "gourmand-07", name: "Spicebomb Infrared", brand: "Viktor & Rolf", family: "gourmand", year: 2021, gender: "masculine", topNotes: ["Chili", "Bergamota", "Mandarina"], middleNotes: ["Canela", "Tabasco"], baseNotes: ["Caramelo", "Vainilla", "Almizcle"], description: "Picante y dulce a la vez. Gourmand explosivo.", imageUrl: null },
  { id: "gourmand-08", name: "Sucre", brand: "Comptoir Sud Pacifique", family: "gourmand", year: 2010, gender: "feminine", topNotes: ["Azúcar", "Caramelo"], middleNotes: ["Vainilla", "Almendra"], baseNotes: ["Almizcle", "Tonka"], description: "Dulce como el azúcar. Gourmand puro y placentero.", imageUrl: null },
  { id: "gourmand-09", name: "Praline de Santal", brand: "Guerlain", family: "gourmand", year: 2016, gender: "feminine", topNotes: ["Praliné", "Sándalo"], middleNotes: ["Flor de almendro"], baseNotes: ["Vainilla", "Almizcle"], description: "Dulce y amaderado. El gourmand elegante de Guerlain.", imageUrl: null },
  { id: "gourmand-10", name: "Loverdose", brand: "Diesel", family: "gourmand", year: 2011, gender: "feminine", topNotes: ["Anís estrellado", "Mandarina"], middleNotes: ["Regaliz", "Flor de naranjo"], baseNotes: ["Vainilla", "Patchouli", "Almizcle"], description: "Anisado y adictivo. Gourmand urbano de Diesel.", imageUrl: null },
  { id: "gourmand-11", name: "Hypnotic Poison", brand: "Dior", family: "gourmand", year: 1998, gender: "feminine", topNotes: ["Almendra amarga", "Pomelo", "Jacaranda"], middleNotes: ["Jazmín", "Albaricoque", "Flor de coco"], baseNotes: ["Sándalo", "Almizcle", "Vainilla"], description: "Veneno hipnótico. Almendrado, misterioso e irresistible.", imageUrl: null },
  { id: "gourmand-12", name: "Vanilla Sky", brand: "Memo Paris", family: "gourmand", year: 2012, gender: "unisex", topNotes: ["Mandarina", "Bergamota"], middleNotes: ["Vainilla de Madagascar", "Jazmín"], baseNotes: ["Benjuí", "Ámbar", "Almizcle"], description: "La vainilla más suntuosa del mundo.", imageUrl: null },

  // ── AROMÁTICA ─────────────────────────────────────────────────────────────
  { id: "aromatica-01", name: "Bulgari pour Homme", brand: "Bvlgari", family: "aromatica", year: 1995, gender: "masculine", topNotes: ["Bergamota", "Neroli", "Madera"], middleNotes: ["Té", "Salvia", "Cardamomo"], baseNotes: ["Almizcle blanco", "Cedro", "Vetiver"], description: "Té aromático y mineral. La refinación italiana de Bvlgari.", imageUrl: null },
  { id: "aromatica-02", name: "Aramis Classic", brand: "Aramis", family: "aromatica", year: 1965, gender: "masculine", topNotes: ["Aldeídos", "Bergamota", "Gardenia"], middleNotes: ["Patchouli", "Musgo de Roble", "Geranio"], baseNotes: ["Vetiver", "Cuero", "Cedro"], description: "El aromático clásico americano. Cuero y musgo clásico.", imageUrl: null },
  { id: "aromatica-03", name: "Tuscany per Uomo", brand: "Aramis", family: "aromatica", year: 1984, gender: "masculine", topNotes: ["Menta", "Salvia", "Bergamota"], middleNotes: ["Geranio", "Cilantro", "Lavanda"], baseNotes: ["Ámbar", "Almizcle", "Cedro"], description: "La Toscana en fragancia. Hierbas mediterráneas y calidez.", imageUrl: null },
  { id: "aromatica-04", name: "Blenheim Bouquet", brand: "Penhaligon's", family: "aromatica", year: 1902, gender: "masculine", topNotes: ["Limón", "Pino", "Lavanda"], middleNotes: ["Tomillo", "Muguet", "Nuez moscada"], baseNotes: ["Almizcle", "Cedro", "Madera"], description: "El aromático más aristocrático. Para el caballero inglés.", imageUrl: null },
  { id: "aromatica-05", name: "Tsar", brand: "Van Cleef & Arpels", family: "aromatica", year: 1989, gender: "masculine", topNotes: ["Bergamota", "Lavanda", "Menta"], middleNotes: ["Musgo", "Geranio", "Rosa"], baseNotes: ["Sándalo", "Ámbar", "Cedro"], description: "El zar de los aromáticos. Majestuoso y especiado.", imageUrl: null },
  { id: "aromatica-06", name: "Green Water", brand: "Jacques Fath", family: "aromatica", year: 1997, gender: "masculine", topNotes: ["Cedro", "Menta", "Bergamota"], middleNotes: ["Aldehídos", "Lavanda", "Pino"], baseNotes: ["Musgo", "Almizcle", "Cedro"], description: "Agua verde y fresca. Aromático acuático masculino.", imageUrl: null },
  { id: "aromatica-07", name: "Horizon", brand: "Guy Laroche", family: "aromatica", year: 1992, gender: "masculine", topNotes: ["Bergamota", "Menta", "Limón"], middleNotes: ["Geranio", "Madera de cedro", "Salvia"], baseNotes: ["Almizcle", "Ámbar", "Sándalo"], description: "El aromático que mira al horizonte. Fresco y profundo.", imageUrl: null },
  { id: "aromatica-08", name: "Reaction", brand: "Lancôme", family: "aromatica", year: 2003, gender: "masculine", topNotes: ["Bergamota", "Lima", "Menta"], middleNotes: ["Madera de cedro", "Nuez moscada"], baseNotes: ["Vetiver", "Ámbar", "Almizcle"], description: "Reacción en cadena. Fresco aromático moderno.", imageUrl: null },
  { id: "aromatica-09", name: "Photo pour Homme", brand: "Karl Lagerfeld", family: "aromatica", year: 1990, gender: "masculine", topNotes: ["Albahaca", "Bergamota", "Naranja"], middleNotes: ["Cedro", "Geranio", "Roble"], baseNotes: ["Almizcle", "Ámbar", "Patchouli"], description: "El aromático fotogénico de Lagerfeld.", imageUrl: null },
  { id: "aromatica-10", name: "Eau de Vetiver", brand: "Guerlain", family: "aromatica", year: 1961, gender: "masculine", topNotes: ["Bergamota", "Limón", "Coriandro"], middleNotes: ["Rosa", "Iris", "Geranio"], baseNotes: ["Vetiver", "Sándalo", "Cedro"], description: "El vetiver aromático de Guerlain. Clásico eterno.", imageUrl: null },

  // ── ACUÁTICA ──────────────────────────────────────────────────────────────
  { id: "acuatica-01", name: "Nautica Voyage", brand: "Nautica", family: "acuatica", year: 2006, gender: "masculine", topNotes: ["Manzana", "Agua de mar", "Hoja verde"], middleNotes: ["Mímosa", "Lotus", "Madera acuática"], baseNotes: ["Cedro", "Almizcle", "Roble"], description: "El viaje marino definitivo. Azul como el océano.", imageUrl: null },
  { id: "acuatica-02", name: "Polo Sport", brand: "Ralph Lauren", family: "acuatica", year: 1994, gender: "masculine", topNotes: ["Pepino marino", "Naranja", "Bergamota"], middleNotes: ["Lavanda marina", "Geranio"], baseNotes: ["Cedro", "Almizcle", "Musgo"], description: "Deporte y mar. El acuático deportivo de los 90.", imageUrl: null },
  { id: "acuatica-03", name: "Allure Sport", brand: "Chanel", family: "acuatica", year: 2004, gender: "masculine", topNotes: ["Sal", "Naranja sanguina"], middleNotes: ["Romero", "Notas de agua"], baseNotes: ["Cedro", "Almizcle", "Teca"], description: "Deporte con elegancia Chanel. Marino y atlético.", imageUrl: null },
  { id: "acuatica-04", name: "Blue Seduction", brand: "Antonio Banderas", family: "acuatica", year: 2007, gender: "masculine", topNotes: ["Bergamota", "Anís"], middleNotes: ["Flor de vid", "Cardamomo"], baseNotes: ["Cedro", "Almizcle", "Ámbar"], description: "Acuático mediterráneo accesible y fresco.", imageUrl: null },
  { id: "acuatica-05", name: "Givenchy Blue Label", brand: "Givenchy", family: "acuatica", year: 2004, gender: "masculine", topNotes: ["Pomelo", "Bergamota", "Limón"], middleNotes: ["Lavanda", "Geranio", "Cedro"], baseNotes: ["Vetiver", "Almizcle", "Ámbar"], description: "Acuático fresco y urbano del Paris de Givenchy.", imageUrl: null },
  { id: "acuatica-06", name: "Chrome Legend", brand: "Azzaro", family: "acuatica", year: 2006, gender: "masculine", topNotes: ["Bergamota", "Neroli"], middleNotes: ["Flor de loto", "Madera acuática"], baseNotes: ["Almizcle", "Cedro"], description: "El Chrome más marino y legendario.", imageUrl: null },
  { id: "acuatica-07", name: "Acqua for Life", brand: "Giorgio Armani", family: "acuatica", year: 2012, gender: "masculine", topNotes: ["Lima", "Bergamota", "Mandarina"], middleNotes: ["Menta acuática", "Madera de cedro"], baseNotes: ["Ámbar marino", "Almizcle"], description: "Fresco marino. La vida en agua de Armani.", imageUrl: null },
  { id: "acuatica-08", name: "Dunhill Sport", brand: "Dunhill", family: "acuatica", year: 1999, gender: "masculine", topNotes: ["Bergamota", "Menta", "Anís"], middleNotes: ["Notas marinas", "Lavanda"], baseNotes: ["Cedro", "Almizcle", "Vetiver"], description: "El deporte marino de Dunhill. Fresco y atlético.", imageUrl: null },
  { id: "acuatica-09", name: "New West", brand: "Aramis", family: "acuatica", year: 1988, gender: "masculine", topNotes: ["Salvia", "Enebro", "Pomelo"], middleNotes: ["Notas marinas", "Coriandro", "Madera"], baseNotes: ["Almizcle", "Ámbar", "Musgo"], description: "Pionero acuático. El oeste marino de los 80.", imageUrl: null },
  { id: "acuatica-10", name: "Lacoste Essential Sport", brand: "Lacoste", family: "acuatica", year: 2009, gender: "masculine", topNotes: ["Tomate", "Cedro", "Bergamota"], middleNotes: ["Jengibre", "Madera fría"], baseNotes: ["Cedro", "Vetiver", "Almizcle"], description: "El deporte en fragancia. Fresco, dinámico y deportivo.", imageUrl: null },

  // ── AFRUTADA ──────────────────────────────────────────────────────────────
  { id: "afrutada-01", name: "Be Delicious", brand: "DKNY", family: "afrutada", year: 2004, gender: "feminine", topNotes: ["Pepino", "Manzana verde", "Pomelo"], middleNotes: ["Magnolia", "Rosa", "Violeta"], baseNotes: ["Sándalo", "Almizcle", "Madera"], description: "La manzana de Nueva York. Afrutado y cosmopolita.", imageUrl: null },
  { id: "afrutada-02", name: "Fantasy", brand: "Britney Spears", family: "afrutada", year: 2005, gender: "feminine", topNotes: ["Kiwi", "Mandarina", "Litchi"], middleNotes: ["Jazmín", "Orquídea", "Iris"], baseNotes: ["Almizcle", "Cedro", "Almizcle blanco"], description: "Dulce fantasía afrutada. Un éxito masivo y adorable.", imageUrl: null },
  { id: "afrutada-03", name: "Euphoria", brand: "Calvin Klein", family: "afrutada", year: 2005, gender: "feminine", topNotes: ["Granada", "Persimón"], middleNotes: ["Loto", "Jazmín negra", "Albahaca"], baseNotes: ["Caoba", "Almizcle", "Ámbar"], description: "Euforia sensual y frutal. Profundo y femenino.", imageUrl: null },
  { id: "afrutada-04", name: "La Petite Robe Noire", brand: "Guerlain", family: "afrutada", year: 2012, gender: "feminine", topNotes: ["Cereza negra", "Almendras", "Bergamota"], middleNotes: ["Rosa tea", "Iris", "Peonía"], baseNotes: ["Patchouli", "Vetiver", "Almizcle"], description: "El pequeño vestido negro. Cereza y floral chic.", imageUrl: null },
  { id: "afrutada-05", name: "Lovely", brand: "Sarah Jessica Parker", family: "afrutada", year: 2005, gender: "feminine", topNotes: ["Mandarina", "Manzana verde", "Lavanda"], middleNotes: ["Patchouli", "Rosewood", "Almizcle"], baseNotes: ["Cedro", "Ámbar", "Almizcle"], description: "Dulce, femenino y perfectamente llevable.", imageUrl: null },
  { id: "afrutada-06", name: "Stella", brand: "Stella McCartney", family: "afrutada", year: 2003, gender: "feminine", topNotes: ["Mandarín", "Albahaca"], middleNotes: ["Peonía", "Rosa amber", "Gardenia"], baseNotes: ["Almizcle", "Cedro", "Ámbar"], description: "Natural, floral y afrutado. El estilo Stella.", imageUrl: null },
  { id: "afrutada-07", name: "Incanto Dream", brand: "Salvatore Ferragamo", family: "afrutada", year: 2006, gender: "feminine", topNotes: ["Pomelo", "Melón", "Mango"], middleNotes: ["Flor de loto", "Jazmín", "Rosa"], baseNotes: ["Almizcle blanco", "Cedro"], description: "Sueño afrutado y fresco. Ligero y jovial.", imageUrl: null },
  { id: "afrutada-08", name: "Noa", brand: "Cacharel", family: "afrutada", year: 1998, gender: "feminine", topNotes: ["Bergamota", "Mandarina"], middleNotes: ["Flor de naranjo", "Muguet"], baseNotes: ["Almizcle blanco", "Cedro", "Almizcle"], description: "Fresco, limpio y afrutado. Minimalismo feminae.", imageUrl: null },
  { id: "afrutada-09", name: "Mon Guerlain Bloom of Rose", brand: "Guerlain", family: "afrutada", year: 2019, gender: "feminine", topNotes: ["Bergamota de Calabria", "Rosa"], middleNotes: ["Lavanda de Provenza", "Rosa"], baseNotes: ["Vainilla tahitiana", "Sándalo"], description: "Rosa afrutada y la vainilla suave de Guerlain.", imageUrl: null },
  { id: "afrutada-10", name: "Chance Eau Fraiche", brand: "Chanel", family: "afrutada", year: 2007, gender: "feminine", topNotes: ["Cidra", "Bergamota"], middleNotes: ["Jazmín", "Teck"], baseNotes: ["Almizcle", "Vetiver", "Ámbar"], description: "El Chance más ligero y afrutado.", imageUrl: null },

  // ── CUERO ─────────────────────────────────────────────────────────────────
  { id: "cuero-01", name: "Tuscan Leather", brand: "Tom Ford", family: "cuero", year: 2011, gender: "unisex", topNotes: ["Frambuesa", "Azafrán"], middleNotes: ["Jazmín", "Patchouli"], baseNotes: ["Cuero de Toscana", "Almizcle", "Ámbar"], description: "El cuero más lujoso del mundo. Animal y seductor.", imageUrl: null },
  { id: "cuero-02", name: "Cuir de Russie", brand: "Chanel", family: "cuero", year: 1924, gender: "feminine", topNotes: ["Aldeídos", "Bergamota", "Neroli"], middleNotes: ["Rosa", "Iris", "Ylang-ylang"], baseNotes: ["Cuero de Rusia", "Vetiver", "Sándalo"], description: "El cuero más elegante de Chanel. Historia en cada spray.", imageUrl: null },
  { id: "cuero-03", name: "Knize Ten", brand: "Knize", family: "cuero", year: 1925, gender: "masculine", topNotes: ["Limón", "Bergamota", "Flor de naranjo"], middleNotes: ["Rosa", "Jazmín", "Iris"], baseNotes: ["Cuero", "Musgo de Roble", "Vetiver"], description: "El cuero vintage más auténtico. Un siglo de sofisticación.", imageUrl: null },
  { id: "cuero-04", name: "Derby", brand: "Guerlain", family: "cuero", year: 1985, gender: "masculine", topNotes: ["Bergamota", "Lavanda"], middleNotes: ["Cuero", "Patchouli", "Musgo"], baseNotes: ["Vetiver", "Cedro", "Ámbar"], description: "Cuero y campo. El chipre-cuero clásico de Guerlain.", imageUrl: null },
  { id: "cuero-05", name: "Antaeus", brand: "Chanel", family: "cuero", year: 1981, gender: "masculine", topNotes: ["Bergamota", "Artemisa", "Lavanda"], middleNotes: ["Patchouli", "Musgo de Roble"], baseNotes: ["Cuero", "Cedro", "Ámbar", "Almizcle"], description: "El guerrero de Chanel. Cuero y musgo poderoso.", imageUrl: null },
  { id: "cuero-06", name: "Bottega Veneta pour Homme", brand: "Bottega Veneta", family: "cuero", year: 2013, gender: "masculine", topNotes: ["Cedro", "Cardamomo"], middleNotes: ["Cuero napa", "Pimientas"], baseNotes: ["Vetiver", "Ámbar gris", "Musgo de Roble"], description: "El cuero italiano de la alta moda. Artesano y refinado.", imageUrl: null },
  { id: "cuero-07", name: "Cuir Ottoman", brand: "Parfums de Nicolaï", family: "cuero", year: 1999, gender: "unisex", topNotes: ["Bergamota", "Coriandro"], middleNotes: ["Rosa", "Iris", "Cuero"], baseNotes: ["Vetiver", "Cedro", "Musgo"], description: "El cuero otomano. Exótico, refinado y artesanal.", imageUrl: null },
  { id: "cuero-08", name: "Cabochard", brand: "Grès", family: "cuero", year: 1959, gender: "feminine", topNotes: ["Aldeídos", "Bergamota", "Artemisa"], middleNotes: ["Cuero", "Vetiver", "Patchouli"], baseNotes: ["Tabaco", "Musgo de Roble", "Ámbar"], description: "Cuero femenino audaz. Para la mujer que no pide permiso.", imageUrl: null },
  { id: "cuero-09", name: "English Leather", brand: "Dana", family: "cuero", year: 1949, gender: "masculine", topNotes: ["Lavanda", "Bergamota"], middleNotes: ["Tomillo", "Musgo de Roble"], baseNotes: ["Cuero inglés", "Cedro", "Almizcle"], description: "El cuero inglés clásico. Tradición y masculinidad.", imageUrl: null },
  { id: "cuero-10", name: "Riding Club", brand: "Dunhill", family: "cuero", year: 2017, gender: "masculine", topNotes: ["Cardamomo", "Bergamota", "Manzana verde"], middleNotes: ["Cuero ecuestre", "Vetiver", "Cedro"], baseNotes: ["Almizcle", "Ámbar", "Patchouli"], description: "Cuero de montura y campo. Elegancia ecuestre.", imageUrl: null },
]
