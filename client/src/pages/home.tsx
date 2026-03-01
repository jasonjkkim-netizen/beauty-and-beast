import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { type Product } from "@/lib/data";
import ProductCard from "@/components/product-card";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const BEAUTY_CATEGORIES = ["Toners", "Essences", "Sunscreens", "Serums", "Cleansers", "Moisturizers", "Masks", "Eye Care", "Lip Care"];
const PET_CATEGORIES = ["Pet Food", "Pet Treats", "Pet Grooming", "Pet Health", "Pet Accessories"];

export default function Home() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  const { t } = useI18n();

  const beautyProducts = products.filter(p => BEAUTY_CATEGORIES.includes(p.category));
  const petProducts = products.filter(p => PET_CATEGORIES.includes(p.category));

  const features = [
    t("home.feature1"),
    t("home.feature2"),
    t("home.feature3"),
  ];

  return (
    <Layout>
      <div className="bg-muted/50 border-b py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
              {feature}
            </div>
          ))}
        </div>
      </div>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="relative rounded-lg overflow-hidden group">
          <img
            src="/images/escentual-hero.png"
            alt="Premium Beauty & Pet Care"
            className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>

          <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16">
            <span className="text-white/90 text-sm font-bold tracking-[0.2em] uppercase mb-4" data-testid="text-hero-label">
              {t("hero.newIn")}
            </span>
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 max-w-lg leading-tight" data-testid="text-hero-title">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-white/90 mb-8 max-w-md font-light" data-testid="text-hero-subtitle">
              {t("hero.subtitle")}
            </p>
            <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-8 font-semibold tracking-wide h-12" data-testid="button-shop-edit">
              {t("hero.shopEdit")}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            <span className="font-serif text-xl font-bold italic">Anua</span>
            <span className="font-serif text-xl font-bold tracking-widest">COSRX</span>
            <span className="font-sans text-xl font-black">ROUND LAB</span>
            <span className="font-serif text-xl">Beauty of Joseon</span>
            <span className="font-sans text-xl font-light tracking-widest">KONG</span>
            <span className="font-sans text-xl font-bold">Ziwi Peak</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">

          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && beautyProducts.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-end mb-8 border-b pb-4">
                <h2 className="text-2xl font-serif font-bold text-foreground" data-testid="text-section-trending">{t("home.trending")}</h2>
                <Button variant="link" className="text-sm font-semibold p-0 hover:text-primary" data-testid="link-view-trending">
                  {t("home.viewAllSkincare")}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                {beautyProducts.filter(p => p.featured).slice(0, 4).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          <div className="mb-16 bg-muted/30 rounded-lg p-8 md:p-12 flex flex-col items-center text-center border" data-testid="card-promo-banner">
            <h2 className="text-3xl font-serif font-bold mb-4">{t("home.seasonal")}</h2>
            <p className="text-muted-foreground mb-6 max-w-lg">
              {t("home.seasonalDesc")}
            </p>
            <Button variant="outline" className="rounded-none border-black text-black hover:bg-black hover:text-white px-8" data-testid="button-discover-offers">
              {t("home.discoverOffers")}
            </Button>
          </div>

          {!isLoading && beautyProducts.filter(p => p.category === "Sunscreens").length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-end mb-8 border-b pb-4">
                <h2 className="text-2xl font-serif font-bold text-foreground" data-testid="text-section-spf">{t("home.spf")}</h2>
                <Button variant="link" className="text-sm font-semibold p-0 hover:text-primary" data-testid="link-shop-spf">
                  {t("home.shopSpf")}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                {beautyProducts.filter(p => p.category === "Sunscreens").map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {!isLoading && petProducts.length > 0 && (
            <div id="pet">
              <div className="flex justify-between items-end mb-8 border-b pb-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-foreground" data-testid="text-section-pet">{t("home.petCare")}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{t("home.petCareDesc")}</p>
                </div>
                <Button variant="link" className="text-sm font-semibold p-0 hover:text-primary" data-testid="link-view-pet">
                  {t("home.viewAllPet")}
                </Button>
              </div>

              {(() => {
                const petByCategory: Record<string, Product[]> = {};
                petProducts.forEach(p => {
                  if (!petByCategory[p.category]) petByCategory[p.category] = [];
                  petByCategory[p.category].push(p);
                });

                return Object.entries(petByCategory).map(([category, items]) => (
                  <div key={category} className="mb-12">
                    <h3 className="text-lg font-semibold uppercase tracking-wide text-muted-foreground mb-6" data-testid={`text-pet-category-${category}`}>
                      {category.replace("Pet ", "")}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
                      {items.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          )}

        </div>
      </section>

      <section className="bg-secondary text-secondary-foreground py-16 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-2xl font-serif mb-4">{t("home.community")}</h2>
          <p className="text-sm text-muted-foreground mb-8">
            {t("home.communityDesc")}
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("home.emailPlaceholder")}
              className="flex-1 bg-white border-none px-4 py-3 text-black focus:outline-none"
              data-testid="input-email-newsletter"
            />
            <Button className="rounded-none bg-black text-white hover:bg-black/90 px-8" data-testid="button-subscribe">
              {t("home.subscribe")}
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
