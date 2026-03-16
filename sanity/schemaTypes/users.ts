export default {
  name: 'users',
  type: 'document',
  title: 'Users',
  fields: [
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'email', type: 'string', title: 'Email', validation: (Rule: any) => Rule.required() },
    { name: 'image', type: 'string', title: 'Profile Image' },
    { 
      name: 'role', 
      type: 'string', 
      title: 'Role', 
      options: { list: ['admin', 'customer'] },
      initialValue: 'customer'
    },
    {
      name: 'provider',
      type: 'string',
      title: 'Auth Provider',
      description: 'The authentication provider (e.g., google, credentials)'
    },
    {
      name: 'password',
      type: 'string',
      title: 'Password',
      hidden: true,
    },
    {
      name: 'wishlist',
      title: 'Wishlist',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'products' }] }]
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    },
    {
      name: 'address',
      title: 'Legacy Delivery Address',
      type: 'string',
    },
    {
      name: 'addresses',
      title: 'Delivery Addresses',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'addressLine1', title: 'Address Line 1', type: 'string' },
            { name: 'city', title: 'City', type: 'string' },
            { name: 'district', title: 'District', type: 'string' },
            { name: 'isDefault', title: 'Is Default', type: 'boolean', initialValue: false }
          ]
        }
      ]
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }
  ]
}
