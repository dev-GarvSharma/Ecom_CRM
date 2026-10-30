import { get } from "../admin/app/axiosWrapper.js";

export const getCatalogProducts = (params = "") =>
  get(`catalog/products${params}`);

export const getCatalogCategories = () => get("catalog/categories");
