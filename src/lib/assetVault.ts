// Global Asset & Style Vault for BuatPrompt Studio Suite
// Enables seamless cross-feature consistency across all 28 tools.

export interface CharacterAsset {
  id: string;
  name: string;
  tag: string; // e.g. @host_anchor or @host_sarah
  role: string; // e.g. "UGC Reviewer", "Podcast Host", "Tech Specialist"
  visualPrompt: string;
  negativePrompt?: string;
  wardrobe: string;
  gender: "female" | "male" | "duo" | "stylized-3d" | "faceless";
  brandFolder?: string; // e.g. "Skincare & Beauty", "Properti Emerald", "Universal / Umum"
  imageBase64?: string | null;
  isCustom?: boolean;
  createdAt?: string;
}

export interface ProductAsset {
  id: string;
  name: string;
  tag: string; // e.g. @hero_object
  category: "food" | "skincare" | "tech" | "fashion" | "beverage" | "other";
  visualPrompt: string;
  material: string;
  physicalInteraction: string; // e.g. "held with 3 fingers", "snapped in half", "pumped onto fingertips"
  causalitySoundNote?: string;
  brandFolder?: string; // e.g. "Skincare & Beauty", "Kuliner & F&B"
  imageBase64?: string | null;
  isCustom?: boolean;
  createdAt?: string;
}

export interface EnvironmentAsset {
  id: string;
  name: string;
  tag: string; // e.g. @setting_anchor
  visualPrompt: string;
  spatialMap: string; // e.g. "Kitchen island in center, large window on left, herbs on shelves behind"
  lightingCondition: string;
  brandFolder?: string; // e.g. "Properti & Arsitektur", "Podcast Studio"
  imageBase64?: string | null;
  galleryImages?: Array<{ label: string; imageBase64: string }>;
  isCustom?: boolean;
  createdAt?: string;
}

export interface CameraPreset {
  id: string;
  name: string;
  type: "handheld-ugc" | "macro-pushin" | "orbit-360" | "podcast-multicam" | "topdown-flatlay" | "dutch-tension" | "drone-aerial";
  focalLength: string; // e.g. "28mm", "50mm", "85mm"
  commandSlash: string; // e.g. "/camera handheld selfie 28mm /motion organic creator sway"
  description: string;
  bestFor: string;
  brandFolder?: string;
}

export interface LightingPreset {
  id: string;
  name: string;
  kelvin: string; // e.g. "4500K", "3200K", "5600K"
  direction: string; // e.g. "45-degree key light with soft rim light"
  mood: string;
  promptSnippet: string;
  brandFolder?: string;
}

export interface AudioPreset {
  id: string;
  name: string;
  foleySoundscape: string;
  causalityRule: string; // physical action that triggers the sound
  musicBedGenre: string;
  brandFolder?: string;
}

export interface GlobalVaultData {
  folders?: string[];
  characters: CharacterAsset[];
  products: ProductAsset[];
  environments: EnvironmentAsset[];
  cameras: CameraPreset[];
  lightings: LightingPreset[];
  audios: AudioPreset[];
}

export const DEFAULT_FOLDERS: string[] = [
  "Universal / Umum",
  "Skincare & Beauty",
  "Properti & Arsitektur",
  "Tech & Gadget",
  "Kuliner & F&B",
  "Podcast Studio",
];

// ----------------------------------------------------
// DEFAULT SEED ASSETS (World-Class Presets)
// ----------------------------------------------------

export const DEFAULT_CHARACTERS: CharacterAsset[] = [
  {
    id: "char-sarah-pro",
    name: "Sarah — Modern Professional UGC",
    tag: "@host_anchor",
    role: "UGC Product Reviewer & Lifestyle Creator",
    brandFolder: "Skincare & Beauty",
    visualPrompt:
      "Indonesian female creator in late 20s, elegant modern beige linen blazer over ivory silk top, subtle minimalist gold stud earrings, natural polished ponytail hair, warm articulate expression, natural skin subsurface scattering, realistic eye catchlights, medically accurate facial anatomy.",
    negativePrompt: "cgi appearance, 3d render look, plastic smooth skin, distorted facial structure, artificial beauty filter, watermark.",
    wardrobe: "Beige linen blazer, ivory silk top, minimalist gold jewelry.",
    gender: "female",
    isCustom: false,
  },
  {
    id: "char-bimo-casual",
    name: "Bimo — Smart Casual Tech Reviewer",
    tag: "@host_anchor",
    role: "Tech Specialist & Gadget Unboxer",
    brandFolder: "Tech & Gadget",
    visualPrompt:
      "Indonesian male creator in late 20s, natural groomed short black hair, casual smart navy linen shirt, brushed silver watch on left wrist, authentic friendly smile, natural skin micro-texture, visible skin pores, true-to-life posture, professional soft daylight.",
    negativePrompt: "overly smooth skin, plastic sheen, asymmetric eyes, fake digital render.",
    wardrobe: "Navy linen shirt, brushed silver watch, dark denim.",
    gender: "male",
    isCustom: false,
  },
  {
    id: "char-podcast-duo",
    name: "Reza & Maya — Podcast Duo Co-Hosts",
    tag: "@podcast_hosts",
    role: "Deep-Dive Podcast Hosts (2-3 Characters)",
    brandFolder: "Podcast Studio",
    visualPrompt:
      "Two charismatic Indonesian co-hosts sitting across a warm rustic oak round podcast table. On the left: male host in charcoal knitted crewneck with headphones around neck. On the right: female host in olive corduroy jacket with expressive conversational hand gestures. High-end podcast microphones on boom arms in front of each speaker.",
    negativePrompt: "cluttered frame, merging bodies, mismatched audio equipment, flat lighting.",
    wardrobe: "Charcoal knitted crewneck (male) & olive corduroy jacket (female).",
    gender: "duo",
    isCustom: false,
  },
  {
    id: "char-kiko-3d",
    name: "Kiko — Stylized 3D Character Host",
    tag: "@host_anchor",
    role: "Animation & Kids/Family Explainer",
    brandFolder: "Universal / Umum",
    visualPrompt:
      "Charming stylized 3D animated character host, Pixar-quality subsurface scattering, soft studio lighting, expressive facial mechanics, vibrant textured fabric hoodie, friendly large expressive eyes with realistic corneal reflections.",
    negativePrompt: "hyper-realistic human skin, uncanny valley, low-poly geometry.",
    wardrobe: "Teal textured knit hoodie with warm yellow drawstring.",
    gender: "stylized-3d",
    isCustom: false,
  },
  {
    id: "char-faceless-pov",
    name: "First-Person POV (Faceless Hands)",
    tag: "@creator_hands",
    role: "Aesthetic Cooking / Unboxing / Crafting",
    brandFolder: "Kuliner & F&B",
    visualPrompt:
      "First-person perspective, authentic manicured natural human hands with realistic skin micro-creases and fingernail gloss interacting organically with objects in front of the camera, no face visible.",
    negativePrompt: "extra fingers, warped digits, robotic hands, face visible.",
    wardrobe: "Minimalist silver ring on index finger, soft woven sleeve edge.",
    gender: "faceless",
    isCustom: false,
  },
];

export const DEFAULT_PRODUCTS: ProductAsset[] = [
  {
    id: "prod-kentang-krispi",
    name: "Kentang Goreng Krispi (Golden Crust)",
    tag: "@hero_object",
    category: "food",
    brandFolder: "Kuliner & F&B",
    visualPrompt:
      "Golden brown, ultra-crispy hand-cut french fries arranged on a rustic matte cream ceramic plate, dusted with fine cornstarch crust, glistening with tiny sea-salt crystals, gentle steam rising visibly in macro illumination.",
    material: "Crispy golden fried potato crust, matte ceramic plate.",
    physicalInteraction: "Picked up individually with two fingers, visibly snapped or bitten with shattering crumbs.",
    causalitySoundNote: "Loud, satisfying crisp food crunch sound synchronized exactly with physical bite/snap.",
    isCustom: false,
  },
  {
    id: "prod-serum-skincare",
    name: "Glow Radiance Hydrating Serum",
    tag: "@hero_object",
    category: "skincare",
    brandFolder: "Skincare & Beauty",
    visualPrompt:
      "Luxury frosted glass serum bottle with minimalist aesthetic rose-gold metallic dropper cap, pristine clean typographic label reading 'HYDRA GLOW 10% B5', viscous luminous translucent serum visible inside with micro-droplets on dropper tip.",
    material: "Frosted translucent glass, rose-gold metal cap, viscous serum liquid.",
    physicalInteraction: "Held delicately in palm, dropper dispensed onto fingertips with gentle viscosity.",
    causalitySoundNote: "Crisp glass bottle tap, gentle suction click of dropper, soft droplet sound.",
    isCustom: false,
  },
  {
    id: "prod-artisan-coffee",
    name: "Artisan Iced Cold Brew Latte",
    tag: "@hero_object",
    category: "beverage",
    brandFolder: "Kuliner & F&B",
    visualPrompt:
      "Clear ribbed highball glass filled with crystal-clear geometric ice cubes, dark cold-brew coffee marbling beautifully with oat milk swirls, realistic condensation droplets running down the chilled outer glass surface.",
    material: "Chilled ribbed glass, dense cold brew liquid, ice cubes.",
    physicalInteraction: "Held at bottom of glass, lightly swirled showing ice clinking and milk swirling.",
    causalitySoundNote: "Crisp clinking of ice cubes against glass wall.",
    isCustom: false,
  },
];

export const DEFAULT_ENVIRONMENTS: EnvironmentAsset[] = [
  {
    id: "env-rustic-kitchen",
    name: "Dapur Kayu Rustic & Morning Sunlight",
    tag: "@setting_anchor",
    brandFolder: "Kuliner & F&B",
    visualPrompt:
      "Warm rustic wooden kitchen table, soft morning sunlight filtering through sheer linen curtains, aesthetic home-cooking vlogger background with blurred potted basil plants, ceramicware on open shelves, hyper-realistic depth.",
    spatialMap: "Center: Solid oak island counter. Left: Big arched window with sheer curtains. Right: Minimalist ceramic jars and green basil pot.",
    lightingCondition: "Warm golden morning window light at 45 degrees, soft ambient fill.",
    isCustom: false,
  },
  {
    id: "env-podcast-studio",
    name: "Studio Podcast Akustik & Neon Rim Light",
    tag: "@setting_anchor",
    brandFolder: "Podcast Studio",
    visualPrompt:
      "Professional modern podcast studio, charcoal acoustic geometric wall panels, warm ambient copper filament pendant lights, subtle dark teal and amber neon edge illumination, pristine studio isolation.",
    spatialMap: "Center: Curved wooden podcast desk with boom-arm Shure SM7B mics. Background: Acoustic diffuser wall with vertical LED accent strip.",
    lightingCondition: "Moody 3-point key light on hosts, warm amber rim lighting from behind.",
    isCustom: false,
  },
  {
    id: "env-scandi-living",
    name: "Ruang Tamu Skandinavia Minimalis",
    tag: "@setting_anchor",
    brandFolder: "Properti & Arsitektur",
    visualPrompt:
      "Bright airy Scandinavian living room, light ash hardwood flooring, off-white boucle sofa, fiddle-leaf fig plant in terracotta planter, architectural books on marble coffee table, calm clean daylight.",
    spatialMap: "Foreground: Low marble coffee table. Background: Boucle sofa and floor-to-ceiling balcony window.",
    lightingCondition: "Even, diffuse North-facing daylight, clean neutral 5600K color balance.",
    isCustom: false,
  },
];

export const DEFAULT_CAMERAS: CameraPreset[] = [
  {
    id: "cam-ugc-selfie",
    name: "UGC Smartphone Selfie (Natural Sway)",
    type: "handheld-ugc",
    focalLength: "28mm wide",
    commandSlash: "/camera handheld selfie 28mm /motion subtle organic human breathing sway /framing creator eye-level",
    description: "Kamera HP otentik dengan goyangan tangan alami, sangat manusiawi, tidak seperti render AI robotik.",
    bestFor: "Hook video TikTok / Reels, curhat kreator, unboxing spontan.",
  },
  {
    id: "cam-macro-pushin",
    name: "Cinematic Macro Push-In (Product Hero)",
    type: "macro-pushin",
    focalLength: "50mm / 85mm portrait macro",
    commandSlash: "/camera slow push-in 50mm /motion cinematic dolly slider /depth f/1.8 shallow bokeh",
    description: "Kamera meluncur maju halus mendekati detail produk atau ekspresi wajah yang terkesima.",
    bestFor: "Reveal rahasia produk, momen gigitan makanan, tekstur skincare.",
  },
  {
    id: "cam-360-orbit",
    name: "360-Degree Continuous Orbit Arc",
    type: "orbit-360",
    focalLength: "35mm prime",
    commandSlash: "/camera continuous 360-orbit arc /motion smooth motorized gimbal /elevation eye-level",
    description: "Kamera mengitari subjek dan produk secara melingkar mulus dengan latar belakang berputar dinamis.",
    bestFor: "Showcase kemasan mewah, fashion outfit of the day, hotel/resort tour.",
  },
  {
    id: "cam-podcast-multicam",
    name: "Multi-Cam Podcast (Wide to Cross-Cut)",
    type: "podcast-multicam",
    focalLength: "50mm & 85mm multi-angle",
    commandSlash: "/camera master wide 35mm cross-cutting to tight 85mm over-the-shoulder portrait",
    description: "Pola kamera podcast profesional: pengambilan meja luas diselingi close-up bahu saat lawan bicara merespons.",
    bestFor: "Diskusi 2-3 orang, wawancara, bincang edukasi.",
  },
  {
    id: "cam-topdown-flatlay",
    name: "Top-Down Flat Lay (90° Cooking / Unboxing)",
    type: "topdown-flatlay",
    focalLength: "35mm overhead",
    commandSlash: "/camera overhead 90-degree bird-eye flat lay /motion locked perpendicular /lighting even shadowless",
    description: "Kamera tegak lurus menatap ke meja dari atas, memperlihatkan susunan bahan dan aksi tangan.",
    bestFor: "Tutorial masak, susunan bumbu, step-by-step perakitan gadget.",
  },
];

export const DEFAULT_LIGHTINGS: LightingPreset[] = [
  {
    id: "light-warm-morning",
    name: "Natural Warm Morning Sunlight (4500K)",
    kelvin: "4500K Warm Neutral",
    direction: "45-degree side window angle with soft fill reflection",
    mood: "Autentik, ramah, jujur, segar.",
    promptSnippet: "soft morning natural window daylight, 45-degree directional key light, gentle ambient bounce, realistic catchlights.",
  },
  {
    id: "light-golden-hour",
    name: "Golden Hour Glow & Soft Bokeh (3200K)",
    kelvin: "3200K Warm Golden",
    direction: "Back-rim golden sunset illumination with warm fill",
    mood: "Estetik, emosional, romantis, premium.",
    promptSnippet: "golden hour rim lighting, warm sunset tones, soft circular background bokeh, dreamy atmospheric glow.",
  },
  {
    id: "light-high-key-studio",
    name: "Clean High-Key Commercial Studio (5600K)",
    kelvin: "5600K Crisp Daylight",
    direction: "Large softbox overhead with dual white reflector fills",
    mood: "Higienis, jernih, profesional, tekstur produk tajam.",
    promptSnippet: "high-key commercial studio lighting, soft diffused softbox, crisp texture definition, pure color accuracy, zero harsh shadows.",
  },
];

export const DEFAULT_AUDIOS: AudioPreset[] = [
  {
    id: "audio-crisp-crunch",
    name: "Food Crisp Snap & Chew (Zero Phantom SFX)",
    foleySoundscape: "Ultra-satisfying loud food crunch sound effect, golden crust fracture, subtle chewing resonance.",
    causalityRule: "Physical bite or snap in half must be visibly depicted on screen at exact millisecond.",
    musicBedGenre: "Warm acoustic fingerstyle guitar, 105 BPM, friendly upbeat.",
  },
  {
    id: "audio-skincare-drop",
    name: "Hydrating Dropper & Gentle Tap",
    foleySoundscape: "Tactile glass dropper suction click, soft liquid droplet splash, gentle skincare bottle placement tap.",
    causalityRule: "Dropper bulb squeezed and liquid droplet releases visibly into palm.",
    musicBedGenre: "Ethereal chill ambient lo-fi, 78 BPM, spa relaxation.",
  },
];

export const INITIAL_DEFAULT_VAULT: GlobalVaultData = {
  folders: DEFAULT_FOLDERS,
  characters: DEFAULT_CHARACTERS,
  products: DEFAULT_PRODUCTS,
  environments: DEFAULT_ENVIRONMENTS,
  cameras: DEFAULT_CAMERAS,
  lightings: DEFAULT_LIGHTINGS,
  audios: DEFAULT_AUDIOS,
};

// ----------------------------------------------------
// LOCALSTORAGE DATA ACCESS & SYNCHRONIZATION
// ----------------------------------------------------

const VAULT_STORAGE_KEY = "buatprompt_asset_vault_v1";

export function getGlobalVaultData(): GlobalVaultData {
  if (typeof window === "undefined") {
    return INITIAL_DEFAULT_VAULT;
  }

  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) {
      const initial: GlobalVaultData = {
        folders: DEFAULT_FOLDERS,
        characters: DEFAULT_CHARACTERS,
        products: DEFAULT_PRODUCTS,
        environments: DEFAULT_ENVIRONMENTS,
        cameras: DEFAULT_CAMERAS,
        lightings: DEFAULT_LIGHTINGS,
        audios: DEFAULT_AUDIOS,
      };
      localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    const rawFolders: string[] = Array.isArray(parsed.folders) ? parsed.folders : [];
    const loadedFolders = rawFolders.length > 0
      ? Array.from(new Set(rawFolders.filter((f) => typeof f === "string" && f !== "Semua Proyek")))
      : DEFAULT_FOLDERS;

    return {
      folders: loadedFolders.length > 0 ? loadedFolders : DEFAULT_FOLDERS,
      characters: parsed.characters || DEFAULT_CHARACTERS,
      products: parsed.products || DEFAULT_PRODUCTS,
      environments: parsed.environments || DEFAULT_ENVIRONMENTS,
      cameras: parsed.cameras || DEFAULT_CAMERAS,
      lightings: parsed.lightings || DEFAULT_LIGHTINGS,
      audios: parsed.audios || DEFAULT_AUDIOS,
    };
  } catch (err) {
    console.warn("Failed to parse Global Asset Vault from localStorage, using defaults:", err);
    return {
      folders: DEFAULT_FOLDERS,
      characters: DEFAULT_CHARACTERS,
      products: DEFAULT_PRODUCTS,
      environments: DEFAULT_ENVIRONMENTS,
      cameras: DEFAULT_CAMERAS,
      lightings: DEFAULT_LIGHTINGS,
      audios: DEFAULT_AUDIOS,
    };
  }
}

export function saveGlobalVaultData(data: GlobalVaultData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(data));
    // Dispatch a custom event so other open tabs/components can re-render immediately
    window.dispatchEvent(new Event("buatprompt_vault_updated"));
  } catch (err) {
    console.error("Failed to save Global Asset Vault to localStorage:", err);
  }
}

export function addCustomFolder(folderName: string): void {
  const vault = getGlobalVaultData();
  const trimmed = folderName.trim();
  if (!trimmed || trimmed === "Semua Proyek") return;
  const currentFolders = (vault.folders || DEFAULT_FOLDERS).filter((f) => f !== "Semua Proyek");
  if (!currentFolders.includes(trimmed)) {
    vault.folders = [...currentFolders, trimmed];
    saveGlobalVaultData(vault);
  }
}

// Helper methods for easy component consumption
export function addOrUpdateCharacter(char: CharacterAsset): void {
  const vault = getGlobalVaultData();
  const idx = vault.characters.findIndex((c) => c.id === char.id);
  if (idx >= 0) {
    vault.characters[idx] = { ...char, isCustom: true };
  } else {
    vault.characters.unshift({ ...char, isCustom: true, createdAt: new Date().toISOString() });
  }
  saveGlobalVaultData(vault);
}

export function deleteCharacter(id: string): void {
  const vault = getGlobalVaultData();
  vault.characters = vault.characters.filter((c) => c.id !== id);
  saveGlobalVaultData(vault);
}

export function addOrUpdateProduct(prod: ProductAsset): void {
  const vault = getGlobalVaultData();
  const idx = vault.products.findIndex((p) => p.id === prod.id);
  if (idx >= 0) {
    vault.products[idx] = { ...prod, isCustom: true };
  } else {
    vault.products.unshift({ ...prod, isCustom: true, createdAt: new Date().toISOString() });
  }
  saveGlobalVaultData(vault);
}

export function deleteProduct(id: string): void {
  const vault = getGlobalVaultData();
  vault.products = vault.products.filter((p) => p.id !== id);
  saveGlobalVaultData(vault);
}

export function addOrUpdateEnvironment(env: EnvironmentAsset): void {
  const vault = getGlobalVaultData();
  const idx = vault.environments.findIndex((e) => e.id === env.id);
  if (idx >= 0) {
    vault.environments[idx] = { ...env, isCustom: true };
  } else {
    vault.environments.unshift({ ...env, isCustom: true, createdAt: new Date().toISOString() });
  }
  saveGlobalVaultData(vault);
}

export function deleteEnvironment(id: string): void {
  const vault = getGlobalVaultData();
  vault.environments = vault.environments.filter((e) => e.id !== id);
  saveGlobalVaultData(vault);
}

export function resetVaultToDefaults(): void {
  if (typeof window === "undefined") return;
  const defaults: GlobalVaultData = {
    folders: DEFAULT_FOLDERS,
    characters: DEFAULT_CHARACTERS,
    products: DEFAULT_PRODUCTS,
    environments: DEFAULT_ENVIRONMENTS,
    cameras: DEFAULT_CAMERAS,
    lightings: DEFAULT_LIGHTINGS,
    audios: DEFAULT_AUDIOS,
  };
  saveGlobalVaultData(defaults);
}

