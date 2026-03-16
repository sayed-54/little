export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    { name: 'name', title: 'Customer Name', type: 'string' },
    { name: 'email', title: 'Email', type: 'string' },
    { name: 'phone', title: 'Phone', type: 'string' },
    { name: 'address', title: 'Address', type: 'string' },
    {
      name: 'status',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Processing', value: 'processing' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
          { title: 'Cancelled', value: 'cancelled' }
        ]
      },
      initialValue: 'pending'
    },
    { name: 'totalPrice', title: 'Total Price', type: 'number' },
    {
      name: 'cartDetails',
      title: 'Cart Details',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', type: 'string' },
            { name: 'name', type: 'string' },
            { name: 'price', type: 'number' },
            { name: 'quantity', type: 'number' },
            { name: 'size', type: 'string' },
            { name: 'color', type: 'string' },
            { name: 'image', type: 'string' }
          ]
        }
      ]
    },
    { 
      name: 'paymentMethod', 
      title: 'Payment Method', 
      type: 'string',
      options: { list: ['stripe', 'cod'] },
      initialValue: 'stripe'
    },
    {
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{ type: 'users' }],
      description: 'The registered user who placed this order (if any)'
    },
    {
      name: 'fees',
      title: 'Applied Fees',
      type: 'object',
      fields: [
        { name: 'shipping', type: 'number', title: 'Shipping Fee' },
        { name: 'cod', type: 'number', title: 'COD Fee' },
        { name: 'discount', type: 'number', title: 'Discount Amount' }
      ]
    },
    { name: 'createdAt', title: 'Created At', type: 'datetime' }
  ]
};
