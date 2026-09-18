import { useState, createContext, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SelectedProduct } from "../../pages/ViewProduct/ViewProduct";
import { CartContext } from "../../App";
import SpinnerComponent from "../Spinner/SpinnerComponent";
import Rating from "../Rating/Rating";
import ProductSize from "../ProductSize/ProductSize";
import Quantity from "../Quantity/Quantity";
import CollapsibleComponent from "../CollapsibleComponent/CollapsibleComponent";
import { productUnitPrice, formatMoney } from "../../utils/pricing";
import {
  isNewProduct,
  quantityBounds,
  quantityForCart,
} from "../../utils/inventory";
import { useCatalog } from "../../context/CatalogContext";
import { loginPath, useAuth } from "../../context/AuthContext";
import css from "./ProductPricingDetails.module.css";

export const UserProductSize = createContext();

function clip(text, max = 72) {
  if (!text) {
    return "";
  }
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export default function ProductDescription() {
  const { addCart, getFreeCartId, inCart, cartProducts } = useContext(CartContext);
  const { product } = useContext(SelectedProduct);
  const { settings } = useCatalog();
  const { canCart } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [flash, setFlash] = useState(false);

  const alreadyAdded = product ? inCart(product.id, size) : false;
  const reserved = (cartProducts || [])
    .filter((line) => line.id === product?.id)
    .reduce((sum, line) => sum + (Number(line.quantity) || 0), 0);
  const bounds = quantityBounds(product, reserved);
  const pricing = productUnitPrice(product);
  const kicker = product?.brand || product?.category || "";
  const showNew = isNewProduct(product, settings.newBadgeDays);
  const lowStock =
    bounds.canBuy &&
    (product?.availabilityStatus === "Low Stock" ||
      product?.stock <= settings.lowStockAt);

  useEffect(() => {
    if (bounds.canBuy) {
      setQuantity((current) => Math.min(bounds.max, Math.max(1, current || 1)));
    } else {
      setQuantity(1);
    }
  }, [product?.id, bounds.canBuy, bounds.max]);

  function enterToCart() {
    if (!canCart) {
      navigate(loginPath(`${location.pathname}${location.search}`));
      return;
    }
    if (!bounds.canBuy || alreadyAdded) {
      return;
    }
    const qty = quantityForCart(quantity, bounds);
    if (!qty) {
      return;
    }
    setQuantity(qty);
    addCart({
      cartId: getFreeCartId(),
      id: product.id,
      title: product.title,
      price: pricing.sale,
      listPrice: pricing.list,
      discountPercentage: pricing.pct,
      thumbnail: product.images?.[0] || product.thumbnail,
      quantity: qty,
      cartPrice: Number((pricing.sale * qty).toFixed(2)),
      stock: product.stock,
      sku: product.sku || "",
      size,
    });
    setFlash(true);
    window.setTimeout(() => setFlash(false), 600);
  }

  if (!product) {
    return <SpinnerComponent />;
  }

  const buttonLabel = flash
    ? "Added"
    : alreadyAdded
      ? "Item Added"
      : "Add to cart";

  return (
    <div className={css.buy}>
      {kicker ? <p className={css.kicker}>{kicker}</p> : null}
      <div className={css.titleRow}>
        <h1 className={css.title}>
          {product.title}
          {showNew ? <span className={css.newMark}>New</span> : null}
        </h1>
        <div className={css.rating}>
          <Rating value={Math.round(product.rating)} size="xs" />
          <span className={css.ratingValue}>{product.rating}</span>
        </div>
      </div>
      <div className={css.priceRow}>
        <span className={css.sale}>${formatMoney(pricing.sale)}</span>
        {pricing.pct > 0 ? (
          <>
            <span className={css.list}>${formatMoney(pricing.list)}</span>
            <span className={css.off}>-{Math.round(pricing.pct)}%</span>
          </>
        ) : null}
      </div>
      <UserProductSize.Provider value={{ size, setSize }}>
        <ProductSize />
      </UserProductSize.Provider>
      <div>
        <Quantity
          value={quantity}
          min={bounds.min || 1}
          max={bounds.max || 1}
          onChange={setQuantity}
          variant="pdp"
        />
        <p className={css.stock}>
          {bounds.outOfStock
            ? "Out of stock"
            : !bounds.canBuy
              ? "Limit of 5 per product"
              : lowStock
                ? product.availabilityStatus || "Low stock"
                : `${product.stock} in stock`}
        </p>
      </div>
      <button
        type="button"
        className={css.addCart}
        onClick={enterToCart}
        disabled={canCart && (alreadyAdded || !bounds.canBuy)}
      >
        {!canCart
          ? "Log in to add"
          : bounds.outOfStock
            ? "Out of stock"
            : alreadyAdded
              ? buttonLabel
              : !bounds.canBuy
                ? "Limit reached"
                : buttonLabel}
      </button>
      <ul className={css.trust}>
        {product.shippingInformation ? (
          <li>{clip(product.shippingInformation)}</li>
        ) : null}
        {product.warrantyInformation ? (
          <li>{clip(product.warrantyInformation)}</li>
        ) : null}
        {product.returnPolicy ? <li>{clip(product.returnPolicy)}</li> : null}
      </ul>
      {product.description ? (
        <p className={css.blurb}>{clip(product.description, 140)}</p>
      ) : null}
      <div className={css.accordions}>
        <CollapsibleComponent
          title="Description"
          content={product.description}
        />
        <CollapsibleComponent
          title="Shipping & Returns"
          content={
            <>
              {product.shippingInformation ? (
                <p className={css.detailLine}>{product.shippingInformation}</p>
              ) : null}
              {product.returnPolicy ? (
                <p className={css.detailLine}>{product.returnPolicy}</p>
              ) : null}
            </>
          }
        />
        <CollapsibleComponent
          title="Details"
          content={
            <>
              {product.dimensions ? (
                <p className={css.detailLine}>
                  {product.dimensions.width} × {product.dimensions.depth} ×{" "}
                  {product.dimensions.height}
                </p>
              ) : null}
              <p className={css.detailLine}>SKU · {product.sku || "—"}</p>
              {product.meta?.qrCode ? (
                <img
                  className={css.qr}
                  src={product.meta.qrCode}
                  alt={`QR code for ${product.sku || product.title}`}
                />
              ) : null}
              <p className={css.detailLine}>Stock: {product.stock}</p>
              <p className={css.detailLine}>Weight: {product.weight}</p>
              {product.warrantyInformation ? (
                <p className={css.detailLine}>{product.warrantyInformation}</p>
              ) : null}
              {product.tags?.length ? (
                <div className={css.chips}>
                  {product.tags.map((tag) => (
                    <span className={css.chip} key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </>
          }
        />
      </div>
    </div>
  );
}
