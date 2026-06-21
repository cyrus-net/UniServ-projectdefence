import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, Star, DollarSign, Package, TrendingUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

export function SellerProfile() {
  const { user } = useAuth();

  const profileName = user?.fullName || "Seller";
  const profileInitials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "S";
  const profileImage = user?.photoBase64 || null;
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleString(undefined, { month: "short", year: "numeric" }) : "-";

  const [rating, setRating] = useState<number>(4.9);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [servicesCount, setServicesCount] = useState<number>(0);
  const [ordersCount, setOrdersCount] = useState<number>(0);

  const [services, setServices] = useState<any[]>([]);
  const [sellerReviews, setSellerReviews] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState<number>(0);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const sellerBookings = bookings.filter((booking) => {
    const sellerId = booking?.seller?._id || booking?.seller;
    return sellerId && user?._id && sellerId.toString() === user._id.toString();
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthEarnings = sellerBookings.reduce((sum, booking) => {
    const createdAt = booking?.createdAt ? new Date(booking.createdAt) : null;
    if (
      booking?.status === "completed" &&
      createdAt &&
      createdAt.getMonth() === currentMonth &&
      createdAt.getFullYear() === currentYear
    ) {
      return sum + (booking.service?.price || 0);
    }
    return sum;
  }, 0);

  const pendingEarnings = sellerBookings.reduce((sum, booking) => {
    if (booking?.status && booking.status !== "completed" && booking.status !== "rejected") {
      return sum + (booking.service?.price || 0);
    }
    return sum;
  }, 0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await api.services.getStats();

        // Map possible backend keys to our UI
        setRating(stats?.avgRating ?? stats?.rating ?? rating);
        setCompletedCount(stats?.completedBookings ?? stats?.totalBookings ?? stats?.completed ?? 0);
        setServicesCount(stats?.activeServices ?? stats?.servicesCount ?? stats?.totalServices ?? 0);
        setOrdersCount(stats?.totalOrders ?? stats?.orders ?? stats?.totalBookings ?? 0);
        setTotalEarnings(stats?.totalEarnings ?? 0);
      } catch (err) {
        console.error("Failed to load profile stats:", err);
      }
    };

    if (user?._id) loadStats();
  }, [user?._id]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const [svcRes, revRes, bkRes] = await Promise.all([
          api.services.getMyServices(),
          api.reviews.getAll(),
          api.bookings.getAll(),
        ]);

        setServices(Array.isArray(svcRes) ? svcRes : []);
        setSellerReviews(Array.isArray(revRes) ? revRes : []);
        setBookings(Array.isArray(bkRes) ? bkRes : []);
      } catch (err) {
        console.error("Failed to load services/reviews/bookings:", err);
        setServices([]);
        setSellerReviews([]);
        setBookings([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (user?._id) loadData();
  }, [user?._id]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card rounded-xl p-8 border border-border mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt={`${profileName} profile`} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold">{profileInitials}</span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profileName}</h1>
                  <p className="text-lg text-foreground/70 mb-3">UniServ Seller</p>
                  <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since {memberSince}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold mb-1">{completedCount}</p>
                  <p className="text-sm text-foreground/60">Completed</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold mb-1">{servicesCount}</p>
                  <p className="text-sm text-foreground/60">Services</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold mb-1">{ordersCount}</p>
                  <p className="text-sm text-foreground/60">Orders</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-foreground/70">
                  {user?.bio || "No biography has been added yet. Update your profile to share more about yourself."}
                </p>
              </div>

              <div>
                <Link
                  to="/settings"
                  className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors mr-3"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/seller/services"
                  className="inline-block px-6 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                >
                  Manage Services
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">My Services ({services.length})</h2>
                <Link
                  to="/seller/add-service"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Add Service
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {isLoadingData ? (
                  <div className="md:col-span-2 rounded-xl border border-border bg-card p-10 text-center text-foreground/70">
                    Loading services...
                  </div>
                ) : services.length === 0 ? (
                  <div className="md:col-span-2 rounded-xl border border-border bg-card p-10 text-center text-foreground/70">
                    No services found.
                  </div>
                ) : (
                  services.map((service) => {
                    const serviceId = (service._id || service.id || "").toString();
                    const serviceReviews = sellerReviews.filter((r) => {
                      const sid = r?.service && (r.service._id || r.service);
                      return sid && sid.toString() === serviceId;
                    });
                    const avgRating = serviceReviews.length ? serviceReviews.reduce((s, r) => s + (r.rating || 0), 0) / serviceReviews.length : 0;
                    const reviewsCount = serviceReviews.length;
                    const ordersCompleted = bookings.filter((b) => {
                      const bid = b?.service && (b.service._id || b.service);
                      return bid && bid.toString() === serviceId && (b.status === "completed");
                    }).length;

                    return (
                      <div key={serviceId} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          {service.images?.[0] ? (
                            <img src={service.images[0]} alt={service.title} className="object-cover w-full h-full" />
                          ) : (
                            <div className="text-5xl">🎨</div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-semibold mb-2">{service.title}</h3>
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{avgRating ? avgRating.toFixed(1) : "0.0"}</span>
                            </div>
                            <span className="text-sm text-foreground/60">({reviewsCount} reviews)</span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-border mb-3">
                            <span className="text-sm text-foreground/60">Starting at</span>
                            <span className="text-xl font-bold">${service.price}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground/60">
                            <Package className="w-4 h-4" />
                            <span>{ordersCompleted} orders completed</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Reviews ({sellerReviews.length})</h2>
              <div className="space-y-4">
                {isLoadingData ? (
                  <div className="bg-card rounded-xl p-6 border border-border text-center">Loading reviews...</div>
                ) : sellerReviews.length === 0 ? (
                  <div className="bg-card rounded-xl p-6 border border-border text-center">No reviews yet.</div>
                ) : (
                  sellerReviews.map((review) => {
                    const clientName = review.client?.fullName || review.client || "Client";
                    const serviceTitle = review.service?.title || review.service || "Service";
                    const ratingStars = Math.max(0, Math.min(5, review.rating || 0));

                    return (
                      <div key={review._id || review.id} className="bg-card rounded-xl p-6 border border-border">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="font-semibold">{clientName.split(" ").map((n) => n[0]).join("")}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">{clientName}</h4>
                                <p className="text-sm text-foreground/60">{serviceTitle}</p>
                              </div>
                              <span className="text-sm text-foreground/60">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {Array.from({ length: ratingStars }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <p className="text-foreground/70">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold mb-4">Earnings Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2 text-foreground/60">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">This Month</span>
                  </div>
                  <span className="font-bold text-lg">₦{thisMonthEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2 text-foreground/60">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">Total Earned</span>
                  </div>
                  <span className="font-bold text-lg">₦{totalEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-foreground/60">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="font-bold text-lg">₦{pendingEarnings.toLocaleString()}</span>
                </div>
              </div>
              <Link
                to="/seller/earnings"
                className="block w-full text-center mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
              >
                View Detailed Earnings
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
