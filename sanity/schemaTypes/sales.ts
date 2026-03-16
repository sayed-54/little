export default{
    name:"sale"
    ,title:"Sales"
    ,type:"document"
    ,fields:[
        {
            name:"name",
            type:'string',
            title:'Product Name',
        },
        {
            name:'images',
            type:'array' ,
            title:'Product Image' ,
             of:[{type:'image'}],
          },
          {
             name:"description",
             type:'text',
             title:'Product Description' 
          },
          {
              name:'slug',
              type:'slug',
              title:'slug',
              options:{
                  source:'name',
              },
          },
          {
              name:'OldPrice',
              type:'number',
              title:'OldPrice'
          },
          {
            name:'NewPrice',
            type:'number',
            title:'NewPrice'
          },
          {
              name:'sizes',
              type:'array',
              title:'sizes',
              of:[{type:'string'}]
          },
          {
            name: 'rating',
            title: 'Rating',
            type: 'number',
            initialValue: 0,
            validation: (Rule: any) => Rule.min(0).max(5)
          },
          {
            name: 'reviewsCount',
            title: 'Reviews Count',
            type: 'number',
            initialValue: 0
          }
    ]
}