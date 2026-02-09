
import React from 'react';
import { PricingPlan } from './types';

export const PLANS: PricingPlan[] = [
  {
    id: 'plan-a',
    name: 'PLAN A',
    tagline: 'The Dashboard',
    price: 'NPR 10,000',
    focus: 'Software Only',
    features: {
      dataEntry: '❌ You manage it',
      processAudit: '❌ Not included',
      missedLeadAlerts: '⚠️ Automated Only',
      branchComparison: '❌ Not included',
      accountsReceivable: '❌ Not included',
      cashFlow: '❌ Not included'
    },
    idealClient: 'Small / DIY Owners'
  },
  {
    id: 'plan-b',
    name: 'PLAN B',
    tagline: 'Process Audit',
    price: 'NPR 15,000',
    focus: 'Staff Efficiency',
    features: {
      dataEntry: '✅ We verify daily',
      processAudit: '✅ Daily Checks',
      missedLeadAlerts: '✅ Human Verified',
      branchComparison: '❌ Not included',
      accountsReceivable: '❌ Not included',
      cashFlow: '❌ Not included'
    },
    idealClient: 'Growing Teams',
    highlight: true
  },
  {
    id: 'plan-c',
    name: 'PLAN C',
    tagline: 'Multi-Branch',
    price: 'NPR 20,000',
    focus: 'Branch Control',
    features: {
      dataEntry: '✅ We verify daily',
      processAudit: '✅ Daily Checks',
      missedLeadAlerts: '✅ Human Verified',
      branchComparison: '✅ Included',
      accountsReceivable: '❌ Not included',
      cashFlow: '❌ Not included'
    },
    idealClient: 'Scaling Agencies',
    highlight: true
  },
  {
    id: 'plan-d',
    name: 'Fractional CFO',
    tagline: 'The Controller',
    price: 'NPR 40,000',
    focus: 'Cash & AR',
    features: {
      dataEntry: '✅ We verify daily',
      processAudit: '✅ Daily Checks',
      missedLeadAlerts: '✅ Human Verified',
      branchComparison: '✅ Included',
      accountsReceivable: '✅ AR Aging Report',
      cashFlow: '✅ Monthly Analysis'
    },
    idealClient: 'Market Leaders',
    highlight: false
  }
];

// ... keeping old plans for reference if needed, but adding new ones below
export const PRICING_PLANS = [
  {
    name: "Starters",
    price: "NPR 10,000",
    period: "/month",
    description: "For agencies that just need visibility. I track the numbers, you check the staff.",
    features: [
      "Weekly CEO Report",
      "Automated Alerts Only",
      "❌ No Human Verification",
      "❌ No Daily Audit"
    ],
    popular: false,
    idealClient: "Small Teams"
  },
  {
    name: "Process Control",
    price: "NPR 15,000",
    period: "/month",
    description: "I don't just report the news, I fix it. I step in and correct behavior.",
    features: [
      "Everything in Starters",
      "Daily Staff Activity Audit",
      "Direct Staff Correction",
      "Enrollment Pipeline Cleaning"
    ],
    popular: true,
    idealClient: "Growing Agencies"
  },
  {
    name: "Multi-Branch",
    price: "NPR 25,000",
    period: "/month",
    description: "Consolidated control and reporting for agencies with multiple locations.",
    features: [
      "Everything in Process Control",
      "Branch-wise Reporting",
      "Regional Manager Training",
      "Consolidated Headquarters View"
    ],
    popular: false,
    idealClient: "Scaling Agencies"
  },
  {
    name: "Fractional CFO",
    price: "NPR 45,000",
    period: "/month",
    description: "Complete financial oversight. AR, Cash Flow, and Future Projection.",
    features: [
      "Everything in Multi-Branch",
      "Accounts Receivable Management",
      "University Invoice Filing",
      "Monthly Financial Strategy Call"
    ],
    popular: false,
    idealClient: "Market Leaders"
  }
];

export const NAV_LINKS = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Pricing', href: '#pricing' },
];

export const BOOKING_LINK = "https://calendly.com/shresthaconsolidated/30min";

export const openCalendly = (e: React.MouseEvent) => {
  e.preventDefault();
  if ((window as any).Calendly) {
    (window as any).Calendly.initPopupWidget({
      url: BOOKING_LINK
    });
  } else {
    window.open(BOOKING_LINK, '_blank');
  }
};
