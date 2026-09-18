import { useContext, useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { SelectedProduct } from "../../pages/ViewProduct/ViewProduct";
import SpinnerComponent from "../Spinner/SpinnerComponent";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  productImageFallback,
} from "../../utils/productImage";
import css from "./ProductImage.module.css";

export default function ProductImage() {
  const { product } = useContext(SelectedProduct);
  const images = product?.images?.length ? product.images : [];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [lightbox, setLightbox] = useState(false);
  const [src, setSrc] = useState(PRODUCT_IMAGE_PLACEHOLDER);

  const heroSrc =
    images[index] || product?.thumbnail || PRODUCT_IMAGE_PLACEHOLDER;

  useEffect(() => {
    setIndex(0);
  }, [product?.id]);

  useEffect(() => {
    setSrc(heroSrc);
  }, [heroSrc]);

  function show(next) {
    if (!images.length) {
      return;
    }
    const wrapped = (next + images.length) % images.length;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setIndex(wrapped);
      return;
    }
    setVisible(false);
    window.setTimeout(() => {
      setIndex(wrapped);
      setVisible(true);
    }, 120);
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") {
        show(index - 1);
      }
      if (e.key === "ArrowRight") {
        show(index + 1);
      }
      if (e.key === "Escape") {
        setLightbox(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length]);

  if (!product) {
    return <SpinnerComponent />;
  }

  function handleImageError() {
    const next = productImageFallback(src, product);
    if (next !== src) {
      setSrc(next);
    }
  }

  return (
    <div className={css.gallery}>
      <div className={css.thumbs}>
        {images.map((url, i) => (
          <button
            type="button"
            key={url + i}
            className={`${css.thumb} ${i === index ? css.thumbSelected : ""}`}
            onClick={() => show(i)}
            aria-label={`View image ${i + 1}`}
          >
            <img
              src={url}
              alt=""
              onError={(event) => {
                const next = productImageFallback(url, product);
                if (next !== event.currentTarget.src) {
                  event.currentTarget.src = next;
                }
              }}
            />
          </button>
        ))}
      </div>
      <div className={css.hero}>
        <img
          src={src}
          alt={product.title}
          className={`${css.heroImage} ${visible ? css.heroImageVisible : ""}`}
          onClick={() => setLightbox(true)}
          onError={handleImageError}
        />
        {images.length > 1 ? (
          <>
            <button
              type="button"
              className={`${css.heroButton} ${css.prev}`}
              aria-label="Previous image"
              onClick={() => show(index - 1)}
            >
              <LuChevronLeft size={18} />
            </button>
            <button
              type="button"
              className={`${css.heroButton} ${css.next}`}
              aria-label="Next image"
              onClick={() => show(index + 1)}
            >
              <LuChevronRight size={18} />
            </button>
          </>
        ) : null}
      </div>
      {lightbox ? (
        <div
          className={css.lightbox}
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className={css.lightboxClose}
            aria-label="Close"
            onClick={() => setLightbox(false)}
          >
            ×
          </button>
          <img
            src={src}
            alt={product.title}
            className={css.lightboxImage}
            onClick={(e) => e.stopPropagation()}
            onError={handleImageError}
          />
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className={`${css.heroButton} ${css.prev}`}
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  show(index - 1);
                }}
              >
                <LuChevronLeft size={18} />
              </button>
              <button
                type="button"
                className={`${css.heroButton} ${css.next}`}
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  show(index + 1);
                }}
              >
                <LuChevronRight size={18} />
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
