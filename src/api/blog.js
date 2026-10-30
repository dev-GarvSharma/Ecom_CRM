import { get, post } from "../admin/app/axiosWrapper.js";

export const getBlogPosts = (page = 1) => get(`blogs?page=${page}&recordPerPage=12`);
export const getBlogPost = (slug) => get(`blogs/${encodeURIComponent(slug)}`);
export const submitBlogComment = (slug, data) =>
  post(`blogs/${encodeURIComponent(slug)}/comments`, data);
