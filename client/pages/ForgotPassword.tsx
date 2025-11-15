import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email) {
    toast.error("Please enter your email");
    return;
  }

  setIsLoading(true);
  try {
    const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to send reset link");
    }

    const data = await res.json();
    toast.success(data.message || "Password reset link sent to your email!");
    setSubmitted(true);
  } catch (error: any) {
    console.error(error);
    toast.error(error.message || "Failed to send reset link. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-md mx-auto">
          <div className="animate-slide-up">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
              {!submitted ? (
                <>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Reset Password
                  </h1>
                  <p className="text-muted-foreground mb-8">
                    Enter your email address and we'll send you a link to reset
                    your password.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-border focus:ring-primary"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary/90 text-white h-11 flex items-center justify-center gap-2"
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                      {!isLoading && <ArrowRight className="w-5 h-5" />}
                    </Button>
                  </form>

                  <div className="border-t border-border mt-8 pt-8">
                    <p className="text-center text-muted-foreground">
                      Remember your password?{" "}
                      <Link
                        to="/login"
                        className="text-primary hover:text-primary/80 font-semibold transition-colors"
                      >
                        Log in
                      </Link>
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-6">
                  <div className="text-6xl">✉️</div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Check Your Email
                  </h2>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to{" "}
                    <span className="font-semibold text-foreground">{email}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The link will expire in 1 hour. If you don't see it, check
                    your spam folder.
                  </p>

                  <div className="border-t border-border pt-8">
                    <Link to="/login">
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                      >
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
