import fs from "node:fs";
import path from "node:path";

export type ProductSpecification = {
  label: string;
  value: string;
};

export type Product = {
  name: string;
  category: "NMC" | "LFP";
  description: string;
  image: string;
  voltage: string;
  capacity: string;
  price?: string;
  stockStatus: "In Stock" | "Out of Stock";
  sortOrder?: number;
  specifications: ProductSpecification[];
};

const PRODUCTS_DIRECTORY = path.join(process.cwd(), "content", "products");

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;
  return (
    typeof product.name === "string" &&
    typeof product.category === "string" &&
    typeof product.description === "string" &&
    typeof product.image === "string" &&
    typeof product.voltage === "string" &&
    typeof product.capacity === "string" &&
    typeof product.stockStatus === "string" &&
    Array.isArray(product.specifications)
  );
}

export function getProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_DIRECTORY)) {
    return [];
  }

  return fs
    .readdirSync(PRODUCTS_DIRECTORY)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => {
      const filePath = path.join(PRODUCTS_DIRECTORY, fileName);
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = JSON.parse(raw) as unknown;

      if (!isProduct(parsed)) {
        throw new Error(`Invalid product data in ${filePath}`);
      }

      return parsed;
    })
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}
