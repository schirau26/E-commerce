export const PRODUCT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="533"><rect fill="#f6f1e4" width="100%" height="100%"/></svg>',
  );

export function productImageCandidates(item = {}) {
  const urls = [];
  if (item.images?.[0]) {
    urls.push(item.images[0]);
  }
  if (item.thumbnail && item.thumbnail !== item.images?.[0]) {
    urls.push(item.thumbnail);
  }
  return urls;
}

export function productImageFallback(failedSrc, item = {}) {
  const chain = [];
  if (failedSrc) {
    chain.push(failedSrc);
  }
  productImageCandidates(item).forEach((url) => {
    if (!chain.includes(url)) {
      chain.push(url);
    }
  });
  if (!chain.includes(PRODUCT_IMAGE_PLACEHOLDER)) {
    chain.push(PRODUCT_IMAGE_PLACEHOLDER);
  }
  const index = chain.indexOf(failedSrc);
  if (index === -1) {
    return PRODUCT_IMAGE_PLACEHOLDER;
  }
  return chain[Math.min(index + 1, chain.length - 1)];
}
