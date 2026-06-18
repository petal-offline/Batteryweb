"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/products";

type ProductCategory = "NMC" | "LFP";

type ProductShowcaseProps = {
  products: Product[];
};

const categoryDetails: Record<
  ProductCategory,
  {
    label: string;
    title: string;
    summary: string;
    bestFor: string;
    href: string;
  }
> = {
  NMC: {
    label: "NMC Cells",
    title: "High-density cylindrical cells for packs and mobility builds.",
    summary:
      "Browse rechargeable lithium-ion and NMC-format cells used in EV packs, tools, service networks, and industrial assemblies.",
    bestFor: "EV packs, power tools, compact energy systems",
    href: "/products#nmc"
  },
  LFP: {
    label: "LFP Cells",
    title: "Stable LiFePO4 cells for commercial storage and backup projects.",
    summary:
      "Compare prismatic and high-capacity LiFePO4 cells for solar storage, backup systems, and long-cycle industrial projects.",
    bestFor: "Solar storage, backup systems, long-cycle packs",
    href: "/products#lfp"
  }
};

function getCategoryProducts(products: Product[], category: ProductCategory) {
  return products.filter((product) => product.category === category);
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
  const shouldReduceMotion = useReducedMotion();
  const categories = (["NMC", "LFP"] as ProductCategory[]).map((category) => {
    const categoryProducts = getCategoryProducts(products, category);
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
  });

  return (
    <>
      <div className="section-heading product-heading">
        <div>
          <p className="section-kicker">Product showcase</p>
          <h2 id="products-title">Choose a cell category</h2>
        </div>
        <p>
          Hover or tap a category to reveal the catalog link. Each product page
          enquiry opens a WhatsApp picker with both KCEL sales numbers.
        </p>
      </div>

      <div className="product-showcase-grid product-showcase-grid--categories">
        {categories.map((category, index) => (
          <motion.a
            href={category.href}
            aria-label={`See all ${category.label} products`}
            className="category-reveal-card"
            data-slot="product-reveal-card"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.02 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{
              delay: index * 0.08,
              type: "spring",
              stiffness: 260,
              damping: 26
            }}
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
              <h3>{category.label}</h3>
              <span>
                {category.products.length} product listings for {category.bestFor.toLowerCase()}.
              </span>
            </div>
            <div className="category-reveal-link">
              <span>{category.title}</span>
              <small>{category.summary}</small>
              <strong>
                See All
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </strong>
            </div>
          </motion.a>
        ))}
      </div>
    </>
  );
}
