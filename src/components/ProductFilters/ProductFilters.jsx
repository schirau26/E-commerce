import {
  createEmptyFilters,
  PRICE_RANGES,
  RATING_OPTIONS,
  SORT_OPTIONS,
  formatCategoryLabel,
} from "../../utils/productFilters";
import { useCatalog } from "../../context/CatalogContext";
import css from "./ProductFilters.module.css";

export default function ProductFilters({
  filters,
  onChange = () => {},
  id = "filters",
  products = [],
}) {
  const { settings } = useCatalog();
  const categories = settings.enabledCategories || [];
  const brands = [
    ...new Set(
      products.map((item) => item.brand).filter((brand) => Boolean(brand)),
    ),
  ].sort();
  function update(patch) {
    onChange({ ...filters, ...patch });
  }

  function toggleCategory(value) {
    const selected = filters.categories.includes(value)
      ? filters.categories.filter((item) => item !== value)
      : [...filters.categories, value];
    update({ categories: selected });
  }

  function toggleBrand(value) {
    const current = filters.brands || [];
    const selected = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    update({ brands: selected });
  }

  function togglePriceRange(id) {
    const selected = filters.priceRanges.includes(id)
      ? filters.priceRanges.filter((item) => item !== id)
      : [...filters.priceRanges, id];
    update({ priceRanges: selected });
  }

  function removeChip(chip) {
    if (chip.type === "category") {
      toggleCategory(chip.value);
    } else if (chip.type === "brand") {
      toggleBrand(chip.value);
    } else if (chip.type === "priceRange") {
      togglePriceRange(chip.value);
    } else if (chip.type === "minPrice") {
      update({ minPrice: "" });
    } else if (chip.type === "maxPrice") {
      update({ maxPrice: "" });
    } else if (chip.type === "rating") {
      update({ rating: null });
    } else if (chip.type === "sort") {
      update({ sort: "" });
    }
  }

  const chips = [];
  filters.categories.forEach((value) => {
    chips.push({
      id: `cat-${value}`,
      type: "category",
      value,
      label: formatCategoryLabel(value),
    });
  });
  filters.brands?.forEach((value) => {
    chips.push({
      id: `brand-${value}`,
      type: "brand",
      value,
      label: value,
    });
  });
  filters.priceRanges.forEach((value) => {
    const range = PRICE_RANGES.find((item) => item.id === value);
    chips.push({
      id: `price-${value}`,
      type: "priceRange",
      value,
      label: range?.label || value,
    });
  });
  if (filters.minPrice !== "") {
    chips.push({
      id: "minPrice",
      type: "minPrice",
      label: `Min $${filters.minPrice}`,
    });
  }
  if (filters.maxPrice !== "") {
    chips.push({
      id: "maxPrice",
      type: "maxPrice",
      label: `Max $${filters.maxPrice}`,
    });
  }
  if (filters.rating) {
    const rating = RATING_OPTIONS.find((item) => item.value === filters.rating);
    chips.push({
      id: "rating",
      type: "rating",
      label: `${rating?.label || filters.rating} ★`,
    });
  }
  if (filters.sort) {
    const sort = SORT_OPTIONS.find((item) => item.id === filters.sort);
    chips.push({
      id: "sort",
      type: "sort",
      label: sort?.label || filters.sort,
    });
  }

  return (
    <section className={css.panel}>
      <div className={css.header}>
        <h2 className={css.title}>Filters</h2>
        <button
          type="button"
          className={css.clear}
          onClick={() => onChange(createEmptyFilters())}
        >
          Clear all
        </button>
      </div>

      {chips.length ? (
        <div className={css.chips}>
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className={css.chip}
              onClick={() => removeChip(chip)}
            >
              {chip.label}
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      ) : null}

      <details className={css.group}>
        <summary>Category</summary>
        <div className={css.options}>
          {categories.map((category) => (
            <label key={category} className={css.option}>
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
              />
              {formatCategoryLabel(category)}
            </label>
          ))}
        </div>
      </details>

      {brands.length ? (
        <details className={css.group}>
          <summary>Brand</summary>
          <div className={css.options}>
            {brands.map((brand) => (
              <label key={brand} className={css.option}>
                <input
                  type="checkbox"
                  checked={(filters.brands || []).includes(brand)}
                  onChange={() => toggleBrand(brand)}
                />
                {brand}
              </label>
            ))}
          </div>
        </details>
      ) : null}

      <details className={css.group}>
        <summary>Price</summary>
        <div className={css.options}>
          {PRICE_RANGES.map((range) => (
            <label key={range.id} className={css.option}>
              <input
                type="checkbox"
                checked={filters.priceRanges.includes(range.id)}
                onChange={() => togglePriceRange(range.id)}
              />
              {range.label}
            </label>
          ))}
          <div className={css.minmax}>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(event) => update({ minPrice: event.target.value })}
            />
            <span>–</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(event) => update({ maxPrice: event.target.value })}
            />
          </div>
        </div>
      </details>

      <details className={css.group}>
        <summary>Rating</summary>
        <div className={css.options}>
          {RATING_OPTIONS.map((option) => (
            <label key={option.value} className={css.option}>
              <input
                type="radio"
                name={`rating-${id}`}
                checked={filters.rating === option.value}
                onChange={() => update({ rating: option.value })}
              />
              <span className={css.stars} aria-hidden="true">
                {"★".repeat(option.value)}
                {"☆".repeat(5 - option.value)}
              </span>
              {option.label}
            </label>
          ))}
        </div>
      </details>

      <details className={css.group}>
        <summary>Sort</summary>
        <div className={css.options}>
          {SORT_OPTIONS.map((option) => (
            <label key={option.id} className={css.option}>
              <input
                type="radio"
                name={`sort-${id}`}
                checked={filters.sort === option.id}
                onChange={() => update({ sort: option.id })}
              />
              {option.label}
            </label>
          ))}
        </div>
      </details>
    </section>
  );
}
