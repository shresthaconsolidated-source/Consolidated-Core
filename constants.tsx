
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

export const NAV_LINKS = [
  { name: 'Home', href: '#' },
  { name: 'About', href: '#about' },
  { name: 'Pricing', href: '#pricing' },
];

export const BOOKING_LINK = "https://calendly.com/shresthaconsolidated/30min";
