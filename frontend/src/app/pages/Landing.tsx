import { Link } from "react-router";
import { Search, Briefcase, Star, Shield, TrendingUp, Users } from "lucide-react";

export function Landing() {
  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Hire Trusted Students or Earn from Your Campus Skills
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-10">
              A university-based marketplace for student skill services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/sign-up"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Find Services
              </Link>
              <Link
                to="/sign-up"
                className="px-8 py-4 bg-card border-2 border-primary text-primary rounded-full hover:bg-accent transition-all inline-flex items-center justify-center gap-2"
              >
                <Briefcase className="w-5 h-5" />
                Offer Services
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why UniServ?
            </h2>
            <p className="text-lg text-foreground/70">
              Connecting talented students across campus
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trusted Community</h3>
              <p className="text-foreground/70">
                All students are verified university members, ensuring a safe and trusted marketplace.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Services</h3>
              <p className="text-foreground/70">
                Browse reviews and ratings to find the perfect match for your project needs.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Grow Your Skills</h3>
              <p className="text-foreground/70">
                Build your portfolio and earn money while gaining valuable work experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-foreground/70">
              Discover services across various categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Tutoring", "Design", "Programming", "Writing", "Photography", "Music", "Marketing", "Video Editing"].map((category) => (
              <Link
                key={category}
                to="/sign-in"
                className="bg-card rounded-xl p-6 text-center border border-border hover:border-primary hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold">{category}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Join thousands of students already using UniServ
          </p>
          <Link
            to="/sign-up"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold">U</span>
                </div>
                <span className="text-xl font-semibold">UniServ</span>
              </div>
              <p className="text-sm text-foreground/70">
                Connecting talented students across campus.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link to="/how-it-works" className="hover:text-foreground">How It Works</Link></li>
                <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
                <li><Link to="/client/explore" className="hover:text-foreground">Browse Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link to="/coming-soon" className="hover:text-foreground">Help Center</Link></li>
                <li><Link to="/coming-soon" className="hover:text-foreground">Safety</Link></li>
                <li><Link to="/coming-soon" className="hover:text-foreground">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link to="/coming-soon" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/coming-soon" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link to="/coming-soon" className="hover:text-foreground">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-foreground/70">
            © 2026 UniServ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}