import CompanyIntel from "../models/CompanyIntel.js";
import { isDBConnected } from "../config/db.js";

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const uniq = (values = []) =>
  [...new Set(values.map((value) => String(value || "").trim()).filter(Boolean))];

const getEmails = (text) =>
  uniq(String(text).match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || []).map(
    (email) => email.toLowerCase(),
  );

const getDomains = (text, emails = []) => {
  const urlDomains = (String(text).match(/https?:\/\/(?:www\.)?([a-z0-9.-]+\.[a-z]{2,})/gi) || [])
    .map((url) => {
      try {
        return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
      } catch {
        return "";
      }
    });

  const bareDomains = String(text).match(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi) || [];
  const emailDomains = emails.map((email) => email.split("@")[1]);

  return uniq([...urlDomains, ...bareDomains, ...emailDomains])
    .map((domain) => domain.replace(/^www\./, "").toLowerCase())
    .filter((domain) => !["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"].includes(domain));
};

const getCompanyCandidates = (text) => {
  const candidates = [];
  const patterns = [
    /\b(?:company|employer|organization)\s*[:\-]\s*([A-Z][A-Za-z0-9&.,' -]{2,60})/gi,
    /\b(?:from|at|with)\s+([A-Z][A-Za-z0-9&.,' -]{2,60})\b/gi,
    /\b([A-Z][A-Za-z0-9&.' -]{2,50}(?:Pvt\.?\s*Ltd\.?|Private\s+Limited|LLC|Inc\.?|Ltd\.?|Technologies|FinTech|Solutions))\b/g,
  ];

  for (const pattern of patterns) {
    for (const match of String(text).matchAll(pattern)) {
      const candidate = match[1]
        .replace(/\s+/g, " ")
        .replace(/[.,:;]+$/, "")
        .trim();

      if (candidate.length >= 3) {
        candidates.push(candidate);
      }
    }
  }

  return uniq(candidates).slice(0, 5);
};

const getSignals = (text, extractedInfo = {}) => {
  const emails = getEmails(text);
  const domains = getDomains(text, emails);
  const companyCandidates = uniq([
    extractedInfo.company,
    ...getCompanyCandidates(text),
  ]);

  return {
    companyCandidates,
    normalizedCompanies: companyCandidates.map(normalizeText).filter(Boolean),
    emails,
    domains,
  };
};

const getCacheAgeDays = (cacheRecord) => {
  const lastSeen = cacheRecord?.lastSeenAt ? new Date(cacheRecord.lastSeenAt) : null;

  if (!lastSeen || Number.isNaN(lastSeen.getTime())) {
    return Infinity;
  }

  return (Date.now() - lastSeen.getTime()) / (1000 * 60 * 60 * 24);
};

export const isStrongFreshCacheMatch = (cacheRecord, text, extractedInfo = {}) => {
  if (!cacheRecord) {
    return false;
  }

  const maxAgeDays = Number(process.env.COMPANY_CACHE_MAX_AGE_DAYS || 60);
  if (getCacheAgeDays(cacheRecord) > maxAgeDays) {
    return false;
  }

  const signals = getSignals(text, extractedInfo);
  const normalizedCompany = normalizeText(cacheRecord.normalizedCompany || cacheRecord.companyName);
  const domainMatch = signals.domains.some((domain) => cacheRecord.domains?.includes(domain));
  const emailMatch = signals.emails.some((email) => cacheRecord.emails?.includes(email));
  const companyMatch =
    normalizedCompany &&
    signals.normalizedCompanies.some((company) => company === normalizedCompany);

  return domainMatch || emailMatch || companyMatch;
};

export const findCompanyIntel = async (text, extractedInfo = {}) => {
  try {
    if (!isDBConnected()) {
      return null;
    }

    const signals = getSignals(text, extractedInfo);
    const or = [];

    if (signals.normalizedCompanies.length) {
      or.push({ normalizedCompany: { $in: signals.normalizedCompanies } });
      or.push({ aliases: { $in: signals.normalizedCompanies } });
    }

    if (signals.domains.length) {
      or.push({ domains: { $in: signals.domains } });
    }

    if (signals.emails.length) {
      or.push({ emails: { $in: signals.emails } });
    }

    if (!or.length) {
      return null;
    }

    return CompanyIntel.findOne({ $or: or }).sort({ lastSeenAt: -1 }).lean();
  } catch (error) {
    console.warn("Company intelligence lookup failed:", error.message);
    return null;
  }
};

export const upsertCompanyIntel = async (text, analysis) => {
  try {
    if (!isDBConnected()) {
      return null;
    }

    const extractedInfo = analysis?.extractedInfo || {};
    const signals = getSignals(text, extractedInfo);
    const companyName = extractedInfo.company || signals.companyCandidates[0];
    const normalizedCompany = normalizeText(companyName);

    if (!normalizedCompany && !signals.domains.length && !signals.emails.length) {
      return null;
    }

    const filter = normalizedCompany
      ? { normalizedCompany }
      : { $or: [{ domains: { $in: signals.domains } }, { emails: { $in: signals.emails } }] };

    const now = new Date();
    const update = {
      $set: {
        companyName: companyName || signals.domains[0] || signals.emails[0],
        normalizedCompany: normalizedCompany || signals.domains[0] || signals.emails[0],
        lastRiskScore: analysis.riskScore,
        lastRiskLevel: analysis.riskLevel,
        lastConfidence: analysis.confidence,
        lastSummary: analysis.summary,
        lastRedFlags: analysis.redFlags || [],
        lastRecommendedActions: analysis.recommendedActions || [],
        lastExtractedInfo: extractedInfo,
        lastSeenAt: now,
      },
      $setOnInsert: {
        firstSeenAt: now,
      },
      $inc: {
        sourceCount: 1,
      },
      $addToSet: {
        aliases: { $each: signals.normalizedCompanies },
        domains: { $each: signals.domains },
        emails: { $each: signals.emails },
        contacts: { $each: uniq([extractedInfo.contact]) },
        roles: { $each: uniq([extractedInfo.role]) },
        locations: { $each: uniq([extractedInfo.location]) },
      },
    };

    return CompanyIntel.findOneAndUpdate(filter, update, {
      returnDocument: "after",
      upsert: true,
    }).lean();
  } catch (error) {
    console.warn("Company intelligence cache update failed:", error.message);
    return null;
  }
};

export const toCachedAnalysisPayload = (cacheRecord) => {
  if (!cacheRecord) {
    return null;
  }

  return {
    riskScore: cacheRecord.lastRiskScore,
    riskLevel: cacheRecord.lastRiskLevel,
    confidence: cacheRecord.lastConfidence,
    summary: `${cacheRecord.lastSummary || "Cached company intelligence found."} This result is based on prior scans because live AI analysis is temporarily unavailable.`,
    redFlags: cacheRecord.lastRedFlags || [],
    recommendedActions: [
      ...(cacheRecord.lastRecommendedActions || []),
      "Run a fresh analysis if this message contains new details or a different sender.",
    ],
    extractedInfo: cacheRecord.lastExtractedInfo || {},
    cache: {
      status: "cache-first",
      companyName: cacheRecord.companyName,
      sourceCount: cacheRecord.sourceCount,
      lastSeenAt: cacheRecord.lastSeenAt,
    },
  };
};

export const toCacheMeta = (cacheRecord, status = "hit") => {
  if (!cacheRecord) {
    return { status: "miss" };
  }

  return {
    status,
    companyName: cacheRecord.companyName,
    sourceCount: cacheRecord.sourceCount,
    lastRiskLevel: cacheRecord.lastRiskLevel,
    lastSeenAt: cacheRecord.lastSeenAt,
  };
};
