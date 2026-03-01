import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Link } from "wouter";
import { useI18n } from "@/lib/i18n";

export default function CheckoutCancel() {
  const { t } = useI18n();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 text-center max-w-lg">
        <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h1 className="text-3xl font-serif font-bold mb-4" data-testid="text-cancel-title">{t("cancel.title")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("cancel.message")}
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button className="rounded-none bg-black hover:bg-black/90 text-white px-8 h-12 font-semibold tracking-widest text-sm" data-testid="button-back-to-shop">
              {t("cancel.back")}
            </Button>
          </Link>
        </div>
        <p className="text-xs text-muted-foreground mt-8">
          {t("cancel.trouble")} <a href="https://wa.me/85294448661" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">{t("cancel.contact")}</a>
        </p>
      </div>
    </Layout>
  );
}
