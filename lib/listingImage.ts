/**
 * Resolves a display URL for marketplace listing images.
 * Firestore demo seeds and older rows often omit `imageUrl`; we fall back to
 * stable Unsplash images (see next.config.ts remotePatterns for images.unsplash.com).
 */

const DEFAULT =
  "https://images.unsplash.com/photo-1500937386664-56d1cc6a73b0?auto=format&fit=crop&w=800&q=80";

const BY_CATEGORY_KEYWORD: { test: (cat: string) => boolean; url: string }[] = [
  {
    test: (c) => c.includes("grain") || c.includes("tuber") || c.includes("rice") || c.includes("maize"),
    url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  },
  {
    test: (c) => c.includes("poultry") || c.includes("egg"),
    url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3e8a?auto=format&fit=crop&w=800&q=80",
  },
  {
    test: (c) => c.includes("vegetable") || c.includes("pepper") || c.includes("onion") || c.includes("tomato"),
    url: "https://images.unsplash.com/photo-1592924357228-91a4daadcabc?auto=format&fit=crop&w=800&q=80",
  },
  {
    test: (c) => c.includes("fruit") || c.includes("watermelon") || c.includes("plantain"),
    url: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
  },
  {
    test: (c) => c.includes("livestock"),
    url: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80",
  },
];

export function resolveListingImageUrl(raw: Record<string, unknown>): string {
  const direct =
    (typeof raw.imageUrl === "string" && raw.imageUrl.trim()) ||
    (typeof raw.image === "string" && raw.image.trim()) ||
    (typeof raw.photoUrl === "string" && raw.photoUrl.trim());
  if (direct) {
    return direct;
  }

  const category = String(raw.category ?? "").toLowerCase();
  const name = String(raw.productName ?? "").toLowerCase();
  const haystack = `${category} ${name}`;

  for (const { test, url } of BY_CATEGORY_KEYWORD) {
    if (test(haystack)) {
      return url;
    }
  }

  return DEFAULT;
}

/** Per demo product (seed order) — distinct photos for the marketplace grid. */
export const DEMO_LISTING_IMAGE_URLS: string[] = [
  "https://images.unsplash.com/photo-1592924357228-91a4daadcabc?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1582722872445-44dc5f7e3e8a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1501430654243-c934cec2e8c0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
];
