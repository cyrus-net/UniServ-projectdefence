import { Link, useNavigate } from "react-router";
import { Mail, Lock, User, Search, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import useAutoDismiss from "../hooks/useAutoDismiss";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

declare global {
  interface Window {
    google?: any;
  }
}

export function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"client" | "seller" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

  const showError = (message: string) => {
    setError(message);
  };

  useEffect(() => {
    if (window.google || document.getElementById("google-client-script")) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-client-script";
    document.body.appendChild(script);
  }, []);

  useAutoDismiss(error, setError, 3000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      showError("Please select a role");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const bio = String(formData.get("bio") ?? "").trim();

    // Client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];

    if (!emailRegex.test(email)) {
      showError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    const emailDomain = email.split("@")[1]?.toLowerCase();
    if (!emailDomain || !allowedDomains.includes(emailDomain)) {
      showError("Only @gmail.com, @yahoo.com, and @outlook.com are allowed");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const userData = {
      fullName,
      email,
      password,
      role: selectedRole,
      bio,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful, redirect to sign in page
        navigate("/sign-in");
      } else {
        showError(data.message || "Registration failed");
      }
    } catch (error) {
      showError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response: any) => {
    if (!response?.credential) {
      showError("Google authentication failed.");
      setGoogleLoading(false);
      return;
    }

    try {
      const data = await api.auth.googleAuth({ credential: response.credential, role: selectedRole ?? undefined });
      if (data?.token) {
        login(
          {
            _id: data._id,
            fullName: data.fullName,
            email: data.email,
            role: data.role,
            bio: data.bio,
            photoBase64: data.photoBase64,
            createdAt: data.createdAt,
          },
          data.token
        );
        navigate(data.role === "seller" ? "/seller/dashboard" : "/client/dashboard");
      } else {
        showError(data.message || "Google authentication failed.");
      }
    } catch (error) {
      showError("Google authentication failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!selectedRole) {
      showError("Please select a role before continuing with Google.");
      return;
    }
    if (!googleClientId) {
      showError("Google client ID is not configured.");
      return;
    }
    if (!window.google) {
      showError("Google authentication is not available right now.");
      return;
    }

    setGoogleLoading(true);
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleResponse,
    });
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setGoogleLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen">
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-foreground/70">Join UniServ today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  name="fullName"
                  type="text"
                  placeholder="Your Name"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email Address"
                  title="Allowed domains: @gmail.com, @yahoo.com, @outlook.com"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-foreground/60">Allowed domains: @gmail.com, @yahoo.com, @outlook.com</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                name="bio"
                rows={4}
                placeholder="Tell us a bit about yourself"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-4">How would you like to use the platform?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole("client")}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    selectedRole === "client"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <Search className="w-8 h-8 text-primary mb-2" />
                    <span className="font-medium">Find Services</span>
                    <span className="text-xs text-foreground/60 mt-1">Hire students</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("seller")}
                  className={`p-4 border-2 rounded-xl transition-all ${
                    selectedRole === "seller"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <Briefcase className="w-8 h-8 text-primary mb-2" />
                    <span className="font-medium">Offer Services</span>
                    <span className="text-xs text-foreground/60 mt-1">Earn money</span>
                  </div>
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary" required />
              <span className="text-sm text-foreground/70">
                I agree to the{" "}
                <Link to="/coming-soon" className="text-primary hover:text-primary/80">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/coming-soon" className="text-primary hover:text-primary/80">Privacy Policy</Link>
              </span>
            </label>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-4">
            <div className="flex items-center gap-3 text-sm text-foreground/60 mb-4">
              <span className="h-px flex-1 bg-border"></span>
              <span>or continue with</span>
              <span className="h-px flex-1 bg-border"></span>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              className="w-full py-3 bg-white text-foreground border border-border rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                "Continuing with Google..."
              ) : (
                <>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="h-5 w-5" />
                  Continue with Google
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-foreground/70">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-primary hover:text-primary/80 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}