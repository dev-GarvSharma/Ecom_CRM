import { createContext } from "react";

export const CatalogContext = createContext({
  products: [],
  categories: [],
  loading: true,
});