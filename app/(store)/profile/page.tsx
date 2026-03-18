"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { Loader2, User, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AccountSidebar from "@/components/auth/AccountSidebar";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Initialize form when session loads
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        phone: (session.user as any).phone || "",
        address: (session.user as any).address || ""
      });
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Tell NextAuth to update its local session cache
      await update({
        ...session,
        user: {
           ...session?.user,
           name: formData.name,
           phone: formData.phone,
           address: formData.address
        }
      });

      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (error: any) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold font-heading">Not logged in</h2>
          <p className="text-muted-foreground">Please sign in to view your profile.</p>
          <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 lg:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8 items-end mb-12">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold uppercase border border-primary/20">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div>
               <h1 className="text-4xl font-heading font-extrabold text-foreground">
                 {session?.user?.name}&apos;s Dashboard
               </h1>
               <p className="text-muted-foreground">{session?.user?.email}</p>
            </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-card border border-border shadow-sm rounded-2xl p-6 md:p-8">
               <h2 className="text-2xl font-semibold font-heading mb-6 flex items-center gap-2">
                 <User className="h-5 w-5 text-primary" /> Personal Information
               </h2>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                 
                 <div className="space-y-2">
                   <Label htmlFor="name">Full Name</Label>
                   <Input 
                     id="name" 
                     name="name" 
                     value={formData.name} 
                     onChange={handleChange} 
                     className="max-w-md h-12"
                   />
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="phone">Phone Number (For Delivery)</Label>
                   <div className="relative max-w-md">
                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input 
                       id="phone" 
                       name="phone" 
                       value={formData.phone} 
                       onChange={handleChange} 
                       placeholder="+20 123 456 7890"
                       className="pl-10 h-12"
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <Label htmlFor="address">Default Address (For Delivery)</Label>
                   <div className="relative max-w-xl">
                     <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                     <textarea 
                       id="address" 
                       name="address" 
                       value={formData.address} 
                       onChange={(e: any) => handleChange(e)} 
                       placeholder="123 Main St, City, District"
                       className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-10 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     />
                   </div>
                 </div>

                 {message.text && (
                   <div className={`p-4 text-sm rounded-lg font-medium border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                     {message.text}
                   </div>
                 )}

                 <div className="pt-4 border-t border-border mt-8">
                   <Button type="submit" disabled={isSaving} className="h-12 px-8">
                     {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                   </Button>
                 </div>
               </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
