import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navbar } from "../../components/navigation/Navbar";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "../../services/api";

interface Booking {
  _id: string;
  client: { fullName: string; email: string };
  seller: { fullName: string; email: string };
  service: { title: string; description: string; price: number };
  status: "pending" | "accepted" | "completed" | "rejected";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
  updatedAt: string;
}

export function BookingsManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const allBookings = await api.bookings.getAll();
        // Filter to only seller's bookings where the user is the seller
        const sellerBookings = allBookings.filter(
          (b: any) => b.seller && (b.seller._id || b.seller)
        );
        setBookings(sellerBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: "Pending",
      accepted: "In Progress",
      completed: "Completed",
      rejected: "Rejected",
    };
    return statusMap[status] || status;
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return booking.status === "pending" || booking.status === "accepted";
    if (activeTab === "completed") return booking.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Bookings Management</h1>
          <p className="text-foreground/70">Track and manage your orders</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Active Orders</p>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => b.status === "pending" || b.status === "accepted").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Completed</p>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => b.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-foreground/60">Pending</p>
                <p className="text-2xl font-bold">
                  {bookings.filter(b => b.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
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
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12 text-foreground/70">Loading bookings...</div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-foreground/70">No bookings yet</div>
          ) : (
            filteredBookings.map((booking) => (
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
                        <p className="text-sm text-foreground/70 mb-2">from {booking.client.fullName}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-foreground/60">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Ordered: {formatDate(booking.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Updated: {formatDate(booking.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
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
                      {getStatusLabel(booking.status)}
                    </span>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-foreground/60">Amount</p>
                        <p className="text-xl font-bold">${booking.service.price}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}