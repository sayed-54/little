"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const menuItems = [
  { name: "Personal Info", href: "/profile", icon: User },
  { name: "Order History", href: "/orders", icon: Package },
  { name: "My Wishlist", href: "/wishlist", icon: Heart },
  // { name: "Settings", href: "/profile/settings", icon: Settings },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full lg:w-64 space-y-2">
      <div className="bg-card border border-border shadow-sm rounded-2xl p-4 overflow-hidden">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
                {item.name}
              </Link>
            );
          })}
          
          <div className="h-px bg-border/50 my-3 mx-2" />
          
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Mini Help Section */}
      <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
        <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Need Help?</h4>
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          If you have issues with an order or your account, reach out to our premium concierge.
        </p>
        <Link href="/Contacts" className="text-[10px] font-bold text-primary mt-2 inline-block border-b border-primary hover:border-transparent transition-all">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
