import type { LucideIcon } from 'lucide-react'
import {
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardList,
  Headphones,
  MessageSquareText,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Users,
} from 'lucide-react'

export type SolutionCategory =
  | 'All Solutions'
  | 'Procurement'
  | 'Human Resources'
  | 'Finance'
  | 'Customer Support'
  | 'Sales Operations'

export interface SolutionWorkflowStep {
  title: string
  description: string
}

export interface SolutionCapability {
  name: string
  description: string
  problem: string
  icon: LucideIcon
}

export interface SolutionDefinition {
  id: string
  slug: string
  title: string
  category: Exclude<SolutionCategory, 'All Solutions'>
  description: string
  shortDescription: string
  capabilities: string[]
  icon: LucideIcon
  accent: 'green' | 'blue' | 'purple' | 'orange'
  featured: boolean
  active?: boolean
  recentlyUsed?: boolean
  businessProblems: string[]
  workflow: SolutionWorkflowStep[]
  requirements: string[]
  useCases: string[]
  researchCapabilities: {
    name: string
    description: string
    icon: LucideIcon
  }[]
  primaryActionLabel: string
}

export const SOLUTION_CATALOG: SolutionDefinition[] = [
  {
    id: 'procureiq',
    slug: 'procureiq',
    title: 'ProcureIQ',
    category: 'Procurement',
    description:
      'Vendor discovery, supplier comparison, RFQs, quotations, and procurement workflows grounded in research evidence and customer-review policy.',
    shortDescription:
      'Vendor discovery, supplier comparison, RFQs, quotations and procurement workflows.',
    capabilities: [
      'Purchase request management',
      'Vendor discovery',
      'Product comparison',
      'Price and warranty analysis',
      'Delivery estimation',
      'Vendor scoring',
      'RFQ generation',
      'Procurement tracking',
    ],
    icon: ShoppingCart,
    accent: 'green',
    featured: true,
    active: true,
    businessProblems: [
      'Time-consuming supplier discovery',
      'Manual vendor comparison',
      'Difficult quotation management',
      'Limited procurement visibility',
      'Inefficient follow-ups',
    ],
    workflow: [
      { title: 'Capture request', description: 'Customer submits quantity, timing, and specification requirements.' },
      { title: 'Define scope', description: 'Expert identifies constraints, evaluation criteria, and success factors.' },
      { title: 'Research', description: 'ProcureIQ creates a research plan and evaluates supplier options.' },
      { title: 'Compare', description: 'AI summarizes options, pricing, warranties, and delivery trade-offs.' },
      { title: 'Review and approve', description: 'Human expert reviews the final recommendation before any action.' },
    ],
    requirements: [
      'Purchase requirements and product specs',
      'Budget range or constraints',
      'Delivery timeline and service expectations',
      'Warranty and compliance requirements',
      'Primary stakeholders and approval flow',
    ],
    useCases: [
      'Identify qualified suppliers for a new office technology rollout',
      'Compare competing vendors for an infrastructure refresh',
      'Prepare a cleaner RFQ package with weighted scoring and assumptions',
    ],
    researchCapabilities: [
      { name: 'Research', description: 'Build a focused research plan across the vendor landscape.', icon: Search },
      { name: 'Compare', description: 'Assess supplier fit, warranty, pricing, and delivery trade-offs.', icon: ChartNoAxesCombined },
      { name: 'Validate', description: 'Cross-check supplier claims against sources and dependencies.', icon: ShieldCheck },
      { name: 'Score', description: 'Create weighted recommendations for a business-ready shortlist.', icon: Sparkles },
    ],
    primaryActionLabel: 'Start procurement engagement',
  },
  {
    id: 'hr',
    slug: 'hr',
    title: 'HR Solutions',
    category: 'Human Resources',
    description:
      'Improve recruitment and workforce workflows using AI-powered intelligence and structured assessment of hiring decisions.',
    shortDescription:
      'Recruitment process analysis, hiring optimization, and workforce planning support.',
    capabilities: [
      'Recruitment process analysis',
      'Candidate screening workflows',
      'Hiring process optimization',
      'Recruitment tool research',
      'Onboarding workflow improvement',
      'HR technology recommendations',
    ],
    icon: Users,
    accent: 'blue',
    featured: false,
    active: false,
    recentlyUsed: true,
    businessProblems: [
      'Slow or inconsistent hiring decisions',
      'Fragmented recruitment workflows',
      'Difficulty comparing HR tooling',
      'Weak onboarding and process governance',
      'Limited visibility into workforce bottlenecks',
    ],
    workflow: [
      { title: 'Map needs', description: 'Capture hiring goals, role scope, and team constraints.' },
      { title: 'Assess process', description: 'Analyze the current recruiting and onboarding experience.' },
      { title: 'Research tools', description: 'Research reviews hiring platforms, ATS options, and workflow patterns.' },
      { title: 'Compare options', description: 'Evaluate vendor fit against cost, integration, and staffing demands.' },
      { title: 'Recommend', description: 'Draft a decision-ready plan for expert and stakeholder approval.' },
    ],
    requirements: [
      'Role profile and hiring goals',
      'Current recruitment bottlenecks',
      'Team or candidate volume assumptions',
      'Budget constraints and timeline',
      'Department stakeholders and decision owners',
    ],
    useCases: [
      'Assess a hiring funnel for high-volume recruiting needs',
      'Compare talent acquisition tools across ATS and workflow platforms',
      'Improve onboarding and role readiness across a growing team',
    ],
    researchCapabilities: [
      { name: 'Discover', description: 'Find candidate workflows, platform options, and market patterns.', icon: Search },
      { name: 'Deep Dive', description: 'Investigate workflow pain points, vendor claims, and adoption trade-offs.', icon: ClipboardList },
      { name: 'Synthesize', description: 'Turn research into decision-ready recommendations and stakeholder context.', icon: MessageSquareText },
      { name: 'Score', description: 'Rank alternatives against hiring, cost, and implementation criteria.', icon: Sparkles },
    ],
    primaryActionLabel: 'Start HR workflow',
  },
  {
    id: 'finance',
    slug: 'finance',
    title: 'Finance Solutions',
    category: 'Finance',
    description:
      'Improve financial operations through intelligent automation, spend analysis, and operational decision support that is aligned to expert review.',
    shortDescription:
      'Financial workflow research, reconciliation support, and automation planning.',
    capabilities: [
      'Invoice processing analysis',
      'Financial workflow research',
      'Reconciliation process improvement',
      'Financial software comparison',
      'Automation recommendations',
      'Implementation planning',
    ],
    icon: CircleDollarSign,
    accent: 'purple',
    featured: true,
    active: false,
    recentlyUsed: false,
    businessProblems: [
      'Manual reconciliation and invoice handling',
      'Fragmented financial operations workflows',
      'Unclear automation opportunities',
      'Weak comparison of financial software options',
      'Difficulty turning cost drivers into a clear plan',
    ],
    workflow: [
      { title: 'Define workflow', description: 'Document the finance challenge, constraints, and required outcomes.' },
      { title: 'Collect signals', description: 'Assess current process, tooling, and bottlenecks in the operating model.' },
      { title: 'Research alternatives', description: 'Research evaluates financial software and process patterns.' },
      { title: 'Model scenarios', description: 'Compare costs, compliance, and implementation effort.' },
      { title: 'Approve plan', description: 'Expert and stakeholders review the final operations recommendation.' },
    ],
    requirements: [
      'Current financial workflow details',
      'Pain points and bottlenecks',
      'Budget or approval guardrails',
      'Software or process constraints',
      'Expected implementation timeline',
    ],
    useCases: [
      'Assess invoice processing and approval bottlenecks',
      'Compare financial operations tools for a multi-entity environment',
      'Prepare a business case for automation and governance changes',
    ],
    researchCapabilities: [
      { name: 'Discover', description: 'Survey finance tools, models, and operational patterns relevant to the problem.', icon: Search },
      { name: 'Compare', description: 'Assess trade-offs across cost, implementation speed, and governance.', icon: ChartNoAxesCombined },
      { name: 'Validate', description: 'Check assumptions against market evidence and common operating patterns.', icon: ShieldCheck },
      { name: 'Synthesize', description: 'Draft a balanced recommendation for stakeholders and reviewers.', icon: MessageSquareText },
    ],
    primaryActionLabel: 'Start finance review',
  },
  {
    id: 'support',
    slug: 'support',
    title: 'Support Solutions',
    category: 'Customer Support',
    description:
      'Improve customer support operations through intelligent ticket management, escalation design, and workflow automation grounded in review and evidence.',
    shortDescription:
      'Support process analysis, operational optimization, and escalation design.',
    capabilities: [
      'Support process analysis',
      'Ticket workflow optimization',
      'Issue investigation',
      'Support tool comparison',
      'Escalation workflow design',
      'AI-powered support recommendations',
    ],
    icon: Headphones,
    accent: 'orange',
    featured: false,
    active: true,
    businessProblems: [
      'Slow or inconsistent ticket handling',
      'Unclear support workflow ownership',
      'Difficulty comparing support tooling',
      'Escalation gaps and slow issue recovery',
      'Limited visibility into support process quality',
    ],
    workflow: [
      { title: 'Capture service model', description: 'Document current support volume, team coverage, and common issues.' },
      { title: 'Identify gaps', description: 'Analyze escalation paths, bottlenecks, and operational pain points.' },
      { title: 'Research options', description: 'Research explores support tooling and service operating models.' },
      { title: 'Compare fit', description: 'Review support tools, staffing patterns, and workflow impacts.' },
      { title: 'Recommend', description: 'Prepare a clear plan with risk, scaling, and approval considerations.' },
    ],
    requirements: [
      'Current support scope and maturity model',
      'Case volume and channel mix',
      'Escalation and ownership details',
      'Team structure and staffing constraints',
      'Customer experience and SLA expectations',
    ],
    useCases: [
      'Assess the current support operating model before a tooling refresh',
      'Design a more efficient escalation workflow for priority cases',
      'Compare AI support tools and service approaches for a regional rollout',
    ],
    researchCapabilities: [
      { name: 'Research', description: 'Map support patterns, tools, and service models relevant to the customer challenge.', icon: Search },
      { name: 'Deep Dive', description: 'Investigate workflow, escalation, and staffing gaps in the current process.', icon: BriefcaseBusiness },
      { name: 'Compare', description: 'Contrast platform options and process alternatives against the operating model.', icon: ChartNoAxesCombined },
      { name: 'Validate', description: 'Check assumptions and evidence before moving to final recommendations.', icon: ShieldCheck },
    ],
    primaryActionLabel: 'Launch support scenario',
  },
]

export const SOLUTION_CATEGORIES: Array<{ label: SolutionCategory; value: string }> = [
  { label: 'All Solutions', value: 'all' },
  { label: 'Procurement', value: 'procurement' },
  { label: 'Human Resources', value: 'hr' },
  { label: 'Finance', value: 'finance' },
  { label: 'Customer Support', value: 'support' },
  { label: 'Sales Operations', value: 'sales' },
]

export const FEATURED_SOLUTION_IDS = ['procureiq', 'finance']
export const ACTIVE_SOLUTION_IDS = ['procureiq', 'support']
export const RECENTLY_USED_SOLUTION_IDS = ['hr', 'finance']

export function getSolutionBySlug(slug: string | undefined): SolutionDefinition | undefined {
  if (!slug) return undefined
  return SOLUTION_CATALOG.find((solution) => solution.slug === slug)
}

export function getSolutionById(id: string | undefined): SolutionDefinition | undefined {
  if (!id) return undefined
  return SOLUTION_CATALOG.find((solution) => solution.id === id)
}
