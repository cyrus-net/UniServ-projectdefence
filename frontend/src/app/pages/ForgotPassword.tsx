import { Link } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import useAutoDismiss from "../hooks/useAutoDismiss";

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useAutoDismiss(error, setError, 3000);
  useAutoDismiss(success, setSuccess, 3000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to send reset email");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
            <p className="text-foreground/70">Enter your email to reset your password</p>
          </div>

          {success ? (
            <div className="text-center">
              <div className="text-green-600 mb-4">
                Password reset email sent! Check your inbox.
              </div>
              <Link
                to="/sign-in"
                className="text-primary hover:text-primary/80 font-medium"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
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

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Reset Email"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-foreground/70">
            <Link to="/sign-in" className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
