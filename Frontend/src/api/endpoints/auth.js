import api from "../axios";

export const loginUser = (data) => api.post("/auth/login/", data);
export const registerCustomer = (data) => api.post("/auth/register/customer/", data);
export const registerTrader = (data) => api.post("/auth/register/trader/", data);
export const getMe = () => api.get("/auth/me/");
export const logoutUser = () => api.post("/auth/logout/");