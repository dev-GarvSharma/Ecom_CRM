import { post, put } from "../admin/app/axiosWrapper.js";

export const synchronizeCart = (items) => put("cart", { items });

export const placeCashOnDeliveryOrder = (order) => post("orders", order);