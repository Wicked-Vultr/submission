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
import SettingsPage from '../features/settings/SettingsPage'
import SolutionsHubPage from '../features/solutions/SolutionsHubPage'
import KnowledgeHubPage from '../features/knowledge/KnowledgeHubPage'
import SolutionDetailPage from '../features/solutions/SolutionDetailPage'

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
          <Route path="solutions/:slug" element={<SolutionDetailPage />} />
          <Route path="knowledge" element={<KnowledgeHubPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

