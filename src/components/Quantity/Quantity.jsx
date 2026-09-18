import { Box, Text, Flex, Button } from "@chakra-ui/react";

export default function Quantity({
  value = 1,
  onChange = () => {},
  min = 1,
  max = 5,
}) {
  const quantity = value;

  return (
    <>
      <Box>
        <Text fontSize={"15px"}>Quantity</Text>
        <Flex
          justifyContent={"space-around"}
          alignItems={"center"}
          borderColor={"ThreeDFace"}
          borderWidth={"2px"}
          w={"150px"}
          h={"45px"}
        >
          <Button
            variant={"ghost"}
            onClick={() => onChange(quantity <= min ? min : quantity - 1)}
          >
            -
          </Button>
          <Text>{quantity}</Text>

          <Button
            variant={"ghost"}
            onClick={() =>
              onChange(quantity >= max ? max : quantity + 1)
            }
          >
            +
          </Button>
        </Flex>
      </Box>
    </>
  );
}
