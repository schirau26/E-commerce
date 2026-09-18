import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryList } from "../../APIs/getCategoryList/getCategoryList";
import { useCatalog } from "../../context/CatalogContext";
import {
  BOUTIQUE_CATEGORIES,
  formatActivityLogText,
} from "../../utils/catalogSettings";
import { formatCategoryLabel, SORT_OPTIONS } from "../../utils/productFilters";
import css from "./Admin.module.css";

export default function Admin() {
  const {
    isAdmin,
    login,
    logout,
    settings,
    saveSettings,
    orders,
    clearOrders,
    activityLog,
    logEvent,
    clearActivityLog,
  } = useCatalog();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("catalog");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryListFail, setCategoryListFail] = useState(false);
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(settings);
  }, [settings]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await getCategoryList();
        if (!cancelled) {
          setCategoryListFail(false);
          setCategoryList(list);
        }
      } catch (error) {
        console.log(error);
        if (!cancelled) {
          setCategoryList([...BOUTIQUE_CATEGORIES]);
          setCategoryListFail(true);
          logEvent({
            type: "category_list_fail",
            message: "Couldn’t load DummyJSON categories.",
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin, logEvent]);

  function submitLogin(event) {
    event.preventDefault();
    if (login(password)) {
      setError("");
      setPassword("");
      return;
    }
    setError("That password does not match.");
  }

  function toggleCategory(value) {
    const selected = draft.enabledCategories.includes(value)
      ? draft.enabledCategories.filter((item) => item !== value)
      : [...draft.enabledCategories, value];
    setDraft({ ...draft, enabledCategories: selected });
  }

  function saveDraft() {
    if (!draft.enabledCategories.length) {
      return;
    }
    saveSettings(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  }

  function downloadActivityLog() {
    const text = formatActivityLogText(activityLog);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `xenon-log-${stamp}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if (!isAdmin) {
    return (
      <div className={css.page}>
        <header className={css.header}>
          <Link to="/" className={css.wordmark}>
            XENON
          </Link>
        </header>
        <form className={css.card} onSubmit={submitLogin}>
          <h1 className={css.title}>Admin</h1>
          <p className={css.copy}>Enter the boutique password to continue.</p>
          <label className={css.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? <p className={css.error}>{error}</p> : null}
          <button type="submit" className={css.primary}>
            Sign in
          </button>
          <Link to="/shop" className={css.link}>
            View shop
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className={css.page}>
      <header className={css.header}>
        <Link to="/" className={css.wordmark}>
          XENON
        </Link>
        <div className={css.headerActions}>
          <Link to="/shop" className={css.link}>
            View shop
          </Link>
          <button type="button" className={css.ghost} onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <div className={css.tabs} role="tablist">
        {[
          ["catalog", "Catalog"],
          ["display", "Display"],
          ["orders", "Orders"],
          ["log", "Log"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? css.tabActive : css.tab}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "catalog" ? (
        <section className={css.card}>
          <div className={css.cardHead}>
            <h1 className={css.title}>Catalog</h1>
            <div className={css.rowActions}>
              <button
                type="button"
                className={css.ghost}
                onClick={() =>
                  setDraft({
                    ...draft,
                    enabledCategories: [...categoryList],
                  })
                }
              >
                Select all
              </button>
              <button
                type="button"
                className={css.ghost}
                onClick={() =>
                  setDraft({
                    ...draft,
                    enabledCategories: [...BOUTIQUE_CATEGORIES],
                  })
                }
              >
                Restore boutique defaults
              </button>
            </div>
          </div>
          <p className={css.copy}>
            Choose which DummyJSON categories the shop loads.
          </p>
          {categoryListFail ? (
            <p className={css.error}>Couldn’t load DummyJSON categories.</p>
          ) : null}
          <div className={css.options}>
            {categoryList.map((category) => (
              <label key={category} className={css.option}>
                <input
                  type="checkbox"
                  checked={draft.enabledCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                {formatCategoryLabel(category)}
              </label>
            ))}
          </div>
          <button
            type="button"
            className={css.primary}
            onClick={saveDraft}
            disabled={!draft.enabledCategories.length}
          >
            {saved ? "Saved" : "Save catalog"}
          </button>
        </section>
      ) : null}

      {tab === "display" ? (
        <section className={css.card}>
          <h1 className={css.title}>Display</h1>
          <label className={css.option}>
            <input
              type="checkbox"
              checked={draft.hideOutOfStock}
              onChange={(event) =>
                setDraft({ ...draft, hideOutOfStock: event.target.checked })
              }
            />
            Hide out of stock
          </label>
          <label className={css.label}>
            New badge window (days)
            <input
              type="number"
              min="1"
              value={draft.newBadgeDays}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  newBadgeDays: Number(event.target.value) || 1,
                })
              }
            />
          </label>
          <label className={css.label}>
            Low-stock threshold
            <input
              type="number"
              min="1"
              value={draft.lowStockAt}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  lowStockAt: Number(event.target.value) || 1,
                })
              }
            />
          </label>
          <label className={css.label}>
            Default sort
            <select
              value={draft.defaultSort}
              onChange={(event) =>
                setDraft({ ...draft, defaultSort: event.target.value })
              }
            >
              <option value="">Featured</option>
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className={css.primary} onClick={saveDraft}>
            {saved ? "Saved" : "Save display"}
          </button>
        </section>
      ) : null}

      {tab === "orders" ? (
        <section className={css.card}>
          <div className={css.cardHead}>
            <h1 className={css.title}>Orders</h1>
            {orders.length ? (
              <button type="button" className={css.ghost} onClick={clearOrders}>
                Clear log
              </button>
            ) : null}
          </div>
          {orders.length ? (
            <div className={css.tableWrap}>
              <table className={css.table}>
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Pay</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{new Date(order.at).toLocaleString()}</td>
                      <td>
                        {order.items
                          .map((item) => `${item.title} ×${item.quantity}`)
                          .join(", ")}
                      </td>
                      <td>${Number(order.total).toFixed(2)}</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        {order.address?.name}
                        {order.address?.address
                          ? ` · ${order.address.address}`
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={css.copy}>No local orders yet.</p>
          )}
        </section>
      ) : null}

      {tab === "log" ? (
        <section className={css.card}>
          <div className={css.cardHead}>
            <h1 className={css.title}>Log</h1>
            <div className={css.rowActions}>
              <button
                type="button"
                className={css.ghost}
                onClick={downloadActivityLog}
                disabled={!activityLog.length}
              >
                Download
              </button>
              {activityLog.length ? (
                <button
                  type="button"
                  className={css.ghost}
                  onClick={clearActivityLog}
                >
                  Clear log
                </button>
              ) : null}
            </div>
          </div>
          {activityLog.length ? (
            <div className={css.tableWrap}>
              <table className={css.table}>
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Type</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLog.map((entry, index) => (
                    <tr key={`${entry.at}-${entry.type}-${index}`}>
                      <td>{new Date(entry.at).toLocaleString()}</td>
                      <td>{entry.type}</td>
                      <td>
                        {entry.message}
                        {entry.detail ? ` — ${entry.detail}` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={css.copy}>No activity yet.</p>
          )}
        </section>
      ) : null}
    </div>
  );
}
