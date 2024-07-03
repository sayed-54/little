export default{
    name: 'products',
    type:'document',
    title:'Products',
    fields:[
        {
            name:'name',
            type:'string',
            title:'Product Name',
        },
        {
            name:'sizes',
            type:'array',
            title:'sizes',
            of:[{type:'string'}]
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
            name:'price',
            type:'number',
            title:'Price'
        },
        

    ]
}