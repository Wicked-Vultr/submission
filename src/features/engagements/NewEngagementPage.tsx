import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getCustomers } from '../../lib/customerStorage'
import { saveEngagement } from '../../lib/engagementStorage'
import { logActivity } from '../../lib/activityStorage'
import type { Customer } from '../../types/customer'
import type { Engagement } from '../../types/engagement'
import {
  newEngagementSchema,
  type NewEngagementFormValues,
} from '../../lib/validation/schemas'
import FieldError from '../../components/FieldError'
import './NewEngagementPage.css'

const EMPTY_ENGAGEMENT: Omit<NewEngagementFormValues, 'customerId'> = {
  title: '',
  problemStatement: '',
  objectives: '',
  constraints: '',
  successMetrics: '',
  stakeholders: '',
}

export default function NewEngagementPage() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<Customer[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewEngagementFormValues>({
    resolver: zodResolver(newEngagementSchema),
    defaultValues: {
      ...EMPTY_ENGAGEMENT,
      customerId: '',
    },
  })

  useEffect(() => {
    const list = getCustomers()
    setCustomers(list)
    if (list.length > 0) {
      reset({
        ...EMPTY_ENGAGEMENT,
        customerId: list[0].id,
      })
    }
  }, [reset])

  function onSubmit(values: NewEngagementFormValues) {
    const now = new Date().toISOString()
    const engagement: Engagement = {
      id: `${Date.now()}`,
      title: values.title.trim(),
      customerId: values.customerId,
      problemStatement: values.problemStatement.trim(),
      objectives: values.objectives.trim(),
      constraints: values.constraints.trim(),
      successMetrics: values.successMetrics.trim(),
      stakeholders: values.stakeholders.trim(),
      status: 'scoping',
      createdAt: now,
      updatedAt: now,
    }

    saveEngagement(engagement)
    logActivity(`Engagement "${engagement.title}" created`, engagement.id)
    navigate(`/app/engagements/${engagement.id}`)
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">ENGAGEMENTS</p>
          <h1>New Engagement</h1>
          <p>Capture the customer challenge and scope for CHRONICLE research.</p>
        </div>

        <Link to="/app/engagements" className="view-all-btn">
          <ArrowLeft size={16} />
          Back to Engagements
        </Link>
      </header>

      <section className="dashboard-panel engagement-form-panel">
        <h2>Engagement details</h2>
        <p className="form-description">
          Fields align with the problem scoping module in the technical blueprint.
        </p>

        {customers.length === 0 ? (
          <p className="form-description">
            Add a{' '}
            <Link to="/app/customers/new" style={{ color: '#2563eb' }}>
              customer
            </Link>{' '}
            before creating an engagement.
          </p>
        ) : (
          <form className="engagement-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <label htmlFor="engagement-title">Engagement title *</label>
            <input
              id="engagement-title"
              placeholder="e.g. Remote team project management tooling"
              aria-invalid={errors.title ? 'true' : 'false'}
              {...register('title')}
            />
            <FieldError message={errors.title?.message} />

            <label htmlFor="customer-select">Customer *</label>
            <select id="customer-select" {...register('customerId')}>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.customerId?.message} />

            <label htmlFor="problem-description">Problem statement *</label>
            <textarea
              id="problem-description"
              rows={4}
              placeholder="Describe the business challenge in plain language..."
              aria-invalid={errors.problemStatement ? 'true' : 'false'}
              {...register('problemStatement')}
            />
            <FieldError message={errors.problemStatement?.message} />

            <label htmlFor="objectives">Objectives</label>
            <textarea
              id="objectives"
              rows={3}
              placeholder="What should this engagement achieve?"
              {...register('objectives')}
            />

            <label htmlFor="constraints">Constraints</label>
            <textarea
              id="constraints"
              rows={3}
              placeholder="Budget, timeline, compliance, or technical limits..."
              {...register('constraints')}
            />

            <label htmlFor="success-metrics">Success metrics</label>
            <textarea
              id="success-metrics"
              rows={2}
              placeholder="How will you measure success?"
              {...register('successMetrics')}
            />

            <label htmlFor="stakeholders">Stakeholders</label>
            <textarea
              id="stakeholders"
              rows={2}
              placeholder="Who needs to review or approve outcomes?"
              {...register('stakeholders')}
            />

            <button type="submit" className="new-engagement-btn">
              Create engagement
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
