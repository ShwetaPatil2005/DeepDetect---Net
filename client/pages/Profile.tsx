import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Download, User, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface AnalysisResult {
  _id: string;
  imageUrl: string;
  isAI: boolean;
  confidence: number;
  timestamp: string;
  metrics?: {
    pixelAnomalies?: string;
    textureConsistency?: string;
    lightingRealism?: string;
    edgeQuality?: string;
  };
}

interface UserType {
  username: string;
  email: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user info from backend
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user info");
      }
    };

    // Fetch analysis history from backend
 // Fetch analysis history from backend
const fetchHistory = async () => {
  try {
    const res = await fetch("http://localhost:8080/api/history", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch analysis history");
    const data = await res.json();

    // map backend docs to UI-friendly AnalysisResult shape
    const mapped: AnalysisResult[] = data.map((item: any) => ({
      _id: item._id,
      imageUrl: item.imageUrl || item.imageName || "",
      // use boolean if present else fallback to result string:
      isAI: typeof item.isAI === "boolean" ? item.isAI : item.result === "AI-Generated",
      confidence: typeof item.confidence === "number" ? item.confidence : 0,
      timestamp: item.timestamp ? new Date(item.timestamp).toISOString() : item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
      metrics: item.analysisDetails || {},
    }));

    setHistory(mapped);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch analysis history");
  }
};


    fetchUser();
    fetchHistory();
  }, [token, navigate]);

  const handleDelete = async (_id: String) => {
    try {
      const res = await fetch(`http://localhost:8080/api/history/${_id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete analysis");
      setHistory(history.filter((item) => item._id !== _id));
      toast.success("Analysis removed from history");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete analysis");
    }
  };

const handleDownload = async (result: AnalysisResult) => {
  if (!result || !result.imageUrl) return;

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

    // Header background
    pdf.setFillColor(245, 245, 250);
    pdf.rect(0, 0, pageWidth, 35, "F");

    // Logo/Title
    pdf.setTextColor(128, 0, 128);
    pdf.setFontSize(18);
    pdf.setFont(undefined, "bold");
    pdf.text("DeepDetect", leftColX, currentY + 8);

    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(9);
    pdf.text("AI-Generated Image Analysis Report", leftColX, currentY + 14);

    // Date (top right)
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8);
    pdf.text(
      new Date(result.timestamp).toLocaleString(),
      pageWidth - leftColX,
      currentY + 8,
      { align: "right" }
    );

    currentY = 40;

    // LEFT COLUMN - Image + Result
    const img = new Image();
    img.crossOrigin = "anonymous";
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
        const resultY = currentY + imgHeight + 5;
        if (result.isAI) pdf.setFillColor(220, 38, 38);
        else pdf.setFillColor(22, 163, 74);
        pdf.rect(leftColX, resultY, colWidth - 5, 12, "F");

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont(undefined, "bold");
        pdf.text(
          result.isAI ? "AI-GENERATED" : "REAL IMAGE",
          leftColX + colWidth / 2 - 2.5,
          resultY + 8,
          { align: "center" }
        );

        // RIGHT COLUMN - Confidence + Metrics
        let detailY = currentY;

        pdf.setTextColor(26, 26, 46);
        pdf.setFontSize(12);
        pdf.setFont(undefined, "bold");
        pdf.text("Confidence Score", rightColX, detailY);

        detailY += 8;
        pdf.setFontSize(28);
        pdf.setFont(undefined, "bold");
        if (result.isAI) pdf.setTextColor(220, 38, 38);
        else pdf.setTextColor(22, 163, 74);
        pdf.text(`${result.confidence}%`, rightColX, detailY + 6);

        detailY += 20;
        pdf.setTextColor(26, 26, 46);
        pdf.setFontSize(11);
        pdf.setFont(undefined, "bold");
        pdf.text("Analysis Metrics", rightColX, detailY);

        detailY += 8;

        const metricsData = [
          ["Pixel Anomalies", result.metrics?.pixelAnomalies || "N/A"],
          ["Texture Consistency", result.metrics?.textureConsistency || "N/A"],
          ["Lighting Realism", result.metrics?.lightingRealism || "N/A"],
          ["Edge Quality", result.metrics?.edgeQuality || "N/A"],
        ];

        metricsData.forEach((metric, index) => {
          if (index % 2 === 0) pdf.setFillColor(250, 250, 255);
          else pdf.setFillColor(245, 245, 250);
          pdf.rect(rightColX, detailY - 3, colWidth - 5, 7, "F");

          pdf.setTextColor(26, 26, 46);
          pdf.setFontSize(8.5);
          pdf.text(metric[0], rightColX + 1, detailY + 1);

          pdf.setFont(undefined, "bold");
          pdf.setTextColor(128, 0, 128);
          pdf.text(metric[1], rightColX + colWidth - 6, detailY + 1, {
            align: "right",
          });
          detailY += 7;
        });

        // Summary Box
        const bottomY = currentY + imgHeight + 30;
        pdf.setFillColor(245, 245, 250);
        pdf.rect(leftColX, bottomY, pageWidth - 30, 25, "F");

        pdf.setTextColor(26, 26, 46);
        pdf.setFontSize(10);
        pdf.setFont(undefined, "bold");
        pdf.text("Report Summary", leftColX + 2, bottomY + 5);

        pdf.setFontSize(8);
        pdf.setFont(undefined, "normal");
        pdf.setTextColor(80, 80, 80);

        const infoLines = [
          `Classification: ${result.isAI ? "AI-Generated Image" : "Real Image"}`,
          `Confidence: ${result.confidence}%`,
          `Analysis Method: Advanced AI Detection Algorithms`,
          `Generated: ${new Date().toLocaleString()}`,
        ];

        infoLines.forEach((line, i) =>
          pdf.text(line, leftColX + 2, bottomY + 10 + i * 4)
        );

        // Footer
        pdf.setDrawColor(200, 200, 200);
        pdf.line(leftColX, pageHeight - 8, pageWidth - leftColX, pageHeight - 8);
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(7);
        pdf.text(
          "DeepDetect AI Detection System",
          pageWidth / 2,
          pageHeight - 3,
          { align: "center" }
        );

        pdf.save(`DeepDetect-Report-${Date.now()}.pdf`);
        toast.dismiss();
        toast.success("PDF report downloaded successfully!");
      }
    };

    img.src = result.imageUrl;
  } catch (err) {
    toast.dismiss();
    toast.error("Failed to generate PDF");
    console.error(err);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-white to-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* User Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Your Profile
          </h1>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <User className="w-6 h-6 text-primary mt-2" />
              <div>
                <p className="text-muted-foreground text-sm mb-1">Name</p>
                <p className="text-2xl font-semibold text-foreground">
                  {user?.username || "User"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary mt-2" />
              <div>
                <p className="text-muted-foreground text-sm mb-1">Email</p>
                <p className="text-2xl font-semibold text-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border grid grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-bold text-primary">
                {history.length}
              </p>
              <p className="text-muted-foreground text-sm">Total Analyses</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">
                {history.filter((h) => !h.isAI).length}
              </p>
              <p className="text-muted-foreground text-sm">Real Images</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">
                {history.filter((h) => h.isAI).length}
              </p>
              <p className="text-muted-foreground text-sm">AI-Generated</p>
            </div>
          </div>
        </div>

        {/* Analysis History */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Analysis History
          </h2>

          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                <span>📋</span>
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">
                No analysis yet
              </p>
              <p className="text-muted-foreground mb-6">
                Start by analyzing your first image
              </p>
              <a href="/analyze">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Analyze Image
                </Button>
              </a>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((result) => (
                <div
                  key={result._id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary transition-colors"
                >
                  <div className="flex-1 mb-4 sm:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          result.isAI
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {result.isAI ? "⚠️ AI-Generated" : "✅ Real"}
                      </span>
                      <span className="text-foreground font-semibold">
                        {result.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(result.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(result)}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Report</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(result._id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
