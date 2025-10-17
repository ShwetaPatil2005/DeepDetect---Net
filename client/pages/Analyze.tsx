import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link, Loader, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

export default function Analyze() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("authToken") !== null;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    isAI: boolean;
    confidence: number;
  } | null>(null);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
        analyzeImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlAnalysis = () => {
    if (!urlInput) {
      toast.error("Please enter an image URL");
      return;
    }

    setImageUrl(urlInput);
    analyzeImage(urlInput);
  };

  const analyzeImage = async (url: string) => {
    setIsLoading(true);
    try {
      // Mock analysis - in production, this would call a real API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const isAI = Math.random() > 0.5;
      const confidence = Math.floor(Math.random() * 30 + 70);

      setResult({ isAI, confidence });

      // Save to history
      const history = JSON.parse(localStorage.getItem("analysisHistory") || "[]");
      history.unshift({
        id: Date.now(),
        imageUrl: url.startsWith("http") ? url : "uploaded-image",
        isAI,
        confidence,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("analysisHistory", JSON.stringify(history.slice(0, 50)));

      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResult = () => {
    if (!result || !imageUrl) return;

    toast.success("Result downloaded!");
    // In production, this would generate a PDF or image with overlay
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Analyze Image
            </h1>
            <p className="text-muted-foreground mb-8">
              Upload or paste an image URL to detect if it's AI-generated
            </p>

            <div className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-input"
                  disabled={isLoading}
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="font-semibold text-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </label>
              </div>

              {/* URL Input */}
              <div className="space-y-3">
                <Label htmlFor="url" className="text-foreground">
                  Or paste image URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={isLoading}
                    className="border-border focus:ring-primary"
                  />
                  <Button
                    onClick={handleUrlAnalysis}
                    disabled={isLoading || !urlInput}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <Link className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Analysis Info */}
              <div className="bg-secondary/50 rounded-xl p-6 space-y-3">
                <h3 className="font-semibold text-foreground">
                  How it works:
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">1</span>
                    <span>Upload or link an image</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">2</span>
                    <span>Our AI analyzes pixel patterns</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">3</span>
                    <span>Get instant results with confidence</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="animate-fade-in">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <Loader className="w-12 h-12 text-primary animate-spin" />
                <p className="text-lg font-semibold text-foreground">
                  Analyzing image...
                </p>
                <p className="text-muted-foreground">
                  This takes about 2 seconds
                </p>
              </div>
            )}

            {imageUrl && !isLoading && (
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                </div>

                {result && (
                  <div className="space-y-4 animate-slide-up">
                    <div
                      className={`rounded-2xl p-6 border-2 ${
                        result.isAI
                          ? "border-red-200 bg-red-50"
                          : "border-green-200 bg-green-50"
                      }`}
                    >
                      <h3 className="text-2xl font-bold mb-2">
                        {result.isAI ? "⚠️ AI-Generated" : "✅ Real Image"}
                      </h3>
                      <p
                        className={`text-lg font-semibold ${
                          result.isAI
                            ? "text-red-700"
                            : "text-green-700"
                        }`}
                      >
                        Confidence: {result.confidence}%
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-3">
                          Analysis Details
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-foreground">Detection</span>
                            <span className="font-semibold">
                              {result.isAI ? "AI" : "Real"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground">Confidence</span>
                            <span className="font-semibold">
                              {result.confidence}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground">Time</span>
                            <span className="font-semibold">
                              {new Date().toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={downloadResult}
                      className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download Result
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!imageUrl && !isLoading && (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="text-6xl mb-4">📸</div>
                <p className="text-lg font-semibold text-foreground">
                  No image selected
                </p>
                <p className="text-muted-foreground">
                  Upload or paste an image URL to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* History Link */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            <a href="/profile" className="text-primary hover:text-primary/80 font-semibold">
              View your analysis history
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
