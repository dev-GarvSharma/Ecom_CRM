import { useContext } from "react";
import { CatalogContext } from "./catalogContextValue.js";

export const useCatalog = () => useContext(CatalogContext);