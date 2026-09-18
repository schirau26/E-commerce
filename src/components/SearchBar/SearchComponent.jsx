import {
  Combobox,
  Dialog,
  Portal,
  Button,
  useFilter,
  useListCollection,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { LuSearch } from "react-icons/lu";
import { allShopProducts } from "../../APIs/getAllProducts/getAllProducts";
import { UserContext } from "../../pages/home/Home";
import { searchQuery } from "../../APIs/getSearch/getSearchQuery";
import { HOME_PRODUCT_SELECT } from "../../utils/catalogSettings";
import { useCatalog } from "../../context/CatalogContext";
import { useNavigate } from "react-router-dom";
import css from "./SearchComponent.module.css";

export default function SearchComponent() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false }) === true;
  const { setSearchProduct, page, setAlert } = useContext(UserContext);
  const { settings, withStock, catalogTick, logEvent } = useCatalog();

  const [storeProductsAPI, setStoreProductsAPI] = useState([
    { title: "Loading" },
  ]);

  const { contains } = useFilter({ sensitivity: "base" });

  const { collection, filter, set } = useListCollection({
    initialItems: storeProductsAPI,
    filter: contains,
    itemToString: (item) => item.title,
    itemToValue: (item) => String(item.id ?? item.title),
  });

  useEffect(() => {
    (async () => {
      try {
        const products = await allShopProducts(settings.enabledCategories, {
          select: HOME_PRODUCT_SELECT,
        });
        const mapped = products.map(withStock);
        setStoreProductsAPI(mapped);
        set(mapped);
      } catch (error) {
        console.log(error);
        setStoreProductsAPI([]);
        set([]);
      }
    })();
  }, [settings.enabledCategories, catalogTick, withStock]);

  function closeMobileSearch() {
    setMobileOpen(false);
  }

  async function sendSearchProduct(product) {
    try {
      const searchedProducts = await searchQuery(
        product,
        settings.enabledCategories,
      );
      setSearchProduct(searchedProducts.map(withStock));
      closeMobileSearch();
    } catch (error) {
      console.log(error);
      setAlert?.({ bool: true, type: "serverFail" });
      logEvent({ type: "search_fail", message: "Product search failed" });
    }
  }

  function changeProduct(id) {
    if (!id) {
      return;
    }
    navigate(`/ViewProduct/${id}`);
    closeMobileSearch();
  }

  function findItem(value) {
    return collection.items.find(
      (item) => String(item.id) === String(value) || item.title === value,
    );
  }

  function runSearch(value) {
    if (!value) {
      return;
    }
    const selected = findItem(value);
    if (page.current === "Home") {
      sendSearchProduct(selected?.title ?? value);
    } else {
      changeProduct(selected?.id ?? value);
    }
  }

  const list = (
    <Combobox.Content className={isMobile ? css.inlineList : undefined}>
      <Combobox.Empty>No items found</Combobox.Empty>
      {collection.items.map((item, index) => (
        <Combobox.Item item={item} key={item.id ?? index}>
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
          onClick={() => setMobileOpen(true)}
        >
          <LuSearch size={22} />
        </Button>
        <Dialog.Root
          open={mobileOpen}
          onOpenChange={(e) => setMobileOpen(e.open)}
        >
          <Portal>
            <Dialog.Backdrop bg="blackAlpha.600" />
            <Dialog.Positioner>
              <Dialog.Content
                mx="16px"
                width="calc(100% - 32px)"
                maxW="100%"
                height="auto"
              >
                <div className={css.dialogPanel}>{combobox}</div>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      </>
    );
  }

  return combobox;
}
