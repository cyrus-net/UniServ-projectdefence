import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navbar } from "../../components/navigation/Navbar";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";

interface Booking {
  _id: string;
  service: { _id: string; title: string };
  seller: { _id: string; fullName: string };
  status: "pending" | "accepted" | "completed" | "rejected";
  createdAt: string;
}

export function MyBookings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const result = await api.bookings.getAll();
      setBookings(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Failed to load bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return booking.status === "accepted" || booking.status === "pending";
    if (activeTab === "completed") return booking.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
          <p className="text-foreground/70">Track and manage your service orders</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === "all"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === "active"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === "completed"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Completed
          </button>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-foreground/70">Loading your bookings...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🎨</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{booking.service.title}</h3>
                        <p className="text-sm text-foreground/70 mb-2">by {booking.seller.fullName}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Ordered: {new Date(booking.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                          booking.status === "completed"
                            ? "bg-green-500/10 text-green-600"
                            : booking.status === "accepted"
                            ? "bg-blue-500/10 text-blue-600"
                            : booking.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-red-500/10 text-red-600"
                        }`}
                      >
                        {booking.status === "completed" && <CheckCircle className="w-4 h-4" />}
                        {booking.status === "accepted" && <Clock className="w-4 h-4" />}
                        {booking.status === "pending" && <AlertCircle className="w-4 h-4" />}
                        {booking.status === "rejected" && <AlertCircle className="w-4 h-4" />}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <Link
                        to={`/client/booking/${booking._id}`}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-foreground/70 mb-6">Start exploring services to make your first booking</p>
            <Link
              to="/client/explore"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Explore Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
