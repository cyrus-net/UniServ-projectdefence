import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { api } from "../../services/api";

interface Service {
  _id: string;
  title: string;
  description: string;
  seller: { fullName: string; email: string; _id: string };
  price: number;
  availability: string;
  status?: string;
  images?: string[];
  avgRating?: number;
  reviewCount?: number;
}

export function ExploreServices() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("all");
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["All", "Tutoring", "Design", "Programming", "Writing", "Photography", "Music", "Video Editing", "Marketing"];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        // Load first 3 pages (36 services) for initial exploration
        const [page1, page2, page3] = await Promise.all([
          api.services.getAll(1, 12),
          api.services.getAll(2, 12),
          api.services.getAll(3, 12),
        ]);
        
        const allServices = [
          ...(Array.isArray(page1?.services) ? page1.services : page1 || []),
          ...(Array.isArray(page2?.services) ? page2.services : page2 || []),
          ...(Array.isArray(page3?.services) ? page3.services : page3 || []),
        ];
        
        setServices(allServices);
        setCurrentPage(3);
        setTotalPages(page1?.pagination?.pages || 1);
      } catch (err) {
        setError("Failed to load services");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  const loadMore = async () => {
    if (currentPage >= totalPages || isLoadingMore) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await api.services.getAll(nextPage, 12);
      
      const newServices = Array.isArray(response?.services) ? response.services : response || [];
      setServices(prev => [...prev, ...newServices]);
      setCurrentPage(nextPage);
    } catch (err) {
      console.error("Failed to load more services:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const filteredServices = services.filter((service) => {
    // Only show services that are active (case-insensitive comparison)
    if (service.status && service.status.toLowerCase() !== "active") return false;

    if (priceRange === "budget" && service.price >= 30) return false;
    if (priceRange === "mid" && (service.price < 30 || service.price > 50)) return false;
    if (priceRange === "premium" && service.price < 50) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explore Services</h1>
          <p className="text-foreground/70">Discover talented students ready to help</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button className="sm:w-auto px-6 py-3 bg-card border border-border rounded-xl hover:bg-accent transition-colors flex items-center justify-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:bg-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Price Range Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setPriceRange("all")}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                priceRange === "all" ? "bg-primary/10 text-primary" : "bg-card border border-border hover:bg-accent"
              }`}
            >
              All Prices
            </button>
            <button
              onClick={() => setPriceRange("budget")}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                priceRange === "budget" ? "bg-primary/10 text-primary" : "bg-card border border-border hover:bg-accent"
              }`}
            >
              Under ₦30
            </button>
            <button
              onClick={() => setPriceRange("mid")}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                priceRange === "mid" ? "bg-primary/10 text-primary" : "bg-card border border-border hover:bg-accent"
              }`}
            >
              ₦30 - ₦50
            </button>
            <button
              onClick={() => setPriceRange("premium")}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                priceRange === "premium" ? "bg-primary/10 text-primary" : "bg-card border border-border hover:bg-accent"
              }`}
            >
              ₦50+
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          {isLoading ? (
            <p className="text-foreground/70">Loading services...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-foreground/70">
              Showing <span className="font-semibold text-foreground">{filteredServices.length}</span> services
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Link
              key={service._id}
              to={`/client/service/${service._id}`}
              className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                {service.images && service.images.length > 0 && service.images[0] ? (
                  <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-5xl">🎨</div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold group-hover:text-primary transition-colors flex-1 line-clamp-2 mb-1">
                  {service.title}
                </h3>
                <p className="text-sm text-foreground/70 mb-3">
                  {typeof service.seller === "string" ? service.seller : service.seller?.fullName}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {service.avgRating ? Number(service.avgRating).toFixed(1) : "New"}
                    </span>
                  </div>
                  {service.reviewCount != null && service.reviewCount > 0 && (
                    <span className="text-sm text-foreground/60">({service.reviewCount})</span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-foreground/60">Starting at</span>
                  <span className="text-xl font-bold">₦{service.price}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {currentPage < totalPages && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? "Loading..." : "Load More Services"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
