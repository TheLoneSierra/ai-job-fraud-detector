import mongoose from "mongoose";

const companyIntelSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      trim: true,
      required: true,
    },
    normalizedCompany: {
      type: String,
      trim: true,
      index: true,
    },
    aliases: {
      type: [String],
      default: [],
    },
    domains: {
      type: [String],
      default: [],
      index: true,
    },
    emails: {
      type: [String],
      default: [],
    },
    contacts: {
      type: [String],
      default: [],
    },
    roles: {
      type: [String],
      default: [],
    },
    locations: {
      type: [String],
      default: [],
    },
    sourceCount: {
      type: Number,
      default: 0,
    },
    lastRiskScore: Number,
    lastRiskLevel: String,
    lastConfidence: String,
    lastSummary: String,
    lastRedFlags: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    lastRecommendedActions: {
      type: [String],
      default: [],
    },
    lastExtractedInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    firstSeenAt: Date,
    lastSeenAt: Date,
  },
  { timestamps: true },
);

companyIntelSchema.index({ normalizedCompany: 1, domains: 1 });

const CompanyIntel =
  mongoose.models.CompanyIntel ||
  mongoose.model("CompanyIntel", companyIntelSchema);

export default CompanyIntel;
