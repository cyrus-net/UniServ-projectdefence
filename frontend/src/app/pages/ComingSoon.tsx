import { Link } from "react-router";
import { Megaphone } from "lucide-react";

export function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 bg-card rounded-2xl shadow-lg border border-border max-w-md">
        <Megaphone className="w-12 h-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-extrabold mb-2">Coming Soon!!!</h1>
        <p className="text-foreground/70 mb-6">We're working on this feature. Check back later.</p>
        <Link to="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">Go Home</Link>
      </div>
    </div>
  );
}
