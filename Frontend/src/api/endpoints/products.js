import api from "../axios";

const unwrap = (data) => data?.results ?? data;

export const getCategories = () =>
  api.get("/categories/").then((r) => unwrap(r.data));

export const getProducts = (params = {}) =>
  api.get("/products/", { params }).then((r) => r.data);   // keep full object: we'll need count/next for pagination UI

export const getProduct = (slug) =>
  api.get(`/products/${slug}/`).then((r) => r.data);