import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cartTotals } from "../utils/pricing";
import {
  ADMIN_PASSWORD,
  ADMIN_SESSION_KEY,
  ORDERS_KEY,
  STOCK_KEY,
  defaultAdminSettings,
  readAdminSettings,
  readJson,
  writeJson,
  ADMIN_SETTINGS_KEY,
  appendActivityLog,
  readActivityLog,
  ACTIVITY_LOG_KEY,
} from "../utils/catalogSettings";
import { applyStockMap } from "../utils/inventory";

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  const [settings, setSettingsState] = useState(readAdminSettings);
  const [stockMap, setStockMap] = useState(() => readJson(STOCK_KEY, {}));
  const [orders, setOrders] = useState(() => readJson(ORDERS_KEY, []));
  const [activityLog, setActivityLog] = useState(readActivityLog);
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem(ADMIN_SESSION_KEY) === "1",
  );
  const [catalogTick, setCatalogTick] = useState(0);

  const logEvent = useCallback((entry) => {
    setActivityLog(appendActivityLog(entry));
  }, []);

  const persist = useCallback(
    (key, value) => {
      const ok = writeJson(key, value);
      if (!ok) {
        logEvent({
          type: "storage_fail",
          message: "Could not write browser storage",
          detail: key,
        });
      }
      return ok;
    },
    [logEvent],
  );

  const saveSettings = useCallback(
    (next) => {
      const merged = { ...defaultAdminSettings(), ...next };
      if (!persist(ADMIN_SETTINGS_KEY, merged)) {
        return false;
      }
      setSettingsState(merged);
      setCatalogTick((tick) => tick + 1);
      logEvent({
        type: "settings",
        message: "Admin saved settings",
        detail: `${merged.enabledCategories.length} categories, hideOOS=${merged.hideOutOfStock}, sort=${merged.defaultSort || "featured"}`,
      });
      return true;
    },
    [logEvent, persist],
  );

  const login = useCallback(
    (password) => {
      if (password !== ADMIN_PASSWORD) {
        logEvent({ type: "login_fail", message: "Admin sign-in failed" });
        return false;
      }
      sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
      setIsAdmin(true);
      logEvent({ type: "login_ok", message: "Admin signed in" });
      return true;
    },
    [logEvent],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdmin(false);
    logEvent({ type: "logout", message: "Admin signed out" });
  }, [logEvent]);

  const withStock = useCallback(
    (product) => applyStockMap(product, stockMap),
    [stockMap],
  );

  const placeOrder = useCallback(
    ({ items = [], address = {}, paymentMethod = "COD" } = {}) => {
      const totals = cartTotals(items);
      const order = {
        id: `xn-${Date.now()}`,
        at: new Date().toISOString(),
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          sku: item.sku || "",
          quantity: item.quantity,
          cartPrice: item.cartPrice,
        })),
        total: totals.total,
        address: {
          name: address.name || "",
          email: address.email || "",
          contact: address.contact || "",
          address: address.address || "",
        },
        paymentMethod,
      };
      const nextOrders = [order, ...orders];
      const nextStock = { ...stockMap };
      items.forEach((item) => {
        const key = String(item.id);
        const current =
          key in nextStock ? Number(nextStock[key]) : Number(item.stock) || 0;
        nextStock[key] = Math.max(0, current - (Number(item.quantity) || 0));
      });
      const ordersOk = persist(ORDERS_KEY, nextOrders);
      const stockOk = persist(STOCK_KEY, nextStock);
      if (!ordersOk || !stockOk) {
        persist(ORDERS_KEY, orders);
        persist(STOCK_KEY, stockMap);
        logEvent({
          type: "order_fail",
          message: "Order could not be saved",
        });
        return { ok: false, order: null };
      }
      setOrders(nextOrders);
      setStockMap(nextStock);
      logEvent({
        type: "order_ok",
        message: "Order placed",
        detail: `${order.id} · $${Number(order.total).toFixed(2)}`,
      });
      return { ok: true, order };
    },
    [orders, stockMap, persist, logEvent],
  );

  const clearOrders = useCallback(() => {
    if (!persist(ORDERS_KEY, [])) {
      return;
    }
    setOrders([]);
    logEvent({ type: "orders_cleared", message: "Admin cleared order log" });
  }, [persist, logEvent]);

  const clearActivityLog = useCallback(() => {
    if (!persist(ACTIVITY_LOG_KEY, [])) {
      return;
    }
    setActivityLog([]);
  }, [persist]);

  const value = useMemo(
    () => ({
      settings,
      saveSettings,
      stockMap,
      withStock,
      catalogTick,
      isAdmin,
      login,
      logout,
      orders,
      placeOrder,
      clearOrders,
      activityLog,
      logEvent,
      clearActivityLog,
    }),
    [
      settings,
      saveSettings,
      stockMap,
      withStock,
      catalogTick,
      isAdmin,
      login,
      logout,
      orders,
      placeOrder,
      clearOrders,
      activityLog,
      logEvent,
      clearActivityLog,
    ],
  );

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalog() {
  const value = useContext(CatalogContext);
  if (!value) {
    throw new Error("useCatalog must be used within CatalogProvider");
  }
  return value;
}
