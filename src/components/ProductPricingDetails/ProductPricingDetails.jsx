import {
  Box,
  Stack,
  Heading,
  Text,
  Button,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { useState, createContext, useContext } from "react";
import { SelectedProduct } from "../../pages/ViewProduct/ViewProduct";
import { CartContext } from "../../App";
import SpinnerComponent from "../Spinner/SpinnerComponent";
import Rating from "../Rating/Rating";
import ProductSize from "../ProductSize/ProductSize";
import Quantity from "../Quantity/Quantity";

export const UserProductSize = createContext();

export default function ProductDescription() {
  const { addCart, getFreeCartId, inCart } = useContext(CartContext);
  const { product } = useContext(SelectedProduct);

  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = product?.stock > 5 ? 5 : Math.max(1, product?.stock || 1);
  const alreadyAdded = product ? inCart(product.id, size) : false;

  function enterToCart() {
    addCart({
      cartId: getFreeCartId(),
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity,
      cartPrice: product.price * quantity,
      stock: product.stock,
      size,
    });
  }

  return (
    <>
      <Box
        w={{ base: "100%", md: "50%" }}
        maxW={{ base: "480px" }}
        p={"20px"}
        rounded={"md"}
        marginTop={{ base: "25px", md: "0px" }}
        marginBottom={{ base: "40px", md: "0px" }}
        borderColor={"ThreeDFace"}
        borderWidth={"4px"}
      >
        {product ? (
          <>
            <Stack gap={{ base: "20px", md: "25px" }}>
              <Flex justifyContent={"space-between"}>
                <Heading fontSize={{ base: "19px", md: "22px" }}>
                  {product.title}
                </Heading>
                <Badge
                  colorPalette={
                    product.availabilityStatus === "In Stock" ? "green" : "red"
                  }
                >
                  {product.availabilityStatus}
                </Badge>
              </Flex>
              <Text fontSize={{ base: "13px", md: "15px" }}>
                {product.description}
              </Text>
              <Heading fontSize={{ base: "2xl", md: "3xl" }}>
                ${product.price}
              </Heading>
              <Flex gap={"10px"}>
                <Rating value={Math.round(product.rating)} />
                <Text fontSize={"14px"}>{product.rating}</Text>
              </Flex>
              <UserProductSize.Provider value={{ size, setSize }}>
                <ProductSize />
              </UserProductSize.Provider>
              <Quantity
                value={quantity}
                max={maxQuantity}
                onChange={setQuantity}
              />
              {alreadyAdded ? (
                <Button disabled>Item Added</Button>
              ) : (
                <Button onClick={enterToCart}>Add to Cart</Button>
              )}
            </Stack>
          </>
        ) : (
          <SpinnerComponent />
        )}
      </Box>
    </>
  );
}
