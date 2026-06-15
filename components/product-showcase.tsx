"use client";

import { ProductRevealCard } from "@/components/ui/product-reveal-card";
import type { Product } from "@/lib/products";

type ProductShowcaseProps = {
  products: Product[];
  enquiryUrl: string;
};

const reviewCounts = [38, 52, 44, 29, 31, 47];

function compactSpecificationValue(value: string) {
  const firstPhrase = value.split(",")[0].trim();

  if (firstPhrase.length <= 34) {
    return firstPhrase;
  }

  return `${firstPhrase.slice(0, 31).trim()}...`;
}

export function ProductShowcase({ products, enquiryUrl }: ProductShowcaseProps) {
  return (
    <>
      <div className="section-heading product-heading">
        <div>
          <p className="section-kicker">Product showcase</p>
          <h2 id="products-title">Core battery cell inventory</h2>
        </div>
        <p>
          Hover or tap a product to reveal supply details and send a direct enquiry for
          current availability.
        </p>
      </div>
      <div className="product-showcase-grid">
        {products.map((product, index) => (
          <ProductRevealCard
            key={product.name}
            category={product.category}
            stockStatus={product.stockStatus}
            name={product.name}
            price={product.price}
            image={product.image}
            description={product.description}
            rating={4.8 + (index % 2) * 0.1}
            reviewCount={reviewCounts[index % reviewCounts.length]}
            enquiryUrl={enquiryUrl}
            detailsHref="#contact"
            className="w-full"
            features={product.specifications.slice(0, 2).map((specification) => ({
              title: specification.label,
              value: compactSpecificationValue(specification.value)
            }))}
          />
        ))}
      </div>
    </>
  );
}
