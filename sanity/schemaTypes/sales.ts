export default{
    name:"sales"
    ,title:"sales"
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
          }
    ]
}