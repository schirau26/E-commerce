import {
  Box,
  Heading,
  Card,
  Image,
  HStack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { LuX, LuDelete, LuTrash } from "react-icons/lu";
import CartTableHeading from "../CartTableHeading/CartTableHeading";
import { useContext } from "react";
import MobileStepper from "../MobileStepper/MobileStepper";
import { CartContext } from "../../App";

export default function CartTable() {
  const { cartProducts, deleteCartItem } = useContext(CartContext);

  return (
    <>
      <Flex
        flexDirection={"column"}
        gap="15px"
        marginLeft={{ base: "5px", md: "20px" }}
        marginBottom={{ base: "50px" }}
      >
        <Heading>Order Summary</Heading>
        {cartProducts ? (
          cartProducts.map((item) => {
            return (
              <Card.Root
                key={item.cartId}
                flexDirection="row"
                overflow="hidden"
                maxW="xl"
                h={"auto"}
              >
                <Image
                  objectFit="fit"
                  maxW="150px"
                  w={{ base: "100px", md: "130px" }}
                  h={{ base: "100px", md: "130px" }}
                  src={item.thumbnail}
                  alt={item.title}
                />
                <Box w={"100%"}>
                  <Card.Body>
                    <HStack gap={"20px"}>
                      <Flex justifyContent={"space-between"} w={"100%"}>
                        <Card.Title
                          mb="2"
                          fontSize={{ base: "14px", md: "17px" }}
                        >
                          {item.title}
                          {item.size ? ` · ${item.size}` : ""}
                        </Card.Title>
                        <Icon
                          as={LuTrash}
                          size={"md"}
                          bg={{
                            base: "colorPalette.100",
                            _hover: "colorPalette.200",
                          }}
                          onClick={() => deleteCartItem(item.cartId)}
                        ></Icon>
                      </Flex>
                    </HStack>
                    <Card.Description>
                      ${item.cartPrice.toFixed(2)}
                    </Card.Description>
                    <HStack mt="4">
                      <MobileStepper item={item} />
                    </HStack>
                  </Card.Body>
                </Box>
              </Card.Root>
            );
          })
        ) : (
          <p>Loading</p>
        )}
      </Flex>
    </>
  );
}
