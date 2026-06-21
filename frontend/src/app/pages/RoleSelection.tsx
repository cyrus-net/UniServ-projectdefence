import { Link } from "react-router";
import { Search, Briefcase } from "lucide-react";

export function RoleSelection() {
  return (
    <div className="min-h-screen">
      
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            How would you like to use the platform?
          </h1>
          <p className="text-lg text-foreground/70">
            Choose your role to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Find Services */}
          <Link
            to="/client/dashboard"
            className="group bg-card rounded-2xl p-8 border-2 border-border hover:border-primary transition-all shadow-sm hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-6 transition-colors">
                <Search className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Find Services</h2>
              <p className="text-foreground/70 mb-6">
                Hire students for tasks, projects, or tutoring.
              </p>
              <div className="space-y-2 text-sm text-foreground/60 text-left w-full">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Browse thousands of services</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Review ratings and portfolios</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Secure booking process</span>
                </div>
              </div>
              <div className="mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-full group-hover:bg-primary/90 transition-colors">
                Continue as Client
              </div>
            </div>
          </Link>

          {/* Offer Services */}
          <Link
            to="/seller/dashboard"
            className="group bg-card rounded-2xl p-8 border-2 border-border hover:border-primary transition-all shadow-sm hover:shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-6 transition-colors">
                <Briefcase className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Offer Services</h2>
              <p className="text-foreground/70 mb-6">
                Showcase your skills and earn money.
              </p>
              <div className="space-y-2 text-sm text-foreground/60 text-left w-full">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Create service listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Set your own prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Build your portfolio</span>
                </div>
              </div>
              <div className="mt-8 px-6 py-3 bg-primary text-primary-foreground rounded-full group-hover:bg-primary/90 transition-colors">
                Continue as Seller
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8 text-sm text-foreground/60">
          You can switch between roles anytime in your profile settings
        </div>
      </div>
    </div>
  );
}
