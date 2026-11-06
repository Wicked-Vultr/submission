import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
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
import './NewCustomerPage.css'

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

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">CUSTOMERS</p>
          <h1>Add Customer</h1>
          <p>Add an organization and its contact information.</p>
        </div>

        <Link to="/app/customers" className="view-all-btn">
          <ArrowLeft size={16} />
          Back to Customers
        </Link>
      </header>

      <section className="dashboard-panel customer-form-panel">
        <form className="customer-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-section">
            <h2>Organization Information</h2>
            <p className="form-description">
              Enter the basic details about the customer organization.
            </p>

            <label htmlFor="customer-name">Organization Name *</label>
            <input
              id="customer-name"
              placeholder="Enter organization name"
              aria-invalid={errors.name ? 'true' : 'false'}
              {...register('name')}
            />
            <FieldError message={errors.name?.message} />

            <label htmlFor="customer-type">Customer Type *</label>
            <select id="customer-type" {...register('customerType')}>
              <option value="Company">Company</option>
              <option value="Internal Business Unit">Internal Business Unit</option>
              <option value="Other">Other</option>
            </select>

            <label htmlFor="industry">Industry</label>
            <input
              id="industry"
              placeholder="e.g. Information Technology, Healthcare"
              {...register('industry')}
            />

            <label htmlFor="department">Department</label>
            <input
              id="department"
              placeholder="e.g. IT, Procurement, Operations"
              {...register('department')}
            />

            <label htmlFor="description">Organization Description / Context</label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe the organization and relevant background..."
              {...register('description')}
            />
          </div>

          <div className="form-section">
            <div className="contacts-heading">
              <div>
                <h2>Customer Contacts</h2>
                <p className="form-description">
                  Add the people who will communicate with the Expert.
                </p>
              </div>

              <button
                type="button"
                className="add-contact-btn"
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
                <Plus size={16} />
                Add Contact
              </button>
            </div>

            <FieldError message={errors.contacts?.message} />

            {fields.map((field, index) => (
              <div className="contact-form-card" key={field.id}>
                <div className="contact-card-heading">
                  <h3>Contact {index + 1}</h3>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      className="remove-contact-btn"
                      onClick={() => remove(index)}
                      aria-label={`Remove contact ${index + 1}`}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>

                <label htmlFor={`contact-name-${field.id}`}>Contact Name</label>
                <input
                  id={`contact-name-${field.id}`}
                  placeholder="Enter contact name"
                  aria-invalid={
                    errors.contacts?.[index]?.name ? 'true' : 'false'
                  }
                  {...register(`contacts.${index}.name`)}
                />
                <FieldError message={errors.contacts?.[index]?.name?.message} />

                <label htmlFor={`contact-email-${field.id}`}>Email Address</label>
                <input
                  id={`contact-email-${field.id}`}
                  type="email"
                  placeholder="Enter email address"
                  aria-invalid={
                    errors.contacts?.[index]?.email ? 'true' : 'false'
                  }
                  {...register(`contacts.${index}.email`)}
                />
                <FieldError message={errors.contacts?.[index]?.email?.message} />

                <input type="hidden" {...register(`contacts.${index}.id`)} />

                <label htmlFor={`contact-role-${field.id}`}>Role / Position</label>
                <input
                  id={`contact-role-${field.id}`}
                  placeholder="e.g. Primary Stakeholder, Manager"
                  {...register(`contacts.${index}.role`)}
                />

                <label htmlFor={`contact-preferences-${field.id}`}>
                  Contact Preferences
                </label>
                <input
                  id={`contact-preferences-${field.id}`}
                  placeholder="e.g. Email, Phone, Preferred contact time"
                  {...register(`contacts.${index}.contactPreferences`)}
                />
              </div>
            ))}
          </div>

          <div className="form-actions">
            <Link to="/app/customers" className="cancel-form-btn">
              Cancel
            </Link>

            <button type="submit" className="new-engagement-btn">
              Add Customer
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
