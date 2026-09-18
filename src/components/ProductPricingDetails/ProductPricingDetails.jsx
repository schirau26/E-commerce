import { useState, createContext, useContext } from "react";
import { SelectedProduct } from "../../pages/ViewProduct/ViewProduct";
import { CartContext } from "../../App";
import SpinnerComponent from "../Spinner/SpinnerComponent";
import Rating from "../Rating/Rating";
import ProductSize from "../ProductSize/ProductSize";
import Quantity from "../Quantity/Quantity";
import CollapsibleComponent from "../CollapsibleComponent/CollapsibleComponent";
import { productUnitPrice, formatMoney } from "../../utils/pricing";
import css from "./ProductPricingDetails.module.css";

export const UserProductSize = createContext();

function clip(text, max = 72) {
  if (!text) {
    return "";
  }
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

export default function ProductDescription() {
  const { addCart, getFreeCartId, inCart } = useContext(CartContext);
  const { product } = useContext(SelectedProduct);

  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [flash, setFlash] = useState(false);

  const maxQuantity = product?.stock > 5 ? 5 : Math.max(1, product?.stock || 1);
  const alreadyAdded = product ? inCart(product.id, size) : false;
  const pricing = productUnitPrice(product);
  const kicker = product?.brand || product?.category || "";

  function enterToCart() {
    addCart({
      cartId: getFreeCartId(),
      id: product.id,
      title: product.title,
      price: pricing.sale,
      listPrice: pricing.list,
      discountPercentage: pricing.pct,
      thumbnail: product.thumbnail,
      quantity,
      cartPrice: Number((pricing.sale * quantity).toFixed(2)),
      stock: product.stock,
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
        <h1 className={css.title}>{product.title}</h1>
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
          max={maxQuantity}
          onChange={setQuantity}
          variant="pdp"
        />
        <p className={css.stock}>
          {product.availabilityStatus === "Low Stock" || product.stock < 10
            ? product.availabilityStatus || "Low stock"
            : `${product.stock} in stock`}
        </p>
      </div>
      <button
        type="button"
        className={css.addCart}
        onClick={enterToCart}
        disabled={alreadyAdded}
      >
        {buttonLabel}
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
