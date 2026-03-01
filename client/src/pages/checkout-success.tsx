import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

export default function CheckoutSuccess() {
  const { clearCart } = useCart();
  const { t } = useI18n();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h1 className="text-3xl font-serif font-bold mb-4" data-testid="text-success-title">{t("success.title")}</h1>
        <p className="text-muted-foreground mb-2">
          {t("success.message")}
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          {t("success.email")}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="rounded-none bg-black hover:bg-black/90 text-white px-8 h-12 font-semibold tracking-widest text-sm" data-testid="button-continue-shopping">
              {t("success.continue")}
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-8">
          {t("success.help")} <a href="https://wa.me/85294448661" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">{t("success.contact")}</a>
        </p>
      </div>
    </Layout>
  );
}
