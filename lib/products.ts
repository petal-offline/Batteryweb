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
const FALLBACK_PRODUCT_IMAGE = "/images/battery-cells-lab.png";

type ProductRecord = Omit<Product, "image" | "specifications"> & {
  image?: unknown;
  specifications?: unknown;
};

function isProduct(value: unknown): value is ProductRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Record<string, unknown>;
  return (
    typeof product.name === "string" &&
    (product.category === "NMC" || product.category === "LFP") &&
    typeof product.description === "string" &&
    typeof product.voltage === "string" &&
    typeof product.capacity === "string" &&
    (product.stockStatus === "In Stock" || product.stockStatus === "Out of Stock")
  );
}

function normalizeImagePath(value: unknown): string {
  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue || trimmedValue.startsWith("blob:") || trimmedValue.startsWith("data:")) {
      return FALLBACK_PRODUCT_IMAGE;
    }

    return trimmedValue.startsWith("http") || trimmedValue.startsWith("/")
      ? trimmedValue
      : `/${trimmedValue}`;
  }

  if (Array.isArray(value)) {
    return normalizeImagePath(value[0]);
  }

  if (value && typeof value === "object") {
    const imageRecord = value as Record<string, unknown>;
    return normalizeImagePath(
      imageRecord.path ?? imageRecord.url ?? imageRecord.src ?? imageRecord.publicUrl
    );
  }

  return FALLBACK_PRODUCT_IMAGE;
}

function normalizeProduct(product: ProductRecord): Product {
  return {
    ...product,
    image: normalizeImagePath(product.image),
    specifications: Array.isArray(product.specifications) ? product.specifications : []
  };
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

      return normalizeProduct(parsed);
    })
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}
