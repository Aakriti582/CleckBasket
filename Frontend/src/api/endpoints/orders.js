import api from "../axios";

export const getCart = () => api.get("/cart/").then((r) => r.data);

export const addCartItem = (product_id, quantity = 1) =>
  api.post("/cart/items/", { product_id, quantity }).then((r) => r.data);

export const updateCartItem = (id, quantity) =>
  api.patch(`/cart/items/${id}/`, { quantity }).then((r) => r.data);

export const removeCartItem = (id) =>
  api.delete(`/cart/items/${id}/`).then((r) => r.data);

export const getCollectionSlots = (date) =>
  api.get("/collection-slots/", { params: date ? { date } : {} }).then((r) => r.data);

export const checkout = (payload) =>
  api.post("/checkout/", payload).then((r) => r.data);

export const getOrders = () => api.get("/orders/").then((r) => r.data);

export const getOrder = (id) => api.get(`/orders/${id}/`).then((r) => r.data);