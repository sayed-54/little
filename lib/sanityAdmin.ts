import { createClient } from "next-sanity";

export const adminClient = createClient({
    projectId: "oyeriaey",
    dataset: "production",
    apiVersion: "2022-03-25",
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});
