
export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  focus: string;
  features: {
    dataEntry: string;
    processAudit: string;
    missedLeadAlerts: string;
    branchComparison: string;
    accountsReceivable: string;
    cashFlow: string;
  };
  idealClient: string;
  highlight?: boolean;
}

export interface GapAnalysisResult {
  summary: string;
  identifiedGaps: string[];
  recommendedPlan: string;
  roiEstimate: string;
}
