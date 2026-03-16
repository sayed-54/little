export default {
  name: 'socialLink',
  type: 'document',
  title: 'Social Links',
  fields: [
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'Twitter', 'YouTube', 'WhatsApp']
      }
    },
    { name: 'url', title: 'URL', type: 'url', hidden: ({ parent }: any) => parent?.platform === 'WhatsApp' },
    { name: 'whatsappNumber', title: 'WhatsApp Number', type: 'string', hidden: ({ parent }: any) => parent?.platform !== 'WhatsApp' }
  ]
}
