import { useEffect, useMemo, useState, createContext, useRef } from "react";
import NavBar from "../../components/NavBar/Navbar";
import { allShopProducts } from "../../APIs/getAllProducts/getAllProducts";
import Display from "../../components/Card/Card";
import Spinner from "../../components/Spinner/SpinnerComponent";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import AlertPopUp from "../../components/AlertPopUp/AlertPopUp";
import ErrorIcon from "../../components/ErrorIcon/ErrorIcon";
import ProductFilters from "../../components/ProductFilters/ProductFilters";
import {
  createEmptyFilters,
  applyProductFilters,
} from "../../utils/productFilters";
import { HOME_PRODUCT_SELECT } from "../../utils/catalogSettings";
import { useCatalog } from "../../context/CatalogContext";
import css from "./Home.module.css";

export const UserContext = createContext();

const PAGE_SIZE = 16;

export default function Home() {
  const { settings, withStock, logEvent } = useCatalog();
  const [searchProduct, setSearchProduct] = useState("");
  const [filters, setFilters] = useState(createEmptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [alert, setAlert] = useState({ bool: false, type: "" });
  const [catalogKey, setCatalogKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [retryTick, setRetryTick] = useState(0);

  const page = useRef("Home");

  const listedProducts = Array.isArray(searchProduct)
    ? searchProduct.map(withStock)
    : searchProduct;

  const visibleProducts = useMemo(
    () =>
      Array.isArray(listedProducts)
        ? applyProductFilters(listedProducts, filters, {
            hideOutOfStock: settings.hideOutOfStock,
            defaultSort: settings.defaultSort,
          })
        : [],
    [listedProducts, filters, settings.hideOutOfStock, settings.defaultSort],
  );

  const pageProducts = visibleProducts.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters, searchProduct]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const products = await allShopProducts(settings.enabledCategories, {
          select: HOME_PRODUCT_SELECT,
        });
        if (!cancelled) {
          setSearchProduct(products);
          setAlert({ bool: false, type: "" });
        }
      } catch (error) {
        if (!cancelled) {
          setSearchProduct("");
          setAlert({ bool: true, type: "serverFail" });
          logEvent({
            type: "server_fail",
            message: "Home catalog failed to load",
          });
        }
        console.log(error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [settings.enabledCategories, retryTick, logEvent]);

  useEffect(() => {
    if (Array.isArray(searchProduct)) {
      setCatalogKey((key) => key + 1);
    }
  }, [searchProduct]);

  const catalog = (
    <div className={css.catalog}>
      <div className={css.grid}>
        {Array.isArray(searchProduct) ? (
          visibleProducts.length ? (
            pageProducts.map((product, index) => (
              <Display
                item={product}
                linkTo={`/ViewProduct/${product.id}`}
                index={index}
                key={`${catalogKey}-${product.id}`}
              />
            ))
          ) : (
            <p className={css.empty}>No products match these filters.</p>
          )
        ) : alert.bool ? (
          <ErrorIcon
            type={alert.type}
            onRetry={
              alert.type === "serverFail"
                ? () => {
                    setAlert({ bool: false, type: "" });
                    setSearchProduct("");
                    setRetryTick((tick) => tick + 1);
                  }
                : undefined
            }
          />
        ) : (
          <Spinner />
        )}
      </div>
      {Array.isArray(searchProduct) && visibleCount < visibleProducts.length ? (
        <button
          type="button"
          className={css.loadMore}
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
        >
          Load more
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      <UserContext.Provider
        value={{ searchProduct, setSearchProduct, page, setAlert }}
      >
        <NavBar />
      </UserContext.Provider>
      {alert.bool ? <AlertPopUp type={alert.type} /> : null}

      <div className={css.page}>
        <button
          type="button"
          className={css.filterToggle}
          onClick={() => setFiltersOpen(true)}
        >
          Filters
        </button>
        <div className={css.layout}>
          <aside className={css.sidebar}>
            <ProductFilters
              id="sidebar"
              filters={filters}
              onChange={setFilters}
              products={Array.isArray(listedProducts) ? listedProducts : []}
            />
          </aside>
          {catalog}
        </div>
      </div>

      {filtersOpen ? (
        <div
          className={css.overlay}
          data-overlay=""
          onClick={() => setFiltersOpen(false)}
          role="presentation"
        >
          <div
            className={css.sheet}
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-label="Filters"
          >
            <ProductFilters
              id="sheet"
              filters={filters}
              onChange={setFilters}
              products={Array.isArray(listedProducts) ? listedProducts : []}
            />
            <button
              type="button"
              className={css.sheetClose}
              onClick={() => setFiltersOpen(false)}
            >
              Show results
            </button>
          </div>
        </div>
      ) : null}

      <FooterComponent />
    </>
  );
}
