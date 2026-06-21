import { Link } from "react-router";
import { Navbar } from "../../components/navigation/Navbar";
import { DollarSign, ShoppingBag, Star, TrendingUp, Eye, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { api } from "../../services/api";

export function SellerDashboard() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(" ")[0] || "there";
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  const [activeServices, setActiveServices] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  const loadServices = async () => {
    try {
      const result = await api.services.getMyServices();
      setServices(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Failed to load seller services:", error);
      setServices([]);
    }
  };

  useEffect(() => {
    const loadStatsAndRecent = async () => {
      try {
        const [stats, bookingsRes] = await Promise.all([api.services.getStats(), api.bookings.getRecentForSeller()]);
        setActiveServices(stats.activeServices || 0);
        setTotalBookings(stats.totalBookings || 0);
        setTotalEarnings(stats.totalEarnings || 0);
        setAvgRating(stats.avgRating || 0);

        const bookings = Array.isArray(bookingsRes) ? bookingsRes : [];
        const sellerBookings = bookings.map((b) => ({
          id: b._id || b.id,
          service: b.service?.title || (b.service && b.service.name) || "Service",
          client: b.client?.fullName || b.client || "Client",
          status: b.status,
          amount: b.service?.price || 0,
          date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "",
        }));

        setRecentBookings(sellerBookings);
      } catch (error) {
        console.error("Failed to load stats or bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?._id) {
      loadStatsAndRecent();
      loadServices();
    }
  }, [user?._id]);

  const stats = [
    { label: "Active Services", value: activeServices.toString(), icon: ShoppingBag, color: "primary" },
    { label: "Total Bookings", value: totalBookings.toString(), icon: TrendingUp, color: "green" },
    { label: "Total Earnings", value: `₦${totalEarnings}`, icon: DollarSign, color: "blue" },
    { label: "Avg. Rating", value: avgRating.toString(), icon: Star, color: "yellow" },
  ];

  

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {capitalizedFirstName}!</h1>
            <p className="text-foreground/70">Here's what's happening with your services</p>
          </div>
          <Link
            to="/seller/add-service"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add New Service
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === "primary" ? "bg-primary/10" :
                  stat.color === "green" ? "bg-green-500/10" :
                  stat.color === "blue" ? "bg-blue-500/10" :
                  "bg-yellow-500/10"
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.color === "primary" ? "text-primary" :
                    stat.color === "green" ? "text-green-600" :
                    stat.color === "blue" ? "text-blue-600" :
                    "text-yellow-600"
                  }`} />
                </div>
                <div>
                  <p className="text-sm text-foreground/60">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Recent Bookings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Bookings</h2>
              <Link to="/seller/bookings" className="text-primary hover:text-primary/80 text-sm font-medium">
                View All
              </Link>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="divide-y divide-border">
                {recentBookings.length === 0 && !isLoading && (
                  <div className="p-4 text-sm text-foreground/60">No recent bookings</div>
                )}
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{booking.service}</h3>
                        <p className="text-sm text-foreground/70">{booking.client}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === "completed" ? "bg-green-500/10 text-green-600" :
                        booking.status === "in progress" || booking.status === "in-progress" || booking.status === "accepted" ? "bg-blue-500/10 text-blue-600" :
                        "bg-yellow-500/10 text-yellow-600"
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground/60">{booking.date}</span>
                      <span className="font-semibold">₦{booking.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Earnings Chart Placeholder */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Earnings Overview</h2>
              <Link to="/seller/earnings" className="text-primary hover:text-primary/80 text-sm font-medium">
                View Details
              </Link>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="h-64 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                <div className="text-center">
                  <DollarSign className="w-16 h-16 text-primary mx-auto mb-3" />
                  <p className="text-foreground/70">Earnings Chart</p>
                  <p className="text-3xl font-bold mt-2">₦{totalEarnings}</p>
                  <p className="text-sm text-foreground/60 mt-1">Total from completed bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Services */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">My Services</h2>
            <Link to="/seller/services" className="text-primary hover:text-primary/80 text-sm font-medium">
              Manage All
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.length === 0 && !isLoading ? (
              <div className="md:col-span-3 rounded-xl border border-border bg-card p-10 text-center text-foreground/70">
                No services found. Add a service to see it here.
              </div>
            ) : (
              services.map((service) => (
                <div key={service._id || service.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video flex items-center justify-center overflow-hidden">
                    {service.images?.[0] ? (
                      <img src={service.images[0]} alt={service.title} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <div className="text-5xl">🎨</div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold flex-1">{service.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        service.status === "Paused" ? "bg-yellow-500/10 text-yellow-600" : "bg-green-500/10 text-green-600"
                      }`}>
                        {service.status || "Active"}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center justify-between text-foreground/70">
                        <span>Price:</span>
                        <span className="font-semibold text-foreground">₦{service.price}</span>
                      </div>
                      {service.availability && (
                        <div className="flex items-center justify-between text-foreground/70">
                          <span>Availability:</span>
                          <span className="font-semibold text-foreground">{service.availability}</span>
                        </div>
                      )}
                      {service.orders !== undefined && (
                        <div className="flex items-center justify-between text-foreground/70">
                          <div className="flex items-center gap-1">
                            <ShoppingBag className="w-4 h-4" />
                            <span>Orders:</span>
                          </div>
                          <span className="font-semibold text-foreground">{service.orders}</span>
                        </div>
                      )}
                      {service.views !== undefined && (
                        <div className="flex items-center justify-between text-foreground/70">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>Views:</span>
                          </div>
                          <span className="font-semibold text-foreground">{service.views}</span>
                        </div>
                      )}
                    </div>
                    <Link
                      to="/seller/services"
                      className="block w-full text-center py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      Manage Service
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
