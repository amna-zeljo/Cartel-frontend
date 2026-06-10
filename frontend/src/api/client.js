import BACKEND_URL from "../config/backend";

let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.detail;
    const message = Array.isArray(detail)
      ? detail.map((e) => e.msg).join(", ")
      : detail || "Request failed";
    throw new Error(message);
  }
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login-json", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  getMarkets: (search) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    return request(`/markets${query}`);
  },
  getMarketBranches: (marketId) => request(`/markets/${marketId}/branches`),
  getProducts: (search, marketId) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (marketId) params.append("market_id", marketId);
    const query = params.toString() ? `?${params}` : "";
    return request(`/products${query}`);
  },
  getProduct: (id) => request(`/products/${id}`),
  calculateOrder: (items) =>
    request("/orders/calculate", { method: "POST", body: JSON.stringify(items) }),
  placeOrder: (body) => request("/orders", { method: "POST", body: JSON.stringify(body) }),
  getOrderHistory: () => request("/orders/history"),
  getSavingsSummary: () => request("/orders/savings"),
};
