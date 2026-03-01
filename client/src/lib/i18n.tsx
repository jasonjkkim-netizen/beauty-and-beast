import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Language = "en" | "zh";

const translations = {
  en: {
    "nav.help": "Help & Advice",
    "nav.delivery": "Delivery & Returns",
    "nav.account": "Account",
    "nav.skincare": "Skincare",
    "nav.sunscreens": "Sunscreens",
    "nav.essences": "Essences",
    "nav.petcare": "Pet Care",
    "nav.brands": "Brands",
    "nav.offers": "Offers",
    "search.placeholder": "Search products, brands or concerns...",
    "search.short": "Search...",
    "cart.bag": "Bag",
    "cart.yourBag": "Your Bag",
    "cart.empty": "Your bag is empty",
    "cart.emptyHint": "Add some products to get started",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.free": "FREE",
    "cart.freeShippingHint": "Spend HK${amount} more for free shipping",
    "cart.total": "Total",
    "cart.checkout": "CHECKOUT",
    "cart.processing": "PROCESSING...",
    "cart.securePay": "Secure payment via Stripe",
    "cart.checkoutFailed": "Checkout failed. Please try again.",
    "product.addToBag": "ADD TO BAG",
    "product.offer": "Offer",
    "hero.newIn": "New In",
    "hero.title": "Beauty & Beast",
    "hero.subtitle": "Premium Korean skincare for you, and the finest care products for your furry companion.",
    "hero.shopEdit": "SHOP THE EDIT",
    "home.feature1": "Authenticity guaranteed",
    "home.feature2": "Free HK delivery over HK$500",
    "home.feature3": "Trusted since 2024",
    "home.trending": "Trending Skincare",
    "home.viewAllSkincare": "VIEW ALL SKINCARE",
    "home.seasonal": "Seasonal Specials",
    "home.seasonalDesc": "Enjoy up to 30% off our curated selection of skincare essentials and premium pet products.",
    "home.discoverOffers": "DISCOVER OFFERS",
    "home.spf": "Sun Protection Essentials",
    "home.shopSpf": "SHOP SPF",
    "home.petCare": "Pet Care",
    "home.petCareDesc": "Premium products for your furry family members",
    "home.viewAllPet": "VIEW ALL PET CARE",
    "home.community": "Join the Beauty & Beast Community",
    "home.communityDesc": "Sign up for exclusive offers, new product launches, and expert tips for you and your pet.",
    "home.emailPlaceholder": "Enter your email address",
    "home.subscribe": "SUBSCRIBE",
    "footer.customerService": "Customer Service",
    "footer.helpCentre": "Help Centre",
    "footer.deliveryInfo": "Delivery Information",
    "footer.returnsPolicy": "Returns Policy",
    "footer.trackOrder": "Track My Order",
    "footer.contactWhatsapp": "Contact Us (WhatsApp)",
    "footer.aboutUs": "About Us",
    "footer.ourStory": "Our Story",
    "footer.authenticity": "Authenticity Guarantee",
    "footer.affiliates": "Affiliates",
    "footer.careers": "Careers",
    "footer.secureShopping": "Secure Shopping",
    "footer.secureDesc": "We use industry standard encryption to protect your details.",
    "footer.copyright": "\u00a9 2026 Beauty & Beast. All Rights Reserved.",
    "success.title": "Order Confirmed",
    "success.message": "Thank you for your purchase! We've received your order and will begin processing it shortly.",
    "success.email": "A confirmation email will be sent to you with your order details and tracking information.",
    "success.continue": "CONTINUE SHOPPING",
    "success.help": "Need help?",
    "success.contact": "Contact us on WhatsApp",
    "cancel.title": "Payment Cancelled",
    "cancel.message": "Your payment was cancelled. No charges have been made. Your bag items are still saved if you'd like to try again.",
    "cancel.back": "BACK TO SHOP",
    "cancel.trouble": "Having trouble?",
    "cancel.contact": "Contact us on WhatsApp",
    "notfound.title": "404 Page Not Found",
    "notfound.message": "The page you're looking for doesn't exist.",
    "whatsapp.defaultMessage": "Hi! I'm interested in Beauty & Beast products.",
    "whatsapp.title": "Chat with us on WhatsApp",
    "lang.switch": "\u4e2d\u6587",
  },
  zh: {
    "nav.help": "\u5e6b\u52a9\u8207\u5efa\u8b70",
    "nav.delivery": "\u9001\u8ca8\u8207\u9000\u8ca8",
    "nav.account": "\u5e33\u6236",
    "nav.skincare": "\u8b77\u819a",
    "nav.sunscreens": "\u9632\u66ec",
    "nav.essences": "\u7cbe\u83ef",
    "nav.petcare": "\u5bf5\u7269\u8b77\u7406",
    "nav.brands": "\u54c1\u724c",
    "nav.offers": "\u512a\u60e0",
    "search.placeholder": "\u641c\u5c0b\u7522\u54c1\u3001\u54c1\u724c\u6216\u8b77\u819a\u554f\u984c...",
    "search.short": "\u641c\u5c0b...",
    "cart.bag": "\u8cfc\u7269\u888b",
    "cart.yourBag": "\u60a8\u7684\u8cfc\u7269\u888b",
    "cart.empty": "\u60a8\u7684\u8cfc\u7269\u888b\u662f\u7a7a\u7684",
    "cart.emptyHint": "\u6dfb\u52a0\u4e00\u4e9b\u7522\u54c1\u958b\u59cb\u8cfc\u7269",
    "cart.subtotal": "\u5c0f\u8a08",
    "cart.shipping": "\u904b\u8cbb",
    "cart.free": "\u514d\u904b\u8cbb",
    "cart.freeShippingHint": "\u518d\u6d88\u8cbb HK${amount} \u5373\u53ef\u514d\u904b",
    "cart.total": "\u7e3d\u8a08",
    "cart.checkout": "\u7d50\u8cec",
    "cart.processing": "\u8655\u7406\u4e2d...",
    "cart.securePay": "\u900f\u904e Stripe \u5b89\u5168\u4ed8\u6b3e",
    "cart.checkoutFailed": "\u7d50\u8cec\u5931\u6557\uff0c\u8acb\u91cd\u8a66\u3002",
    "product.addToBag": "\u52a0\u5165\u8cfc\u7269\u888b",
    "product.offer": "\u512a\u60e0",
    "hero.newIn": "\u65b0\u54c1\u4e0a\u67b6",
    "hero.title": "Beauty & Beast",
    "hero.subtitle": "\u70ba\u60a8\u63d0\u4f9b\u512a\u8cea\u97d3\u570b\u8b77\u819a\u54c1\uff0c\u4ee5\u53ca\u70ba\u60a8\u7684\u6bdb\u5b69\u63d0\u4f9b\u6700\u597d\u7684\u8b77\u7406\u7522\u54c1\u3002",
    "hero.shopEdit": "\u7cbe\u9078\u63a8\u85a6",
    "home.feature1": "\u6b63\u54c1\u4fdd\u8b49",
    "home.feature2": "\u6e9f\u5340\u8cfc\u7269\u6eff HK$500 \u514d\u904b",
    "home.feature3": "\u81ea 2024 \u5e74\u503c\u5f97\u4fe1\u8cf4",
    "home.trending": "\u71b1\u9580\u8b77\u819a",
    "home.viewAllSkincare": "\u67e5\u770b\u6240\u6709\u8b77\u819a\u54c1",
    "home.seasonal": "\u5b63\u7bc0\u7279\u60e0",
    "home.seasonalDesc": "\u7cbe\u9078\u8b77\u819a\u5fc5\u5099\u54c1\u548c\u512a\u8cea\u5bf5\u7269\u7528\u54c1\u6700\u9ad8\u4eab\u4e09\u6298\u512a\u60e0\u3002",
    "home.discoverOffers": "\u63a2\u7d22\u512a\u60e0",
    "home.spf": "\u9632\u66ec\u5fc5\u5099",
    "home.shopSpf": "\u9078\u8cfc\u9632\u66ec",
    "home.petCare": "\u5bf5\u7269\u8b77\u7406",
    "home.petCareDesc": "\u70ba\u60a8\u7684\u6bdb\u5b69\u63d0\u4f9b\u512a\u8cea\u7522\u54c1",
    "home.viewAllPet": "\u67e5\u770b\u6240\u6709\u5bf5\u7269\u7528\u54c1",
    "home.community": "\u52a0\u5165 Beauty & Beast \u793e\u7fa4",
    "home.communityDesc": "\u8a3b\u518a\u7372\u53d6\u7368\u5bb6\u512a\u60e0\u3001\u65b0\u54c1\u4e0a\u67b6\u4ee5\u53ca\u5c08\u5bb6\u8b77\u819a\u548c\u5bf5\u7269\u8b77\u7406\u8cbc\u58eb\u3002",
    "home.emailPlaceholder": "\u8f38\u5165\u60a8\u7684\u96fb\u5b50\u90f5\u4ef6\u5730\u5740",
    "home.subscribe": "\u8a02\u95b1",
    "footer.customerService": "\u5ba2\u6236\u670d\u52d9",
    "footer.helpCentre": "\u5e6b\u52a9\u4e2d\u5fc3",
    "footer.deliveryInfo": "\u9001\u8ca8\u8cc7\u8a0a",
    "footer.returnsPolicy": "\u9000\u8ca8\u653f\u7b56",
    "footer.trackOrder": "\u8ffd\u8e64\u8a02\u55ae",
    "footer.contactWhatsapp": "\u806f\u7e6b\u6211\u5011 (WhatsApp)",
    "footer.aboutUs": "\u95dc\u65bc\u6211\u5011",
    "footer.ourStory": "\u6211\u5011\u7684\u6545\u4e8b",
    "footer.authenticity": "\u6b63\u54c1\u4fdd\u8b49",
    "footer.affiliates": "\u806f\u76df\u8a08\u5283",
    "footer.careers": "\u62db\u8058",
    "footer.secureShopping": "\u5b89\u5168\u8cfc\u7269",
    "footer.secureDesc": "\u6211\u5011\u63a1\u7528\u696d\u754c\u6a19\u6e96\u52a0\u5bc6\u6280\u8853\u4fdd\u8b77\u60a8\u7684\u8cc7\u6599\u3002",
    "footer.copyright": "\u00a9 2026 Beauty & Beast\u3002\u7248\u6b0a\u6240\u6709\u3002",
    "success.title": "\u8a02\u55ae\u5df2\u78ba\u8a8d",
    "success.message": "\u611f\u8b1d\u60a8\u7684\u8cfc\u8cb7\uff01\u6211\u5011\u5df2\u6536\u5230\u60a8\u7684\u8a02\u55ae\uff0c\u5373\u5c07\u958b\u59cb\u8655\u7406\u3002",
    "success.email": "\u78ba\u8a8d\u96fb\u5b50\u90f5\u4ef6\u5c07\u767c\u9001\u7d66\u60a8\uff0c\u5305\u542b\u8a02\u55ae\u8a73\u60c5\u548c\u7269\u6d41\u8cc7\u8a0a\u3002",
    "success.continue": "\u7e7c\u7e8c\u8cfc\u7269",
    "success.help": "\u9700\u8981\u5e6b\u52a9\uff1f",
    "success.contact": "\u900f\u904e WhatsApp \u806f\u7e6b\u6211\u5011",
    "cancel.title": "\u4ed8\u6b3e\u5df2\u53d6\u6d88",
    "cancel.message": "\u60a8\u7684\u4ed8\u6b3e\u5df2\u53d6\u6d88\uff0c\u672a\u6536\u53d6\u4efb\u4f55\u8cbb\u7528\u3002\u60a8\u7684\u8cfc\u7269\u888b\u7522\u54c1\u5df2\u4fdd\u5b58\uff0c\u53ef\u96a8\u6642\u91cd\u8a66\u3002",
    "cancel.back": "\u8fd4\u56de\u5546\u5e97",
    "cancel.trouble": "\u9047\u5230\u554f\u984c\uff1f",
    "cancel.contact": "\u900f\u904e WhatsApp \u806f\u7e6b\u6211\u5011",
    "notfound.title": "404 \u627e\u4e0d\u5230\u9801\u9762",
    "notfound.message": "\u60a8\u8981\u627e\u7684\u9801\u9762\u4e0d\u5b58\u5728\u3002",
    "whatsapp.defaultMessage": "\u4f60\u597d\uff01\u6211\u5c0d Beauty & Beast \u7684\u7522\u54c1\u6709\u8208\u8da3\u3002",
    "whatsapp.title": "\u900f\u904e WhatsApp \u806f\u7e6b\u6211\u5011",
    "lang.switch": "EN",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bb_lang");
      if (saved === "zh" || saved === "en") return saved;
    }
    return "en";
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("bb_lang", newLang);
  }, []);

  const t = useCallback((key: TranslationKey, vars?: Record<string, string | number>): string => {
    let text: string = translations[lang][key] || translations.en[key] || key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`\${${k}}`, String(v));
      });
    }
    return text;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
