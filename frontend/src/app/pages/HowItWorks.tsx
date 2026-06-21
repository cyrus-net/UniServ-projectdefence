import { Search, MessageCircle, CreditCard, Star, UserPlus, Briefcase } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="min-h-screen">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
          <p className="text-xl text-foreground/70">
            Getting started is easy. Choose your path below.
          </p>
        </div>

        {/* For Clients */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-4">
              <Search className="w-5 h-5" />
              <span className="font-semibold">For Clients</span>
            </div>
            <h2 className="text-3xl font-bold mb-3">Finding Services</h2>
            <p className="text-foreground/70">Hire talented students in just a few steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <Search className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Browse Services</h3>
              <p className="text-sm text-foreground/70">
                Explore services by category or search for specific skills
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <Star className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Review & Select</h3>
              <p className="text-sm text-foreground/70">
                Check ratings, reviews, and portfolios to find the right match
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Book & Communicate</h3>
              <p className="text-sm text-foreground/70">
                Book the service and discuss details with the seller
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <CreditCard className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Pay & Review</h3>
              <p className="text-sm text-foreground/70">
                Secure payment upon completion and leave a review
              </p>
            </div>
          </div>
        </div>

        {/* For Sellers */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-4">
              <Briefcase className="w-5 h-5" />
              <span className="font-semibold">For Sellers</span>
            </div>
            <h2 className="text-3xl font-bold mb-3">Offering Services</h2>
            <p className="text-foreground/70">Start earning from your skills today</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <UserPlus className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Create Account</h3>
              <p className="text-sm text-foreground/70">
                Sign up with your university email to get verified
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <Briefcase className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">List Your Service</h3>
              <p className="text-sm text-foreground/70">
                Create service listings with pricing and details
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <MessageCircle className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Get Orders</h3>
              <p className="text-sm text-foreground/70">
                Receive bookings and communicate with clients
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <CreditCard className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Deliver & Earn</h3>
              <p className="text-sm text-foreground/70">
                Complete orders and get paid securely
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-foreground/70 mb-8">
            Join thousands of students already using UniServ
          </p>
          <a
            href="/sign-up"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg"
          >
            Create Your Account
          </a>
        </div>
      </div>
    </div>
  );
}