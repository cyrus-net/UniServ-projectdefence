import { useParams, Link, useNavigate } from "react-router";
import { Navbar } from "../../components/navigation/Navbar";
import { Clock, Download, Star, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import useAutoDismiss from "../../hooks/useAutoDismiss";

export function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useAutoDismiss(paymentSuccess, setPaymentSuccess, 3000);
  useAutoDismiss(paymentError, setPaymentError, 3000);

  const handlePayment = async () => {
    if (!id) return;
    setIsPaymentLoading(true);
    setPaymentError("");
    try {
      const result = await api.payments.processPayment(id);
      if (result.message === "Payment successful") {
        setPaymentSuccess(true);
      } else {
        setPaymentError(result.message || "Payment failed");
      }
    } catch (error) {
      setPaymentError("Network error. Please try again.");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleMessageSeller = () => {
    navigate("/messages");
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/client/bookings"
          className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground mb-6 transition-colors"
        >
          ← Back to Bookings
        </Link>

        {/* Status Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-semibold text-blue-600">In Progress</p>
              <p className="text-sm text-foreground/70">Expected delivery: Feb 18, 2026</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">🎨</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Professional Logo Design</h3>
                    <p className="text-foreground/70 mb-2">Order #12345</p>
                    <div className="flex items-center gap-4 text-sm text-foreground/60">
                      <span>Ordered: Feb 10, 2026</span>
                      <span>•</span>
                      <span>Due: Feb 18, 2026</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold mb-3">Requirements</h4>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-foreground/70">
                      Need a modern logo for my tech startup. The company name is "CloudSync" 
                      and we focus on cloud storage solutions. Looking for something clean, 
                      professional, and tech-forward. Prefer blue/purple color scheme.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Deliverables</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">logo-concept-1.png</p>
                      <p className="text-sm text-foreground/60">2.4 MB</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    Download
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Download className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">logo-concept-2.png</p>
                      <p className="text-sm text-foreground/60">1.8 MB</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Seller Info */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Seller</h3>
                <Link to="/profile" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-semibold">EW</span>
                  </div>
                  <div>
                    <p className="font-semibold">Emma Wilson</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.9 (127)</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Order Summary */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Service Price</span>
                    <span className="font-medium">$45.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Service Fee</span>
                    <span className="font-medium">$2.25</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">$47.25</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Actions</h3>
                {paymentSuccess && (
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 text-sm">
                    ✓ Payment Successful
                  </div>
                )}
                {paymentError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">
                    ✕ {paymentError}
                  </div>
                )}
                <div className="space-y-2">
                  {!paymentSuccess && (
                    <button 
                      onClick={handlePayment}
                      disabled={isPaymentLoading}
                      className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isPaymentLoading ? "Processing..." : "Pay Now"}
                    </button>
                  )}
                  <button 
                    onClick={handleMessageSeller}
                    className="w-full py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message Seller
                  </button>
                  <button className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Approve & Complete
                  </button>
                  <button className="w-full py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                    Request Revision
                  </button>
                  <button className="w-full py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-destructive">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}