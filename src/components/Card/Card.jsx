import { Box, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SpinnerComponent from "../Spinner/SpinnerComponent";
import css from "./Card.module.css";
import { useEffect, useRef, useState } from "react";
import { productUnitPrice, formatMoney } from "../../utils/pricing";

const STAGGER_MS = 40;
const STAGGER_CAP = 9;

export default function Display({ item = "", linkTo = "", index = 0 }) {
  const load = !item || !linkTo;
  const imageSrc = item?.images?.[0] || item?.thumbnail;
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    setImageLoaded(false);
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

  return (
    <Link
      to={linkTo}
      className={css.card}
      style={{ animationDelay: `${delay}ms` }}
    >
      <Box className={css.imageWrap}>
        <Image
          ref={imageRef}
          src={imageSrc}
          alt={item.title}
          className={`${css.image} ${imageLoaded ? css.imageLoaded : ""}`}
          onLoad={() => setImageLoaded(true)}
        />
      </Box>
      <Box className={css.body}>
        {kicker ? <Text className={css.kicker}>{kicker}</Text> : null}
        <Text as="h3" className={css.title} data-testid="title">
          {item.title}
        </Text>
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
