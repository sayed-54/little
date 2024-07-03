module.exports={
      images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.sanity.io',
                pathname: '**',
            },
        ],
    },
    // env:{
    //     SHOPIFY_STORE_DOMAIN:process.env.SHOPIFY_STORE_DOMAIN,
    //     SHOPIFY_STOREFRONT_ACCESSTOKEN:process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN
    // }
}