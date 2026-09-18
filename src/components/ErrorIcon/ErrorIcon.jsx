import { LuSearch } from "react-icons/lu";
import { IoCloudOffline } from "react-icons/io5";
import { FaDropbox } from "react-icons/fa6";
import { Box, AbsoluteCenter, VStack, Text, Button } from "@chakra-ui/react";

export default function ErrorIcon({ type = "serverFail", onRetry }) {
  const error = {
    serverFail: {
      msg: "Internal Server Error",
      icon: <IoCloudOffline size={80} />,
    },
    noItem: {
      msg: "No items found",
      icon: <FaDropbox size={80} />,
    },
  };
  const display = error[type] || error.serverFail;

  return (
    <>
      <Box position="relative" w={"100%"} h={"85vh"}>
        <AbsoluteCenter>
          <VStack colorPalette="teal">
            {display.icon}
            <Text color="black">{display.msg}</Text>
            {onRetry ? (
              <Button onClick={onRetry} variant="outline">
                Retry
              </Button>
            ) : null}
          </VStack>
        </AbsoluteCenter>
      </Box>
    </>
  );
}
