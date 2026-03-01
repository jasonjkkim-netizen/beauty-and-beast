import { type Product } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { t } = useI18n();
  const savings = product.originalPriceHKD > product.priceHKD
    ? Math.round(((product.originalPriceHKD - product.priceHKD) / product.originalPriceHKD) * 100)
    : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      priceHKD: product.priceHKD,
      image: product.image,
      volume: product.volume,
    });
  }

  return (
    <div className="group flex flex-col h-full cursor-pointer" data-testid={`card-product-${product.id}`}>
      <div className="relative aspect-square mb-4 bg-white border border-muted flex items-center justify-center p-6">
        {savings > 0 && (
          <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold uppercase px-2 py-1 tracking-wider z-10" data-testid={`badge-offer-${product.id}`}>
            {t("product.offer")}
          </div>
        )}
        
        <img 
          src={product.image} 
          alt={product.name}
          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105"
          data-testid={`img-product-${product.id}`}
        />
        
        <div className="absolute bottom-4 left-0 right-0 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <Button
             className="w-full bg-black hover:bg-black/90 text-white rounded-none text-xs font-semibold h-10 tracking-widest"
             onClick={handleAddToCart}
             data-testid={`button-quick-buy-${product.id}`}
           >
              {t("product.addToBag")}
           </Button>
        </div>
      </div>
      
      <div className="flex flex-col flex-grow text-center px-2">
        <h3 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mb-1" data-testid={`text-brand-${product.id}`}>
          {product.brand}
        </h3>
        <h4 className="text-sm font-medium leading-snug mb-2 line-clamp-2 hover:underline" data-testid={`text-name-${product.id}`}>
          {product.name}
        </h4>
        
        <div className="flex items-center justify-center gap-0.5 mb-2">
           {[1, 2, 3, 4, 5].map((star) => (
             <Star key={star} className="h-3 w-3 fill-primary text-primary" />
           ))}
           <span className="text-[10px] text-muted-foreground ml-1">(24)</span>
        </div>
        
        <div className="mt-auto pt-2">
          {savings > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${product.id}`}>HK${product.originalPriceHKD}</span>
              <span className="text-base font-bold text-destructive" data-testid={`text-price-${product.id}`}>HK${product.priceHKD}</span>
            </div>
          ) : (
            <span className="text-base font-bold" data-testid={`text-price-${product.id}`}>HK${product.priceHKD}</span>
          )}
        </div>
      </div>
    </div>
  );
}
