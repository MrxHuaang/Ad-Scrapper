export interface AD {
  Source: string;
  AD_Number: string;
  Subject: string;
  Make: string;
  Model: string;
  Effective_Date: string;
  Status: string;
  Product_Type: string;
  Docket: string;
  PDF_Link: string;
}

export const SOURCE_KEYS = [
  "federal_register",
  "easa",
  "transport_canada",
  "anac_brazil",
  "dgac_chile",
  "anac_argentina",
  "all",
] as const;

export type SourceKey = (typeof SOURCE_KEYS)[number];

export const SOURCE_LABELS: Record<SourceKey, string> = {
  federal_register: "Federal Register",
  easa: "EASA",
  transport_canada: "Transport Canada",
  anac_brazil: "ANAC Brazil",
  dgac_chile: "DGAC Chile",
  anac_argentina: "ANAC Argentina",
  all: "All Sources",
};

export interface SearchParams {
  source: SourceKey;
  keyword: string;
  make: string;
  model: string;
  product_type: string;
  date_from: string;
  date_to: string;
  max_results: number;
}

export type SearchStatus = "idle" | "searching" | "done" | "error";
