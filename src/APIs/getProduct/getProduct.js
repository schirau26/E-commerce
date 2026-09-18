export async function getProductById(id) {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  if (!response.ok) {
    return null;
  }
  return response.json();
}
