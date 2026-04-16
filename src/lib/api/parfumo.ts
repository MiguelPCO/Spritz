/**
 * Fragrance catalog search
 *
 * For MVP without a paid API key, searches a curated local seed list.
 * For production, subscribe to a fragrance API via RapidAPI and set RAPIDAPI_KEY.
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
      `https://fragrances.p.rapidapi.com/search?q=${encodeURIComponent(query)}&limit=10`,
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

// ─── Curated seed catalog ────────────────────────────────────────────────────

const SEED_FRAGRANCES: FragranceCatalogResult[] = [
  // ── FRESH ──────────────────────────────────────────────────────────────────
  {
    id: "fresh-01", name: "Bleu de Chanel", brand: "Chanel", family: "fresh", year: 2010, gender: "masculine",
    topNotes: ["Limón", "Naranja", "Menta"], middleNotes: ["Jengibre", "Nuez moscada", "Jazmín"], baseNotes: ["Cedro", "Sándalo", "Incienso"],
    description: "Un masculino fresco y sofisticado con carácter parisino.", imageUrl: null,
  },
  {
    id: "fresh-02", name: "Sauvage", brand: "Dior", family: "fresh", year: 2015, gender: "masculine",
    topNotes: ["Bergamota", "Pimienta"], middleNotes: ["Geranio", "Lavanda"], baseNotes: ["Ambroxan", "Cedro"],
    description: "Fresco, salvaje y sin domesticar. Un icono moderno.", imageUrl: null,
  },
  {
    id: "fresh-03", name: "Acqua di Gio", brand: "Giorgio Armani", family: "fresh", year: 1996, gender: "masculine",
    topNotes: ["Bergamota", "Neroli", "Lima"], middleNotes: ["Romero", "Jacinto", "Jazmín"], baseNotes: ["Cedro", "Musgo", "Ámbar"],
    description: "La esencia del Mediterráneo. Fresco marino clásico.", imageUrl: null,
  },
  {
    id: "fresh-04", name: "Cool Water", brand: "Davidoff", family: "fresh", year: 1988, gender: "masculine",
    topNotes: ["Menta", "Naranja", "Lavanda"], middleNotes: ["Neroli", "Geranio", "Romero"], baseNotes: ["Cedro", "Musgo", "Ámbar"],
    description: "El acuático que definió una generación.", imageUrl: null,
  },
  {
    id: "fresh-05", name: "Light Blue", brand: "Dolce & Gabbana", family: "fresh", year: 2001, gender: "feminine",
    topNotes: ["Limón de Sicilia", "Manzana", "Cedro"], middleNotes: ["Bambú", "Jazmín", "Rosa blanca"], baseNotes: ["Cedro", "Ámbar", "Almizcle"],
    description: "El verano mediterráneo en una botella.", imageUrl: null,
  },
  {
    id: "fresh-06", name: "CK One", brand: "Calvin Klein", family: "fresh", year: 1994, gender: "unisex",
    topNotes: ["Bergamota", "Limón", "Piña", "Cardamomo"], middleNotes: ["Nuez moscada", "Jazmín", "Rosa"], baseNotes: ["Sándalo", "Ámbar", "Almizcle"],
    description: "El unisex que cambió la perfumería. Limpio y compartido.", imageUrl: null,
  },
  {
    id: "fresh-07", name: "Chrome", brand: "Azzaro", family: "fresh", year: 1996, gender: "masculine",
    topNotes: ["Bergamota", "Neroli", "Limón"], middleNotes: ["Anís", "Cardamomo", "Rosa"], baseNotes: ["Sándalo", "Cedro", "Tonka"],
    description: "Fresco, limpio y con un toque acuático metálico.", imageUrl: null,
  },
  {
    id: "fresh-08", name: "L'Eau d'Issey", brand: "Issey Miyake", family: "fresh", year: 1992, gender: "feminine",
    topNotes: ["Nélumbio acuático", "Bergamota", "Mandarina"], middleNotes: ["Rosa", "Lys", "Cyclamen"], baseNotes: ["Sándalo", "Almizcle", "Cedro"],
    description: "El agua convertida en perfume. Icono japonés de minimalismo.", imageUrl: null,
  },
  {
    id: "fresh-09", name: "Colonia", brand: "Acqua di Parma", family: "fresh", year: 1916, gender: "unisex",
    topNotes: ["Bergamota de Calabria", "Lavanda", "Verbena"], middleNotes: ["Rosa", "Jazmín", "Neroli"], baseNotes: ["Vetiver", "Sándalo", "Musgo de Roble"],
    description: "La colonia italiana por excelencia. Elegancia clásica atemporal.", imageUrl: null,
  },
  {
    id: "fresh-10", name: "Invictus", brand: "Paco Rabanne", family: "fresh", year: 2013, gender: "masculine",
    topNotes: ["Pomelo", "Laurel marino"], middleNotes: ["Jazmín", "Acacia seca"], baseNotes: ["Musgo de Roble", "Guayaco", "Ámbar"],
    description: "Para el guerrero moderno. Fresco, magnético e invicto.", imageUrl: null,
  },
  {
    id: "fresh-11", name: "Versace Pour Homme", brand: "Versace", family: "fresh", year: 2008, gender: "masculine",
    topNotes: ["Limón", "Bergamota", "Neroli"], middleNotes: ["Hiacintos", "Ciclamen", "Cedro"], baseNotes: ["Fondo marino", "Almizcle"],
    description: "Fresco mediterráneo con carácter italiano.", imageUrl: null,
  },
  {
    id: "fresh-12", name: "Eternity for Men", brand: "Calvin Klein", family: "fresh", year: 1989, gender: "masculine",
    topNotes: ["Lavanda", "Mandarina", "Limón"], middleNotes: ["Musgo", "Sándalo", "Neroli"], baseNotes: ["Ámbar", "Musgo de Roble", "Cedro"],
    description: "Un clásico de los 90 que definió el fougère americano.", imageUrl: null,
  },
  {
    id: "fresh-13", name: "Eau Sauvage", brand: "Dior", family: "fresh", year: 1966, gender: "masculine",
    topNotes: ["Limón", "Rosalina", "Albahaca"], middleNotes: ["Jazmín", "Orris", "Rosa"], baseNotes: ["Vetiver", "Musgo de Roble", "Ámbar"],
    description: "La cologne que cambió la historia. El original Sauvage.", imageUrl: null,
  },
  {
    id: "fresh-14", name: "Drakkar Noir", brand: "Guy Laroche", family: "fresh", year: 1982, gender: "masculine",
    topNotes: ["Lavanda", "Bergamota", "Pino"], middleNotes: ["Tomillo", "Albahaca", "Romero"], baseNotes: ["Cedro", "Musgo de Roble", "Almizcle"],
    description: "El fougère icónico que marcó los años 80.", imageUrl: null,
  },
  {
    id: "fresh-15", name: "Acqua di Gio Profumo", brand: "Giorgio Armani", family: "fresh", year: 2015, gender: "masculine",
    topNotes: ["Bergamota", "Pimienta"], middleNotes: ["Romero marino", "Notas marinas"], baseNotes: ["Incienso", "Patchouli", "Sándalo"],
    description: "La versión más oscura y profunda del clásico marino.", imageUrl: null,
  },

  // ── FLORAL ─────────────────────────────────────────────────────────────────
  {
    id: "floral-01", name: "La Vie Est Belle", brand: "Lancôme", family: "floral", year: 2012, gender: "feminine",
    topNotes: ["Grosella negra", "Pera"], middleNotes: ["Iris", "Peonía", "Jazmín"], baseNotes: ["Praliné", "Vainilla", "Patchouli"],
    description: "La vida es bella. Un floral gourmand delicadamente feliz.", imageUrl: null,
  },
  {
    id: "floral-02", name: "Coco Mademoiselle", brand: "Chanel", family: "floral", year: 2001, gender: "feminine",
    topNotes: ["Naranja", "Bergamota"], middleNotes: ["Rosa", "Jazmín", "Iris"], baseNotes: ["Patchouli", "Vainilla", "Musgo blanco"],
    description: "La Mademoiselle moderna de Chanel. Elegante y libre.", imageUrl: null,
  },
  {
    id: "floral-03", name: "Miss Dior", brand: "Dior", family: "floral", year: 2021, gender: "feminine",
    topNotes: ["Bergamota", "Rosa fresca"], middleNotes: ["Rosa centifolia", "Iris"], baseNotes: ["Patchouli"],
    description: "Una declaración de amor en forma de flor.", imageUrl: null,
  },
  {
    id: "floral-04", name: "Flowerbomb", brand: "Viktor & Rolf", family: "floral", year: 2005, gender: "feminine",
    topNotes: ["Té verde", "Bergamota", "Osmanthus"], middleNotes: ["Freesia", "Jazmín", "Orquídea"], baseNotes: ["Musgo", "Almizcle", "Patchouli"],
    description: "Una explosión floral. Inmenso y envolvente.", imageUrl: null,
  },
  {
    id: "floral-05", name: "J'adore", brand: "Dior", family: "floral", year: 1999, gender: "feminine",
    topNotes: ["Pera", "Melón"], middleNotes: ["Rosa damascena", "Jazmín", "Ylang-ylang"], baseNotes: ["Cedro", "Almizcle", "Vainilla"],
    description: "El floral dorado de Dior. Sensual y luminoso.", imageUrl: null,
  },
  {
    id: "floral-06", name: "Chance", brand: "Chanel", family: "floral", year: 2002, gender: "feminine",
    topNotes: ["Piña", "Jacinto", "Rosa"], middleNotes: ["Iris", "Jazmín"], baseNotes: ["Patchouli", "Vetiver", "Musgo blanco"],
    description: "La fragrancia para quienes crean su propia suerte.", imageUrl: null,
  },
  {
    id: "floral-07", name: "Good Girl", brand: "Carolina Herrera", family: "floral", year: 2016, gender: "feminine",
    topNotes: ["Almendra", "Café"], middleNotes: ["Jazmín", "Tuberosa"], baseNotes: ["Cacao", "Vainilla", "Tonka"],
    description: "El lado bueno y el lado oscuro. Dualidad femenina.", imageUrl: null,
  },
  {
    id: "floral-08", name: "Daisy", brand: "Marc Jacobs", family: "floral", year: 2007, gender: "feminine",
    topNotes: ["Fresa", "Violeta", "Pomelo"], middleNotes: ["Jazmín", "Gardenia", "Violeta"], baseNotes: ["Almizcle blanco", "Vainilla", "Cedro"],
    description: "Joven, alegre y despreocupada como una margarita.", imageUrl: null,
  },
  {
    id: "floral-09", name: "Si", brand: "Giorgio Armani", family: "floral", year: 2013, gender: "feminine",
    topNotes: ["Néctar de cassis"], middleNotes: ["Rosa, Freesia"], baseNotes: ["Patchouli", "Vainilla", "Almizcle"],
    description: "Sí a la vida. Moderna, femenina y confiada.", imageUrl: null,
  },
  {
    id: "floral-10", name: "Mon Paris", brand: "Yves Saint Laurent", family: "floral", year: 2016, gender: "feminine",
    topNotes: ["Fresas", "Pera", "Frambuesa"], middleNotes: ["Peonía", "Rosa", "Ylang-ylang"], baseNotes: ["Patchouli", "Almizcle blanco", "Ámbar"],
    description: "Un amor parisino en cada spray. Romántico y frutal.", imageUrl: null,
  },
  {
    id: "floral-11", name: "Bloom", brand: "Gucci", family: "floral", year: 2017, gender: "feminine",
    topNotes: ["Ranúnculo", "Neroli"], middleNotes: ["Jazmín", "Tuberosa", "Rangoon Creeper"], baseNotes: ["Sándalo", "Musgo de Roble"],
    description: "Un jardín florido capturado en una botella de Gucci.", imageUrl: null,
  },
  {
    id: "floral-12", name: "My Way", brand: "Giorgio Armani", family: "floral", year: 2020, gender: "feminine",
    topNotes: ["Bergamota", "Naranja de Egipto"], middleNotes: ["Tuberosa india", "Rosa Guntur"], baseNotes: ["Cedro de Virginia", "Almizcle de Vainilla"],
    description: "Para las mujeres que encuentran su propio camino.", imageUrl: null,
  },

  // ── ORIENTAL ───────────────────────────────────────────────────────────────
  {
    id: "oriental-01", name: "Black Opium", brand: "Yves Saint Laurent", family: "oriental", year: 2014, gender: "feminine",
    topNotes: ["Pera", "Rosa", "Flor de naranja"], middleNotes: ["Café", "Jazmín"], baseNotes: ["Vainilla", "Patchouli", "Cedro"],
    description: "Adictivo, oscuro y envolvente. Café y flores de noche.", imageUrl: null,
  },
  {
    id: "oriental-02", name: "Shalimar", brand: "Guerlain", family: "oriental", year: 1925, gender: "feminine",
    topNotes: ["Limón", "Bergamota"], middleNotes: ["Rosa", "Iris", "Jazmín"], baseNotes: ["Vainilla", "Incienso", "Ámbar", "Almizcle"],
    description: "La reina de los orientales. Un siglo de historia y sensualidad.", imageUrl: null,
  },
  {
    id: "oriental-03", name: "Angel", brand: "Thierry Mugler", family: "oriental", year: 1992, gender: "feminine",
    topNotes: ["Melón", "Frambuesa", "Caramelo"], middleNotes: ["Miel", "Patchouli", "Chocolate"], baseNotes: ["Vainilla", "Caramelo", "Patchouli"],
    description: "El gourmand que lo inventó todo. Goloso e hipnótico.", imageUrl: null,
  },
  {
    id: "oriental-04", name: "Spicebomb", brand: "Viktor & Rolf", family: "oriental", year: 2012, gender: "masculine",
    topNotes: ["Pomelo", "Bergamota", "Pimienta roja"], middleNotes: ["Canela", "Pimienta de Cayena", "Safrán"], baseNotes: ["Vetiver", "Cuero", "Tabaco"],
    description: "Una bomba de especias. Explosivo, masculino y seductor.", imageUrl: null,
  },
  {
    id: "oriental-05", name: "Black Orchid", brand: "Tom Ford", family: "oriental", year: 2006, gender: "unisex",
    topNotes: ["Trufa negra", "Frutas negras", "Pomelo"], middleNotes: ["Orquídea negra", "Ylang-ylang", "Especias negras"], baseNotes: ["Patchouli", "Vainilla", "Sándalo", "Vetiver"],
    description: "Oscuro, lujoso y magnético. La joya oscura de Tom Ford.", imageUrl: null,
  },
  {
    id: "oriental-06", name: "Alien", brand: "Thierry Mugler", family: "oriental", year: 2005, gender: "feminine",
    topNotes: ["Jazmín"], middleNotes: ["Heliotropo", "Flor de sol blanco"], baseNotes: ["Madera de cachemir", "Ámbar"],
    description: "Extraterrestre y único. Una firma imposible de imitar.", imageUrl: null,
  },
  {
    id: "oriental-07", name: "1 Million", brand: "Paco Rabanne", family: "oriental", year: 2008, gender: "masculine",
    topNotes: ["Pomelo", "Mandarina", "Menta"], middleNotes: ["Canela", "Especias", "Rosa"], baseNotes: ["Cuero", "Ámbar", "Madera"],
    description: "Vale un millón. Magnético, especiado y seductor.", imageUrl: null,
  },
  {
    id: "oriental-08", name: "Oud Wood", brand: "Tom Ford", family: "oriental", year: 2007, gender: "unisex",
    topNotes: ["Cardamomo", "Pimienta china"], middleNotes: ["Oud", "Sándalo", "Vetiver"], baseNotes: ["Tonka", "Ámbar"],
    description: "El oud occidental por excelencia. Oscuro y lujoso.", imageUrl: null,
  },
  {
    id: "oriental-09", name: "Narciso", brand: "Narciso Rodriguez", family: "oriental", year: 2014, gender: "feminine",
    topNotes: ["Almizcle"], middleNotes: ["Rosa centifolia", "Magnolia"], baseNotes: ["Cedro de Virginia", "Vetiver"],
    description: "Minimalista y sensual. El almizcle como arte.", imageUrl: null,
  },
  {
    id: "oriental-10", name: "Boss Bottled", brand: "Hugo Boss", family: "oriental", year: 1998, gender: "masculine",
    topNotes: ["Manzana", "Limón", "Ciruela"], middleNotes: ["Geranio", "Violeta", "Canela"], baseNotes: ["Sándalo", "Vainilla", "Cedro"],
    description: "El caballero moderno de Hugo Boss. Clásico e infalible.", imageUrl: null,
  },

  // ── WOODY ──────────────────────────────────────────────────────────────────
  {
    id: "woody-01", name: "Terre d'Hermès", brand: "Hermès", family: "woody", year: 2006, gender: "masculine",
    topNotes: ["Pomelo", "Pimienta naranja"], middleNotes: ["Pimienta", "Geranio"], baseNotes: ["Vetiver", "Cedro", "Benzoe"],
    description: "Terroso, mineral y profundamente masculino.", imageUrl: null,
  },
  {
    id: "woody-02", name: "Aventus", brand: "Creed", family: "woody", year: 2010, gender: "masculine",
    topNotes: ["Piña", "Bergamota", "Grosella negra"], middleNotes: ["Abedul", "Patchouli", "Jazmín"], baseNotes: ["Musgo de Roble", "Almizcle", "Ámbar"],
    description: "El perfume del poder. Ambición destilada en fragancia.", imageUrl: null,
  },
  {
    id: "woody-03", name: "Encre Noire", brand: "Lalique", family: "woody", year: 2006, gender: "masculine",
    topNotes: ["Ciprés", "Violeta"], middleNotes: ["Vetiver de Madagascar"], baseNotes: ["Cedro", "Almizcle"],
    description: "El vetiver más crudo y oscuro. Profundidad sin límites.", imageUrl: null,
  },
  {
    id: "woody-04", name: "Legend", brand: "Mont Blanc", family: "woody", year: 2006, gender: "masculine",
    topNotes: ["Bergamota", "Lavanda", "Piña"], middleNotes: ["Romero", "Geranio", "Musgo"], baseNotes: ["Cedro", "Sándalo", "Tonka", "Almizcle"],
    description: "La leyenda accesible. Limpio, fresco y elegante.", imageUrl: null,
  },
  {
    id: "woody-05", name: "Dior Homme", brand: "Dior", family: "woody", year: 2011, gender: "masculine",
    topNotes: ["Lavanda", "Bergamota", "Cacao"], middleNotes: ["Iris", "Cacao"], baseNotes: ["Vetiver", "Cedro", "Almizcle"],
    description: "El iris como jamás lo habías olido. Minimalismo chic.", imageUrl: null,
  },
  {
    id: "woody-06", name: "Sauvage EDP", brand: "Dior", family: "woody", year: 2018, gender: "masculine",
    topNotes: ["Bergamota", "Lavanda"], middleNotes: ["Pimienta Sichuan", "Vetiver"], baseNotes: ["Ambroxan", "Cedro", "Labdanum"],
    description: "La versión más oscura y amaderada del Sauvage original.", imageUrl: null,
  },
  {
    id: "woody-07", name: "Fahrenheit", brand: "Dior", family: "woody", year: 1988, gender: "masculine",
    topNotes: ["Lavanda", "Bergamota", "Mandarina"], middleNotes: ["Violeta", "Cedro", "Geranio"], baseNotes: ["Cuero", "Musgo", "Madera", "Ámbar"],
    description: "El rock madera de los 80. Cuero, gasolina y elegancia.", imageUrl: null,
  },
  {
    id: "woody-08", name: "Bleu de Chanel EDP", brand: "Chanel", family: "woody", year: 2011, gender: "masculine",
    topNotes: ["Limón", "Menta", "Pomelo"], middleNotes: ["Nuez moscada", "Incienso", "Jazmín"], baseNotes: ["Cedro", "Sándalo", "Patchouli"],
    description: "Más profundo que el EDT. Amaderado y misterioso.", imageUrl: null,
  },
  {
    id: "woody-09", name: "Allure Homme Sport", brand: "Chanel", family: "woody", year: 2004, gender: "masculine",
    topNotes: ["Mandarina", "Citron", "Bergamota"], middleNotes: ["Notas marinas", "Cedro"], baseNotes: ["Vetiver", "Madera del Pacífico", "Almizcle"],
    description: "El deporte con elegancia Chanel. Dinámico y sofisticado.", imageUrl: null,
  },
  {
    id: "woody-10", name: "Dior Homme Intense", brand: "Dior", family: "woody", year: 2011, gender: "masculine",
    topNotes: ["Lavanda", "Cacao"], middleNotes: ["Iris root", "Orris"], baseNotes: ["Vetiver", "Ámbar", "Cedro"],
    description: "El Dior Homme llevado al extremo. Iris denso y envolvente.", imageUrl: null,
  },
  {
    id: "woody-11", name: "Hugo", brand: "Hugo Boss", family: "woody", year: 1995, gender: "masculine",
    topNotes: ["Menta", "Geranio", "Pino"], middleNotes: ["Lavanda", "Romero", "Enebro"], baseNotes: ["Cedro", "Sándalo", "Musgo de Roble"],
    description: "El fougère verde que refrescó los 90. Rebelde y limpio.", imageUrl: null,
  },
  {
    id: "woody-12", name: "Bvlgari Man Wood Essence", brand: "Bvlgari", family: "woody", year: 2018, gender: "masculine",
    topNotes: ["Cardamomo", "Bergamota"], middleNotes: ["Cedro del Atlas", "Guayaco"], baseNotes: ["Musgo de Roble", "Ámbar", "Vetiver"],
    description: "La esencia pura del bosque en un traje de Bvlgari.", imageUrl: null,
  },
  {
    id: "woody-13", name: "Green Irish Tweed", brand: "Creed", family: "woody", year: 1985, gender: "masculine",
    topNotes: ["Verbena de limón", "Iris", "Menta verde"], middleNotes: ["Violeta", "Iris"], baseNotes: ["Sándalo de Mysore", "Ámbar"],
    description: "El fougère verde de Creed. El ADN de Sauvage.", imageUrl: null,
  },

  // ── GREEN ──────────────────────────────────────────────────────────────────
  {
    id: "green-01", name: "Chanel No. 19", brand: "Chanel", family: "green", year: 1970, gender: "feminine",
    topNotes: ["Aldeídos", "Neroli", "Bergamota", "Galbanum"], middleNotes: ["Lirio", "Jazmín", "Iris"], baseNotes: ["Vetiver", "Cedro", "Musgo de Roble"],
    description: "El verde intemporal de Chanel. Hierba y flores en equilibrio.", imageUrl: null,
  },
  {
    id: "green-02", name: "Un Jardin sur le Nil", brand: "Hermès", family: "green", year: 2005, gender: "unisex",
    topNotes: ["Tomate verde", "Loto", "Pomelo", "Mangostán"], middleNotes: ["Galbanum", "Flor de árbol de capullo"], baseNotes: ["Madera seca", "Incienso"],
    description: "Un jardín a orillas del Nilo. Verde, fresco y sereno.", imageUrl: null,
  },
  {
    id: "green-03", name: "Erolfa", brand: "Creed", family: "green", year: 1992, gender: "masculine",
    topNotes: ["Bergamota", "Pomelo", "Petitgrain"], middleNotes: ["Geranio", "Lavanda", "Artemisa"], baseNotes: ["Cedro", "Vetiver", "Ámbar"],
    description: "Fresco marino y verde. El Mediterráneo silvestre de Creed.", imageUrl: null,
  },
  {
    id: "green-04", name: "Amazonia Wild", brand: "Azzaro", family: "green", year: 2015, gender: "masculine",
    topNotes: ["Bergamota", "Menta", "Vetiver verde"], middleNotes: ["Cedro", "Bambú"], baseNotes: ["Musgo", "Madera seca", "Almizcle"],
    description: "La jungla en estado puro. Verde y salvaje.", imageUrl: null,
  },
  {
    id: "green-05", name: "Yardley English Lavender", brand: "Yardley", family: "green", year: 1913, gender: "unisex",
    topNotes: ["Lavanda", "Bergamota"], middleNotes: ["Lavanda"], baseNotes: ["Musgo de Roble", "Cedro"],
    description: "La lavanda inglesa más clásica. Un campo en primavera.", imageUrl: null,
  },
  {
    id: "green-06", name: "Polo Green", brand: "Ralph Lauren", family: "green", year: 1978, gender: "masculine",
    topNotes: ["Pino", "Albahaca", "Tabaco verde"], middleNotes: ["Artemisa", "Tomillo", "Cuero"], baseNotes: ["Cedro", "Patchouli", "Musgo de Roble"],
    description: "El chypre verde americano. El campo y el lujo combinados.", imageUrl: null,
  },

  // ── AMBER ──────────────────────────────────────────────────────────────────
  {
    id: "amber-01", name: "Ambre Sultan", brand: "Serge Lutens", family: "amber", year: 2000, gender: "unisex",
    topNotes: ["Hojas de laurel", "Orégano", "Plantas aromáticas"], middleNotes: ["Ámbar", "Resinas orientales"], baseNotes: ["Vainilla", "Sándalo", "Musgo"],
    description: "El ámbar más puro de Serge Lutens. Cálido, resinoso y hechizante.", imageUrl: null,
  },
  {
    id: "amber-02", name: "L'Ambre des Merveilles", brand: "Hermès", family: "amber", year: 2006, gender: "feminine",
    topNotes: ["Bergamota", "Ámbar"], middleNotes: ["Incienso"], baseNotes: ["Ámbar", "Benjuí", "Musgo de Roble", "Almizcle"],
    description: "El ámbar llevado a la excelencia por Hermès. Suave y radiante.", imageUrl: null,
  },
  {
    id: "amber-03", name: "Amber Pour Homme", brand: "Paco Rabanne", family: "amber", year: 1996, gender: "masculine",
    topNotes: ["Bergamota", "Galbanum", "Mandarina"], middleNotes: ["Rosa", "Iris", "Geranio"], baseNotes: ["Ámbar", "Vetiver", "Sándalo"],
    description: "El ámbar masculino accesible y siempre elegante.", imageUrl: null,
  },
  {
    id: "amber-04", name: "Ambre Nuit", brand: "Dior", family: "amber", year: 2009, gender: "unisex",
    topNotes: ["Rosa turca", "Bergamota"], middleNotes: ["Ámbar", "Cardamomo"], baseNotes: ["Labdanum", "Madera de cedro", "Almizcle"],
    description: "La noche de ámbar de Dior. Profundo, sensual y misterioso.", imageUrl: null,
  },
  {
    id: "amber-05", name: "Opium", brand: "Yves Saint Laurent", family: "amber", year: 1977, gender: "feminine",
    topNotes: ["Mandarina", "Bergamota", "Enebro"], middleNotes: ["Rosa", "Jazmín", "Clavo"], baseNotes: ["Ámbar", "Sándalo", "Mirra", "Incienso"],
    description: "El oriental escandaloso que redefinió la provocación en perfumería.", imageUrl: null,
  },
  {
    id: "amber-06", name: "Musc Ravageur", brand: "Frédéric Malle", family: "amber", year: 2000, gender: "unisex",
    topNotes: ["Mandarina", "Lavanda", "Bergamota"], middleNotes: ["Canela", "Clavo"], baseNotes: ["Almizcle", "Sándalo", "Vainilla", "Ámbar"],
    description: "El almizcle salvaje y animal. Carnal e irresistible.", imageUrl: null,
  },
]

function searchLocalSeed(query: string): FragranceCatalogResult[] {
  const q = query.toLowerCase()
  return SEED_FRAGRANCES.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.brand.toLowerCase().includes(q) ||
      f.family.toLowerCase().includes(q) ||
      f.topNotes.some((n) => n.toLowerCase().includes(q)) ||
      f.middleNotes.some((n) => n.toLowerCase().includes(q)) ||
      f.baseNotes.some((n) => n.toLowerCase().includes(q))
  ).slice(0, 12)
}
