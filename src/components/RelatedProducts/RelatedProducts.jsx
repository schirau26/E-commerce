import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Display from "../Card/Card";
import { getCategory } from "../../APIs/getCategory/getCategory";
import { HOME_PRODUCT_SELECT } from "../../utils/catalogSettings";
import { applyStockMap } from "../../utils/inventory";
import { useCatalog } from "../../context/CatalogContext";
import css from "./RelatedProducts.module.css";

export default function RelatedProducts({ product }) {
  const { stockMap } = useCatalog();
  const [related, setRelated] = useState([]);
  const tags = useMemo(
    () => (Array.isArray(product?.tags) ? product.tags : []),
    [product],
  );

  useEffect(() => {
    if (!product?.category) {
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await getCategory(product.category, {
          select: HOME_PRODUCT_SELECT,
        });
        const tagSet = new Set(tags);
        const matches = list
          .map((item) => applyStockMap(item, stockMap))
          .filter((item) => {
            if (item.id === product.id) {
              return false;
            }
            return (item.tags || []).some((tag) => tagSet.has(tag));
          })
          .slice(0, 4);
        if (!cancelled) {
          setRelated(matches);
        }
      } catch {
        if (!cancelled) {
          setRelated([]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [product?.id, product?.category, tags, stockMap]);

  if (!related.length) {
    return null;
  }

  return (
    <section className={css.section} aria-labelledby="related-heading">
      <h2 className={css.heading} id="related-heading">
        Related
      </h2>
      <div className={css.row}>
        {related.map((item, index) => (
          <Display
            key={item.id}
            item={item}
            linkTo={`/ViewProduct/${item.id}`}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
