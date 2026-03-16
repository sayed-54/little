import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { client } from "@/lib/sanity";
import { getStoreSettingsQuery } from "@/lib/queries";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(getStoreSettingsQuery);
  return {
    title: settings?.storeName || "Little Locals",
    description: "Luxury ecommerce shopping experience for curated collections.",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
