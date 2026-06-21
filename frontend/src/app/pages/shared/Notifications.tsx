import { useState } from "react";
import { Bell, Star, ShoppingBag, MessageSquare } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

const iconMap = {
  booking: ShoppingBag,
  review: Star,
  message: MessageSquare,
  service: Bell,
  system: Bell,
};

const badgeClasses: Record<string, string> = {
  booking: "bg-blue-100 text-blue-600",
  review: "bg-yellow-100 text-yellow-600",
  message: "bg-sky-100 text-sky-600",
  service: "bg-primary/10 text-primary",
  system: "bg-foreground/10 text-foreground/70",
};

export function Notifications() {
  const [activeTab, setActiveTab] = useState("all");
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notif.read;
    if (activeTab === notif.type) return true;
    return false;
  });

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-foreground/70">Stay updated with your activities</p>
          </div>
          <button
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className={`text-sm font-medium transition-colors ${
              unreadCount > 0
                ? "text-primary hover:text-primary/80"
                : "text-foreground/40 cursor-not-allowed"
            }`}
          >
            {unreadCount > 0 ? "Mark all as read" : "All read"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === "all"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === "unread"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Unread ({notifications.filter(n => !n.read).length})
          </button>
          <button
            onClick={() => setActiveTab("booking")}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === "booking"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === "review"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Reviews
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const Icon = iconMap[notification.type] ?? Bell;
            const badgeClass = badgeClasses[notification.type] ?? badgeClasses.system;
            const timeLabel = notification.createdAt
              ? new Date(notification.createdAt).toLocaleString()
              : "Just now";

            return (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all cursor-pointer ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${badgeClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold truncate">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                    <p className="text-sm text-foreground/70 mb-2 truncate">{notification.message}</p>
                    <p className="text-xs text-foreground/60">{timeLabel}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
            <p className="text-foreground/70">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}