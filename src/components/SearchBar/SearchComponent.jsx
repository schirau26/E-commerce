import {
  Combobox,
  Dialog,
  Portal,
  Button,
  useFilter,
  useListCollection,
  useBreakpointValue,
  createOverlay,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { LuSearch } from "react-icons/lu";
import { allShopProducts } from "../../APIs/getAllProducts/getAllProducts";
import { categories } from "../../data/category_data";
import { UserContext } from "../../pages/home/Home";
import { searchQuery } from "../../APIs/getSearch/getSearchQuery";
import { useNavigate } from "react-router-dom";
import css from "./SearchComponent.module.css";

const searchOverlay = createOverlay((props) => {
  const { content, ...rest } = props;
  return (
    <Dialog.Root {...rest}>
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.600" />
        <Dialog.Positioner>
          <Dialog.Content
            mx="16px"
            width="calc(100% - 32px)"
            maxW="100%"
            height="auto"
          >
            <div className={css.dialogPanel}>{content}</div>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});

export default function SearchComponent({ model = "" }) {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const isMobile = useBreakpointValue({ base: true, md: false }) === true;
  const { setSearchProduct, page } = useContext(UserContext);

  const [storeProductsAPI, setStoreProductsAPI] = useState([
    { title: "Loading" },
  ]);

  useEffect(() => {
    (async () => {
      const products = await allShopProducts(categories);
      setStoreProductsAPI(products);
      set(products);
    })();
  }, []);

  async function sendSearchProduct(product) {
    try {
      const searchedProducts = await searchQuery(product);
      if (searchedProducts.length) {
        setSearchProduct(searchedProducts);
        searchOverlay.close("search");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function changeProduct(link) {
    navigate(`/ViewProduct/${link}`);
    searchOverlay.close("search");
  }

  function runSearch(value) {
    if (!value) {
      return;
    }
    if (page.current === "Home") {
      sendSearchProduct(value);
    } else {
      changeProduct(value);
    }
  }

  const { contains } = useFilter({ sensitivity: "base" });

  const { collection, filter, set } = useListCollection({
    initialItems: storeProductsAPI,
    filter: contains,
    itemToString: (item) => item.title,
    itemToValue: (item) => item.title,
  });

  const list = (
    <Combobox.Content className={isMobile ? css.inlineList : undefined}>
      <Combobox.Empty>No items found</Combobox.Empty>
      {collection.items.map((item, index) => (
        <Combobox.Item item={item} key={index}>
          {item.title}
          <Combobox.ItemIndicator />
        </Combobox.Item>
      ))}
    </Combobox.Content>
  );

  const combobox = (
    <Combobox.Root
      collection={collection}
      onInputValueChange={(e) => {
        filter(e.inputValue);
        setInputValue(e.inputValue);
      }}
      onValueChange={(e) => runSearch(e.value[0])}
      className={isMobile ? css.dialogRoot : css.root}
    >
      <Combobox.Label></Combobox.Label>
      <Combobox.Control className={css.control}>
        <LuSearch size={16} className={css.icon} aria-hidden="true" />
        <Combobox.Input
          className={css.input}
          placeholder="Search"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              runSearch(inputValue);
            }
          }}
        />
        <Combobox.IndicatorGroup className={css.indicators}>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      {isMobile ? (
        <div className={css.inlineResults}>{list}</div>
      ) : (
        <Combobox.Positioner>{list}</Combobox.Positioner>
      )}
    </Combobox.Root>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className={css.iconTrigger}
          aria-label="Search"
          onClick={() =>
            searchOverlay.open("search", {
              content: combobox,
            })
          }
        >
          <LuSearch size={22} />
        </Button>
        <searchOverlay.Viewport />
      </>
    );
  }

  return combobox;
}
