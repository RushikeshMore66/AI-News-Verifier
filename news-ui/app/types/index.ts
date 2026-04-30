export type Verdict = "TRUE" | "FALSE" | "MISLEADING" | "UNVERIFIED";

export interface SourceItem {
  source: string;
  url: string;
  snippet: string;
  published: string;
}

export interface VerificationResult {
  verdict: Verdict;
  confidence: number;
  summary: string;
  analysis: string;
  supporting: SourceItem[];
  contradicting: SourceItem[];
}

export interface StreamState {
  status: "idle" | "streaming" | "parsing" | "done" | "error";
  rawAccumulated: string;
  result: VerificationResult | null;
  claim: string;
  errorMessage: string | null;
}

export type StreamAction =
  | { type: "START"; claim: string }
  | { type: "TOKEN"; content: string }
  | { type: "DONE"; result: VerificationResult }
  | { type: "ERROR"; message: string }
  | { type: "RESET" };
