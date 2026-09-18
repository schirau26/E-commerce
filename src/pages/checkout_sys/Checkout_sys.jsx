import {
  Button,
  Steps,
  Icon,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { createContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CartTable from "../../components/CartTable/CartTable";
import { LuArrowLeft, LuArrowRight, LuHouse } from "react-icons/lu";
import Receipt from "../../components/CartReceipt/CartReceipt";
import CartPayment from "../../components/CartPayment/CartPayment";
import CompleteCart from "../../components/CompleteCart/CompleteCart";

export const ReceiptContext = createContext();
export const PaymentContext = createContext();

export default function checkout() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [cardNumber, setCardNumber] = useState("");

  const canPlaceOrder = useMemo(() => {
    if (paymentMethod === "1") {
      return true;
    }
    const digits = cardNumber.replace(/\D/g, "");
    return digits.length >= 13;
  }, [paymentMethod, cardNumber]);

  return (
    <PaymentContext.Provider
      value={{
        paymentMethod,
        setPaymentMethod,
        cardNumber,
        setCardNumber,
      }}
    >
      <Steps.Root
        defaultStep={0}
        count={steps.length}
        width={"100%"}
        h={"100vh"}
        m={"0px auto"}
        paddingTop={"15px"}
        justifyContent={"space-between"}
      >
        <Steps.List paddingRight={"20px"} paddingLeft={"20px"}>
          {steps.map((step, index) => (
            <Steps.Item key={index} index={index} title={step.title}>
              <Steps.Indicator />
              {isMobile ? <></> : <Steps.Title>{step.title}</Steps.Title>}
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>
        {steps.map((step, index) => (
          <Steps.Content
            key={index}
            index={index}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            h={"100vh"}
            overflowY={step.title !== "Payment" ? "scroll" : ""}
          >
            {step.description}
            <Flex
              justifyContent={"space-around"}
              marginTop={"15px"}
              position="fixed"
              bottom="0"
              left="0"
              w={"100%"}
              bg={{
                base: "rgba(255, 255, 255)",
                md: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {step.title === "Cart" ? (
                <Link to={"/"}>
                  <Button variant={"ghost"}>
                    <Icon as={LuHouse}></Icon>
                    Home
                  </Button>
                </Link>
              ) : (
                <Steps.PrevTrigger asChild>
                  <Button variant={"ghost"}>
                    <Icon as={LuArrowLeft}></Icon>
                    Back
                  </Button>
                </Steps.PrevTrigger>
              )}
              {step.title === "Payment" ? (
                <Steps.NextTrigger asChild>
                  <Button variant={"ghost"} disabled={!canPlaceOrder}>
                    Place order <Icon as={LuArrowRight}></Icon>
                  </Button>
                </Steps.NextTrigger>
              ) : (
                <Steps.NextTrigger asChild>
                  <Button variant={"ghost"}>
                    Continue <Icon as={LuArrowRight}></Icon>
                  </Button>
                </Steps.NextTrigger>
              )}
            </Flex>
            {step.extra ? step.extra : ""}
          </Steps.Content>
        ))}
        <Steps.CompletedContent>
          <CompleteCart />
        </Steps.CompletedContent>
      </Steps.Root>
    </PaymentContext.Provider>
  );
}

const steps = [
  {
    title: "Cart",
    description: <CartTable />,
  },
  {
    title: "Receipt",
    description: <Receipt />,
  },
  {
    title: "Payment",
    description: <CartPayment />,
  },
];
