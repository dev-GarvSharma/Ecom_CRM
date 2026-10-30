import { useEffect, useState } from "react";
import { getCatalogCategories, getCatalogProducts } from "../api/catalog.js";
import { resolveImageUrl } from "../utils/image.js";
import { CatalogContext } from "./catalogContextValue.js";

const normalizeProduct = (product) => {
  const variants = (product.variants || []).map((variant) => ({
    ...variant,
    price: Number(variant.price),
    compareAtPrice:
      variant.compareAtPrice == null ? null : Number(variant.compareAtPrice),
    stock: Number(variant.stock),
    options: variant.options || {},
  }));
  const prices = variants.map((variant) => variant.price);
  const comparePrices = variants
    .map((variant) => variant.compareAtPrice)
    .filter(Number.isFinite);
  const attributes = product.attributes || {};
  const images = (product.images || [])
    .map((image) =>
      resolveImageUrl(typeof image === "string" ? image : image.path),
    )
    .filter(Boolean);
  const colors = [
    ...new Set(
      variants.flatMap((variant) =>
        [
          variant.options.color,
          variant.options.finish,
          variant.options.stone,
        ].filter(Boolean),
      ),
    ),
  ];

  return {
    ...product,
    category: product.category?.name || "Uncategorized",
    images,
    variants,
    price: prices.length ? Math.min(...prices) : 0,
    oldPrice: comparePrices.length ? Math.max(...comparePrices) : 0,
    stock: variants.reduce((sum, variant) => sum + variant.stock, 0),
    colors,
    tags: Array.isArray(attributes.tags) ? attributes.tags : [],
    badge: attributes.badge || "",
    rating: Number(attributes.rating || 0),
    reviews: Number(attributes.reviews || 0),
    material: product.material || "",
  };
};

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      getCatalogProducts("?recordPerPage=100"),
      getCatalogCategories(),
    ])
      .then(([productResult, categoryResult]) => {
        if (!active) return;
        if (!productResult.success || !categoryResult.success)
          throw new Error(
            productResult.message ||
              categoryResult.message ||
              "Catalog unavailable.",
          );
        setProducts((productResult.data?.data || []).map(normalizeProduct));
        setCategories(
          (categoryResult.data?.data || []).map((category) => ({
            ...category,
            image: resolveImageUrl(category.image),
          })),
        );
        setError("");
      })
      .catch((catalogError) => {
        if (active) setError(catalogError.message || "Catalog unavailable.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <CatalogContext.Provider value={{ products, categories, loading, error }}>
      {children}
    </CatalogContext.Provider>
  );
}

