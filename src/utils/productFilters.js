import { productUnitPrice } from "./pricing";

export const PRICE_RANGES = [
  { id: "0-50", label: "$0-$50", min: 0, max: 50 },
  { id: "50-75", label: "$50-$75", min: 50, max: 75 },
  { id: "75-150", label: "$75-$150", min: 75, max: 150 },
  { id: "over-150", label: "Over $150", min: 150, max: Infinity },
];

export const SORT_OPTIONS = [
  { id: "price-desc", label: "Price: High to Low" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "rating-desc", label: "Rating: High to Low" },
  { id: "rating-asc", label: "Rating: Low to High" },
];

export const RATING_OPTIONS = [
  { value: 5, label: "5" },
  { value: 4, label: "4+" },
  { value: 3, label: "3+" },
  { value: 2, label: "2+" },
  { value: 1, label: "1+" },
];

export function createEmptyFilters() {
  return {
    categories: [],
    brands: [],
    priceRanges: [],
    minPrice: "",
    maxPrice: "",
    rating: null,
    sort: "",
  };
}

export const EMPTY_FILTERS = createEmptyFilters();

export function formatCategoryLabel(value) {
  return String(value || "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function inPriceRange(sale, range) {
  if (range.max === Infinity) {
    return sale >= range.min;
  }
  return sale >= range.min && sale <= range.max;
}

export function applyProductFilters(
  products,
  filters = EMPTY_FILTERS,
  options = {},
) {
  if (!Array.isArray(products)) {
    return [];
  }

  const minP = filters.minPrice === "" ? null : Number(filters.minPrice);
  const maxP = filters.maxPrice === "" ? null : Number(filters.maxPrice);
  const hideOutOfStock = Boolean(options.hideOutOfStock);

  let list = products.filter((product) => {
    if (hideOutOfStock) {
      const stock = Number(product.stock) || 0;
      if (stock === 0 || product.availabilityStatus === "Out of Stock") {
        return false;
      }
    }

    if (
      filters.categories?.length &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }

    if (filters.brands?.length && !filters.brands.includes(product.brand)) {
      return false;
    }

    const sale = productUnitPrice(product).sale;

    if (filters.priceRanges?.length) {
      const match = filters.priceRanges.some((id) => {
        const range = PRICE_RANGES.find((item) => item.id === id);
        return range ? inPriceRange(sale, range) : false;
      });
      if (!match) {
        return false;
      }
    }

    if (minP !== null && !Number.isNaN(minP) && sale < minP) {
      return false;
    }
    if (maxP !== null && !Number.isNaN(maxP) && sale > maxP) {
      return false;
    }

    if (filters.rating && (Number(product.rating) || 0) < filters.rating) {
      return false;
    }

    return true;
  });

  const sort = filters.sort || options.defaultSort || "";

  if (sort === "price-desc") {
    list = [...list].sort(
      (a, b) => productUnitPrice(b).sale - productUnitPrice(a).sale,
    );
  } else if (sort === "price-asc") {
    list = [...list].sort(
      (a, b) => productUnitPrice(a).sale - productUnitPrice(b).sale,
    );
  } else if (sort === "rating-desc") {
    list = [...list].sort(
      (a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0),
    );
  } else if (sort === "rating-asc") {
    list = [...list].sort(
      (a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0),
    );
  }

  return list;
}
