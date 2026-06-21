import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, Eye, ShoppingBag, Pause, Play, Trash2 } from "lucide-react";
import { api } from "../../services/api";

export function MyServices() {
  const [activeTab, setActiveTab] = useState("all");
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const result = await api.services.getMyServices();
      setServices(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Failed to load services:", error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleToggleStatus = async (service: any) => {
    setIsSaving(true);
    try {
      const newStatus = service.status === "Paused" ? "Active" : "Paused";
      await api.services.update(service._id || service.id, { status: newStatus });
      await loadServices();
    } catch (error) {
      console.error("Failed to update service status:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteService = async (service: any) => {
    setIsSaving(true);
    try {
      await api.services.delete(service._id || service.id);
      await loadServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredServices = services.filter((service) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return service.status !== "Paused";
    if (activeTab === "paused") return service.status === "Paused";
    return true;
  });

  const totalCount = services.length;
  const activeCount = services.filter((service) => service.status !== "Paused").length;
  const pausedCount = services.filter((service) => service.status === "Paused").length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Services</h1>
            <p className="text-foreground/70">Manage your live and paused service listings.</p>
          </div>
          <Link
            to="/seller/add-service"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add New Service
          </Link>
        </div>

        <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === "all"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            All Services ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === "active"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab("paused")}
            className={`px-6 py-3 font-medium transition-colors whitespace-nowrap ${
              activeTab === "paused"
                ? "text-primary border-b-2 border-primary"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Paused ({pausedCount})
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-foreground/70">
            Loading your services...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 rounded-xl border border-border bg-card">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-foreground/70 mb-6">
              You currently have no services in this section. Add a new service to start earning.
            </p>
            <Link
              to="/seller/add-service"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Service
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service._id || service.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video flex items-center justify-center overflow-hidden relative group">
                  {service.images?.[0] ? (
                    <img src={service.images[0]} alt={service.title} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <div className="text-5xl">🎨</div>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <h3 className="font-semibold flex-1 line-clamp-2">{service.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      service.status === "Active" ? "bg-green-500/10 text-green-600" : "bg-yellow-500/10 text-yellow-600"
                    }`}>
                      {service.status || "Active"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between text-foreground/70">
                      <span>Price:</span>
                      <span className="font-semibold text-foreground">${service.price}</span>
                    </div>
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

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      disabled={isSaving}
                      onClick={() => handleToggleStatus(service)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {service.status === "Paused" ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      <span>{service.status === "Paused" ? "Resume" : "Pause"}</span>
                    </button>
                    <button
                      disabled={isSaving}
                      onClick={() => handleDeleteService(service)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
