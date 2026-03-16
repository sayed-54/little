"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Chrome, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Welcome back!");
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      toast.error("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-heading font-bold tracking-tight">
              Little<span className="text-primary">Locals.</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Welcome Back</h2>
          <p className="text-muted-foreground italic">Sign in to your premium shopping experience</p>
        </div>

        <div className="bg-card border border-border shadow-2xl rounded-3xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 group transition-all"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground tracking-widest">Or continue with</span>
            </div>
          </div>

          <div className="space-y-6">
            <Button 
              onClick={() => signIn("google", { callbackUrl: "/" })}
              variant="outline" 
              className="w-full h-14 rounded-xl border-border hover:bg-muted font-semibold flex items-center justify-center gap-3 transition-all"
            >
              <Chrome size={20} className="text-primary" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground tracking-widest">Premium Access</span>
              </div>
            </div>

            <div className="space-y-4">
               <p className="text-center text-sm text-muted-foreground px-8">
                By continuing, you agree to our <Link href="/terms" className="underline hover:text-primary">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-primary">Privacy Policy</Link>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <ShoppingBag size={16} />
            Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Join the Club</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
