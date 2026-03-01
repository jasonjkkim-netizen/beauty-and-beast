import { Link } from "wouter";
import { Search, ShoppingBag, Menu, User, ChevronDown, X, Plus, Minus, Trash2, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { FaAlipay, FaWeixin, FaCcVisa, FaCcMastercard, FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";

function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, subtotal, shipping, total, isOpen, setIsOpen } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { t } = useI18n();

  async function handleCheckout() {
    if (items.length === 0) return;
    setCheckoutLoading(true);
    try {
      const res = await apiRequest("POST", "/api/checkout", {
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert(t("cart.checkoutFailed"));
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="flex flex-col items-center cursor-pointer group" data-testid="button-open-cart">
          <div className="relative">
            <ShoppingBag className="h-6 w-6 text-black group-hover:text-primary transition-colors" />
            <span className="absolute -top-1 -right-2 h-4 w-4 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold" data-testid="text-cart-count">
              {totalItems}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold mt-1 hidden md:block group-hover:text-primary">{t("cart.bag")}</span>
        </div>
      </SheetTrigger>
      <SheetContent side="right" className="w-[380px] bg-white p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-left font-bold uppercase tracking-wider text-sm">{t("cart.yourBag")} ({totalItems})</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-sm text-gray-500 mb-2">{t("cart.empty")}</p>
            <p className="text-xs text-gray-400">{t("cart.emptyHint")}</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map(item => (
                <div key={item.productId} className="flex gap-4 border-b pb-4" data-testid={`cart-item-${item.productId}`}>
                  <div className="w-16 h-16 bg-gray-50 border flex items-center justify-center shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">{item.brand}</p>
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.volume}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 border flex items-center justify-center hover:bg-gray-50"
                          data-testid={`button-qty-minus-${item.productId}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-mono w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 border flex items-center justify-center hover:bg-gray-50"
                          data-testid={`button-qty-plus-${item.productId}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold">HK${item.priceHKD * item.quantity}</span>
                        <button onClick={() => removeItem(item.productId)} className="text-gray-400 hover:text-red-500" data-testid={`button-remove-${item.productId}`}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span>{t("cart.subtotal")}</span>
                <span className="font-mono">HK${subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>{t("cart.shipping")}</span>
                <span className="font-mono">{shipping === 0 ? t("cart.free") : `HK$${shipping}`}</span>
              </div>
              {subtotal > 0 && subtotal < 500 && (
                <p className="text-xs text-gray-500">{t("cart.freeShippingHint", { amount: 500 - subtotal })}</p>
              )}
              <div className="flex justify-between font-bold text-base border-t pt-3">
                <span>{t("cart.total")}</span>
                <span className="font-mono">HK${total}</span>
              </div>
              <Button
                className="w-full rounded-none bg-black hover:bg-black/90 text-white h-12 font-semibold tracking-widest text-sm"
                onClick={handleCheckout}
                disabled={checkoutLoading}
                data-testid="button-checkout"
              >
                {checkoutLoading ? t("cart.processing") : t("cart.checkout")}
              </Button>
              <p className="text-[10px] text-center text-gray-400">{t("cart.securePay")}</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function WhatsAppButton() {
  const { t } = useI18n();
  const phoneNumber = "85294448661";
  const message = encodeURIComponent(t("whatsapp.defaultMessage"));
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all hover:scale-110"
      data-testid="button-whatsapp"
      title={t("whatsapp.title")}
    >
      <FaWhatsapp className="h-7 w-7" />
    </a>
  );
}

function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "zh" : "en")}
      className="flex items-center gap-1 cursor-pointer hover:text-black text-xs font-medium"
      data-testid="button-lang-switch"
    >
      <Globe className="h-3 w-3" />
      {t("lang.switch")}
    </button>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10">
      <div className="bg-[#f5f5f5] text-xs py-1.5 border-b">
        <div className="container mx-auto px-4 flex justify-between items-center text-muted-foreground">
          <div className="flex gap-4">
            <span className="hidden sm:inline hover:text-black cursor-pointer">{t("nav.help")}</span>
            <span className="hidden sm:inline hover:text-black cursor-pointer">{t("nav.delivery")}</span>
          </div>
          <div className="flex gap-4 items-center font-medium">
            <LanguageSwitcher />
            <span className="flex items-center gap-1 cursor-pointer hover:text-black">
              <User className="h-3 w-3" /> {t("nav.account")}
            </span>
            <span className="flex items-center gap-1 cursor-pointer hover:text-black">
              HKD ($) <ChevronDown className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>

      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          
          <div className="md:hidden flex-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-black">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-white">
                <SheetHeader>
                  <SheetTitle className="text-left font-serif text-2xl font-black tracking-tight uppercase">Beauty<span className="font-light">&Beast</span></SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 mt-8 uppercase text-sm font-semibold tracking-wider">
                  <Link href="/" className="hover:text-primary">{t("nav.skincare")}</Link>
                  <Link href="#pet" className="hover:text-primary">{t("nav.petcare")}</Link>
                  <Link href="#" className="hover:text-primary">{t("nav.brands")}</Link>
                  <Link href="#" className="text-destructive">{t("nav.offers")}</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Link href="/" className="cursor-pointer">
              <h1 className="font-serif text-3xl md:text-4xl font-black tracking-tight uppercase">
                Beauty<span className="text-primary font-light">&Beast</span>
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <input 
              type="text" 
              placeholder={t("search.placeholder")}
              className="w-full bg-[#f5f5f5] border-none px-4 py-2.5 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
            />
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-full text-muted-foreground hover:bg-transparent">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 md:flex-none flex items-center justify-end gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="md:hidden text-black" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
            <CartDrawer />
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-10 h-12 text-sm font-bold tracking-widest uppercase text-black border-t bg-white">
          <Link href="/" className="hover:text-primary hover:underline underline-offset-8 decoration-2 transition-all cursor-pointer">{t("nav.skincare")}</Link>
          <Link href="#" className="hover:text-primary hover:underline underline-offset-8 decoration-2 transition-all cursor-pointer">{t("nav.sunscreens")}</Link>
          <Link href="#" className="hover:text-primary hover:underline underline-offset-8 decoration-2 transition-all cursor-pointer">{t("nav.essences")}</Link>
          <Link href="#pet" className="hover:text-primary hover:underline underline-offset-8 decoration-2 transition-all cursor-pointer">{t("nav.petcare")}</Link>
          <Link href="#" className="hover:text-primary hover:underline underline-offset-8 decoration-2 transition-all cursor-pointer">{t("nav.brands")}</Link>
          <Link href="#" className="text-destructive hover:underline underline-offset-8 decoration-2 transition-all cursor-pointer">{t("nav.offers")}</Link>
        </nav>

        {isSearchOpen && (
          <div className="md:hidden border-t bg-white py-4 px-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder={t("search.short")}
                className="w-full bg-[#f5f5f5] border-none px-4 py-2.5 text-sm rounded-none focus:outline-none"
                autoFocus
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}
      </header>

      <main className="bg-white">
        {children}
      </main>

      <footer className="bg-[#f5f5f5] pt-16 pb-8 mt-0 border-t border-[#e5e5e5]">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4">{t("footer.customerService")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-black">{t("footer.helpCentre")}</Link></li>
              <li><Link href="#" className="hover:text-black">{t("footer.deliveryInfo")}</Link></li>
              <li><Link href="#" className="hover:text-black">{t("footer.returnsPolicy")}</Link></li>
              <li><Link href="#" className="hover:text-black">{t("footer.trackOrder")}</Link></li>
              <li><a href="https://wa.me/85294448661" target="_blank" rel="noopener noreferrer" className="hover:text-black">{t("footer.contactWhatsapp")}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-4">{t("footer.aboutUs")}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-black">{t("footer.ourStory")}</Link></li>
              <li><Link href="#" className="hover:text-black">{t("footer.authenticity")}</Link></li>
              <li><Link href="#" className="hover:text-black">{t("footer.affiliates")}</Link></li>
              <li><Link href="#" className="hover:text-black">{t("footer.careers")}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 bg-white p-6 border text-center flex flex-col items-center justify-center">
            <h4 className="font-bold uppercase tracking-wider text-sm mb-2">{t("footer.secureShopping")}</h4>
            <p className="text-xs text-muted-foreground mb-4">{t("footer.secureDesc")}</p>
            <div className="flex gap-4 items-center text-muted-foreground/60">
               <FaCcVisa className="h-8 w-8 hover:text-black transition-colors" title="Visa" />
               <FaCcMastercard className="h-8 w-8 hover:text-black transition-colors" title="Mastercard" />
               <FaAlipay className="h-8 w-8 hover:text-black transition-colors" title="Alipay" />
               <FaWeixin className="h-8 w-8 hover:text-black transition-colors" title="WeChat Pay" />
               <div className="flex flex-col justify-center items-center h-8 px-2 border border-current rounded font-bold text-[10px] hover:text-black transition-colors">
                 EPS
               </div>
               <div className="flex flex-col justify-center items-center h-8 px-2 border border-current rounded font-bold text-[10px] hover:text-black transition-colors">
                 OCTOPUS
               </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 text-center border-t border-[#e5e5e5] pt-8">
          <h1 className="font-serif text-2xl font-black tracking-tight uppercase text-black/20 mb-4">
            Beauty&Beast
          </h1>
          <p className="text-xs text-muted-foreground">
            {t("footer.copyright")}
          </p>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  );
}
