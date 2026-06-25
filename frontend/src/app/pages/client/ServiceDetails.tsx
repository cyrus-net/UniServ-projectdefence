import { useParams } from "react-router";
import { Star, Clock, CheckCircle, Heart, MessageCircle, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface Service {
  _id: string;
  title: string;
  description: string;
  seller: { _id: string; fullName: string; email: string };
  price: number;
  category: string;
  deliveryTime: number;
  revisions: string;
  features: string[];
  images: string[];
  availability: string;
}

interface Review {
  _id: string;
  client: { fullName: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export function ServiceDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [hasBooked, setHasBooked] = useState(false);

  // Message modal state
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState("");
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [svc, revs] = await Promise.all([
          api.services.getById(id!),
          api.reviews.getByService(id!),
        ]);
        setService(svc);
        setReviews(Array.isArray(revs) ? revs : []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBook = async () => {
    setIsBooking(true);
    try {
      await api.bookings.create({ serviceId: id! });
      setHasBooked(true);
      showSuccess("Booking successful! Check My Bookings.");
    } catch {
      showSuccess("Failed to book. Try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.savedServices.save(id!);
      showSuccess("Service saved! ❤️");
    } catch {
      showSuccess("Failed to save. Try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async () => {
    if (!msgText.trim() || !service) return;
    setIsSendingMsg(true);
    try {
      await api.messages.send({ receiverId: service.seller._id, message: msgText });
      setMsgSuccess("Message sent!");
      setMsgText("");
      setTimeout(() => {
        setMsgSuccess("");
        setShowMsgModal(false);
      }, 2000);
    } catch {
      setMsgSuccess("Failed to send. Try again.");
    } finally {
      setIsSendingMsg(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  if (isLoading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  );

  if (!service) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p>Service not found.</p>
    </div>
  );

  const sellerInitials = service.seller.fullName.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-background">

      {/* Message Modal */}
      {showMsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Message {service.seller.fullName}</h3>
              <button onClick={() => setShowMsgModal(false)} title="Close" className="p-2 hover:bg-accent rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              ref={msgRef}
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Write your message..."
              rows={4}
              className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
            />
            {msgSuccess && <p className="text-sm text-green-600 mb-3">{msgSuccess}</p>}
            <button
              onClick={handleSendMessage}
              disabled={isSendingMsg || !msgText.trim()}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {isSendingMsg ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl overflow-hidden flex items-center justify-center">
              {service.images && service.images.length > 0 && service.images[0] ? (
                <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-8xl">🎨</div>
              )}
            </div>

            {/* Title & Seller */}
            <div>
              <h1 className="text-3xl font-bold mb-3">{service.title}</h1>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-semibold">{sellerInitials}</span>
                </div>
                <div>
                  <p className="font-semibold">{service.seller.fullName}</p>
                  {avgRating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{avgRating}</span>
                      <span className="text-foreground/60">({reviews.length} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">About This Service</h2>
              <p className="text-foreground/70 mb-4">{service.description}</p>
              {service.features.length > 0 && (
                <ul className="space-y-2">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-foreground/60">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="pb-4 border-b border-border last:border-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold">
                            {review.client.fullName.split(" ").map(n => n[0]).join("").toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold">{review.client.fullName}</p>
                            <p className="text-sm text-foreground/60">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                            ))}
                          </div>
                          <p className="text-foreground/70 text-sm">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <div className="bg-card rounded-xl p-6 border border-border shadow-lg">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold">₦{service.price}</span>
                    <span className="text-foreground/60">starting price</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Clock className="w-4 h-4" />
                    <span>{service.deliveryTime} day{service.deliveryTime !== 1 ? "s" : ""} delivery</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleBook}
                    disabled={isBooking || hasBooked}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
                  >
                    {hasBooked ? "Booked ✓" : isBooking ? "Booking..." : "Book Now"}
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-3 bg-card border border-border rounded-xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Heart className="w-5 h-5" />
                    {isSaving ? "Saving..." : "Save Service"}
                  </button>

                  {hasBooked && (
                    <button
                      onClick={() => { setShowMsgModal(true); setTimeout(() => msgRef.current?.focus(), 100); }}
                      className="w-full py-3 bg-card border border-border rounded-xl hover:bg-accent transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Message Seller
                    </button>
                  )}

                  {/* Success message below buttons */}
                  {successMsg && (
                    <p className="text-sm text-green-600 text-center mt-2">{successMsg}</p>
                  )}
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Service Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Category</span>
                    <span className="font-medium">{service.category || "General"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Delivery Time</span>
                    <span className="font-medium">{service.deliveryTime} day{service.deliveryTime !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Revisions</span>
                    <span className="font-medium">{service.revisions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Availability</span>
                    <span className="font-medium">{service.availability}</span>
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