import './EvidenceCard.css'

interface EvidenceCardProps {
  name: string
  summary: string
  pricing: string
  features: string
  pros: string
  cons: string
  depthScore: number
  confidence: number
  validationStatus: string
  sourceLabel: string
  sourceUrl: string
}

export default function EvidenceCard({
  name,
  summary,
  pricing,
  features,
  pros,
  cons,
  depthScore,
  confidence,
  validationStatus,
  sourceLabel,
  sourceUrl,
}: EvidenceCardProps) {
  return (
    <article className="evidence-card">
      <header className="evidence-card-header">
        <h3>{name}</h3>
        <span className={`validation-pill validation-pill--${validationStatus}`}>
          {validationStatus}
        </span>
      </header>
      <p className="evidence-summary">{summary}</p>
      <dl className="evidence-meta">
        <div>
          <dt>Pricing</dt>
          <dd>{pricing}</dd>
        </div>
        <div>
          <dt>Features</dt>
          <dd>{features}</dd>
        </div>
        <div>
          <dt>Pros</dt>
          <dd>{pros}</dd>
        </div>
        <div>
          <dt>Cons</dt>
          <dd>{cons}</dd>
        </div>
        <div>
          <dt>Depth / confidence</dt>
          <dd>
            {Math.round(depthScore * 100)}% depth · {Math.round(confidence * 100)}%
            confidence
          </dd>
        </div>
      </dl>
      <a
        className="evidence-source"
        href={sourceUrl}
        target="_blank"
        rel="noreferrer noopener"
      >
        Source: {sourceLabel}
      </a>
    </article>
  )
}
