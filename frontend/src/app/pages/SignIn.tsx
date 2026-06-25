import { Link, useNavigate } from "react-router";
import { Mail, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import useAutoDismiss from "../hooks/useAutoDismiss";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

declare global {
  interface Window {
    google?: any;
  }
}

export function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const googleClientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

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
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const loginData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const data = await api.auth.login({
        email: loginData.email as string,
        password: loginData.password as string,
      });

      if (data?.token) {
        login({
          _id: data._id,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
          bio: data.bio,
          photoBase64: data.photoBase64,
          createdAt: data.createdAt,
        }, data.token);

        if (data.role === "client") {
          navigate("/client/dashboard");
        } else {
          navigate("/seller/dashboard");
        }
      } else {
        setError(data?.message || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response: any) => {
    if (!response?.credential) {
      setError("Google authentication failed.");
      setGoogleLoading(false);
      return;
    }

    try {
      const data = await api.auth.googleAuth({ credential: response.credential });
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
        setError(data.message || "Google authentication failed.");
      }
    } catch (error) {
      setError("Google authentication failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!googleClientId) {
      setError("Google client ID is not configured.");
      return;
    }
    if (!window.google) {
      setError("Google authentication is not available right now.");
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
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-foreground/70">Sign in to your UniServ account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  name="email"
                  type="email"
                  placeholder="your email address"
                  className="w-full pl-10 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                <span className="text-sm text-foreground/70">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In"}
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
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-3 bg-white text-foreground border border-border rounded-xl hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                "Signing in with Google..."
              ) : (
                <>
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" className="h-5 w-5" />
                  Continue with Google
                </>
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-foreground/70">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-primary hover:text-primary/80 font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
  This is a
  multi-line comment
*/