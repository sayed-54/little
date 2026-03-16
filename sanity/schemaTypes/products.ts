export default {
  name: 'products',
  type: 'document',
  title: 'Products',
  fields: [
    { name: 'name', type: 'string', title: 'Product Name' },
    { name: 'slug', type: 'slug', title: 'Slug', options: { source: 'name' } },
    { name: 'storeId', type: 'string', title: 'Store ID', initialValue: 'default' },
    { name: 'price', type: 'number', title: 'Price' },
    { name: 'sale_price', type: 'number', title: 'Sale Price' },
    { name: 'stock', type: 'number', title: 'Stock' },
    { name: 'featured', type: 'boolean', title: 'Featured Product' },
    { name: 'tags', type: 'array', title: 'Tags', of: [{ type: 'string' }] },
    { name: 'sizes', type: 'array', title: 'Sizes', of: [{ type: 'string' }] },
    { name: 'colors', type: 'array', title: 'Colors', of: [{ type: 'string' }] },
    { name: 'images', type: 'array', title: 'Images', of: [{ type: 'image' }] },
    { name: 'description', type: 'text', title: 'Description' },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }]
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Meta Title' },
        { name: 'description', type: 'text', title: 'Meta Description' }
      ]
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      initialValue: 0,
      validation: (Rule: any) => Rule.min(0).max(5)
    },
    {
      name: 'reviewsCount',
      title: 'Reviews Count',
      type: 'number',
      initialValue: 0
    }
  ]
}