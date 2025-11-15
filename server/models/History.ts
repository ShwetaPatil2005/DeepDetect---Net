import mongoose, { Schema, Document } from "mongoose";

export interface IHistory extends Document {
  userId: string;
  imageName: string;
  imageUrl?: string;
  result: string;
  isAI?: boolean;
  confidence?: number;
  analysisDetails?: {
    pixelAnomalies?: string;
    textureConsistency?: string;
    lightingRealism?: string;
    edgeQuality?: string;
  };
  timestamp?: Date;
  date: Date;
}

const HistorySchema: Schema<IHistory> = new Schema({
  userId: { type: String, required: true },
  imageName: { type: String, required: true },
  imageUrl: { type: String },
  result: { type: String, required: true },
  isAI: { type: Boolean, default: false },
  confidence: { type: Number, default: 0 },
  analysisDetails: {
    pixelAnomalies: { type: String },
    textureConsistency: { type: String },
    lightingRealism: { type: String },
    edgeQuality: { type: String },
  },
  timestamp: { type: Date, default: Date.now },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<IHistory>("History", HistorySchema);
