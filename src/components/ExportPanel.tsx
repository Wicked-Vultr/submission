import { Download } from 'lucide-react'
import './ExportPanel.css'
import {
  getComparison,
  getFindings,
  getSourcesForEngagement,
} from '../lib/findingsStorage'
import { getRecommendation } from '../lib/recommendationsStorage'
import { getRoadmapItems } from '../lib/roadmapStorage'
import { getEngagementById } from '../lib/engagementStorage'

interface ExportPanelProps {
  engagementId: string
}

type ExportFormat = 'json' | 'csv' | 'markdown'

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function ExportPanel({ engagementId }: ExportPanelProps) {
  const engagement = getEngagementById(engagementId)
  const findings = getFindings(engagementId)
  const canExport = findings.length > 0

  function buildPayload() {
    return {
      engagement,
      findings,
      sources: getSourcesForEngagement(engagementId),
      comparison: getComparison(engagementId),
      recommendation: getRecommendation(engagementId),
      roadmap: getRoadmapItems(engagementId),
      exportedAt: new Date().toISOString(),
    }
  }

  function handleExport(format: ExportFormat) {
    if (!canExport || !engagement) return
    const payload = buildPayload()
    const slug = engagement.title.replace(/\s+/g, '-').slice(0, 40)

    if (format === 'json') {
      download(
        `${slug}-export.json`,
        JSON.stringify(payload, null, 2),
        'application/json'
      )
      return
    }

    if (format === 'csv') {
      const header = 'name,pricing,depth,confidence,validation'
      const rows = findings.map(
        (f) =>
          `"${f.name}","${f.pricing}",${f.depthScore},${f.confidence},${f.validationStatus}`
      )
      download(`${slug}-findings.csv`, [header, ...rows].join('\n'), 'text/csv')
      return
    }

    const md = [
      `# ${engagement.title}`,
      '',
      '## Findings',
      ...findings.map(
        (f) =>
          `### ${f.name}\n${f.summary}\n- Pricing: ${f.pricing}\n- Validation: ${f.validationStatus}\n`
      ),
      '',
      '## Recommendation',
      getRecommendation(engagementId)?.summary ?? '_Not generated_',
    ].join('\n')
    download(`${slug}-report.md`, md, 'text/markdown')
  }

  return (
    <section className="export-panel dashboard-panel">
      <h2>Exports</h2>
      <p className="form-description">
        Download structured deliverables (PDF via backend when ReportLab export is
        connected).
      </p>
      <div className="export-actions">
        {(['json', 'csv', 'markdown'] as ExportFormat[]).map((format) => (
          <button
            key={format}
            type="button"
            className="export-btn"
            disabled={!canExport}
            onClick={() => handleExport(format)}
          >
            <Download size={16} />
            {format.toUpperCase()}
          </button>
        ))}
      </div>
      {!canExport && (
        <p className="export-hint">Complete supplier research to enable exports.</p>
      )}
    </section>
  )
}
