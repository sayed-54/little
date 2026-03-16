import React from 'react';
import { FaFacebookSquare, FaInstagram, FaTwitterSquare, FaTiktok, FaLinkedin, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import { client } from '@/lib/sanity';
import { groq } from 'next-sanity';
import { getSocialLinksQuery } from '@/lib/queries';

async function getSocialLinks() {
  try {
    return await client.fetch(getSocialLinksQuery);
  } catch (err) {
    return [];
  }
}

const getPlatformIcon = (platform: string) => {
  const iconClass = "text-2xl text-foreground hover:text-primary transition-colors";
  switch(platform) {
    case 'Facebook': return <FaFacebookSquare className={iconClass} />;
    case 'Instagram': return <FaInstagram className={iconClass} />;
    case 'TikTok': return <FaTiktok className={iconClass} />;
    case 'LinkedIn': return <FaLinkedin className={iconClass} />;
    case 'Twitter': return <FaTwitterSquare className={iconClass} />;
    case 'YouTube': return <FaYoutube className={iconClass} />;
    case 'WhatsApp': return <FaWhatsapp className={iconClass} />;
    default: return <FaFacebookSquare className={iconClass} />;
  }
}

async function getStoreSettings() {
  try {
    return await client.fetch(groq`*[_type == "storeSettings" && storeId == "default"][0]{
      storeName,
      socialLinks[]->{
        platform,
        url,
        whatsappNumber
      }
    }`);
  } catch (err) {
    return null;
  }
}

const Footer = async () => {
  const settings = await getStoreSettings();
  const socialLinks = settings?.socialLinks || [];

  return (
    <footer className="bg-muted/30 border-t border-border mt-auto w-full px-6 pt-16 pb-8">
      <div className="container mx-auto grid md:grid-cols-4 gap-12">
        <div className="md:col-span-1 flex flex-col items-start">
          <Link href="/" className="font-heading font-bold text-3xl tracking-tight text-foreground mb-6">
            {settings?.storeName ? (
              <>
                {settings.storeName.split(' ')[0]}<span className="text-primary">{settings.storeName.split(' ')[1] ? ` ${settings.storeName.split(' ')[1]}` : '.'}</span>
              </>
            ) : (
              <>Little<span className="text-primary">Locals.</span></>
            )}
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8">
            Premium ecommerce shopping destination. Discover curated collections crafted for your lifestyle.
          </p>
          <div className="flex gap-4 flex-wrap">
            {socialLinks?.map((link: any, idx: number) => {
              const href = link.platform === 'WhatsApp' ? `https://wa.me/${link.whatsappNumber}` : link.url;
              return (
                <Link key={idx} href={href} target="_blank" rel="noopener noreferrer">
                  {getPlatformIcon(link.platform)}
                </Link>
              )
            })}
          </div>
        </div>
        
        <div className="md:col-span-1 flex flex-col">
          <h3 className="font-heading font-semibold text-foreground mb-6">Shop</h3>
          <nav className="flex flex-col gap-3">
            <Link href="/Products" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Products</Link>
            <Link href="/Sale" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sale</Link>
          </nav>
        </div>

        <div className="md:col-span-1 flex flex-col">
          <h3 className="font-heading font-semibold text-foreground mb-6">Support</h3>
          <nav className="flex flex-col gap-3">
            <Link href="/Contacts" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link>
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">FAQ</span>
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">Shipping Details</span>
            <span className="text-sm text-muted-foreground cursor-pointer hover:text-primary transition-colors">Returns & Exchanges</span>
          </nav>
        </div>

        <div className="md:col-span-1 flex flex-col">
          <h3 className="font-heading font-semibold text-foreground mb-6">Newsletter</h3>
          <p className="text-sm text-muted-foreground mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="container mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Little Locals. All rights reserved.
        </p>
        <div className="flex gap-4">
          <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
          <span className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
