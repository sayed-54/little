import { groq } from 'next-sanity';

export const getStoreSettingsQuery = groq`
  *[_type == "storeSettings" && storeId == "default"][0] {
    storeName,
    "logoUrl": logo.asset->url,
    primaryColor,
    contactEmail,
    currency,
    codFee,
    shippingFee,
    socialLinks[]->{
      platform,
      url,
      whatsappNumber
    }
  }
`;

export const getAllCategoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    "slug": slug.current
  }
`;

// User-facing queries
export const getFeaturedProductsQuery = groq`
  *[_type == "products"][0...8] | order(_createdAt desc) {
    _id,
    name,
    slug,
    price,
    sale_price,
    "imageUrl": images[0].asset->url,
    categories[]->{name}
  }
`;

export const getSingleProductQuery = groq`
  *[_type == "products" && slug.current == $slug][0] {
    ...,
    "imageUrls": images[].asset->url,
    categories[]->{name, slug}
  }
`;

// Footer Layout related
export const getSocialLinksQuery = groq`
  *[_type == "socialLink"] {
    platform,
    url,
    whatsappNumber
  }
`;

export const getTestimonialsQuery = groq`
  *[_type == "testimonial"] | order(_createdAt desc)[0...5] {
    author,
    role,
    quote,
    rating
  }
`;

// Admin Analytics queries
export const getAdminTotalOrdersQuery = groq`
  *[_type == "order"] {
    totalPrice,
    status
  }
`;

export const getAdminLowStockQuery = groq`
  *[_type == "products" && stock < 10] {
    _id,
    name,
    stock
  }
`;
