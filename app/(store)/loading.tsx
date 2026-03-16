import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-muted"></div>
        <div className="absolute top-0 left-0 h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
      <h2 className="text-xl font-heading font-medium text-foreground tracking-wide animate-pulse">
        Loading...
      </h2>
    </div>
  );
}
