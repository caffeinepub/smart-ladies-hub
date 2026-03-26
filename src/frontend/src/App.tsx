import {
  ChevronRight,
  Heart,
  Menu,
  Phone,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { ProductGrid } from "./components/ProductGrid";
import { useActor } from "./hooks/useActor";

// Product data
const LADIES_PRODUCTS = [
  { name: "Banarasi Silk Saree", price: 1299 },
  { name: "Cotton Printed Kurti", price: 449 },
  { name: "Palazzo Set", price: 699 },
  { name: "Designer Lehenga", price: 2499 },
  { name: "Casual Tops (3 pcs)", price: 599 },
];
const ACCESSORIES_PRODUCTS = [
  { name: "Handbag (Stylish)", price: 799 },
  { name: "Sunglasses", price: 299 },
  { name: "Hair Accessories Set", price: 199 },
  { name: "Stylish Belt", price: 249 },
  { name: "Scarf / Dupatta", price: 349 },
];
const JEWELLERY_PRODUCTS = [
  { name: "Gold Plated Necklace Set", price: 599 },
  { name: "Jhumka Earrings", price: 299 },
  { name: "Artificial Bangles Set", price: 199 },
  { name: "Stud Earrings", price: 149 },
  { name: "Bracelet", price: 249 },
];
const DAILY_PRODUCTS = [
  { name: "Cotton Bedsheet Set", price: 699 },
  { name: "Kitchen Apron", price: 199 },
  { name: "Cosmetic Pouch", price: 299 },
  { name: "Hair Towel", price: 149 },
  { name: "Wallet", price: 349 },
];
const OFFERS_PRODUCTS = [
  { name: "Combo: Kurti + Dupatta", price: 799, originalPrice: 1199 },
  { name: "Saree Combo (2 pcs)", price: 1499, originalPrice: 2199 },
  { name: "Jewellery Set (5 pcs)", price: 499, originalPrice: 799 },
  { name: "Accessories Bundle", price: 599, originalPrice: 999 },
];

const WA_LINK =
  "https://wa.me/919881293029?text=Hello%2C%20I%20want%20to%20order%20Jewellery%20%2F%20Items%20from%20Smart%20Ladies%20Hub%20%F0%9F%98%8A";

const navLinks = [
  { label: "Home", sub: "Welcome", href: "#home" },
  { label: "LADIES COLLECTION", sub: "Saree, Kurtis", href: "#ladies" },
  { label: "ACCESSORIES", sub: "Bags, Cosmetics", href: "#accessories" },
  { label: "JEWELLERY", sub: "Gold, Artificial", href: "#jewellery" },
  { label: "DAILY USE", sub: "Bags, Combos", href: "#daily" },
  { label: "OFFERS ZONE", sub: "Deals & Festival", href: "#offers" },
];

function WhatsAppButton({
  label = "Order on WhatsApp",
  className = "",
  href,
}: { label?: string; className?: string; href?: string }) {
  return (
    <a
      href={href ?? WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      data-ocid="whatsapp.primary_button"
      className={`inline-flex items-center gap-2 bg-whatsapp text-white font-semibold rounded-full px-5 py-2.5 text-sm shadow-md hover:brightness-110 transition-all duration-200 active:scale-95 ${className}`}
    >
      <svg
        role="img"
        aria-label="WhatsApp"
        viewBox="0 0 24 24"
        className="w-4 h-4 fill-current flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {label}
    </a>
  );
}

function ShareButton({
  className = "",
  label,
}: { className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Smart Ladies Hub",
      text: "Check out Smart Ladies Hub – Fashion, Jewellery & Accessories!",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      data-ocid="share.button"
      className={`inline-flex items-center gap-2 border-2 border-maroon text-maroon font-semibold rounded-full px-4 py-2 text-sm hover:bg-maroon hover:text-white transition-all duration-200 active:scale-95 ${className}`}
    >
      <Share2 className="w-4 h-4 flex-shrink-0" />
      {copied ? (
        <span className="text-xs">Copied!</span>
      ) : label ? (
        <span className="hidden sm:inline">{label}</span>
      ) : (
        <span className="hidden sm:inline">Share</span>
      )}
    </button>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { actor } = useActor();
  const [announcement, setAnnouncement] = useState("");
  const [waLink, setWaLink] = useState(WA_LINK);

  useEffect(() => {
    if (!actor) return;
    actor
      .getStorePublicContent()
      .then((data) => {
        if (data.announcement) setAnnouncement(data.announcement);
        if (data.whatsapp) {
          const msg = encodeURIComponent(
            "Hello, I want to order Jewellery / Items from Smart Ladies Hub 😊",
          );
          setWaLink(`https://wa.me/${data.whatsapp}?text=${msg}`);
        }
      })
      .catch(() => {});
  }, [actor]);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Top tagline strip / announcement */}
      <div className="bg-maroon text-white text-center text-xs sm:text-sm py-2 px-4 tracking-wide">
        {announcement || "Style, Fashion & Jewellery – All in One Place"}
      </div>

      {/* Sticky header */}
      <header
        className="sticky top-0 z-50 bg-ivory shadow-card border-b border-border"
        data-ocid="header.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 gap-4">
            {/* Brand */}
            <a
              href="#home"
              className="flex items-center gap-3 no-underline"
              data-ocid="nav.link"
            >
              <div className="w-10 h-10 rounded-full bg-maroon flex items-center justify-center flex-shrink-0">
                <span className="text-gold text-lg">💎</span>
              </div>
              <div>
                <div className="font-display font-bold text-maroon uppercase text-base sm:text-xl tracking-widest leading-tight">
                  Smart Ladies Hub
                </div>
                <div className="text-muted-foreground text-[10px] sm:text-xs tracking-wide">
                  Fashion · Jewellery · Accessories
                </div>
              </div>
            </a>

            {/* Desktop nav */}
            <nav
              className="hidden lg:flex items-center gap-1"
              data-ocid="nav.section"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  data-ocid="nav.link"
                  className="flex flex-col items-center px-3 py-1.5 rounded-lg hover:bg-beige transition-colors group"
                >
                  <span className="text-xs font-semibold text-maroon tracking-wide group-hover:text-maroon-mid">
                    {link.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground">
                    {link.sub}
                  </span>
                </a>
              ))}
            </nav>

            {/* CTA + share + mobile menu */}
            <div className="flex items-center gap-2">
              <WhatsAppButton href={waLink} className="hidden sm:inline-flex" />
              <ShareButton />
              <a
                href="/admin"
                data-ocid="admin.link"
                title="Admin Panel"
                className="p-2 rounded-lg hover:bg-beige transition-colors text-muted-foreground hover:text-maroon"
              >
                <ShieldCheck className="w-5 h-5" />
              </a>
              <button
                type="button"
                className="lg:hidden p-2 rounded-lg hover:bg-beige transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                data-ocid="nav.toggle"
              >
                {menuOpen ? (
                  <X className="w-5 h-5 text-maroon" />
                ) : (
                  <Menu className="w-5 h-5 text-maroon" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-ivory border-t border-border overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    data-ocid="nav.link"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-beige transition-colors"
                  >
                    <span className="font-semibold text-maroon text-sm">
                      {link.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {link.sub}
                    </span>
                  </a>
                ))}
                <div className="pt-2 pb-1 flex gap-2">
                  <WhatsAppButton
                    href={waLink}
                    className="flex-1 justify-center"
                  />
                  <ShareButton
                    label="Share App"
                    className="flex-1 justify-center"
                  />
                  <a
                    href="/admin"
                    data-ocid="admin.link"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-border text-muted-foreground hover:text-maroon hover:border-maroon transition-colors text-sm font-semibold"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero section */}
        <section
          id="home"
          className="relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.21 0.11 15) 0%, oklch(0.285 0.13 15) 50%, oklch(0.31 0.12 20) 100%)",
          }}
        >
          {/* Decorative pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, oklch(0.72 0.1 78) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.72 0.1 78) 0%, transparent 40%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Text */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="text-white space-y-6"
              >
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-gold text-sm font-semibold border border-gold/30">
                  <Star className="w-3.5 h-3.5 fill-current" /> Premium Indian
                  Fashion Store
                </div>
                <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-5xl lg:text-6xl leading-tight">
                  Elevate Your
                  <span className="text-gold block">Elegance.</span>
                </h1>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                  Explore the finest Saree &amp; Jewelry Collection. From
                  traditional to modern — we have everything for the smart,
                  stylish woman.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="#ladies"
                    data-ocid="hero.primary_button"
                    className="inline-flex items-center justify-center gap-2 bg-gold text-white font-semibold rounded-full px-7 py-3 text-sm shadow-gold hover:brightness-110 transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4" /> Shop New Arrivals
                  </a>
                  <WhatsAppButton href={waLink} label="Order on WhatsApp" />
                </div>
                <div className="flex items-center gap-6 pt-2">
                  <div className="text-center">
                    <div className="text-gold font-bold text-xl">500+</div>
                    <div className="text-white/60 text-xs">Products</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-gold font-bold text-xl">1000+</div>
                    <div className="text-white/60 text-xs">Happy Customers</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-gold font-bold text-xl">Fast</div>
                    <div className="text-white/60 text-xs">Delivery</div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Image */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-gold/30">
                  <img
                    src="/assets/generated/hero-saree.dim_800x600.jpg"
                    alt="Elegant Indian woman in saree"
                    className="w-full h-72 sm:h-80 md:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon/30 to-transparent" />
                </div>
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-card-hover"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-maroon rounded-full flex items-center justify-center text-white text-xs">
                      💎
                    </div>
                    <div>
                      <div className="font-bold text-maroon text-xs">
                        Jewellery
                      </div>
                      <div className="text-muted-foreground text-[10px]">
                        NEW Collection
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-14 px-4 sm:px-6 bg-beige">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-maroon uppercase tracking-widest">
                Featured Categories
              </h2>
              <div className="mt-2 mx-auto w-16 h-0.5 bg-gold rounded-full" />
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                {
                  title: "Ladies Collection",
                  subtitle: "Saree, Kurtis",
                  href: "#ladies",
                  image: "/assets/generated/ladies-collection.dim_600x400.jpg",
                },
                {
                  title: "Accessories",
                  subtitle: "Handbags, Purses",
                  href: "#accessories",
                  image: "/assets/generated/accessories.dim_600x400.jpg",
                },
                {
                  title: "Jewellery",
                  subtitle: "Necklace, Bangles",
                  href: "#jewellery",
                  image:
                    "/assets/generated/jewellery-collection.dim_600x400.jpg",
                  badge: "NEW 🔥",
                },
                {
                  title: "Daily Use",
                  subtitle: "Bags, Combos",
                  href: "#daily",
                },
                {
                  title: "Offers Zone",
                  subtitle: "Deals & Festival",
                  href: "#offers",
                  image: "/assets/generated/festival-offers.dim_600x300.jpg",
                },
              ].map((cat, i) => (
                <motion.a
                  key={cat.title}
                  href={cat.href}
                  data-ocid={`categories.item.${i + 1}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ scale: 1.05, y: -4 }}
                  className="relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover cursor-pointer group block"
                  style={{ minHeight: 180 }}
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-maroon to-maroon-mid" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                  <div
                    className="relative p-4 flex flex-col justify-end"
                    style={{ minHeight: 180 }}
                  >
                    {cat.badge && (
                      <span className="absolute top-2 right-2 bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {cat.badge}
                      </span>
                    )}
                    <h3 className="font-display font-bold text-white text-sm sm:text-base leading-tight">
                      {cat.title}
                    </h3>
                    <p className="text-white/70 text-xs mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Jewellery Collection */}
        <section id="jewellery" className="py-14 px-4 sm:px-6 bg-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 bg-gold/10 rounded-full px-4 py-1 mb-3">
                <span className="text-gold text-sm font-semibold">
                  NEW ARRIVAL 🔥
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-maroon uppercase tracking-widest">
                💎 Jewellery Collection
              </h2>
              <div className="mt-2 mx-auto w-16 h-0.5 bg-gold rounded-full" />
              <p className="mt-3 text-muted-foreground text-sm max-w-md mx-auto">
                Stunning gold plated and artificial jewellery — from delicate
                jhumkas to bold necklace sets
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden shadow-card-hover"
              >
                <img
                  src="/assets/generated/jewellery-collection.dim_600x400.jpg"
                  alt="Jewellery Collection"
                  className="w-full h-64 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="font-display font-bold text-2xl">
                      Gold &amp; Artificial
                    </div>
                    <div className="text-white/80 text-sm mt-1">
                      Premium quality at unbeatable prices
                    </div>
                  </div>
                </div>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-center">
                {[
                  {
                    title: "Gold Plated Jewellery",
                    icon: "✨",
                    desc: "Premium 24K gold plated sets",
                  },
                  {
                    title: "Artificial Jewellery",
                    icon: "💫",
                    desc: "Trendy & affordable pieces",
                  },
                  {
                    title: "Earrings (Jhumka, Studs)",
                    icon: "👂",
                    desc: "Traditional & modern styles",
                  },
                  {
                    title: "Necklace Sets",
                    icon: "📿",
                    desc: "Complete bridal & party sets",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.03 }}
                    data-ocid={`jewellery.item.${i + 1}`}
                    className="bg-maroon rounded-2xl p-4 shadow-card hover:shadow-card-hover cursor-pointer group transition-all duration-200"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-white text-sm">
                      {item.title}
                    </div>
                    <div className="text-white/60 text-xs mt-1">
                      {item.desc}
                    </div>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 bg-gold/90 text-white text-xs font-semibold px-3 py-1 rounded-full hover:bg-gold transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Order Now <ChevronRight className="w-3 h-3" />
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bangles card full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              data-ocid="jewellery.item.5"
              className="bg-maroon rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-card hover:shadow-card-hover cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">⚡</span>
                <div>
                  <div className="font-display font-bold text-white text-xl">
                    Bangles &amp; Bracelets
                  </div>
                  <div className="text-white/70 text-sm mt-1">
                    Beautiful handcrafted bangles &amp; stylish bracelets — from
                    casual to bridal
                  </div>
                </div>
              </div>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold text-white font-semibold px-5 py-2.5 rounded-full text-sm shadow-gold hover:brightness-110 transition-all flex-shrink-0"
              >
                Order on WhatsApp <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Product price list */}
            <ProductGrid
              products={JEWELLERY_PRODUCTS}
              scopePrefix="jewellery_products"
            />
          </div>
        </section>

        {/* Ladies Collection */}
        <section id="ladies" className="py-14 px-4 sm:px-6 bg-beige">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-maroon uppercase tracking-widest">
                👗 Ladies Collection
              </h2>
              <div className="mt-2 mx-auto w-16 h-0.5 bg-gold rounded-full" />
              <p className="mt-3 text-muted-foreground text-sm">
                Premium sarees, kurtis & dress materials for every occasion
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden shadow-card-hover"
              >
                <img
                  src="/assets/generated/ladies-collection.dim_600x400.jpg"
                  alt="Ladies Collection"
                  className="w-full h-64 sm:h-72 object-cover"
                />
              </motion.div>
              <div className="grid grid-cols-1 gap-4 content-center">
                {[
                  {
                    title: "Saree",
                    icon: "🥻",
                    desc: "Silk, cotton, georgette & more — for every event",
                    badge: "Bestseller",
                  },
                  {
                    title: "Kurtis",
                    icon: "👘",
                    desc: "Casual to festive kurtis in all sizes & prints",
                  },
                  {
                    title: "Dress Material",
                    icon: "🎀",
                    desc: "Unstitched fabric sets with beautiful designs",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                    data-ocid={`ladies.item.${i + 1}`}
                    className="bg-card rounded-2xl p-4 shadow-card hover:shadow-card-hover flex items-center gap-4 cursor-pointer group border border-border/50"
                  >
                    <div className="w-12 h-12 bg-maroon/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-maroon">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] bg-gold text-white px-2 py-0.5 rounded-full font-semibold">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 bg-maroon text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Order
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Product price list */}
            <ProductGrid
              products={LADIES_PRODUCTS}
              scopePrefix="ladies_products"
            />
          </div>
        </section>

        {/* Accessories */}
        <section id="accessories" className="py-14 px-4 sm:px-6 bg-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-maroon uppercase tracking-widest">
                👜 Accessories
              </h2>
              <div className="mt-2 mx-auto w-16 h-0.5 bg-gold rounded-full" />
              <p className="mt-3 text-muted-foreground text-sm">
                Complete your look with our premium accessories
              </p>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="grid grid-cols-1 gap-4 content-center">
                {[
                  {
                    title: "Handbags",
                    icon: "👜",
                    desc: "Stylish everyday bags — tote, clutch & shoulder bags",
                  },
                  {
                    title: "Cosmetics",
                    icon: "💄",
                    desc: "Makeup & beauty essentials for the modern woman",
                  },
                  {
                    title: "Ladies Purse",
                    icon: "👛",
                    desc: "Compact & elegant wallets and purses",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ x: 4 }}
                    data-ocid={`accessories.item.${i + 1}`}
                    className="bg-card rounded-2xl p-4 shadow-card hover:shadow-card-hover flex items-center gap-4 cursor-pointer group border border-border/50"
                  >
                    <div className="w-12 h-12 bg-maroon/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-maroon">
                        {item.title}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 bg-maroon text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Order
                    </a>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden shadow-card-hover"
              >
                <img
                  src="/assets/generated/accessories.dim_600x400.jpg"
                  alt="Accessories Collection"
                  className="w-full h-64 sm:h-72 object-cover"
                />
              </motion.div>
            </div>

            {/* Product price list */}
            <ProductGrid
              products={ACCESSORIES_PRODUCTS}
              scopePrefix="accessories_products"
            />
          </div>
        </section>

        {/* Daily Use Items */}
        <section id="daily" className="py-14 px-4 sm:px-6 bg-beige">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-maroon uppercase tracking-widest">
                🎒 Daily Use Items
              </h2>
              <div className="mt-2 mx-auto w-16 h-0.5 bg-gold rounded-full" />
            </motion.div>
            <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[
                {
                  title: "School Bags",
                  icon: "🎒",
                  desc: "Durable, spacious & colourful school bags for kids & teens",
                  badge: "Popular",
                },
                {
                  title: "Combo Packs",
                  icon: "📦",
                  desc: "Value-packed combo deals — jewellery, accessories & more",
                  badge: "Best Value",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  data-ocid={`daily.item.${i + 1}`}
                  className="bg-maroon rounded-2xl p-6 shadow-card-hover cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-3 right-3 bg-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </div>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <div className="font-display font-bold text-white text-xl">
                    {item.title}
                  </div>
                  <div className="text-white/70 text-sm mt-2">{item.desc}</div>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all"
                  >
                    Order on WhatsApp <ChevronRight className="w-3 h-3" />
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Product price list */}
            <ProductGrid
              products={DAILY_PRODUCTS}
              scopePrefix="daily_products"
            />
          </div>
        </section>

        {/* Offers Zone */}
        <section id="offers" className="py-14 px-4 sm:px-6 bg-cream">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-maroon uppercase tracking-widest">
                🎁 Offers Zone
              </h2>
              <div className="mt-2 mx-auto w-16 h-0.5 bg-gold rounded-full" />
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Today's Deals */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                data-ocid="offers.item.1"
                className="bg-maroon rounded-2xl p-6 shadow-card-hover relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full translate-x-8 -translate-y-8" />
                <div className="relative">
                  <div className="inline-flex items-center gap-1 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    🔥 LIMITED TIME
                  </div>
                  <h3 className="font-display font-bold text-white text-2xl">
                    Today&apos;s Deals
                  </h3>
                  <p className="text-white/70 text-sm mt-2 mb-4">
                    Fresh deals every day on sarees, jewellery & accessories.
                    Don&apos;t miss out!
                  </p>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ocid="offers.primary_button"
                    className="inline-flex items-center gap-2 bg-gold text-white font-semibold px-5 py-2.5 rounded-full text-sm shadow-gold hover:brightness-110 transition-all"
                  >
                    👉 Order Now
                  </a>
                </div>
              </motion.div>

              {/* Festival Offers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                data-ocid="offers.item.2"
                className="rounded-2xl overflow-hidden shadow-card-hover relative"
              >
                <img
                  src="/assets/generated/festival-offers.dim_600x300.jpg"
                  alt="Festival Offers"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-maroon/90 to-maroon/50" />
                <div className="relative p-6">
                  <div className="inline-flex items-center gap-1 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    🎉 FESTIVAL SPECIAL
                  </div>
                  <h3 className="font-display font-bold text-white text-2xl">
                    Festival Offers
                  </h3>
                  <div className="text-gold font-bold text-3xl mt-1">
                    UP TO 50% OFF
                  </div>
                  <p className="text-white/70 text-sm mt-2 mb-4">
                    Diwali, Eid, Navratri & more — celebrate with amazing
                    savings!
                  </p>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gold text-white font-semibold px-5 py-2.5 rounded-full text-sm shadow-gold hover:brightness-110 transition-all"
                  >
                    👉 Order Now
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Product price list */}
            <ProductGrid
              products={OFFERS_PRODUCTS}
              scopePrefix="offers_products"
            />
          </div>
        </section>

        {/* Order Now CTA */}
        <section
          id="order"
          className="py-16 px-4 sm:px-6"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.21 0.11 15), oklch(0.285 0.13 15))",
          }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="text-5xl">💎</div>
              <h2 className="font-display font-bold text-white text-3xl sm:text-4xl">
                Ready to Shop?
              </h2>
              <p className="text-white/75 text-base sm:text-lg">
                Order directly on WhatsApp for fast, personal service.
                We&apos;ll help you find exactly what you&apos;re looking for!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="cta.primary_button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center justify-center gap-3 bg-whatsapp text-white font-bold rounded-full px-8 py-4 text-lg shadow-xl hover:brightness-110 transition-all"
                >
                  <svg
                    role="img"
                    aria-label="WhatsApp"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  👉 Order on WhatsApp
                </motion.a>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ShareButton
                    label="Share App"
                    className="border-white/60 text-white hover:bg-white/15 hover:text-white px-8 py-4 text-base font-bold"
                  />
                </motion.div>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                <Phone className="w-4 h-4" />
                <span>WhatsApp: +91 98812 93029</span>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[oklch(0.22_0_0)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-maroon flex items-center justify-center">
                  <span className="text-gold">💎</span>
                </div>
                <div className="font-display font-bold text-gold uppercase tracking-widest text-sm">
                  Smart Ladies Hub
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Your one-stop destination for premium Indian fashion, jewellery
                &amp; accessories.
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-whatsapp rounded-full flex items-center justify-center hover:brightness-110 transition-all"
                >
                  <svg
                    role="img"
                    aria-label="WhatsApp"
                    viewBox="0 0 24 24"
                    className="w-4 h-4 fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-gold uppercase tracking-widest text-xs mb-4">
                Categories
              </h4>
              <ul className="space-y-2 text-white/60 text-sm">
                {[
                  "Saree",
                  "Kurtis",
                  "Dress Material",
                  "Handbags",
                  "Cosmetics",
                ].map((cat) => (
                  <li key={cat}>
                    <a
                      href="#ladies"
                      className="hover:text-gold transition-colors"
                    >
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Jewellery */}
            <div>
              <h4 className="font-semibold text-gold uppercase tracking-widest text-xs mb-4">
                Jewellery
              </h4>
              <ul className="space-y-2 text-white/60 text-sm">
                {[
                  "Gold Plated",
                  "Artificial Jewellery",
                  "Earrings & Jhumka",
                  "Necklace Sets",
                  "Bangles & Bracelets",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#jewellery"
                      className="hover:text-gold transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-gold uppercase tracking-widest text-xs mb-4">
                Contact Us
              </h4>
              <ul className="space-y-3 text-white/60 text-sm">
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>WhatsApp: 9881293029</span>
                </li>
                <li className="flex items-start gap-2">
                  <ShoppingBag className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>Order anytime on WhatsApp for quick assistance</span>
                </li>
              </ul>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-whatsapp text-white text-xs font-semibold px-4 py-2 rounded-full hover:brightness-110 transition-all"
              >
                Chat with us
              </a>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/40 text-xs">
            <div className="flex items-center gap-3">
              <span>
                © {new Date().getFullYear()} Smart Ladies Hub. All rights
                reserved.
              </span>
              <a
                href="/admin"
                className="text-white/25 hover:text-white/50 transition-colors"
                data-ocid="admin.link"
              >
                Admin
              </a>
            </div>
            <div className="flex items-center gap-1">
              Built with{" "}
              <Heart className="w-3 h-3 text-red-400 fill-current mx-1" /> using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/60 hover:text-gold transition-colors ml-1"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
