import { useContext, useMemo, useState } from "react";
import { SelectedProduct } from "../../pages/ViewProduct/ViewProduct";
import Rating from "../Rating/Rating";
import css from "./Comments.module.css";

const STAGGER_MS = 50;
const STAGGER_CAP = 8;

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatDate(value) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Comments() {
  const { product } = useContext(SelectedProduct);
  const [sort, setSort] = useState("highest");
  const reviews = product?.reviews || [];

  const sorted = useMemo(() => {
    const copy = [...reviews];
    if (sort === "newest") {
      copy.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return copy;
  }, [reviews, sort]);

  const average =
    product?.rating ||
    (reviews.length
      ? reviews.reduce((sum, item) => sum + (item.rating || 0), 0) /
        reviews.length
      : 0);

  return (
    <section className={css.section} aria-labelledby="reviews-heading">
      <div className={css.head}>
        <div>
          <h2 className={css.heading} id="reviews-heading">
            Reviews
          </h2>
          <div className={css.summary}>
            <span className={css.average}>{Number(average).toFixed(1)}</span>
            <Rating value={Math.round(average)} size="sm" />
            <span className={css.count}>
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
        {reviews.length ? (
          <div className={css.sort}>
            <button
              type="button"
              aria-pressed={sort === "highest"}
              onClick={() => setSort("highest")}
            >
              Highest
            </button>
            <button
              type="button"
              aria-pressed={sort === "newest"}
              onClick={() => setSort("newest")}
            >
              Newest
            </button>
          </div>
        ) : null}
      </div>
      {sorted.length ? (
        <div className={css.list}>
          {sorted.map((comment, index) => (
            <article
              className={css.card}
              key={`${comment.reviewerEmail || comment.reviewerName}-${index}`}
              style={{
                animationDelay: `${Math.min(index, STAGGER_CAP) * STAGGER_MS}ms`,
              }}
            >
              <div className={css.avatar} aria-hidden="true">
                {initials(comment.reviewerName)}
              </div>
              <div>
                <div className={css.meta}>
                  <span className={css.name}>{comment.reviewerName}</span>
                  <span className={css.date}>{formatDate(comment.date)}</span>
                  <Rating size="xs" value={comment.rating} />
                </div>
                <p className={css.comment}>{comment.comment}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className={css.empty}>No reviews yet.</p>
      )}
    </section>
  );
}
