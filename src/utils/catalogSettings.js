export const BOUTIQUE_CATEGORIES = [
  "beauty",
  "tops",
  "mens-shirts",
  "mens-watches",
  "womens-watches",
  "womens-dresses",
  "fragrances",
  "womens-shoes",
  "mens-shoes",
];

export const HOME_PRODUCT_SELECT =
  "id,title,price,discountPercentage,thumbnail,images,rating,category,brand,tags,stock,availabilityStatus,minimumOrderQuantity,meta";

export const ADMIN_PASSWORD = "xenon";
export const ADMIN_SESSION_KEY = "xenonAdmin";
export const ADMIN_SETTINGS_KEY = "xenon-admin";
export const ORDERS_KEY = "xenon-orders";
export const STOCK_KEY = "xenon-stock";

export function defaultAdminSettings() {
  return {
    enabledCategories: [...BOUTIQUE_CATEGORIES],
    hideOutOfStock: false,
    newBadgeDays: 45,
    defaultSort: "",
    lowStockAt: 10,
  };
}

export function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export const ACTIVITY_LOG_KEY = "xenon-activity-log";
export const ACTIVITY_LOG_CAP = 200;

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function readActivityLog() {
  const stored = readJson(ACTIVITY_LOG_KEY, []);
  return Array.isArray(stored) ? stored : [];
}

export function appendActivityLog(entry) {
  const next = [
    {
      at: new Date().toISOString(),
      type: entry.type || "info",
      message: entry.message || "",
      detail: entry.detail || "",
    },
    ...readActivityLog(),
  ].slice(0, ACTIVITY_LOG_CAP);
  try {
    localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(next));
  } catch {
    return readActivityLog();
  }
  return next;
}

export function formatActivityLogText(entries = []) {
  return entries
    .map((entry) => {
      const date = new Date(entry.at);
      const pad = (n) => String(n).padStart(2, "0");
      const when = Number.isNaN(date.getTime())
        ? String(entry.at || "")
        : `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      const extra = entry.detail ? ` — ${entry.detail}` : "";
      return `${when}  ${entry.type}  ${entry.message}${extra}`;
    })
    .join("\n");
}

export function readAdminSettings() {
  const stored = readJson(ADMIN_SETTINGS_KEY, null);
  if (!stored || typeof stored !== "object") {
    return defaultAdminSettings();
  }
  const defaults = defaultAdminSettings();
  return {
    ...defaults,
    ...stored,
    enabledCategories: Array.isArray(stored.enabledCategories)
      ? stored.enabledCategories
      : defaults.enabledCategories,
  };
}
