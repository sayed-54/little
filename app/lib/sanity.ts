import imageUrlBuilder from '@sanity/image-url'
import { createClient } from "next-sanity";



export const client = createClient({
    projectId:"oyeriaey",
    dataset:"production",
    apiVersion:"2022-03-25",
    useCdn:true,
});

const builder = imageUrlBuilder(client) 

export  function urlfor(source: any){
    return builder.image(source);
}