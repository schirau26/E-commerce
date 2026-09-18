import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CatalogProvider } from "./context/CatalogContext";

function componentRender(ui) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter>
        <CatalogProvider>{ui}</CatalogProvider>
      </MemoryRouter>
    </ChakraProvider>,
  );
}

function componentRender(ui) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ChakraProvider>,
  );
}

export * from "@testing-library/react";
export { componentRender as render };
