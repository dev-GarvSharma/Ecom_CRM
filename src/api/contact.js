import { post } from "../admin/app/axiosWrapper.js";

export const submitContactMessage = (message) => post("contact", message);
