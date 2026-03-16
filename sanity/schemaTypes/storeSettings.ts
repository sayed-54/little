export default {
  name: 'storeSettings',
  type: 'document',
  title: 'Store Settings',
  fields: [
    { name: 'storeName', type: 'string', title: 'Store Name' },
    { name: 'storeId', type: 'string', title: 'Store ID', initialValue: 'default' },
    { name: 'logo', type: 'image', title: 'Store Logo' },
    { name: 'primaryColor', type: 'string', title: 'Primary Color' },
    { name: 'contactEmail', type: 'string', title: 'Contact Email' },
    { name: 'currency', type: 'string', title: 'Currency', initialValue: 'EGP' },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'socialLink' }] }]
    },
    { 
      name: 'codFee', 
      title: 'Cash On Delivery Fee', 
      type: 'number',
      initialValue: 0 
    },
    { 
      name: 'shippingFee', 
      title: 'Standard Shipping Fee', 
      type: 'number',
      initialValue: 0 
    }
  ]
}
