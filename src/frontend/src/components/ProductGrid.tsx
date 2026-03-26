import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

interface Product {
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
}

function makeOrderLink(productName: string): string {
  const msg = `Hello, I want to order ${productName} from Smart Ladies Hub 😊`;
  return `https://wa.me/919881293029?text=${encodeURIComponent(msg)}`;
}

function ProductCard({
  product,
  index,
  scopePrefix,
}: {
  product: Product;
  index: number;
  scopePrefix: string;
}) {
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -4, scale: 1.02 }}
      data-ocid={`${scopePrefix}.item.${index + 1}`}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover border border-border/40 overflow-hidden flex flex-col transition-all duration-200"
    >
      {/* Price band at top */}
      <div className="bg-maroon px-4 pt-4 pb-3 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white text-sm leading-snug flex-1">
          {product.name}
        </h3>
        {discount > 0 && (
          <span className="flex-shrink-0 bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-3 flex items-center justify-between gap-3 flex-1">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-maroon font-bold text-lg">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span className="text-muted-foreground text-xs line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {product.originalPrice && (
            <div className="text-[10px] text-green-600 font-semibold mt-0.5">
              Save ₹
              {(product.originalPrice - product.price).toLocaleString("en-IN")}
            </div>
          )}
        </div>

        <a
          href={makeOrderLink(product.name)}
          target="_blank"
          rel="noopener noreferrer"
          data-ocid={`${scopePrefix}.primary_button.${index + 1}`}
          className="flex-shrink-0 inline-flex items-center gap-1.5 bg-maroon hover:bg-maroon/90 text-white text-xs font-semibold px-3 py-2 rounded-full transition-all active:scale-95 shadow-sm"
        >
          <ShoppingCart className="w-3 h-3" />
          Order
        </a>
      </div>
    </motion.div>
  );
}

export function ProductGrid({
  products,
  scopePrefix,
}: {
  products: Product[];
  scopePrefix: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="mt-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border/50" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Products &amp; Prices
        </span>
        <div className="h-px flex-1 bg-border/50" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {products.map((product, i) => (
          <ProductCard
            key={product.name}
            product={product}
            index={i}
            scopePrefix={scopePrefix}
          />
        ))}
      </div>
    </motion.div>
  );
}
