export interface ShowcaseItem {
  id: string;
  label: string;
  prompt: string;
  image_path: string;
  media_url: string;
  sort_order: number;
  media_type: "video" | "image";
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "luxury-villa-veo2",
    label: "Google Veo 2 / Cinema",
    prompt: "4K cinematic drone establishing shot of a modernist tropical luxury villa cantilevered over lush palm hills at twilight. Slow forward camera push-in, 35mm anamorphic lens, warm interior volumetric lighting glowing through floor-to-ceiling glass, architectural reflection on infinity pool surface, cinematic color grading, 24fps natural motion blur.",
    image_path: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    media_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    sort_order: 1,
    media_type: "image"
  },
  {
    id: "skincare-ugc-commercial",
    label: "UGC Flow / Skincare",
    prompt: "Commercial beauty product photography of minimalist frosted glass serum bottle with metallic dropper. Tiny droplets of water glistening on glass surface, soft diffused morning window light, pastel organic beige backdrop, macro 85mm lens, high-conversion luxury cosmetics aesthetic with pristine reflections.",
    image_path: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    media_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    sort_order: 2,
    media_type: "image"
  },
  {
    id: "artisanal-coffee-hook",
    label: "Shorts Video / Dynamic Hook",
    prompt: "Top-down artisanal coffee brewing sequence, rich velvet crema pouring into clear ceramic cup, steam rising in volumetric morning sunlight, warm wooden aesthetic cafe background, slow motion 60fps macro capture, ultra-satisfying tactile textures with cinematic depth.",
    image_path: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
    media_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
    sort_order: 3,
    media_type: "image"
  },
  {
    id: "editorial-character-fashion",
    label: "Character Board / Fashion",
    prompt: "High-fashion editorial studio portrait of model, sharp cheekbone highlights, studio Rembrandt key light with subtle cyan rim light, high-end designer structured jacket, 85mm f/1.4 lens, clean deep charcoal backdrop, Vogue cover aesthetic with rich skin texture preservation.",
    image_path: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    media_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    sort_order: 4,
    media_type: "image"
  },
  {
    id: "cyberpunk-tech-console",
    label: "Style Detection / Cyberpunk",
    prompt: "Futuristic audio synthesizer console with glowing LED faders, neon turquoise and magenta reflections on brushed dark titanium metal, shallow depth of field, cyberpunk sound production studio atmosphere, high fidelity 8K render with atmospheric haze.",
    image_path: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80",
    media_url: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80",
    sort_order: 5,
    media_type: "image"
  },
  {
    id: "contemporary-art-poster",
    label: "Poster Infografis",
    prompt: "Avant-garde contemporary exhibition poster, bold Swiss typography, balanced geometric composition with vibrant warm gradients, matte fine art paper texture, museum exhibition graphic design standard, clean and compelling visual hierarchy.",
    image_path: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    media_url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    sort_order: 6,
    media_type: "image"
  }
];
