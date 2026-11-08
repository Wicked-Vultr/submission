import { useEffect, useState } from 'react'
import { ArrowLeft, Target, Sparkles } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
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
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'

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
  const [searchParams] = useSearchParams()
  const [customers, setCustomers] = useState<Customer[]>([])
  const preselectedSolution = searchParams.get('solution') ?? ''

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

  useEffect(() => {
    if (!preselectedSolution) return

    const solutionLabel = preselectedSolution.charAt(0).toUpperCase() + preselectedSolution.slice(1)
    const title = `New ${solutionLabel} engagement`
    const problem = `Assess the current ${solutionLabel.toLowerCase()} workflow and recommend the best path for improvement, stakeholder buy-in, and execution.`

    reset((current) => ({
      ...current,
      title,
      problemStatement: problem,
    }))
  }, [preselectedSolution, reset])

  function onSubmit(values: NewEngagementFormValues) {
    const now = new Date().toISOString()
    const engagement: Engagement = {
      id: `${Date.now()}`,
      title: values.title.trim() || `${preselectedSolution || 'Engagement'} scope`,
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

  const inputClass =
    'flex min-h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
  const labelClass = 'mb-1.5 block text-sm font-medium text-foreground'

  return (
    <div className="px-4 pb-10 pt-2 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary">
            Engagements
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            New engagement
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Describe the purchasing need clearly so research can focus on relevant suppliers,
            requirements, and evidence.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/app/engagements" className="gap-2">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </header>

      {customers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">
            Add a{' '}
            <Link
              to="/app/customers/new"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              customer
            </Link>{' '}
            before creating an engagement.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Target className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Engagement essentials
                </h2>
                <p className="text-sm text-muted-foreground">
                  Title, customer, and problem statement drive the research mission.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label htmlFor="engagement-title" className={labelClass}>
                  Title *
                </label>
                <input
                  id="engagement-title"
                  placeholder="e.g. Remote team project management tooling"
                  aria-invalid={errors.title ? 'true' : 'false'}
                  className={cn(inputClass, errors.title && 'border-destructive')}
                  {...register('title')}
                />
                <FieldError message={errors.title?.message} className="mb-0 mt-1" />
              </div>

              <div>
                <label htmlFor="customer-select" className={labelClass}>
                  Customer *
                </label>
                <select
                  id="customer-select"
                  className={cn(inputClass, 'h-10')}
                  {...register('customerId')}
                >
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.customerId?.message} className="mb-0 mt-1" />
              </div>

              <div>
                <label htmlFor="problem-description" className={labelClass}>
                  Problem statement *
                </label>
                <textarea
                  id="problem-description"
                  rows={4}
                  placeholder="Describe the business challenge in plain language…"
                  aria-invalid={errors.problemStatement ? 'true' : 'false'}
                  className={cn(
                    inputClass,
                    'min-h-[120px] resize-y',
                    errors.problemStatement && 'border-destructive'
                  )}
                  {...register('problemStatement')}
                />
                <FieldError
                  message={errors.problemStatement?.message}
                  className="mb-0 mt-1"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-700 dark:text-violet-300">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Scope & stakeholders
                </h2>
                <p className="text-sm text-muted-foreground">
                  Objectives and constraints shape the supplier research plan and exports.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label htmlFor="objectives" className={labelClass}>
                  Objectives
                </label>
                <textarea
                  id="objectives"
                  rows={3}
                  placeholder="What should this engagement achieve?"
                  className={cn(inputClass, 'min-h-[88px] resize-y')}
                  {...register('objectives')}
                />
              </div>

              <div>
                <label htmlFor="constraints" className={labelClass}>
                  Constraints
                </label>
                <textarea
                  id="constraints"
                  rows={3}
                  placeholder="Budget, timeline, compliance, technical limits…"
                  className={cn(inputClass, 'min-h-[88px] resize-y')}
                  {...register('constraints')}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="success-metrics" className={labelClass}>
                    Success metrics
                  </label>
                  <textarea
                    id="success-metrics"
                    rows={2}
                    placeholder="How will you measure success?"
                    className={cn(inputClass, 'min-h-[72px] resize-y')}
                    {...register('successMetrics')}
                  />
                </div>

                <div>
                  <label htmlFor="stakeholders" className={labelClass}>
                    Stakeholders
                  </label>
                  <textarea
                    id="stakeholders"
                    rows={2}
                    placeholder="Who reviews or approves outcomes?"
                    className={cn(inputClass, 'min-h-[72px] resize-y')}
                    {...register('stakeholders')}
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
            <Button variant="outline" type="button" asChild>
              <Link to="/app/engagements">Cancel</Link>
            </Button>
            <Button type="submit" className="min-w-[160px] shadow-md">
              Create engagement
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
