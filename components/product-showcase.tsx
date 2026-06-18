"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, MessageCircle, PackageOpen, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type ProductCategory = "NCM" | "LFP";

type ProductShowcaseProps = {
  products: Product[];
  enquiryNumbers: string[];
};

type GithubContentItem = {
  name: string;
  download_url: string | null;
  type: string;
};

const categoryDetails: Record<
  ProductCategory,
  {
    label: string;
    title: string;
    summary: string;
    bestFor: string;
  }
> = {
  NCM: {
    label: "NCM Cells",
    title: "High-density cylindrical cells for packs and mobility builds.",
    summary:
      "Browse rechargeable lithium-ion and NCM-format cells used in EV packs, tools, service networks, and industrial assemblies.",
    bestFor: "EV packs, power tools, compact energy systems"
  },
  LFP: {
    label: "LFP Cells",
    title: "Stable LiFePO4 cells for commercial storage and backup projects.",
    summary:
      "Compare prismatic and high-capacity LiFePO4 cells for solar storage, backup systems, and long-cycle industrial projects.",
    bestFor: "Solar storage, backup systems, long-cycle packs"
  }
};

const liveProductsEndpoint =
  "https://api.github.com/repos/petal-offline/Batteryweb/contents/content/products?ref=main";

function normalizeProduct(value: unknown): Product | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const product = value as Record<string, unknown>;

  if (
    typeof product.name !== "string" ||
    (product.category !== "NCM" && product.category !== "LFP") ||
    typeof product.description !== "string" ||
    typeof product.image !== "string" ||
    typeof product.voltage !== "string" ||
    typeof product.capacity !== "string" ||
    (product.stockStatus !== "In Stock" && product.stockStatus !== "Out of Stock")
  ) {
    return null;
  }

  return {
    name: product.name,
    category: product.category,
    description: product.description,
    image: product.image,
    voltage: product.voltage,
    capacity: product.capacity,
    price: typeof product.price === "string" ? product.price : undefined,
    stockStatus: product.stockStatus,
    sortOrder: typeof product.sortOrder === "number" ? product.sortOrder : undefined,
    specifications: Array.isArray(product.specifications)
      ? product.specifications.filter(
          (specification): specification is { label: string; value: string } =>
            Boolean(specification) &&
            typeof specification === "object" &&
            typeof (specification as Record<string, unknown>).label === "string" &&
            typeof (specification as Record<string, unknown>).value === "string"
        )
      : []
  };
}

async function fetchLiveProducts() {
  const directoryResponse = await fetch(liveProductsEndpoint, {
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json"
    }
  });

  if (!directoryResponse.ok) {
    throw new Error("Unable to fetch live product directory");
  }

  const directory = (await directoryResponse.json()) as GithubContentItem[];
  const jsonFiles = directory.filter(
    (item) => item.type === "file" && item.name.endsWith(".json") && item.download_url
  );

  const liveProducts = await Promise.all(
    jsonFiles.map(async (item) => {
      const productResponse = await fetch(`${item.download_url}?v=${Date.now()}`, {
        cache: "no-store"
      });

      if (!productResponse.ok) {
        return null;
      }

      return normalizeProduct(await productResponse.json());
    })
  );

  return liveProducts
    .filter((product): product is Product => Boolean(product))
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}

function buildWhatsappUrl(number: string, productName: string) {
  const message = `Hello KCEL, I want to enquire about ${productName}. Please share current availability and quote.`;
  return `https://wa.me/91${number}?text=${encodeURIComponent(message)}`;
}

function getCategoryProducts(products: Product[], category: ProductCategory) {
  return products.filter((product) => product.category === category);
}

export function ProductShowcase({ products, enquiryNumbers }: ProductShowcaseProps) {
  const [liveProducts, setLiveProducts] = useState(products);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let isMounted = true;

    fetchLiveProducts()
      .then((freshProducts) => {
        if (isMounted && freshProducts.length > 0) {
          setLiveProducts(freshProducts);
        }
      })
      .catch(() => {
        // Keep the static export data as a reliable fallback if GitHub is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProduct(null);
        setActiveCategory(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = useMemo(
    () =>
      (["NCM", "LFP"] as ProductCategory[]).map((category) => {
        const categoryProducts = getCategoryProducts(liveProducts, category);
        const inStockCount = categoryProducts.filter(
          (product) => product.stockStatus === "In Stock"
        ).length;

        return {
          category,
          products: categoryProducts,
          inStockCount,
          image: categoryProducts[0]?.image ?? "/images/battery-cells-lab.png",
          ...categoryDetails[category]
        };
      }),
    [liveProducts]
  );

  const modalProducts = activeCategory
    ? getCategoryProducts(liveProducts, activeCategory)
    : [];
  const activeCategoryDetails = activeCategory ? categoryDetails[activeCategory] : null;

  return (
    <>
      <div className="section-heading product-heading">
        <div>
          <p className="section-kicker">Product showcase</p>
          <h2 id="products-title">Choose a cell category</h2>
        </div>
        <p>
          Hover or tap a category to see the full inventory. Product enquiries open a
          WhatsApp picker with both KCEL sales numbers.
        </p>
      </div>

      <div className="product-showcase-grid product-showcase-grid--categories">
        {categories.map((category, index) => (
          <motion.article
            className="category-reveal-card"
            data-slot="product-reveal-card"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.08, duration: 0.45, ease: "easeOut" }}
            key={category.category}
          >
            <div className="category-reveal-image">
              <img src={category.image} alt={`${category.label} product sample`} />
              <div className="category-reveal-badges">
                <span>{category.products.length} listings</span>
                <span>{category.inStockCount} in stock</span>
              </div>
            </div>
            <div className="category-reveal-body">
              <p>{category.label}</p>
              <h3>{category.title}</h3>
              <span>{category.bestFor}</span>
            </div>
            <div className="product-reveal-overlay category-reveal-overlay">
              <div>
                <h4>{category.label}</h4>
                <p>{category.summary}</p>
                <button
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "category-see-all-button"
                  )}
                  type="button"
                  onClick={() => {
                    setActiveCategory(category.category);
                    setActiveProduct(null);
                  }}
                >
                  See All
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {activeCategory && activeCategoryDetails && (
          <motion.div
            className="catalog-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-modal-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="catalog-modal"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="catalog-modal-header">
                <div>
                  <p className="section-kicker">{activeCategoryDetails.label}</p>
                  <h3 id="catalog-modal-title">Available {activeCategoryDetails.label}</h3>
                  <span>
                    {modalProducts.length} products,{" "}
                    {
                      modalProducts.filter((product) => product.stockStatus === "In Stock")
                        .length
                    }{" "}
                    in stock
                  </span>
                </div>
                <button
                  className="modal-icon-button"
                  type="button"
                  onClick={() => {
                    setActiveCategory(null);
                    setActiveProduct(null);
                  }}
                  aria-label="Close product list"
                >
                  <X aria-hidden="true" />
                </button>
              </div>

              <div className="modal-product-grid">
                {modalProducts.map((product) => {
                  const isOutOfStock = product.stockStatus === "Out of Stock";

                  return (
                    <article
                      className={cn(
                        "modal-product-card",
                        isOutOfStock && "modal-product-card--disabled"
                      )}
                      key={product.name}
                    >
                      <div className="modal-product-image">
                        <img src={product.image} alt={product.name} />
                        <span className={isOutOfStock ? "stock-pill stock-pill--out" : "stock-pill"}>
                          {product.stockStatus}
                        </span>
                      </div>
                      <div className="modal-product-body">
                        <div>
                          <p>{product.category}</p>
                          <h4>{product.name}</h4>
                          <span>
                            {product.voltage} | {product.capacity}
                          </span>
                        </div>
                        <p>{product.description}</p>
                        <dl>
                          <div>
                            <dt>Voltage</dt>
                            <dd>{product.voltage}</dd>
                          </div>
                          <div>
                            <dt>Capacity</dt>
                            <dd>{product.capacity}</dd>
                          </div>
                        </dl>
                        <button
                          className={cn(
                            buttonVariants({ variant: "default" }),
                            "modal-inquire-button"
                          )}
                          type="button"
                          disabled={isOutOfStock}
                          onClick={() => setActiveProduct(product)}
                        >
                          {isOutOfStock ? (
                            <PackageOpen className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          )}
                          {isOutOfStock ? "Out of Stock" : "Inquire"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <AnimatePresence>
                {activeProduct && (
                  <motion.div
                    className="whatsapp-picker"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                  >
                    <div>
                      <CheckCircle2 aria-hidden="true" />
                      <div>
                        <strong>Send enquiry for {activeProduct.name}</strong>
                        <span>Choose the KCEL WhatsApp number to contact.</span>
                      </div>
                    </div>
                    <div className="whatsapp-picker-actions">
                      {enquiryNumbers.map((number) => (
                        <a
                          href={buildWhatsappUrl(number, activeProduct.name)}
                          target="_blank"
                          rel="noreferrer"
                          key={number}
                        >
                          <MessageCircle className="h-4 w-4" aria-hidden="true" />
                          {number}
                        </a>
                      ))}
                    </div>
                    <button type="button" onClick={() => setActiveProduct(null)}>
                      Cancel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
