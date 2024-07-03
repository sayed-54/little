export default {
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Address',
      type: 'string',
    },
    {
      name: 'phone',
      title: 'Phone',
      type: 'string',
    },
    {
      name: 'totalPrice',
      title: 'Total Price',
      type: 'number',
    },
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
            { name: 'description', type: 'string' },
            { name: 'price', type: 'number' },
            { name: 'quantity', type: 'number' },
            { name: 'image', type: 'string' },
            { name: 'size',   type: 'string' , title: 'size' }, // Added sizes array
          ],
        },
      ],
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
    },
  ],
};
