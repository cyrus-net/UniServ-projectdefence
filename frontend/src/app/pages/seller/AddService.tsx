import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { Upload, X, Plus } from "lucide-react";
import { api } from "../../services/api";

export function AddService() {
  const navigate = useNavigate();
  const hiddenFileInputs = useRef<Array<HTMLInputElement | null>>([]);
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [availability, setAvailability] = useState("");
  const [deliveryTime, setDeliveryTime] = useState(1);
  
  const [features, setFeatures] = useState<string[]>(["", "", ""]);
  const [requirements, setRequirements] = useState("");
  const [images, setImages] = useState<string[]>(["", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const categories = [
    "Graphic Design",
    "Web Development",
    "Tutoring",
    "Assignment Help",
    "Photography",
    "Video Editing",
    "Typing & Data Entry",
  ];

  const openFileSelector = (index: number) => {
    hiddenFileInputs.current[index]?.click();
  };

  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const normalizeImages = (nextImages: string[]) => {
    const filled = nextImages.filter((img) => !!img);
    return [filled[0] || "", filled[1] || "", filled[2] || "", filled[3] || ""];
  };

  const handleImageChange = async (index: number, file: File | null) => {
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      setImages((prev) => {
        const next = [...prev];
        next[index] = dataUrl;
        return normalizeImages(next);
      });
    } catch (error) {
      console.error("Failed to read image:", error);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    setFeatures((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addFeature = () => {
    setFeatures((prev) => [...prev, ""]);
  };

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        description,
        category: selectedCategory,
        price,
        availability,
        deliveryTime,
        features: features.filter((item) => item.trim() !== ""),
        requirements,
        images: images.filter((item) => item),
      };

      await api.services.create(payload);
      navigate("/seller/services");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to publish service.";
      console.error("Failed to publish service:", message);
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Service</h1>
          <p className="text-foreground/70">Fill in the details to list your service</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Images */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="font-semibold mb-4">Service Images</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="relative aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center hover:border-primary transition-colors cursor-pointer overflow-hidden"
                  onClick={() => openFileSelector(index)}
                >
                  <input
                    ref={(el) => {
                      hiddenFileInputs.current[index] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(index, e.target.files?.[0] ?? null)}
                  />
                  {index === 0 && (
                    <div className="absolute top-3 left-3 z-10 rounded-full bg-primary/90 px-2 py-1 text-[11px] uppercase tracking-[0.12em] text-primary-foreground">
                      Cover
                    </div>
                  )}
                  {images[index] ? (
                    <img src={images[index]} alt={`Service ${index + 1}`} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <Upload className="w-8 h-8 text-foreground/40 mb-2" />
                      <span className="text-sm text-foreground/60">Upload</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-foreground/60 mt-3">
              Upload up to 4 images. First image will be the cover.
            </p>
          </div>

          {/* Basic Information */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Service Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Professional Logo Design"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your service in detail..."
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing & Delivery */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="font-semibold mb-4">Pricing & Delivery</h2>
              <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (₦)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  placeholder="45"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Delivery Time (days)</label>
                <input
                  type="number"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(Number(e.target.value))}
                  placeholder="3"
                  min="1"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>

              

              <div>
                <label className="block text-sm font-medium mb-2">Availability</label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g., 24/7, Weekdays only"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">What's Included</h2>
              <button
                type="button"
                onClick={addFeature}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
              >
                <Plus className="w-4 h-4" />
                Add feature
              </button>
            </div>
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1 px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    title="Remove feature"
                    aria-label="Remove feature"
                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="font-semibold mb-4">Requirements from Buyer</h2>
            <textarea
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="What information do you need from the buyer to start working?"
              className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Action Buttons */}
          {errorMessage && (
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {errorMessage}
            </div>
          )}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/seller/services")}
              className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Publishing..." : "Publish Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
