// similar products
const similarItems = (currentItem: any, allItems: any[]) => {
  let categories: string[] = [];

  // set categories
  if (currentItem.frontmatter.categories.length > 0) {
    categories = currentItem.frontmatter.categories;
  }

  // filter by categories
  const filterByCategories = allItems.filter((item: any) =>
    categories.find((category) =>
      item.frontmatter.categories.includes(category)
    )
  );

  // merged after filter
  const mergedItems = [...new Set([...filterByCategories])];

  // filter by slug
  const filterBySlug = mergedItems.filter(
    (product) => product.slug !== currentItem.slug
  );

  return filterBySlug;
};

export default similarItems;
