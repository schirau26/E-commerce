import { Float, Circle, Box, Icon } from "@chakra-ui/react";
import { LuShoppingBag } from "react-icons/lu";
import { CartContext } from "../../App";
import { useContext } from "react";

export default function CartComponent() {
  const { cartProducts } = useContext(CartContext);

  return (
    <Box position="relative" display="flex" alignItems="center">
      <Icon as={LuShoppingBag} boxSize="22px" />
      <Float offset="2">
        <Circle size="4" bg="red" color="white" fontSize="10px">
          {cartProducts.length}
        </Circle>
      </Float>
    </Box>
  );
}
