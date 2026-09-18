import { Box, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SpinnerComponent from "../Spinner/SpinnerComponent";
import css from "./Card.module.css";
import { useEffect, useRef, useState } from "react";
import { productUnitPrice, formatMoney } from "../../utils/pricing";
import { isNewProduct } from "../../utils/inventory";
import { useCatalog } from "../../context/CatalogContext";
import {
  PRODUCT_IMAGE_PLACEHOLDER,
  productImageCandidates,
  productImageFallback,
} from "../../utils/productImage";

const STAGGER_MS = 40;
const STAGGER_CAP = 9;

export default function Display({ item = "", linkTo = "", index = 0 }) {
  const { settings } = useCatalog();
  const load = !item || !linkTo;
  const primarySrc =
    productImageCandidates(item)[0] || PRODUCT_IMAGE_PLACEHOLDER;
  const [imageSrc, setImageSrc] = useState(primarySrc);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    setImageSrc(primarySrc);
    setImageLoaded(false);
  }, [primarySrc, item?.id]);

  useEffect(() => {
    const img = imageRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setImageLoaded(true);
    }
  }, [imageSrc]);

  if (load) {
    return <SpinnerComponent variant="compact" />;
  }

  const delay = Math.min(index, STAGGER_CAP) * STAGGER_MS;
  const kicker = item.brand || item.category || "";
  const pricing = productUnitPrice(item);
  const tags = Array.isArray(item.tags) ? item.tags.slice(0, 2) : [];
  const showNew = isNewProduct(item, settings.newBadgeDays);

  return (
    <Link
      to={linkTo}
      className={css.card}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Box className={css.imageWrap} bg="var(--card-well)">
        {showNew ? <span className={css.newBadge}>New</span> : null}
        <Image
          ref={imageRef}
          src={imageSrc}
          alt={item.title}
          bg="transparent"
          className={`${css.image} ${imageLoaded ? css.imageLoaded : ""}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            const next = productImageFallback(imageSrc, item);
            if (next !== imageSrc) {
              setImageLoaded(false);
              setImageSrc(next);
            }
          }}
        />
      </Box>
      <Box className={css.body}>
        {kicker ? <Text className={css.kicker}>{kicker}</Text> : null}
        <Text as="h3" className={css.title} data-testid="title">
          {item.title}
        </Text>
        {tags.length ? (
          <div className={css.tags}>
            {tags.map((tag) => (
              <span key={tag} className={css.tag}>
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <Text className={css.priceRow}>
          <span className={css.sale}>${formatMoney(pricing.sale)}</span>
          {pricing.pct > 0 ? (
            <span className={css.list}>${formatMoney(pricing.list)}</span>
          ) : null}
          <span className={css.viewCue} aria-hidden="true">
            View →
          </span>
        </Text>
      </Box>
    </Link>
  );
}
