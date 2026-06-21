import { useParams, Link } from "react-router";
import { Navbar } from "../../components/navigation/Navbar";
import { Star, Clock, CheckCircle, Heart } from "lucide-react";

export function ServiceDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Image */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
              <div className="text-8xl">🎨</div>
            </div>

            {/* Service Title & Seller */}
            <div>
              <h1 className="text-3xl font-bold mb-3">Professional Logo Design</h1>
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold">EW</span>
                  </div>
                  <div>
                    <p className="font-semibold">Emma Wilson</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.9</span>
                      <span className="text-foreground/60">(127 reviews)</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">About This Service</h2>
              <div className="space-y-3 text-foreground/70">
                <p>
                  I will design a professional, modern logo that perfectly represents your brand identity. 
                  With over 3 years of design experience, I specialize in creating unique and memorable logos 
                  for businesses, startups, and personal brands.
                </p>
                <p>
                  What you'll get:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>3 unique logo concepts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Unlimited revisions until you're satisfied</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>High-resolution files (PNG, JPG, SVG)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Source files (AI, PSD)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Fast turnaround (3-5 days)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Portfolio */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Reviews (127)</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pb-4 border-b border-border last:border-0">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold">JD</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold">John Doe</p>
                          <p className="text-sm text-foreground/60">2 weeks ago</p>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-foreground/70 text-sm">
                          Emma delivered an amazing logo! Very professional and responsive. 
                          Highly recommend her services.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Pricing Card */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold">₦45</span>
                    <span className="text-foreground/60">starting price</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Clock className="w-4 h-4" />
                    <span>3-5 days delivery</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-sm">
                    Book Now
                  </button>
                  <button className="w-full py-3 bg-card border border-border rounded-xl hover:bg-accent transition-all flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Save
                  </button>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Service Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Category</span>
                    <span className="font-medium">Design</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Delivery Time</span>
                    <span className="font-medium">3-5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Revisions</span>
                    <span className="font-medium">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Orders Completed</span>
                    <span className="font-medium">127</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}