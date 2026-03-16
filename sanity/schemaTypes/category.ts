export default {
  name: 'category',
  type: 'document',
  title: 'Category',
  fields: [
    { name: 'name', title: 'Category Name', type: 'string' },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' }
    },
    { name: 'image', title: 'Image', type: 'image' }
  ]
}