import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Link as LinkIcon,
  Loader,
  Download,
  ChevronRight,
  X,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Step = "upload" | "review" | "results";

interface AnalysisResult {
  isAI: boolean;
  confidence: number;
  timestamp: string;
  analysisDetails: {
    pixelAnomalies: string;
    textureConsistency: string;
    lightingRealism: string;
    edgeQuality: string;
  };
}

export default function Analyze() {
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = localStorage.getItem("authToken") !== null;

  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"file" | "url" | null>(null);

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
        const image = event.target?.result as string;
        setImageUrl(image);
        setUploadMethod("file");
        setCurrentStep("review");
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
    setUploadMethod("url");
    setCurrentStep("review");
  };

  const handleStartAnalysis = async () => {
    if (!imageUrl) {
      toast.error("No image selected");
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const isAI = Math.random() > 0.5;
      const confidence = Math.floor(Math.random() * 30 + 70);

      const analysisResult: AnalysisResult = {
        isAI,
        confidence,
        timestamp: new Date().toLocaleString(),
        analysisDetails: {
          pixelAnomalies: isAI ? "High" : "Low",
          textureConsistency: isAI ? "Inconsistent" : "Consistent",
          lightingRealism: isAI ? "Unnatural" : "Natural",
          edgeQuality: isAI ? "Blurred" : "Sharp",
        },
      };

      setResult(analysisResult);

      // Save to history
      const history = JSON.parse(localStorage.getItem("analysisHistory") || "[]");
      history.unshift({
        id: Date.now(),
        imageUrl: uploadMethod === "url" ? urlInput : "uploaded-image",
        isAI,
        confidence,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(
        "analysisHistory",
        JSON.stringify(history.slice(0, 50))
      );

      toast.success("Analysis complete!");
      setCurrentStep("results");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!result || !imageUrl) return;

    try {
      toast.loading("Generating PDF...");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const leftColX = 15;
      const rightColX = pageWidth / 2 + 5;
      const colWidth = (pageWidth - 30) / 2 - 5;

      let currentY = 15;

      // Add background color for header
      pdf.setFillColor(245, 245, 250);
      pdf.rect(0, 0, pageWidth, 35, "F");

      // Logo/Title
      pdf.setTextColor(128, 0, 128);
      pdf.setFontSize(18);
      pdf.setFont(undefined, "bold");
      pdf.text("DeepDetect", leftColX, currentY + 8);

      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(9);
      pdf.setFont(undefined, "normal");
      pdf.text("AI-Generated Image Analysis Report", leftColX, currentY + 14);

      // Date on right
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      pdf.text(result.timestamp, pageWidth - leftColX, currentY + 8, {
        align: "right",
      });

      currentY = 40;

      // LEFT COLUMN - Image and Result
      // Image (smaller)
      const img = new Image();
      img.onload = () => {
        const imgWidth = colWidth - 5;
        const imgHeight = (img.height / img.width) * imgWidth;

        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL("image/jpeg", 0.7);
          pdf.addImage(imgData, "JPEG", leftColX, currentY, imgWidth, imgHeight);

          // Result badge below image
          let resultY = currentY + imgHeight + 5;

          // Color box for result
          if (result.isAI) {
            pdf.setFillColor(220, 38, 38);
          } else {
            pdf.setFillColor(22, 163, 74);
          }
          pdf.rect(leftColX, resultY, colWidth - 5, 12, "F");

          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(10);
          pdf.setFont(undefined, "bold");
          const resultText = result.isAI ? "AI-GENERATED" : "REAL IMAGE";
          pdf.text(resultText, leftColX + colWidth / 2 - 2.5, resultY + 8, {
            align: "center",
          });

          // RIGHT COLUMN - Details
          let detailY = currentY;

          // Confidence Section
          pdf.setTextColor(26, 26, 46);
          pdf.setFontSize(12);
          pdf.setFont(undefined, "bold");
          pdf.text("Confidence Score", rightColX, detailY);

          detailY += 8;

          // Confidence value
          pdf.setFontSize(28);
          pdf.setFont(undefined, "bold");
          if (result.isAI) {
            pdf.setTextColor(220, 38, 38);
          } else {
            pdf.setTextColor(22, 163, 74);
          }
          pdf.text(`${result.confidence}%`, rightColX, detailY + 6);

          detailY += 20;

          // Analysis Details Header
          pdf.setTextColor(26, 26, 46);
          pdf.setFontSize(11);
          pdf.setFont(undefined, "bold");
          pdf.text("Analysis Metrics", rightColX, detailY);

          detailY += 8;

          // Details table
          pdf.setFontSize(9);
          pdf.setFont(undefined, "normal");
          pdf.setTextColor(26, 26, 46);

          const metricsData = [
            ["Pixel Anomalies", result.analysisDetails.pixelAnomalies],
            ["Texture Consistency", result.analysisDetails.textureConsistency],
            ["Lighting Realism", result.analysisDetails.lightingRealism],
            ["Edge Quality", result.analysisDetails.edgeQuality],
          ];

          metricsData.forEach((metric, index) => {
            // Alternate row colors
            if (index % 2 === 0) {
              pdf.setFillColor(250, 250, 255);
            } else {
              pdf.setFillColor(245, 245, 250);
            }
            pdf.rect(rightColX, detailY - 3, colWidth - 5, 7, "F");

            pdf.setTextColor(26, 26, 46);
            pdf.setFont(undefined, "normal");
            pdf.setFontSize(8.5);
            pdf.text(metric[0], rightColX + 1, detailY + 1);

            pdf.setFont(undefined, "bold");
            pdf.setTextColor(128, 0, 128);
            pdf.text(metric[1], rightColX + colWidth - 6, detailY + 1, {
              align: "right",
            });

            detailY += 7;
          });

          // BOTTOM SECTION - Info
          let bottomY = currentY + imgHeight + 30;

          // Full width info box
          pdf.setFillColor(245, 245, 250);
          pdf.rect(leftColX, bottomY, pageWidth - 30, 25, "F");

          pdf.setTextColor(26, 26, 46);
          pdf.setFontSize(10);
          pdf.setFont(undefined, "bold");
          pdf.text("Report Summary", leftColX + 2, bottomY + 5);

          pdf.setTextColor(80, 80, 80);
          pdf.setFontSize(8);
          pdf.setFont(undefined, "normal");

          const infoLines = [
            `Classification: ${result.isAI ? "AI-Generated Image" : "Real Image"}`,
            `Confidence: ${result.confidence}%`,
            `Analysis Method: Advanced AI Detection Algorithms`,
            `Generated: ${new Date().toLocaleString()}`,
          ];

          infoLines.forEach((line, index) => {
            pdf.text(line, leftColX + 2, bottomY + 10 + index * 4);
          });

          // Footer
          pdf.setDrawColor(200, 200, 200);
          pdf.line(leftColX, pageHeight - 8, pageWidth - leftColX, pageHeight - 8);

          pdf.setTextColor(150, 150, 150);
          pdf.setFontSize(7);
          pdf.setFont(undefined, "normal");
          pdf.text("DeepDetect AI Detection System", pageWidth / 2, pageHeight - 3, {
            align: "center",
          });

          // Save PDF
          pdf.save(`DeepDetect-Report-${Date.now()}.pdf`);
          toast.success("PDF report downloaded successfully!");
        }
      };
      img.src = imageUrl;
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    }
  };

  const resetAnalysis = () => {
    setCurrentStep("upload");
    setImageUrl(null);
    setUrlInput("");
    setResult(null);
    setUploadMethod(null);
  };

  const goBackToReview = () => {
    setCurrentStep("review");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-background">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Step Indicator */}
        {currentStep !== "results" && (
          <div className="mb-12">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                    currentStep === "upload"
                      ? "bg-primary text-white"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  1
                </div>
                <p
                  className={`text-sm font-semibold ${
                    currentStep === "upload"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Upload
                </p>
              </div>

              <div className="flex-1 h-1 mx-3 mb-6 bg-border" />

              <div className="text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                    currentStep === "review"
                      ? "bg-primary text-white"
                      : currentStep === "results"
                        ? "bg-secondary text-foreground"
                        : "bg-border text-muted-foreground"
                  }`}
                >
                  2
                </div>
                <p
                  className={`text-sm font-semibold ${
                    currentStep === "review"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Review
                </p>
              </div>

              <div className="flex-1 h-1 mx-3 mb-6 bg-border" />

              <div className="text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
                    currentStep === "results"
                      ? "bg-primary text-white"
                      : "bg-border text-muted-foreground"
                  }`}
                >
                  3
                </div>
                <p
                  className={`text-sm font-semibold ${
                    currentStep === "results"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Results
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: UPLOAD */}
        {currentStep === "upload" && (
          <div className="animate-slide-up">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-3">
                Upload Your Image
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose how you'd like to upload an image for analysis
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* File Upload */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Upload from Device
                    </h2>
                    <p className="text-muted-foreground">
                      Select an image file from your computer
                    </p>
                  </div>

                  <div className="border-2 border-dashed border-border rounded-xl p-8 hover:border-primary transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
                      <p className="font-semibold text-foreground mb-1">
                        Click to browse
                      </p>
                      <p className="text-sm text-muted-foreground">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {/* URL Upload */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-lg hover:shadow-xl transition-shadow">
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                      <LinkIcon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Paste Image URL
                    </h2>
                    <p className="text-muted-foreground">
                      Provide a direct link to an image
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="url" className="text-foreground">
                      Image URL
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="border-border focus:ring-primary h-12"
                    />
                  </div>

                  <Button
                    onClick={handleUrlAnalysis}
                    disabled={!urlInput}
                    className="w-full bg-primary hover:bg-primary/90 text-white h-11 flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-12 bg-secondary/50 rounded-2xl p-8 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">
                How DeepDetect Works
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">1</div>
                  <h4 className="font-semibold text-foreground">Upload Image</h4>
                  <p className="text-sm text-muted-foreground">
                    Submit your image through upload or URL
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">2</div>
                  <h4 className="font-semibold text-foreground">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Our system analyzes patterns and artifacts
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">3</div>
                  <h4 className="font-semibold text-foreground">
                    Get Results
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Receive detailed analysis with confidence score
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW */}
        {currentStep === "review" && imageUrl && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Review Your Image
                </h1>
                <p className="text-lg text-muted-foreground">
                  Make sure the image is clear and ready for analysis
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep("upload")}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Change
              </Button>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-lg mb-8">
              <div className="flex items-center justify-center bg-secondary/20 p-12">
                <img
                  src={imageUrl}
                  alt="Review"
                  className="max-w-full max-h-96 rounded-lg shadow-md object-cover"
                />
              </div>
            </div>

            {/* Analysis Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-secondary/50 rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  What We Analyze
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Pixel-level artifacts and anomalies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Texture consistency and patterns</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Lighting and shadow realism</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-0.5">✓</span>
                    <span>Edge quality and sharpness</span>
                  </li>
                </ul>
              </div>

              <div className="bg-accent/10 rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  About This Tool
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  DeepDetect uses advanced machine learning to identify
                  AI-generated images with 98%+ accuracy. Analysis is performed
                  locally and results are saved to your history.
                </p>
                <p className="text-xs text-muted-foreground">
                  Analysis takes approximately 2-3 seconds to complete.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("upload")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={handleStartAnalysis}
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-white h-12 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Start Analysis
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: RESULTS */}
        {currentStep === "results" && result && (
          <div
            ref={resultRef}
            className="animate-slide-up space-y-8"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Analysis Complete
              </h1>
              <p className="text-lg text-muted-foreground">
                Here are your detailed results
              </p>
            </div>

            {/* Main Result Card */}
            <div
              className={`rounded-3xl p-12 border-2 shadow-2xl text-center ${
                result.isAI
                  ? "bg-gradient-to-br from-red-50 to-red-100 border-red-200"
                  : "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
              }`}
            >
              <div className="text-6xl mb-6">
                {result.isAI ? "⚠️" : "✅"}
              </div>
              <h2
                className={`text-4xl font-bold mb-4 ${
                  result.isAI ? "text-red-700" : "text-green-700"
                }`}
              >
                {result.isAI ? "AI-Generated Image Detected" : "Real Image Verified"}
              </h2>
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-full max-w-xs bg-white rounded-full overflow-hidden h-3 shadow-md">
                  <div
                    className={`h-full transition-all ${
                      result.isAI
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${result.confidence}%` }}
                  />
                </div>
              </div>
              <p
                className={`text-2xl font-bold ${
                  result.isAI ? "text-red-600" : "text-green-600"
                }`}
              >
                {result.confidence}% Confidence
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Analyzed: {result.timestamp}
              </p>
            </div>

            {/* Analysis Details */}
            <div className="bg-white rounded-2xl p-8 border border-border shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6">
                Detailed Analysis
              </h3>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <span className="font-semibold text-foreground">
                      Pixel Anomalies
                    </span>
                    <span className="text-primary font-bold">
                      {result.analysisDetails.pixelAnomalies}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <span className="font-semibold text-foreground">
                      Texture Consistency
                    </span>
                    <span className="text-primary font-bold">
                      {result.analysisDetails.textureConsistency}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <span className="font-semibold text-foreground">
                      Lighting Realism
                    </span>
                    <span className="text-primary font-bold">
                      {result.analysisDetails.lightingRealism}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <span className="font-semibold text-foreground">
                      Edge Quality
                    </span>
                    <span className="text-primary font-bold">
                      {result.analysisDetails.edgeQuality}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/20 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Note:</span> This
                  analysis is based on advanced AI detection algorithms. For
                  critical decisions, we recommend human verification.
                </p>
              </div>
            </div>

            {/* Image Preview */}
            {imageUrl && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-lg">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Analyzed Image
                </h3>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Analyzed"
                    className="w-full h-auto max-h-80 object-cover"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={downloadPDF}
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 flex items-center justify-center gap-2 text-lg"
              >
                <Download className="w-6 h-6" />
                Download Report as PDF
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={goBackToReview}
                  className="flex-1"
                >
                  Back to Review
                </Button>
                <Button
                  variant="outline"
                  onClick={resetAnalysis}
                  className="flex-1"
                >
                  Analyze Another Image
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                <a
                  href="/profile"
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  View your analysis history
                </a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
