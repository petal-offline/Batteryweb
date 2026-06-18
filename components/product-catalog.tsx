"use client";

import { CheckCircle2, MessageCircle, PackageOpen, X } from "lucide-react";
import { useMemo, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

type ProductCatalogProps = {
  products: Product[];
  enquiryNumbers: string[];
};

function buildWhatsappUrl(number: string, productName: string) {
  const message = `Hello KCEL, I want to enquire about ${productName}. Please share current availability and quote.`;
  return `https://wa.me/91${number}?text=${encodeURIComponent(message)}`;
}

function getCategoryId(category: Product["category"]) {
  return category.toLowerCase();
}

export function ProductCatalog({ products, enquiryNumbers }: ProductCatalogProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const groupedProducts = useMemo(
    () =>
      (["NMC", "LFP"] as const).map((category) => ({
        category,
        products: products.filter((product) => product.category === category)
      })),
    [products]
  );

  return (
    <>
      <div className="catalog-page-tabs" aria-label="Product categories">
        {groupedProducts.map(({ category, products: categoryProducts }) => (
          <a href={`#${getCategoryId(category)}`} key={category}>
            {category} Cells
            <span>{categoryProducts.length}</span>
          </a>
        ))}
      </div>

      {groupedProducts.map(({ category, products: categoryProducts }) => (
        <section
          className="catalog-category-section"
          id={getCategoryId(category)}
          key={category}
          aria-labelledby={`${getCategoryId(category)}-title`}
        >
          <div className="catalog-category-heading">
            <div>
              <p className="section-kicker">{category} inventory</p>
              <h2 id={`${getCategoryId(category)}-title`}>{category} Cells</h2>
            </div>
            <p>
              {categoryProducts.length} listings,{" "}
              {
                categoryProducts.filter((product) => product.stockStatus === "In Stock")
                  .length
              }{" "}
              in stock.
            </p>
          </div>

          <div className="catalog-product-grid">
            {categoryProducts.map((product) => {
              const isOutOfStock = product.stockStatus === "Out of Stock";

              return (
                <article
                  className={cn(
                    "catalog-product-card",
                    isOutOfStock && "catalog-product-card--disabled"
                  )}
                  key={product.name}
                >
                  <div className="catalog-product-image">
                    <img src={product.image} alt={product.name} />
                    <span className={isOutOfStock ? "stock-pill stock-pill--out" : "stock-pill"}>
                      {product.stockStatus}
                    </span>
                  </div>
                  <div className="catalog-product-body">
                    <div>
                      <p>{product.category}</p>
                      <h3>{product.name}</h3>
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
                        "catalog-inquire-button"
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
        </section>
      ))}

      {activeProduct && (
        <div className="catalog-whatsapp-picker" role="dialog" aria-live="polite">
          <div>
            <CheckCircle2 aria-hidden="true" />
            <div>
              <strong>Send enquiry for {activeProduct.name}</strong>
              <span>Choose the KCEL WhatsApp number to contact.</span>
            </div>
          </div>
          <div className="catalog-whatsapp-actions">
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
          <button
            className="catalog-whatsapp-close"
            type="button"
            onClick={() => setActiveProduct(null)}
            aria-label="Close WhatsApp picker"
          >
            <X aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}
