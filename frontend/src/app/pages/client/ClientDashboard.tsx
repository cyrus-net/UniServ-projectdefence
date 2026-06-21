import { Link } from "react-router";
import { Star, TrendingUp, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

interface Booking {
  _id: string;
  service: { _id: string; title: string };
  seller: { _id: string; fullName: string };
  status: "pending" | "accepted" | "completed" | "rejected";
  createdAt: string;
}

interface Service {
  _id: string;
  title: string;
  seller: { _id: string; fullName: string };
  price: number;
  rating?: number;
  reviews?: number;
}

export function ClientDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [savedServices, setSavedServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsRes, servicesRes, savedRes] = await Promise.all([
        api.bookings.getAll(),
        api.services.getAll(),
        api.savedServices.getAll(),
      ]);
      setBookings(Array.isArray(bookingsRes) ? bookingsRes : []);
      setServices(Array.isArray(servicesRes?.services) ? servicesRes.services : servicesRes || []);
      setSavedServices(Array.isArray(savedRes) ? savedRes : []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats
  const activeBookings = bookings.filter(b => b.status === "accepted").length;
  const completedBookings = bookings.filter(b => b.status === "completed").length;
  const savedServicesCount = savedServices.length;

  // Get recent bookings (limit to 5 most recent)
  const recentBookings = bookings
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Recommended services (limit to 3)
  const recommendedServices = services.slice(0, 3);

  const firstName = user?.fullName?.split(" ")[0] || "User";
  const capitalizedFirstName =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {capitalizedFirstName}!</h1>
          <p className="text-foreground/70">Find the perfect service for your needs</p>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Active Bookings</p>
                <p className="text-2xl font-bold">{activeBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Completed</p>
                <p className="text-2xl font-bold">{completedBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Saved Services</p>
                <p className="text-2xl font-bold">{savedServicesCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            <Link to="/client/bookings" className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </Link>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Service</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Seller</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Status</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Date</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4">{booking.service.title}</td>
                      <td className="px-6 py-4 text-foreground/70">{booking.seller.fullName}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "completed" ? "bg-green-500/10 text-green-600" :
                          booking.status === "accepted" ? "bg-blue-500/10 text-blue-600" :
                          "bg-yellow-500/10 text-yellow-600"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-foreground/70">{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/client/booking/${booking._id}`}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recommended Services */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended for You</h2>
            <Link to="/client/explore" className="text-primary hover:text-primary/80 text-sm font-medium">
              Explore All
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {recommendedServices.map((service) => (
              <Link
                key={service._id}
                to={`/client/service/${service._id}`}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-4xl">🎨</div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-foreground/70 mb-3">{service.seller.fullName}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.rating}</span>
                    </div>
                    <span className="text-sm text-foreground/60">({service.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">Starting at</span>
                    <span className="text-xl font-bold">${service.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
