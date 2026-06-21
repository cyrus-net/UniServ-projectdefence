import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { Calendar, Star, Package, Clock, CheckCircle, X, Upload, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

interface ProfileBooking {
  _id: string;
  service: { title: string; price?: number };
  seller: { fullName: string };
  status: "pending" | "accepted" | "completed" | "rejected";
  createdAt: string;
}

interface ProfileReview {
  _id: string;
  seller: { fullName: string };
  service: { title: string };
  rating: number;
  comment: string;
  createdAt?: string;
  client?: { _id: string };
}

export function ClientProfile() {
  const { user, updateUser } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [totalBookings, setTotalBookings] = useState(0);
  const [completedBookings, setCompletedBookings] = useState(0);
  const [inProgressBookings, setInProgressBookings] = useState(0);
  const [reviewsGivenCount, setReviewsGivenCount] = useState(0);
  const [reviewsGiven, setReviewsGiven] = useState<ProfileReview[]>([]);
  const [recentBookings, setRecentBookings] = useState<ProfileBooking[]>([]);
  const [favoriteServices, setFavoriteServices] = useState<{
    id: string;
    title: string;
    seller: string;
    price: number;
  }[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [avgRatingGiven, setAvgRatingGiven] = useState(0);
  const [activeSince, setActiveSince] = useState<string>("");
  const [metricsLoading, setMetricsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setPhotoError("Please select a valid image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setProfileImage(base64);
        setPhotoError(null);
        setPhotoSaving(true);

        try {
          const result = await api.auth.updateProfile({ photoBase64: base64 });
          if (result.message) {
            setPhotoError(result.message);
          } else {
            updateUser({
              _id: result._id,
              fullName: result.fullName,
              email: result.email,
              role: result.role,
              bio: result.bio,
              photoBase64: result.photoBase64,
              createdAt: result.createdAt,
            });
          }
        } catch (error) {
          setPhotoError("Failed to save profile photo. Please try again.");
        } finally {
          setPhotoSaving(false);
          setShowImageModal(false);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoError("Please select a file");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    setProfileImage(user?.photoBase64 || null);

    const loadProfileMetrics = async () => {
      if (!user) return;

      setMetricsLoading(true);
      try {
        const [bookingsRes, reviewsRes] = await Promise.all([
          api.bookings.getAll(),
          api.reviews.getAll(),
        ]);

        const bookings = Array.isArray(bookingsRes) ? bookingsRes : [];
        const reviews = Array.isArray(reviewsRes) ? reviewsRes : [];

        const userReviewsGiven = reviews.filter((review) => review.client?._id === user._id);

        const clientBookings = bookings.filter((booking) => booking.client?._id === user._id);
        const spent = clientBookings.reduce((sum, booking) => {
          const price = typeof booking.service?.price === "number" ? booking.service.price : 0;
          return sum + price;
        }, 0);
        const ratingSum = userReviewsGiven.reduce((sum, review) => sum + review.rating, 0);

        setTotalBookings(clientBookings.length);
        setCompletedBookings(clientBookings.filter((booking) => booking.status === "completed").length);
        setInProgressBookings(
          clientBookings.filter((booking) => booking.status === "accepted" || booking.status === "pending").length
        );
        setReviewsGiven(userReviewsGiven);
        setReviewsGivenCount(userReviewsGiven.length);
        setTotalSpent(spent);
        setAvgRatingGiven(userReviewsGiven.length ? +(ratingSum / userReviewsGiven.length).toFixed(1) : 0);
        setActiveSince(() => {
          if (!user.createdAt) return "";
          const created = new Date(user.createdAt);
          const now = new Date();
          const months =
            now.getFullYear() * 12 + now.getMonth() -
            (created.getFullYear() * 12 + created.getMonth());
          return `${months} month${months === 1 ? "" : "s"} ago`;
        });

        const sortedRecent = [...clientBookings]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
        setRecentBookings(sortedRecent);

        const serviceMap = new Map<string, { id: string; title: string; seller: string; price: number }>();
        clientBookings.forEach((booking) => {
          const serviceId = booking.service?._id?.toString();
          const price = typeof booking.service?.price === "number" ? booking.service.price : 0;
          if (!serviceId) return;

          const existing = serviceMap.get(serviceId);
          if (!existing || price > existing.price) {
            serviceMap.set(serviceId, {
              id: serviceId,
              title: booking.service.title,
              seller: booking.seller.fullName,
              price,
            });
          }
        });

        const topPaidServices = Array.from(serviceMap.values())
          .sort((a, b) => b.price - a.price)
          .slice(0, 2);
        setFavoriteServices(topPaidServices);
      } catch (error) {
        console.error("Failed to load profile metrics:", error);
      } finally {
        setMetricsLoading(false);
      }
    };

    loadProfileMetrics();
  }, [user]);

  const formatName = (name?: string) =>
    name
      ? name
          .split(" ")
          .filter(Boolean)
          .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
          .join(" ")
      : "";


  const favoriteServicesPlaceholder = [
    { id: "placeholder-1", title: "Start hiring to see favorites", seller: "", price: 0 },
    { id: "placeholder-2", title: "Top services appear here", seller: "", price: 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-xl p-8 border border-border mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <button
                onClick={handleImageClick}
                className="w-32 h-32 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity relative overflow-hidden"
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-5xl font-bold">
                    {formatName(user?.fullName)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </span>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">{formatName(user?.fullName) || "User"}</h1>
                <p className="text-lg text-foreground/70 mb-2">UniServ Client</p>
                {user?.bio && (
                  <p className="text-sm text-foreground/70">{user.bio}</p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xl font-bold mb-1">{metricsLoading ? "-" : totalBookings}</p>
                  <p className="text-sm text-foreground/60">Total Bookings</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xl font-bold mb-1">{metricsLoading ? "-" : completedBookings}</p>
                  <p className="text-sm text-foreground/60">Completed</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-xl font-bold mb-1">{metricsLoading ? "-" : reviewsGivenCount}</p>
                  <p className="text-sm text-foreground/60">Reviews Given</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xl font-bold mb-1">{metricsLoading ? "-" : inProgressBookings}</p>
                  <p className="text-sm text-foreground/60">In Progress</p>
                </div>
              </div>

              <div>
                <Link
                  to="/settings"
                  className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-6 border border-border max-w-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">
                  {profileImage ? "Manage Profile Picture" : "Upload Profile Picture"}
                </h2>
                <button
                  onClick={() => setShowImageModal(false)}
                  aria-label="Close image modal"
                  className="text-foreground/60 hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {profileImage ? (
                  <>
                    <button
                      onClick={() => setShowImagePreview(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Image
                    </button>
                    <button
                      onClick={triggerFileInput}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Change Image
                    </button>
                  </>
                ) : (
                  <button
                    onClick={triggerFileInput}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Image
                  </button>
                )}
                <button
                  onClick={() => setShowImageModal(false)}
                  className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
              {photoError && <p className="text-sm text-red-600 mt-2">{photoError}</p>}
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {showImagePreview && profileImage && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowImagePreview(false)}
          >
            <div
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowImagePreview(false)}
                aria-label="Close preview"
                className="absolute -top-10 right-0 text-white hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-full h-auto rounded-xl object-contain"
              />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Bookings</h2>
                <Link
                  to="/client/bookings"
                  className="text-primary hover:text-primary/80 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{booking.service.title}</h3>
                        <p className="text-sm text-foreground/60">by {booking.seller.fullName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₦{booking.service.price ?? "--"}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "accepted" || booking.status === "pending"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {booking.status === "completed"
                            ? "Completed"
                            : booking.status === "accepted"
                            ? "Accepted"
                            : booking.status === "pending"
                            ? "Pending"
                            : "Rejected"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-sm text-foreground/60">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Reviews Given ({reviewsGiven.length})</h2>
              <div className="space-y-4">
                {reviewsGiven.map((review) => (
                  <div key={review._id} className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-semibold">{review.seller.fullName.split(" ").map((n) => n[0]).join("")}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.seller.fullName}</h4>
                            <p className="text-sm text-foreground/60">{review.service.title}</p>
                          </div>
                          <span className="text-sm text-foreground/60">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-foreground/70">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold mb-4">Favorite Services</h3>
              <div className="space-y-3">
                {(favoriteServices.length ? favoriteServices : favoriteServicesPlaceholder).map((service) => (
                  <div key={service.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">?</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 truncate">{service.title}</h4>
                      {service.seller && (
                        <p className="text-xs text-foreground/60 mb-1">{service.seller}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-foreground/60">
                          {service.seller ? "Top paid service" : "Hire services to populate favorites"}
                        </div>
                          <span className="text-sm font-bold">
                          {service.price ? `₦${service.price}` : "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/client/explore"
                className="block w-full text-center mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                Explore More Services
              </Link>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold mb-4">Activity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Total Spent</span>
                  <span className="font-medium">₦{totalSpent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Avg. Rating Given</span>
                  <span className="font-medium">{avgRatingGiven.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Active Since</span>
                  <span className="font-medium">{activeSince || "—"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
