const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getToken = () => {
  const token = localStorage.getItem("token");
  const normalized = typeof token === "string" ? token.trim() : token;
  if (!normalized || normalized === "null" || normalized === "undefined") {
    return null;
  }
  return normalized;
};

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const authHeader = (): Record<string, string> => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText || "Request failed";
    if (response.status === 401) {
      clearAuthStorage();
      window.location.href = "/sign-in";
    }
    throw new Error(message);
  }
  return data;
};

export const api = {
  // Auth endpoints
  auth: {
    register: async (data: {
      fullName: string;
      email: string;
      password: string;
      role: "client" | "seller";
      bio?: string;
    }) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    login: async (data: { email: string; password: string }) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    googleAuth: async (data: { credential: string; role?: "client" | "seller" }) => {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    updateProfile: async (data: { fullName?: string; email?: string; bio?: string; photoBase64?: string; notificationPreferences?: {
      email?: {
        newBookings?: boolean;
        reviews?: boolean;
        orderUpdates?: boolean;
      };
      push?: {
        realTimeUpdates?: boolean;
        marketing?: boolean;
      };
    } }) => {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    updateTheme: async (theme: "light" | "dark") => {
      const response = await fetch(`${API_URL}/auth/theme`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({ themePreference: theme }),
      });
      return response.json();
    },
  },

  // Service endpoints
  services: {
    getAll: async (page = 1, limit = 12) => {
      const response = await fetch(`${API_URL}/services?page=${page}&limit=${limit}`);
      return response.json();
    },

    getMyServices: async () => {
      const response = await fetch(`${API_URL}/services/my-services`, {
        headers: { ...authHeader() },
      });
      return handleResponse(response);
    },

    getStats: async () => {
      const response = await fetch(`${API_URL}/services/stats`, {
        headers: { ...authHeader() },
      });
      return handleResponse(response);
    },

    create: async (data: {
      title: string;
      description: string;
      category: string;
      price: number;
      availability: string;
      deliveryTime: number;
      revisions?: string;
      requirements: string;
      features: string[];
      images: string[];
    }) => {
      const response = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    update: async (
      id: string,
      data: {
        title?: string;
        description?: string;
        price?: number;
        availability?: string;
        status?: "Active" | "Paused";
      }
    ) => {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
        headers: { ...authHeader() },
      });
      return handleResponse(response);
    },
  },

  // Booking endpoints
  bookings: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/bookings`, {
        headers: { ...authHeader() },
      });
      return handleResponse(response);
    },

    create: async (data: { serviceId: string }) => {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    },

    updateStatus: async (id: string, status: string) => {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({ status }),
      });
      return handleResponse(response);
    },

    getRecentForSeller: async () => {
      const response = await fetch(`${API_URL}/bookings/seller/recent`, {
        headers: { ...authHeader() },
      });
      return handleResponse(response);
    },
  },

  // Payment endpoints
  payments: {
    processPayment: async (bookingId: string) => {
      const response = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({ bookingId }),
      });
      return response.json();
    },
  },

  // Message endpoints
  messages: {
    send: async (data: { receiverId: string; message: string }) => {
      const response = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    getAll: async () => {
      const response = await fetch(`${API_URL}/messages`, {
        headers: { ...authHeader() },
      });
      return response.json();
    },

    getConversation: async (userId: string) => {
      const response = await fetch(`${API_URL}/messages/${userId}`, {
        headers: { ...authHeader() },
      });
      return response.json();
    },
  },

  // Review endpoints
  reviews: {
    create: async (data: { serviceId: string; rating: number; comment: string }) => {
      const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },

    getAll: async () => {
      const response = await fetch(`${API_URL}/reviews`, {
        headers: { ...authHeader() },
      });
      return response.json();
    },
  },

  // Notifications endpoints
  notifications: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: { ...authHeader() },
      });
      return response.json();
    },

    markRead: async (id: string) => {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: { ...authHeader() },
      });
      return response.json();
    },

    markAllRead: async () => {
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: { ...authHeader() },
      });
      return response.json();
    },
  },

  // Saved services endpoints
  savedServices: {
    save: async (serviceId: string) => {
      const response = await fetch(`${API_URL}/saved-services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeader(),
        },
        body: JSON.stringify({ serviceId }),
      });
      return response.json();
    },

    unsave: async (serviceId: string) => {
      const response = await fetch(`${API_URL}/saved-services/${serviceId}`, {
        method: "DELETE",
        headers: { ...authHeader() },
      });
      return response.json();
    },

    getAll: async () => {
      const response = await fetch(`${API_URL}/saved-services`, {
        headers: { ...authHeader() },
      });
      return response.json();
    },

    isSaved: async (serviceId: string) => {
      const response = await fetch(`${API_URL}/saved-services/${serviceId}/is-saved`, {
        headers: { ...authHeader() },
      });
      return response.json();
    },
  },
};
