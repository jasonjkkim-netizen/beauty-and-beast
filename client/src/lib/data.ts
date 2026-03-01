export type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  priceHKD: number;
  originalPriceHKD: number;
  volume: string;
  tags: string[];
  featured: boolean | null;
  inStock: boolean | null;
};

export const beautyCategories = [
  {
    id: "toners",
    title: "Toners",
    description: "Balance pH and Prep Skin",
    subtitle: "Essential for removing residue, hydrating, and soothing."
  },
  {
    id: "essences",
    title: "Essences",
    description: "Deep Hydration and Repair",
    subtitle: "Concentrated actives for repair and brightness."
  },
  {
    id: "sunscreens",
    title: "Sunscreens",
    description: "Essential UV Protection",
    subtitle: "Broad-spectrum defense without white cast."
  }
];

export const petCategories = [
  {
    id: "pet-food",
    title: "Pet Food",
    description: "Premium Nutrition",
    subtitle: "High-quality, balanced meals for dogs and cats."
  },
  {
    id: "pet-treats",
    title: "Treats & Snacks",
    description: "Healthy Rewards",
    subtitle: "Natural, delicious treats your pets will love."
  },
  {
    id: "pet-grooming",
    title: "Grooming",
    description: "Coat & Skin Care",
    subtitle: "Shampoos, brushes, and grooming essentials."
  },
  {
    id: "pet-health",
    title: "Health & Wellness",
    description: "Supplements & Care",
    subtitle: "Vitamins, joint support, and dental care."
  },
  {
    id: "pet-accessories",
    title: "Accessories",
    description: "Collars, Toys & More",
    subtitle: "Everything your pet needs for a happy life."
  }
];

export const categories = [...beautyCategories, ...petCategories];