export default {
  name: 'review',
  type: 'document',
  title: 'Product Reviews',
  fields: [
    { 
      name: 'product', 
      title: 'Product', 
      type: 'reference', 
      to: [{ type: 'products' }, { type: 'sale' }] ,
      validation: (Rule: any) => Rule.required()
    },
    { name: 'userName', type: 'string', title: 'User Name' },
    { name: 'userEmail', type: 'string', title: 'User Email' },
    { 
      name: 'rating', 
      type: 'number', 
      title: 'Rating',
      validation: (Rule: any) => Rule.min(1).max(5).required()
    },
    { name: 'comment', type: 'text', title: 'Comment' },
    { name: 'isApproved', type: 'boolean', title: 'Is Approved', initialValue: false },
    { name: 'createdAt', type: 'datetime', title: 'Created At', initialValue: (new Date()).toISOString() }
  ]
}
