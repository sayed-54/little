export default {
  name: 'testimonial',
  type: 'document',
  title: 'Testimonials',
  fields: [
    { name: 'author', title: 'Author Name', type: 'string' },
    { name: 'role', title: 'Role / Title', type: 'string' },
    { name: 'quote', title: 'Quote', type: 'text' },
    { name: 'rating', title: 'Rating (1-5)', type: 'number', validation: (Rule: any) => Rule.min(1).max(5) }
  ]
}
