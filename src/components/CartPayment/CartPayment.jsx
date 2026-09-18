import {
  Field,
  Fieldset,
  Input,
  Stack,
  HStack,
  RadioGroup,
  Flex,
} from "@chakra-ui/react";
import { useContext } from "react";
import OnlinePayment from "../OnlinePayment/OnlinePayment";
import { PaymentContext } from "../../pages/checkout_sys/Checkout_sys";

export default function CartPayment() {
  const { paymentMethod, setPaymentMethod } = useContext(PaymentContext);
  const displayBankCard = paymentMethod === "2";

  return (
    <>
      <Flex flexDirection={{ base: "column", md: "row" }} marginBottom={"50px"}>
        <Fieldset.Root
          size="lg"
          w="50%"
          minW="270px"
          maxW="400px"
          margin={{ base: "10px 10px", md: "30px 30px" }}
        >
          <Stack>
            <Fieldset.Legend>Contact details</Fieldset.Legend>
            <Fieldset.HelperText>
              Please provide your contact details below.
            </Fieldset.HelperText>
          </Stack>

          <form>
            <Fieldset.Content>
              <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input name="name" required />
              </Field.Root>

              <Field.Root>
                <Field.Label>Email address</Field.Label>
                <Input name="email" type="email" />
              </Field.Root>

              <Field.Root>
                <Field.Label>Contact</Field.Label>
                <Input name="contact" type="text" />
              </Field.Root>

              <Field.Root>
                <Field.Label>Address</Field.Label>
                <Input name="address" type="text" />
              </Field.Root>
            </Fieldset.Content>
          </form>

          <Stack>
            <Fieldset.Legend>Payment Method</Fieldset.Legend>
            <RadioGroup.Root
              value={paymentMethod}
              onValueChange={(e) => setPaymentMethod(e.value)}
            >
              <HStack gap="6">
                {items.map((item) => (
                  <RadioGroup.Item key={item.value} value={item.value}>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                    <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
                  </RadioGroup.Item>
                ))}
              </HStack>
            </RadioGroup.Root>
          </Stack>
        </Fieldset.Root>
        {displayBankCard ? <OnlinePayment /> : null}
      </Flex>
    </>
  );
}

const items = [
  { label: "Cash on delivery", value: "1" },
  { label: "Online Payment", value: "2" },
];
