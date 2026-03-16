export default {
  name: 'coupons',
  type: 'document',
  title: 'Coupons',
  fields: [
    { name: 'code', type: 'string', title: 'Coupon Code' },
    { name: 'discountType', type: 'string', title: 'Discount Type', options: { list: ['percentage', 'fixed'] } },
    { name: 'discountValue', type: 'number', title: 'Discount Value' },
    { name: 'validFrom', type: 'datetime', title: 'Valid From' },
    { name: 'validUntil', type: 'datetime', title: 'Valid Until' },
    { name: 'isActive', type: 'boolean', title: 'Is Active', initialValue: true },
    { name: 'storeId', type: 'string', title: 'Store ID', initialValue: 'default' }
  ]
}
