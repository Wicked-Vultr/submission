import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import type { Engagement } from '../../types/engagement'
import type { Customer } from '../../types/customer'
import EvidenceCard from '../../components/EvidenceCard'
import ComparisonTable from '../../components/ComparisonTable'
import ComparisonScoresChart from './ComparisonScoresChart'
import {
  getComparison,
  getFindings,
  getSourcesForEngagement,
} from '../../lib/findingsStorage'
import '../engagements/EngagementWorkspace.css'
import './FindingsPage.css'
import './ComparisonScoresChart.css'

interface EngagementContext {
  engagement: Engagement
  customer?: Customer
}

export default function FindingsPage() {
  const { engagement } = useOutletContext<EngagementContext>()
  const [version, setVersion] = useState(0)

  useEffect(() => {
    function onUpdate() {
      setVersion((v) => v + 1)
    }
    window.addEventListener('eia-findings-updated', onUpdate)
    return () => window.removeEventListener('eia-findings-updated', onUpdate)
  }, [])

  void version

  const findings = getFindings(engagement.id)
  const comparison = getComparison(engagement.id)
  const sources = getSourcesForEngagement(engagement.id)
  const sourceById = new Map(sources.map((s) => [s.id, s]))

  return (
    <>
      <div className="draft-banner" role="status">
        Findings are source-backed drafts. Verify evidence links before sharing
        with the customer.
      </div>

      {findings.length === 0 ? (
        <section className="dashboard-panel">
          <div className="empty-state">
            <FileSearch size={30} />
            <h3>No findings stored yet</h3>
            <p>
              Run CHRONICLE research on the Research tab. When the job completes,
              normalized entities appear here.
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="dashboard-panel">
            <h2>Evidence ({findings.length} options)</h2>
            <p className="form-description">
              Structured output from CHRONICLE deep dive — 15+ attributes where
              available.
            </p>
            <div className="findings-grid">
              {findings.map((finding) => {
                const source = sourceById.get(finding.sourceIds[0])
                return (
                  <EvidenceCard
                    key={finding.id}
                    name={finding.name}
                    summary={finding.summary}
                    pricing={finding.pricing}
                    features={finding.features}
                    pros={finding.pros}
                    cons={finding.cons}
                    depthScore={finding.depthScore}
                    confidence={finding.confidence}
                    validationStatus={finding.validationStatus}
                    sourceLabel={source?.title ?? 'Unknown source'}
                    sourceUrl={source?.url ?? '#'}
                  />
                )
              })}
            </div>
          </section>

          {comparison && (
            <section className="dashboard-panel">
              <h2>Comparison matrix</h2>
              <p className="form-description">
                Transparent scoring with configurable weights (demo weights from
                research job).
              </p>
              <ComparisonScoresChart findings={findings} comparison={comparison} />
              <ComparisonTable findings={findings} comparison={comparison} />
            </section>
          )}
        </>
      )}
    </>
  )
}
