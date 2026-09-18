import { useState, useEffect, createContext, useRef } from "react";
import { searchQuery } from "../../APIs/getSearch/getSearchQuery";
import { getProductById } from "../../APIs/getProduct/getProduct";
import ProductDescription from "../../components/ProductPricingDetails/ProductPricingDetails";
import ProductDetails from "../../components/ProductExtraData/ProductExtraData";
import ProductImage from "../../components/ProductImage/ProductImage";
import SpinnerComponent from "../../components/Spinner/SpinnerComponent";
import NavBar from "../../components/NavBar/Navbar";
import { Flex, Box } from "@chakra-ui/react";
import { UserContext } from "../home/Home";
import { useParams } from "react-router-dom";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import AlertPopUp from "../../components/AlertPopUp/AlertPopUp";
import ErrorIcon from "../../components/ErrorIcon/ErrorIcon";

export const SelectedProduct = createContext();

export default function ViewProduct() {
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
          const matches = await searchQuery(productId);
          response = matches[0] || null;
        }
        if (!response) {
          setAlert({ bool: true, type: "noItem" });
          return;
        }
        setProduct(response);
      } catch (err) {
        setAlert({ bool: true, type: "serverFail" });
        console.error("Something went wrong", err);
      }
    })();
  }, [productId]);

  return (
    <>
      {/* The context provides placeholder due to navbar expecting one , but it has not general use */}
      <UserContext.Provider value={{ searchProduct, setSearchProduct, page }}>
        <NavBar />
      </UserContext.Provider>

      {alert.bool ? <AlertPopUp type={alert.type} /> : null}

      {product ? (
        <>
          <SelectedProduct.Provider value={{ product: product }}>
            <Flex
              marginBottom={{ base: "0px", md: "100px" }}
              marginTop={{ base: "0px", md: "40px" }}
              m="auto"
              direction={{ base: "column", md: "row" }}
              justifyContent="space-around"
              align={"center"}
              w={"100%"}
              maxW="1200px"
              p={"10px"}
            >
              <ProductImage />
              <ProductDescription />
            </Flex>
            <Box
              paddingLeft={{ base: "10px", md: "30px" }}
              marginBottom={"40px"}
            >
              <ProductDetails />
            </Box>
          </SelectedProduct.Provider>
        </>
      ) : alert.bool ? (
        <ErrorIcon type={alert.type} />
      ) : (
        <SpinnerComponent />
      )}
      <FooterComponent />
    </>
  );
}

// You need to add:
// Color Selection
