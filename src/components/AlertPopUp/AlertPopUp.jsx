import { Alert, Dialog, Portal, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const errors = {
  noItem: { title: "error", value: "No item found , Try again" },
  serverFail: {
    title: "error",
    value: "Something went wrong with the server , Please try again later",
  },
  limitReached: {
    title: "info",
    value: "You have reached the maximum order quantity (per buyer)",
  },
};

export default function AlertPopUp({ type = "serverFail" }) {
  const [open, setOpen] = useState(true);
  const error = errors[type] ?? errors.serverFail;

  useEffect(() => {
    setOpen(true);
  }, [type]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      closeOnEscape={type === "limitReached"}
      closeOnInteractOutside={type === "limitReached"}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content h="auto" minW="300px">
            <Alert.Root status={error.title} h="100%">
              <Alert.Indicator />
              <Alert.Title>{error.value}</Alert.Title>
              {type === "limitReached" ? (
                <Button onClick={() => setOpen(false)}>Close</Button>
              ) : null}
            </Alert.Root>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
