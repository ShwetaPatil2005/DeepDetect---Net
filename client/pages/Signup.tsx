import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name || !email || !password || !confirmPassword) {
    toast.error("Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  if (password.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  setIsLoading(true);
  try {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: name, // ✅ backend expects 'username'
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Account created successfully!");
      navigate("/login");
    } else {
      toast.error(data.message || "Sign up failed. Please try again.");
    }
  } catch (error) {
    console.error("Signup error:", error);
    toast.error("Sign up failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="hidden md:block animate-fade-in">
            <div className="w-full rounded-2xl shadow-xl overflow-hidden">
              <img
                src="https://www.entrust.com/sites/default/files/2025-03/what-are-deepfakes-blog-header-1502x800.png"
                alt="AI facial recognition technology"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="animate-slide-up">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create Your Account
              </h1>
              <p className="text-muted-foreground mb-8">
                Join DeepDetect and start verifying images
              </p>

              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-border focus:ring-primary"
                  />
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-border focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    At least 8 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-foreground">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-border focus:ring-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-white h-11 flex items-center justify-center gap-2"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </Button>
              </form>

              <div className="border-t border-border mt-8 pt-8">
                <p className="text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
