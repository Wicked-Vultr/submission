import { ArrowLeft, Plus, Trash2, Building2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { saveCustomer } from '../../lib/customerStorage'
import { logActivity } from '../../lib/activityStorage'
import type { Customer } from '../../types/customer'
import {
  newCustomerSchema,
  type NewCustomerFormValues,
} from '../../lib/validation/schemas'
import FieldError from '../../components/FieldError'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils'

export default function NewCustomerPage() {
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NewCustomerFormValues>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: {
      name: '',
      customerType: 'Company',
      industry: '',
      department: '',
      description: '',
      contacts: [
        {
          id: `${Date.now()}`,
          name: '',
          email: '',
          role: 'Primary Stakeholder',
          contactPreferences: '',
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  })

  function onSubmit(values: NewCustomerFormValues) {
    const customer: Customer = {
      id: `${Date.now()}`,
      name: values.name.trim(),
      customerType: values.customerType,
      industry: values.industry.trim(),
      department: values.department.trim(),
      description: values.description.trim(),
      contacts: values.contacts
        .filter((c) => c.name.trim() && c.email.trim())
        .map((c) => ({
          ...c,
          name: c.name.trim(),
          email: c.email.trim(),
          role: c.role.trim(),
          contactPreferences: c.contactPreferences.trim(),
        })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveCustomer(customer)
    logActivity(`Customer "${customer.name}" added`)
    navigate('/app/customers')
  }

  const inputClass =
    'flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
  const labelClass = 'mb-1.5 block text-sm font-medium text-foreground'

  return (
    <div className="px-4 pb-10 pt-2 sm:px-6">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-primary">
            Customers
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Add customer
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Capture the organization and stakeholders that experts will collaborate with on
            engagements.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/app/customers" className="gap-2">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Organization
              </h2>
              <p className="text-sm text-muted-foreground">
                Basics used across engagements and audit trails.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="customer-name" className={labelClass}>
                Organization name *
              </label>
              <input
                id="customer-name"
                placeholder="e.g. Contoso Procurement"
                aria-invalid={errors.name ? 'true' : 'false'}
                className={cn(inputClass, errors.name && 'border-destructive')}
                {...register('name')}
              />
              <FieldError message={errors.name?.message} className="mb-0 mt-1" />
            </div>

            <div>
              <label htmlFor="customer-type" className={labelClass}>
                Customer type *
              </label>
              <select
                id="customer-type"
                className={cn(inputClass, 'h-10')}
                {...register('customerType')}
              >
                <option value="Company">Company</option>
                <option value="Internal Business Unit">Internal Business Unit</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="industry" className={labelClass}>
                Industry
              </label>
              <input
                id="industry"
                placeholder="e.g. Information Technology"
                className={inputClass}
                {...register('industry')}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="department" className={labelClass}>
                Department / unit
              </label>
              <input
                id="department"
                placeholder="e.g. Procurement, IT, Operations"
                className={inputClass}
                {...register('department')}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Context
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Background, constraints, or how this customer prefers to work…"
                className={cn(inputClass, 'min-h-[100px] resize-y')}
                {...register('description')}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Contacts</h2>
              <p className="text-sm text-muted-foreground">
                At least one contact with name and email is required.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() =>
                append({
                  id: `${Date.now()}-${fields.length}`,
                  name: '',
                  email: '',
                  role: '',
                  contactPreferences: '',
                })
              }
            >
              <Plus className="size-4" />
              Add contact
            </Button>
          </div>

          <FieldError message={errors.contacts?.message} className="mb-4" />

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-border bg-muted/40 p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Contact {index + 1}
                  </h3>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => remove(index)}
                      aria-label={`Remove contact ${index + 1}`}
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`contact-name-${field.id}`}
                      className={labelClass}
                    >
                      Name
                    </label>
                    <input
                      id={`contact-name-${field.id}`}
                      placeholder="Full name"
                      aria-invalid={
                        errors.contacts?.[index]?.name ? 'true' : 'false'
                      }
                      className={cn(
                        inputClass,
                        errors.contacts?.[index]?.name && 'border-destructive'
                      )}
                      {...register(`contacts.${index}.name`)}
                    />
                    <FieldError
                      message={errors.contacts?.[index]?.name?.message}
                      className="mb-0 mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`contact-email-${field.id}`}
                      className={labelClass}
                    >
                      Email
                    </label>
                    <input
                      id={`contact-email-${field.id}`}
                      type="email"
                      placeholder="name@company.com"
                      aria-invalid={
                        errors.contacts?.[index]?.email ? 'true' : 'false'
                      }
                      className={cn(
                        inputClass,
                        errors.contacts?.[index]?.email && 'border-destructive'
                      )}
                      {...register(`contacts.${index}.email`)}
                    />
                    <FieldError
                      message={errors.contacts?.[index]?.email?.message}
                      className="mb-0 mt-1"
                    />
                  </div>

                  <input type="hidden" {...register(`contacts.${index}.id`)} />

                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`contact-role-${field.id}`}
                      className={labelClass}
                    >
                      Role
                    </label>
                    <input
                      id={`contact-role-${field.id}`}
                      placeholder="e.g. Procurement lead"
                      className={inputClass}
                      {...register(`contacts.${index}.role`)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`contact-preferences-${field.id}`}
                      className={labelClass}
                    >
                      Contact preferences
                    </label>
                    <input
                      id={`contact-preferences-${field.id}`}
                      placeholder="e.g. Email; Tue–Thu afternoons"
                      className={inputClass}
                      {...register(`contacts.${index}.contactPreferences`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
          <Button variant="outline" type="button" asChild>
            <Link to="/app/customers">Cancel</Link>
          </Button>
          <Button type="submit" className="min-w-[140px] shadow-md">
            Save customer
          </Button>
        </div>
      </form>
    </div>
  )
}
