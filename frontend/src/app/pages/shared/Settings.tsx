import { useEffect, useState, useRef } from "react";
import useAutoDismiss from "../../hooks/useAutoDismiss";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { api } from "../../services/api";
import { User, Bell, CreditCard, X, Upload, Eye, ArrowLeft, Moon, Sun } from "lucide-react";

export function Settings() {
  const [activeTab, setActiveTabState] = useState("profile");
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    localStorage.setItem("settingsActiveTab", tab);
  };
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: {
      newBookings: true,
      reviews: true,
      orderUpdates: true,
    },
    push: {
      realTimeUpdates: true,
      marketing: false,
    },
  });
  const [prefMessage, setPrefMessage] = useState("");
  const [prefError, setPrefError] = useState("");
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useAutoDismiss(message, setMessage, 3000);
  useAutoDismiss(error, setError, 3000);
  useAutoDismiss(prefMessage, setPrefMessage, 3000);
  useAutoDismiss(prefError, setPrefError, 3000);
  useAutoDismiss(photoError, setPhotoError, 3000);

  useEffect(() => {
    const savedTab = localStorage.getItem("settingsActiveTab");
    if (savedTab && savedTab !== "security") {
      setActiveTabState(savedTab);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const parts = user.fullName.trim().split(" ");
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setEmail(user.email || "");
    setBio(user.bio || "");
    setProfileImage(user.photoBase64 || null);
    setNotificationPreferences({
      email: {
        newBookings: user.notificationPreferences?.email?.newBookings ?? true,
        reviews: user.notificationPreferences?.email?.reviews ?? true,
        orderUpdates: user.notificationPreferences?.email?.orderUpdates ?? true,
      },
      push: {
        realTimeUpdates: user.notificationPreferences?.push?.realTimeUpdates ?? true,
        marketing: user.notificationPreferences?.push?.marketing ?? false,
      },
    });
  }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsSaving(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const result = await api.auth.updateProfile({ fullName, email, bio, photoBase64: profileImage || undefined });

      if (result.message) {
        setError(result.message);
      } else {
        setMessage("Profile updated successfully.");
        updateUser({
          _id: result._id,
          fullName: result.fullName,
          email: result.email,
          role: result.role,
          bio: result.bio,
          photoBase64: result.photoBase64,
          notificationPreferences: user?.notificationPreferences,
          createdAt: result.createdAt,
        });
      }
    } catch (err) {
      setError("Unable to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageClick = () => {
    setShowImageModal(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setPhotoError("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setPhotoError("Please select a valid image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        setProfileImage(base64);
        setPhotoError(null);
        setPhotoSaving(true);

        try {
          const result = await api.auth.updateProfile({ photoBase64: base64 });
          if (result.message) {
            setPhotoError(result.message);
          } else {
            updateUser({
              _id: result._id,
              fullName: result.fullName,
              email: result.email,
              role: result.role,
              bio: result.bio,
              photoBase64: result.photoBase64,
              createdAt: result.createdAt,
            });
          }
        } catch (error) {
          setPhotoError("Failed to save profile photo. Please try again.");
        } finally {
          setPhotoSaving(false);
          setShowImageModal(false);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoError("Please select a file");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-foreground/70">Manage your account preferences</p>
          </div>
          <Link
            to={user?.role === "client" ? "/client/profile" : "/seller/profile"}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-card rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeTab === "profile" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                }`}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeTab === "notifications" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                }`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
              <button
                onClick={() => setActiveTab("payment")}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeTab === "payment" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Payment</span>
              </button>
              <button
                onClick={() => setActiveTab("appearance")}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeTab === "appearance" ? "bg-primary/10 text-primary" : "hover:bg-accent"
                }`}
              >
                <Sun className="w-5 h-5" />
                <span>Appearance</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity relative overflow-hidden" onClick={handleImageClick}>
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="text-3xl font-bold">
                          {user?.fullName
                            ?.split(" ")
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase() || "U"}
                        </span>
                      )}
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleImageClick}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mb-2"
                      >
                        Change Photo
                      </button>
                      <p className="text-sm text-foreground/60">JPG, PNG or GIF, max 5MB</p>
                    </div>
                  </div>

                  <form onSubmit={handleProfileSave} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        placeholder="your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Bio</label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about yourself"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                      />
                    </div>

                    {message && <p className="text-sm text-green-600">{message}</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (user) {
                            const parts = user.fullName.trim().split(" ");
                            setFirstName(parts[0] || "");
                            setLastName(parts.slice(1).join(" ") || "");
                            setEmail(user.email || "");
                            setBio(user.bio || "");
                            setMessage("");
                            setError("");
                          }
                        }}
                        className="px-6 py-3 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { label: "New bookings", desc: "Get notified when someone books your service" },
                        { label: "Reviews", desc: "Get notified when someone reviews your service" },
                        { label: "Order updates", desc: "Get updates about your orders" },
                      ].map((item, i) => (
                        <label key={i} className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-foreground/60">{item.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Push Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Real-time updates", desc: "Get instant notifications for important events" },
                        { label: "Marketing", desc: "Receive updates about new features and promotions" },
                      ].map((item, i) => (
                        <label key={i} className="flex items-start gap-3 cursor-pointer">
                          <input type="checkbox" defaultChecked={i === 0} className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-sm text-foreground/60">{item.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {prefMessage && <p className="text-sm text-green-600">{prefMessage}</p>}
                    {prefError && <p className="text-sm text-red-600">{prefError}</p>}
                    <button
                      type="button"
                      onClick={async () => {
                        setPrefError("");
                        setPrefMessage("");
                        setIsSavingPrefs(true);

                        try {
                          const result = await api.auth.updateProfile({ notificationPreferences });
                          if (result.message) {
                            setPrefError(result.message);
                          } else {
                            setPrefMessage("Notification preferences saved.");
                            updateUser({
                              _id: result._id,
                              fullName: result.fullName,
                              email: result.email,
                              role: result.role,
                              bio: result.bio,
                              photoBase64: result.photoBase64,
                              notificationPreferences: result.notificationPreferences,
                              createdAt: result.createdAt,
                            });
                          }
                        } catch (err) {
                          setPrefError("Unable to save preferences. Please try again.");
                        } finally {
                          setIsSavingPrefs(false);
                        }
                      }}
                      disabled={isSavingPrefs}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isSavingPrefs ? "Saving..." : "Save Preferences"}
                    </button>
                  </div>
                </div>
              </div>
            )}


            {activeTab === "payment" && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>
                <div className="space-y-4 mb-6">
                  <div className="p-4 border border-border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-foreground/60">Expires 12/26</p>
                      </div>
                    </div>
                    <button className="text-sm text-destructive hover:text-destructive/80">Remove</button>
                  </div>
                </div>
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  Add Payment Method
                </button>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-6">Appearance</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Theme</h3>
                    <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div className="flex items-center gap-3">
                        {isDark ? (
                          <Moon className="w-5 h-5 text-primary" />
                        ) : (
                          <Sun className="w-5 h-5 text-primary" />
                        )}
                        <div>
                          <p className="font-medium">{isDark ? "Dark Mode" : "Light Mode"}</p>
                          <p className="text-sm text-foreground/60">
                            {isDark
                              ? "Switch to light theme for better visibility in bright environments"
                              : "Switch to dark theme for reduced eye strain in low light"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Switch Theme
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-accent rounded-lg">
                    <p className="text-sm text-foreground/70">
                      Your theme preference is automatically saved and will be applied when you sign in.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 border border-border max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                {profileImage ? "Manage Profile Picture" : "Upload Profile Picture"}
              </h2>
              <button
                onClick={() => setShowImageModal(false)}
                aria-label="Close image modal"
                className="text-foreground/60 hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {profileImage ? (
                <>
                  <button
                    onClick={() => setShowImagePreview(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Image
                  </button>
                  <button
                    onClick={triggerFileInput}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Change Image
                  </button>
                </>
              ) : (
                <button
                  onClick={triggerFileInput}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
              )}
              <button
                onClick={() => setShowImageModal(false)}
                className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
            {photoError && <p className="text-sm text-red-600 mt-2">{photoError}</p>}
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && profileImage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImagePreview(false)}
        >
          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImagePreview(false)}
              aria-label="Close preview"
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={profileImage}
              alt="Profile Preview"
              className="w-full h-auto rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}