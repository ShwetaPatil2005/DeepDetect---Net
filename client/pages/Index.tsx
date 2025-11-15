import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Zap,
  History,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Index() {
  const isAuthenticated = localStorage.getItem("authToken") !== null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-background">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Detect AI-Generated Images with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                {" "}
                Precision
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              DeepDetect uses advanced AI analysis to identify synthetic and
              AI-generated images with high confidence. Protect yourself from
              misinformation and deepfakes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link to="/analyze">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                  >
                    Start Analysis
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/signup"> 
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                  >
                    Start Analysis
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              )}
              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-secondary"
                >
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          <div className="hidden md:flex animate-fade-in">
            <div className="w-full rounded-2xl shadow-xl overflow-hidden">
              <img
                src="https://deepfakedetector.ai/img/deepfake%20detector.png"
                alt="Facial recognition technology"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What are AI-Generated Images Section */}
      <section id="what" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What are AI-Generated Images?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Synthetic images created by artificial intelligence systems that can
            be indistinguishable from real photographs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Synthetic Faces",
              description:
                "AI creates photorealistic human faces that never existed, used in social engineering and identity fraud.",
              icon: "👤",
            },
            {
              title: "Manipulated Photos",
              description:
                "Existing images edited by AI to change context, emotions, or create false scenarios.",
              icon: "📸",
            },
            {
              title: "Deepfakes",
              description:
                "AI-generated videos and images that can mimic real people, spreading misinformation at scale.",
              icon: "🎬",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why it's Dangerous Section */}
      <section id="why" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="hidden md:flex">
            <div className="w-full rounded-2xl shadow-xl overflow-hidden">
              <img
                src="https://media.istockphoto.com/id/2231278604/photo/digital-security-alert-displayed-on-smartphone-amidst-cybersecurity-symbols-and-icons-in-a.jpg?s=2048x2048&w=is&k=20&c=KMR19iy_A5dM6G1xrnABBV9NUbLHQ2oFPDhPfQpP-dI="
                alt="AI neural network eye technology"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">
              Why AI-Generated Images Are Dangerous
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The rise of AI-generated images poses unprecedented risks to
              society and individuals.
            </p>

            {[
              {
                title: "Spread Misinformation",
                description:
                  "Fake images can rapidly spread false narratives and influence public opinion.",
              },
              {
                title: "Identity Theft & Fraud",
                description:
                  "AI faces can be used to create fake accounts, commit fraud, or manipulate trust.",
              },
              {
                title: "Ethical Concerns",
                description:
                  "Creating synthetic images of real people without consent raises serious privacy issues.",
              },
              {
                title: "Political Manipulation",
                description:
                  "Deepfakes can be weaponized to spread disinformation during elections or crises.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-primary mt-1" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-lg">
                    {item.title}
                  </h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            DeepDetect provides everything you need to identify and verify
            image authenticity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Accurate Detection",
              description:
                "State-of-the-art AI models that achieve 98%+ accuracy in identifying synthetic images.",
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Lightning Fast",
              description:
                "Get results in seconds. Upload an image and receive instant analysis.",
            },
            {
              icon: <History className="w-8 h-8" />,
              title: "Analysis History",
              description:
                "Keep track of all your analyzed images with timestamps and confidence scores.",
            },
            {
              icon: <Download className="w-8 h-8" />,
              title: "Downloadable Reports",
              description:
                "Export detailed analysis reports with visual overlays and metadata.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md border border-border hover:shadow-lg transition-all hover:border-primary"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 md:p-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                About DeepDetect
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                DeepDetect is built by a team of researchers and engineers
                dedicated to combating misinformation and protecting digital
                authenticity in the age of AI.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our mission is to empower individuals and organizations with
                tools to verify image authenticity, maintain trust in digital
                media, and stay ahead of evolving AI threats.
              </p>
              <div className="flex items-center gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="text-foreground font-semibold">
                  Trusted by security professionals worldwide
                </span>
              </div>
            </div>

            <div className="hidden md:flex">
              <div className="w-full rounded-2xl shadow-xl overflow-hidden">
                <img
                  src="https://screenapp.io/blog/best-free-deepfake-detection-tools.webp"
                  alt="Secure biometric authentication"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="bg-gradient-to-r from-primary to-accent rounded-3xl p-12 md:p-16 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Verify Images?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users protecting themselves from AI-generated
            misinformation.
          </p>
          {isAuthenticated ? (
            <Link to="/analyze">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Start Analyzing Now
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                Sign Up Free
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">AI</span>
                </div>
                <span className="font-bold text-foreground">DeepDetect</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Detecting AI-generated images with precision.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#about" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#privacy" className="hover:text-primary transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DeepDetect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
