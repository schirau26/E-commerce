import {
  AspectRatio,
  Image,
  Container,
  Box,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { SelectedProduct } from "../../pages/ViewProduct/ViewProduct";
import HorizontalScrolling from "../HorizontalScrolling/HorinzontalScrolling";
import SpinnerComponent from "../Spinner/SpinnerComponent";

export default function ProductImage({ productTitle = "" }) {
  const { product } = useContext(SelectedProduct);
  const [selectedImage, setSelectedImage] = useState();

  return (
    <>
      <Box w="100%" maxW={{ base: "440px", md: "350px" }}>
        {product ? (
          <>
            <AspectRatio
              borderRadius={"10px"}
              bg="bg.muted"
              maxW={{ base: "100%", md: "350px" }}
              // h={{ md: "100%" }}
              ratio={1 / 1}
            >
              <Image
                src={selectedImage ? selectedImage : product.images[0]}
                objectFit={"cover"}
              />
            </AspectRatio>
            <HorizontalScrolling
              render={product.images.map((imageURL, index) => {
                return (
                  <AspectRatio
                    key={index}
                    ratio={1 / 1}
                    width={"19%"}
                    h={"auto"}
                    bg={imageURL === selectedImage ? "bg.muted" : "none"}
                  >
                    <Image
                      src={imageURL}
                      onClick={() => setSelectedImage(imageURL)}
                    />
                  </AspectRatio>
                );
              })}
            />
          </>
        ) : (
          <SpinnerComponent />
        )}
      </Box>
    </>
  );
}
