import { Button, Menu, Portal, Icon } from "@chakra-ui/react";
import { LuMenu } from "react-icons/lu";
import { categories } from "../../data/category_data";
import { UserContext } from "../../pages/home/Home";
import { useContext } from "react";
import { getCategory } from "../../APIs/getCategory/getCategory";
import { allShopProducts } from "../../APIs/getAllProducts/getAllProducts";

export default function MenuComponent() {
  const { setSearchProduct, page } = useContext(UserContext);
  const renderCategories = ["Show All", ...categories];

  async function getProducts(product) {
    if (page.current !== "Home") {
      return;
    }
    if (product === "Show All") {
      setSearchProduct(await allShopProducts(categories));
    } else {
      setSearchProduct(await getCategory(product));
    }
  }

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button
          size="sm"
          variant="ghost"
          px="1"
          aria-label="Categories"
        >
          <Icon as={LuMenu} boxSize="22px" />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {renderCategories.map((category, index) => (
              <Menu.Item
                key={index}
                asChild
                value={category}
                onClick={(e) => getProducts(e.target.innerText)}
              >
                <p>
                  {category.slice(0, 1).toUpperCase() + category.slice(1)}
                </p>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
