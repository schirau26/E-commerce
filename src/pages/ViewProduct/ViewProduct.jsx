import { useState, useEffect, createContext, useRef } from "react";
import { searchQuery } from "../../APIs/getSearch/getSearchQuery";
import { getProductById } from "../../APIs/getProduct/getProduct";
import ProductDescription from "../../components/ProductPricingDetails/ProductPricingDetails";
import ProductDetails from "../../components/ProductExtraData/ProductExtraData";
import ProductImage from "../../components/ProductImage/ProductImage";
import RelatedProducts from "../../components/RelatedProducts/RelatedProducts";
import SpinnerComponent from "../../components/Spinner/SpinnerComponent";
import NavBar from "../../components/NavBar/Navbar";
import { UserContext } from "../home/Home";
import { useParams } from "react-router-dom";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import AlertPopUp from "../../components/AlertPopUp/AlertPopUp";
import ErrorIcon from "../../components/ErrorIcon/ErrorIcon";
import { useCatalog } from "../../context/CatalogContext";
import css from "./ViewProduct.module.css";

export const SelectedProduct = createContext();

export default function ViewProduct() {
  const { settings, withStock, logEvent } = useCatalog();
  const [product, setProduct] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const { productId } = useParams();
  const page = useRef("View Page");
  const [alert, setAlert] = useState({ bool: false, type: "" });
  useEffect(() => {
    (async () => {
      try {
        setAlert({ bool: false, type: "" });
        setProduct("");
        let response = null;
        if (/^\d+$/.test(String(productId))) {
          response = await getProductById(productId);
        }
        if (!response) {
          const matches = await searchQuery(
            productId,
            settings.enabledCategories,
          );
          response = matches[0] || null;
        }
        if (!response) {
          setAlert({ bool: true, type: "noItem" });
          return;
        }
        setProduct(response);
      } catch (err) {
        setAlert({ bool: true, type: "serverFail" });
        logEvent({
          type: "server_fail",
          message: "Product page failed to load",
          detail: String(productId),
        });
        console.error("Something went wrong", err);
      }
    })();
  }, [productId]);

  const liveProduct = product ? withStock(product) : product;

  return (
    <>
      <UserContext.Provider value={{ searchProduct, setSearchProduct, page, setAlert }}>
        <NavBar />
      </UserContext.Provider>

      {alert.bool ? <AlertPopUp type={alert.type} /> : null}

      {liveProduct ? (
        <SelectedProduct.Provider value={{ product: liveProduct }}>
          <div className={css.page}>
            <div className={css.layout}>
              <div className={css.gallery}>
                <ProductImage />
              </div>
              <div className={css.buy}>
                <ProductDescription />
              </div>
            </div>
            <div className={css.reviews}>
              <ProductDetails />
            </div>
            <RelatedProducts product={liveProduct} />
          </div>
        </SelectedProduct.Provider>
      ) : alert.bool ? (
        <ErrorIcon type={alert.type} />
      ) : (
        <SpinnerComponent />
      )}
      <FooterComponent />
    </>
  );
}
