import {
  Fieldset,
  Field,
  Stack,
  Input,
  Portal,
  Select,
  Text,
  HStack,
  createListCollection,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useContext } from "react";
import { PaymentContext } from "../../pages/checkout_sys/Checkout_sys";

const month = createListCollection({
  items: Array.from({ length: 12 }, (_, i) => ({
    label: String(i + 1),
    value: String(i + 1),
  })),
});

const currentYear = new Date().getFullYear();
const year = createListCollection({
  items: Array.from({ length: 10 }, (_, i) => ({
    label: String(currentYear + i),
    value: String(currentYear + i),
  })),
});

export default function OnlinePayment() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { cardNumber, setCardNumber } = useContext(PaymentContext);

  return (
    <>
      <Fieldset.Root
        size="lg"
        w="50%"
        minW="270px"
        maxW="400px"
        margin={{ base: "10px 10px 50px", md: "30px 30px" }}
      >
        <Stack>
          <Fieldset.Legend>Card details</Fieldset.Legend>
          <Fieldset.HelperText>
            Please provide your card details below.
          </Fieldset.HelperText>
        </Stack>

        <Fieldset.Content>
          <Field.Root>
            <Field.Label>Card Holder's Name</Field.Label>
            <Input name="cardHolder" autoComplete="cc-name" />
          </Field.Root>

          <Field.Root>
            <Field.Label>Card Number</Field.Label>
            <Input
              name="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="cc-number"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
          </Field.Root>

          <HStack>
            <Text>Card's Exp</Text>
            {isMobile ? <br></br> : ""}
            <Select.Root collection={month} size="sm" width="100px">
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Month" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {month.items.map((framework) => (
                      <Select.Item item={framework} key={framework.value}>
                        {framework.value}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
            {"/"}
            <Select.Root collection={year} size="sm" width="100px">
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Year" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {year.items.map((framework) => (
                      <Select.Item item={framework} key={framework.value}>
                        {framework.value}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </HStack>
          <HStack>
            <Text>CVV</Text>
            <Input
              type="text"
              placeholder="CVV"
              maxLength={4}
              name="cvvNumber"
              inputMode="numeric"
              autoComplete="cc-csc"
              width={"99px"}
            />
          </HStack>
        </Fieldset.Content>
      </Fieldset.Root>
    </>
  );
}
