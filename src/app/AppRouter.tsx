import AppShell from './AppShell'
import SignInPage from './SignInPage'
import ProtectedRoute from '../components/ProtectedRoute'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DashboardPage from '../features/dashboard/DashboardPage'
import EngagementsPage from '../features/engagements/EngagementsPage'
import NewEngagementPage from '../features/engagements/NewEngagementPage'
import EngagementLayout from '../features/engagements/EngagementLayout'
import EngagementOverviewPage from '../features/engagements/EngagementOverviewPage'
import CustomersPage from '../features/customers/CustomersPage'
import NewCustomerPage from '../features/customers/NewCustomerPage'
import ResearchWorkspacePage from '../features/research/ResearchWorkspacePage'
import FindingsPage from '../features/findings/FindingsPage'
import RecommendationsPage from '../features/recommendations/RecommendationsPage'
import RoadmapPage from '../features/roadmap/RoadmapPage'
import CustomerReviewPage from '../features/approvals/CustomerReviewPage'
import ProcureIQPage from '../features/procureiq/ProcureIQPage'
import SettingsPage from '../features/settings/SettingsPage'
import SolutionsHubPage from '../features/solutions/SolutionsHubPage'
import KnowledgeHubPage from '../features/knowledge/KnowledgeHubPage'
import SolutionModulePage from '../features/solutions/SolutionModulePage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/sign-in" replace />} />
        <Route path="/sign-in" element={<SignInPage />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/new" element={<NewCustomerPage />} />
          <Route path="engagements" element={<EngagementsPage />} />
          <Route path="engagements/new" element={<NewEngagementPage />} />
          <Route path="engagements/:id" element={<EngagementLayout />}>
            <Route index element={<EngagementOverviewPage />} />
            <Route path="research" element={<ResearchWorkspacePage />} />
            <Route path="findings" element={<FindingsPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
            <Route path="roadmap" element={<RoadmapPage />} />
            <Route path="review" element={<CustomerReviewPage />} />
          </Route>
          <Route path="solutions" element={<SolutionsHubPage />} />
          <Route path="solutions/procureiq" element={<ProcureIQPage />} />
          <Route path="solutions/hr" element={<SolutionModulePage title="HR Solutions" eyebrow="Specialized module" description="Support workforce planning, hiring workflows, and internal stakeholder evaluation using the same engagement evidence and approval model." features={['Applicant or workforce demand capture', 'Role-fit comparison', 'Hiring and onboarding requirements', 'Review workflow and stakeholder sign-off']} primaryActionLabel="Open HR workflow" primaryActionTo="/app/engagements/new" />} />
          <Route path="solutions/finance" element={<SolutionModulePage title="Finance Solutions" eyebrow="Specialized module" description="Bring financial planning, vendor spend analysis, and business case comparisons into the same expert-led research workspace." features={['Budget and cost baseline capture', 'Scenario comparison and ROI framing', 'Vendor or tool cost analysis', 'Executive review and approval steps']} primaryActionLabel="Start finance review" primaryActionTo="/app/engagements/new" />} />
          <Route path="solutions/support" element={<SolutionModulePage title="Support Solutions" eyebrow="Specialized module" description="Coordinate support tooling, staffing, and service strategy decisions with evidence and customer-facing review gates." features={['Service model and support scope capture', 'Case volume and tooling analysis', 'Support workflow comparison', 'Expert approval before customer rollout']} primaryActionLabel="Launch support scenario" primaryActionTo="/app/engagements/new" />} />
          <Route path="knowledge" element={<KnowledgeHubPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

