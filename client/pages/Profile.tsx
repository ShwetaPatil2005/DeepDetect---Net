import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trash2, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

interface AnalysisResult {
  id: number;
  imageUrl: string;
  isAI: boolean;
  confidence: number;
  timestamp: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const isAuthenticated = localStorage.getItem("authToken") !== null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUser(JSON.parse(userStr));
    }

    const historyStr = localStorage.getItem("analysisHistory");
    if (historyStr) {
      setHistory(JSON.parse(historyStr));
    }
  }, [isAuthenticated, navigate]);

  const handleDelete = (id: number) => {
    setHistory(history.filter((item) => item.id !== id));
    localStorage.setItem("analysisHistory", JSON.stringify(history.filter((item) => item.id !== id)));
    toast.success("Analysis removed from history");
  };

  const handleDownload = (result: AnalysisResult) => {
    toast.success(`Downloaded report for ${result.imageUrl}`);
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
            <div>
              <p className="text-muted-foreground text-sm mb-1">Name</p>
              <p className="text-2xl font-semibold text-foreground">
                {user?.name || "User"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm mb-1">Email</p>
              <p className="text-2xl font-semibold text-foreground">
                {user?.email}
              </p>
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
              <div className="text-5xl mb-4">📋</div>
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
                  key={result.id}
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
                      onClick={() => handleDelete(result.id)}
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
