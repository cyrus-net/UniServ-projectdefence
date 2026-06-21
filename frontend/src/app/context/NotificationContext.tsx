import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "../services/api";

export interface Notification {
  id: string;
  type: "booking" | "review" | "service" | "message" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const normalizeNotification = (raw: any): Notification => ({
  id: raw._id,
  type: raw.type,
  title: raw.title,
  message: raw.message,
  read: raw.read,
  createdAt: raw.createdAt || "",
  metadata: raw.metadata || {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await api.notifications.getAll();
        setNotifications(data.map(normalizeNotification));
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const updated = await api.notifications.markRead(id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? normalizeNotification(updated) : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const data = await api.notifications.markAllRead();
      setNotifications(data.map(normalizeNotification));
    } catch (error) {
      console.error("Failed to mark all notifications read:", error);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
